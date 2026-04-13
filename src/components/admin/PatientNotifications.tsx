import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Send, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Notification {
  id: string;
  patient_name: string;
  mobile: string | null;
  email: string | null;
  notification_type: string;
  message: string;
  sent_via: string;
  sent_at: string;
}

interface Appointment {
  id: string;
  patient_name: string;
  mobile: string;
  email: string | null;
}

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState("");
  const { toast } = useToast();

  const [form, setForm] = useState({
    appointmentId: "",
    patientName: "",
    mobile: "",
    email: "",
    type: "reminder",
    message: "",
    sentVia: "system",
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const [notifRes, apptRes] = await Promise.all([
        supabase.from("patient_notifications").select("*").order("sent_at", { ascending: false }).limit(50),
        supabase.from("appointments").select("id, patient_name, mobile, email").order("created_at", { ascending: false }).limit(100),
      ]);
      setNotifications(notifRes.data || []);
      setAppointments(apptRes.data || []);
      setLoading(false);
    };
    init();
  }, []);

  const selectAppointment = (aptId: string) => {
    const apt = appointments.find(a => a.id === aptId);
    if (apt) {
      setForm(prev => ({
        ...prev,
        appointmentId: aptId,
        patientName: apt.patient_name,
        mobile: apt.mobile,
        email: apt.email || "",
      }));
    }
  };

  const handleSend = async () => {
    if (!form.patientName.trim() || !form.message.trim()) return;
    setSending(true);
    const { data, error } = await supabase.from("patient_notifications").insert({
      appointment_id: form.appointmentId || null,
      patient_name: form.patientName,
      mobile: form.mobile || null,
      email: form.email || null,
      notification_type: form.type,
      message: form.message,
      sent_via: form.sentVia,
      sent_by: userId,
    }).select().single();

    if (error) {
      toast({ title: "Failed to log notification", variant: "destructive" });
    } else {
      toast({ title: "Notification logged successfully" });
      setNotifications(prev => [data, ...prev]);
      setForm({ appointmentId: "", patientName: "", mobile: "", email: "", type: "reminder", message: "", sentVia: "system" });
    }
    setSending(false);
  };

  const typeBadge = (type: string) => {
    switch (type) {
      case "reminder": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Reminder</Badge>;
      case "report_ready": return <Badge className="bg-green-100 text-green-700 border-green-200">Report Ready</Badge>;
      default: return <Badge variant="outline">Custom</Badge>;
    }
  };

  if (loading) return <p className="text-muted-foreground p-4">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-bold text-lg">Patient Notifications</h3>
        <p className="text-sm text-muted-foreground">Send and log notifications to patients</p>
      </div>

      {/* Send Form */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h4 className="font-semibold text-foreground flex items-center gap-2"><Send className="w-4 h-4 text-primary" /> Send Notification</h4>
          
          <div>
            <Label>Select Patient (from appointments)</Label>
            <Select value={form.appointmentId} onValueChange={selectAppointment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient..." />
              </SelectTrigger>
              <SelectContent>
                {appointments.map(apt => (
                  <SelectItem key={apt.id} value={apt.id}>{apt.patient_name} — {apt.mobile}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Patient Name *</Label>
              <Input value={form.patientName} onChange={e => setForm(p => ({ ...p, patientName: e.target.value }))} placeholder="Patient name" />
            </div>
            <div>
              <Label>Mobile</Label>
              <Input value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} placeholder="Mobile number" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Notification Type</Label>
              <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="reminder">Appointment Reminder</SelectItem>
                  <SelectItem value="report_ready">Report Ready</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Send Via</Label>
              <Select value={form.sentVia} onValueChange={v => setForm(p => ({ ...p, sentVia: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System Log</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Message *</Label>
            <Textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Enter notification message..." rows={3} />
          </div>

          <Button onClick={handleSend} disabled={sending || !form.patientName.trim() || !form.message.trim()} className="gap-2">
            <Bell className="w-4 h-4" />
            {sending ? "Sending..." : "Send Notification"}
          </Button>
        </CardContent>
      </Card>

      {/* Log */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Notification Log ({notifications.length})</h4>
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No notifications sent yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, i) => (
              <motion.div key={notif.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card>
                  <CardContent className="p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">{notif.patient_name}</span>
                        {typeBadge(notif.notification_type)}
                        <Badge variant="outline" className="text-xs">{notif.sent_via}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{notif.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(notif.sent_at), "dd MMM, hh:mm a")}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientNotifications;
