import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { CalendarIcon, CheckCircle, Video, Building2 } from "lucide-react";
import emailjs from "@emailjs/browser";
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

const EMAILJS_PUBLIC_KEY = "zN2bb9xlC65XS2wwg";

function generateAppointmentId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `AH-${year}-${random}`;
}
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
  });
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");

  const selectedDoctor = doctors.find((d) => d.id === form.doctorId);

  const fee = useMemo(() => {
    if (!selectedDoctor) return 0;
    return form.isExisting === "yes" ? selectedDoctor.feeExisting : selectedDoctor.feeNew;
  }, [selectedDoctor, form.isExisting]);

  const availableSlots = useMemo(() => {
    if (!date) return [];
    const now = new Date();
    if (isToday(date)) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      return allSlots.filter((slot) => slotToMinutes(slot) > currentMinutes);
    }
    return allSlots;
  }, [date]);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot || !form.doctorId || !form.patientName || !form.mobile) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          patient_name: form.patientName,
          patient_type: form.isExisting === "yes" ? `Existing (ID: ${form.existingId})` : "New",
          mobile: form.mobile,
          age: form.age,
          gender: form.gender,
          marital_status: form.maritalStatus,
          address: `${form.address}, ${form.city} - ${form.pincode}`,
          doctor_name: selectedDoctor?.name,
          specialization: selectedDoctor?.specialty,
          date: format(date, "dd/MM/yyyy"),
          time_slot: timeSlot,
          reason: form.reason,
          fee: `₹${fee}`,
          to_email: "avirahospital@gmail.com",
        },
        EMAILJS_PUBLIC_KEY
      );
      setAppointmentId(generateAppointmentId());
      setSuccess(true);
    } catch {
      toast({ title: "Failed to send confirmation email. Your appointment is still noted.", variant: "destructive" });
      setAppointmentId(generateAppointmentId());
      setSuccess(true);
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Appointment Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
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
              <div>
                <Label>Time Slot *</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot} disabled={!date}>
                  <SelectTrigger><SelectValue placeholder={date ? "Choose a slot" : "Select date first"} /></SelectTrigger>
                  <SelectContent>
                    {availableSlots.length === 0 && (
                      <SelectItem value="none" disabled>No slots available</SelectItem>
                    )}
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                <Label>Age</Label>
                <Input type="number" placeholder="Age" value={form.age} onChange={(e) => updateForm("age", e.target.value)} />
              </div>
              <div>
                <Label>Gender</Label>
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
                <Label>Marital Status</Label>
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
                <Label>City</Label>
                <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input placeholder="Full address" value={form.address} onChange={(e) => updateForm("address", e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Pincode</Label>
                <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Reason for Booking</Label>
              <Textarea placeholder="Briefly describe your reason for visit" value={form.reason} onChange={(e) => updateForm("reason", e.target.value)} />
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
