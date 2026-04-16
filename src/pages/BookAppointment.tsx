import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { CalendarIcon, CheckCircle, Video, Building2 } from "lucide-react";
import emailjs from "@emailjs/browser";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { doctors } from "@/components/DoctorsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AppointmentSlip from "@/components/AppointmentSlip";
import { generateAppointmentEmailHTML } from "@/utils/generateAppointmentEmailHTML";

const EMAILJS_PUBLIC_KEY = "zN2bb9xlC65XS2wwg";

const EMAILJS_SERVICE_ID = "service_rdjqrbt";
const EMAILJS_TEMPLATE_ID = "template_nh07zjn";

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 10; h < 13; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour12 = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      slots.push(`${hour12}:${m.toString().padStart(2, "0")} ${ampm}`);
    }
  }
  // Add 1:00 PM as last slot
  slots.push("1:00 PM");
  return slots;
}

const allSlots = generateTimeSlots();

function slotToMinutes(slot: string): number {
  const [time, ampm] = slot.split(" ");
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + parseInt(mStr);
}

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctor = searchParams.get("doctor") || "";
  const { toast } = useToast();

  const [form, setForm] = useState({
    patientName: "",
    isExisting: "no",
    existingId: "",
    mobile: "",
    age: "",
    maritalStatus: "",
    gender: "",
    address: "",
    city: "",
    pincode: "",
    doctorId: preselectedDoctor,
    reason: "",
    consultationType: "opd",
    email: "",
  });
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const selectedDoctor = doctors.find((d) => d.id === form.doctorId);

  const fee = useMemo(() => {
    if (!selectedDoctor) return 0;
    return form.isExisting === "yes" ? selectedDoctor.feeExisting : selectedDoctor.feeNew;
  }, [selectedDoctor, form.isExisting]);

  // Fetch booked slots when date or doctor changes
  useEffect(() => {
    if (!date || !selectedDoctor) return;
    
    const fetchBookedSlots = async () => {
      const startOfSelectedDay = new Date(date);
      startOfSelectedDay.setHours(0, 0, 0, 0);
      const endOfSelectedDay = new Date(date);
      endOfSelectedDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("appointments")
        .select("time_slot, status")
        .gte("time_slot", startOfSelectedDay.toISOString())
        .lte("time_slot", endOfSelectedDay.toISOString())
        .eq("department", selectedDoctor.specialty)
        .in("status", ["pending", "confirmed", "completed"]);
      
      if (!error && data) {
        const slots = data.map(apt => format(new Date(apt.time_slot), "h:mm a"));
        setBookedSlots(slots);
      }
    };

    fetchBookedSlots();

    const channel = supabase
      .channel(`slots-${selectedDoctor.id}-${format(date, "yyyy-MM-dd")}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => { fetchBookedSlots(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [date, selectedDoctor]);

  const availableSlots = useMemo(() => {
    if (!date) return [];
    const now = new Date();
    
    let filteredSlots = allSlots;
    
    // Filter by time if today
    if (isToday(date)) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      filteredSlots = allSlots.filter((slot) => slotToMinutes(slot) > currentMinutes);
    }
    
    // Filter out booked slots
    filteredSlots = filteredSlots.filter(slot => !bookedSlots.includes(slot));
    
    return filteredSlots;
  }, [date, bookedSlots]);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot || !form.doctorId || !form.patientName || !form.mobile || !form.age || !form.gender || !form.maritalStatus || !form.address || !form.city || !form.pincode || !form.reason) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Create appointment date-time
      const [time, ampm] = timeSlot.split(" ");
      const [hours, minutes] = time.split(":");
      let hour24 = parseInt(hours);
      if (ampm === "PM" && hour24 !== 12) hour24 += 12;
      if (ampm === "AM" && hour24 === 12) hour24 = 0;
      
      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(hour24, parseInt(minutes), 0, 0);


      
      const displayId = `AH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const videoCallLink = form.consultationType === "video" 
        ? `https://meet.jit.si/avira-hospital-${displayId}` 
        : null;

      // Save to database
      const { error: dbError } = await supabase
        .from("appointments")
        .insert({
          patient_name: form.patientName,
          mobile: form.mobile,
          age: form.age ? parseInt(form.age) : null,
          gender: form.gender || null,
          department: selectedDoctor?.specialty || null,
          
          time_slot: appointmentDateTime.toISOString(),
          fee: fee,
          notes: form.reason || null,
          consultation_type: form.consultationType,
          video_call_link: videoCallLink,
          email: form.email || null,
          address: `${form.address}, ${form.city} - ${form.pincode}`.trim().replace(/^, /, '').replace(/ - $/, '') || null,
          patient_type: form.isExisting,
          status: "pending"
        });

      if (dbError) throw dbError;

      // Send email notification
      try {
        const emailHTML = generateAppointmentEmailHTML({
          patientName: form.patientName,
          patientType: form.isExisting === "yes" ? `Existing (ID: ${form.existingId})` : "New",
          mobile: form.mobile,
          email: form.email || undefined,
          age: form.age,
          gender: form.gender,
          maritalStatus: form.maritalStatus,
          address: `${form.address}, ${form.city} - ${form.pincode}`,
          doctorName: selectedDoctor?.name || "",
          specialization: selectedDoctor?.specialty || "",
          date: format(date, "dd/MM/yyyy"),
          timeSlot: timeSlot,
          reason: form.reason,
          fee: fee,
          consultationType: form.consultationType,
          appointmentId: displayId,
        });

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            title: `New Appointment - ${form.patientName}`,
            message_html: emailHTML,
            to_email: "avirahospital@gmail.com",
          },
          EMAILJS_PUBLIC_KEY
        );
      } catch (emailError) {
        console.warn("Email notification failed:", emailError);
      }

      setAppointmentId(displayId);
      setSuccess(true);
    } catch (error: any) {
      toast({ 
        title: "Booking failed", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (success && date) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="text-2xl font-heading font-bold">Appointment Booked!</h2>
            </div>
            <AppointmentSlip
              appointmentId={appointmentId}
              doctorName={selectedDoctor?.name || ""}
              specialization={selectedDoctor?.specialty || ""}
              appointmentDate={date}
              timeSlot={timeSlot}
              patientName={form.patientName}
              age={form.age}
              gender={form.gender}
              mobile={form.mobile}
              address={`${form.address}, ${form.city} - ${form.pincode}`}
              reason={form.reason}
              fee={fee}
              patientType={form.isExisting === "yes" ? "Existing" : "New"}
              consultationType={form.consultationType as "opd" | "video"}
              videoCallLink={form.consultationType === "video" ? `https://meet.jit.si/avira-hospital-${appointmentId}` : undefined}
            />
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => { setSuccess(false); setForm({ ...form, patientName: "", mobile: "", reason: "" }); setDate(undefined); setTimeSlot(""); }}>
                Book Another Appointment
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding bg-section-alt">
        <div className="container-custom max-w-3xl">
          <h1 className="text-3xl font-heading font-bold text-center mb-2">Book an Appointment</h1>
          <p className="text-center text-muted-foreground mb-8">Fill in your details to schedule a consultation</p>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-sm p-6 md:p-8 space-y-6">
            {/* Consultation Type */}
            <div>
              <Label>Consultation Type *</Label>
              <RadioGroup value={form.consultationType} onValueChange={(v) => updateForm("consultationType", v)} className="flex gap-4 mt-2">
                <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                  <RadioGroupItem value="opd" id="opd" />
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="opd" className="cursor-pointer font-medium">In-Person (OPD)</Label>
                </div>
                <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                  <RadioGroupItem value="video" id="video" />
                  <Video className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="video" className="cursor-pointer font-medium">Video Consultation</Label>
                </div>
              </RadioGroup>
              {form.consultationType === "video" && (
                <div className="mt-3 bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-muted-foreground flex items-start gap-2">
                  <Video className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>You'll receive a video call link in your appointment slip. Join at your scheduled time using any device with a camera and microphone.</span>
                </div>
              )}
            </div>

            {/* Doctor Selection */}
            <div>
              <Label>Select Doctor *</Label>
              <Select value={form.doctorId} onValueChange={(v) => updateForm("doctorId", v)}>
                <SelectTrigger><SelectValue placeholder="Choose a doctor" /></SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} — {d.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div>
              <Label>Appointment Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => { setDate(d); setTimeSlot(""); }}
                    disabled={(d) => isBefore(startOfDay(d), startOfDay(new Date())) || d.getDay() === 0}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slots */}
            <div>
              <Label>Time Slot *</Label>
              {!date ? (
                <p className="text-sm text-muted-foreground mt-2">Please select a date first</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-destructive mt-2">No slots available for this date</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                  {allSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isUnavailable = !availableSlots.includes(slot);
                    const isSelected = timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isUnavailable}
                        onClick={() => setTimeSlot(slot)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                            : isBooked
                              ? "bg-destructive/10 text-destructive/50 border-destructive/20 cursor-not-allowed line-through"
                              : isUnavailable
                                ? "bg-muted text-muted-foreground/40 border-border cursor-not-allowed"
                                : "bg-card text-foreground border-border hover:border-primary hover:bg-primary/5 cursor-pointer"
                        )}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Patient Type */}
            <div>
              <Label>Are you an existing patient?</Label>
              <RadioGroup value={form.isExisting} onValueChange={(v) => updateForm("isExisting", v)} className="flex gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="new" />
                  <Label htmlFor="new" className="cursor-pointer">New Patient</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="existing" />
                  <Label htmlFor="existing" className="cursor-pointer">Existing Patient</Label>
                </div>
              </RadioGroup>
            </div>

            {form.isExisting === "yes" && (
              <div>
                <Label>Patient ID</Label>
                <Input placeholder="Enter your patient ID" value={form.existingId} onChange={(e) => updateForm("existingId", e.target.value)} />
              </div>
            )}

            {/* Fee display */}
            {selectedDoctor && (
              <div className="bg-accent rounded-lg p-4 text-sm">
                <span className="font-medium">Consultation Fee: </span>
                <span className="text-primary font-bold text-lg">₹{fee}</span>
                <span className="text-muted-foreground ml-2">({form.isExisting === "yes" ? "Existing" : "New"} Patient)</span>
              </div>
            )}

            {/* Patient Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Patient Name *</Label>
                <Input required placeholder="Full name" value={form.patientName} onChange={(e) => updateForm("patientName", e.target.value)} />
              </div>
              <div>
                <Label>Mobile Number *</Label>
                <Input required type="tel" placeholder="Mobile number" value={form.mobile} onChange={(e) => updateForm("mobile", e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="Email address (optional)" value={form.email} onChange={(e) => updateForm("email", e.target.value)} />
              </div>
              <div>
                <Label>Age *</Label>
                <Input required type="number" placeholder="Age" value={form.age} onChange={(e) => updateForm("age", e.target.value)} />
              </div>
              <div>
                <Label>Gender *</Label>
                <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Marital Status *</Label>
                <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>City *</Label>
                <Input required placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Address *</Label>
              <Input required placeholder="Full address" value={form.address} onChange={(e) => updateForm("address", e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Pincode *</Label>
                <Input required placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Reason for Booking *</Label>
              <Textarea required placeholder="Briefly describe your reason for visit" value={form.reason} onChange={(e) => updateForm("reason", e.target.value)} />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Booking..." : "Confirm Appointment"}
            </Button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BookAppointment;
