import { useState } from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Send, Clock } from "lucide-react";
import emailjs from "@emailjs/browser";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const EMAILJS_PUBLIC_KEY = "zN2bb9xlC65XS2wwg";
const EMAILJS_SERVICE_ID = "service_rdjqrbt";
const EMAILJS_TEMPLATE_ID = "template_nh07zjn";

const contactCards = [
  {
    icon: Phone,
    title: "Phone",
    line1: "02692 354 201",
    line2: "Mon-Sun: 24/7 Available",
  },
  {
    icon: Mail,
    title: "Email",
    line1: "avirahospital@gmail.com",
    line2: "We'll respond within 24 hours",
  },
  {
    icon: MapPin,
    title: "Address",
    line1: "210, R.S.Platinum Building, Bhalej Road, Ganesh Colony, Anand, Gujarat, 388001",
    line2: "",
  },
];

const workingHours = [
  { service: "Emergency Services", time: "24/7 Available", highlight: true },
  { service: "OPD Services", time: "10:00 AM - 1:00 PM", highlight: false },
  { service: "Pharmacy", time: "8:00 AM - 10:00 PM", highlight: false },
  { service: "Laboratory", time: "7:00 AM - 8:00 PM", highlight: false },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      // Save to database
      await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        subject: form.subject || null,
        message: form.message,
      });
      // Also send via EmailJS
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        patient_name: form.name,
        mobile: form.phone,
        reason: form.message,
        to_email: "avirahospital@gmail.com",
      }, EMAILJS_PUBLIC_KEY);
      toast({ title: "Message sent successfully!" });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast({ title: "Failed to send message", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding bg-section-alt">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-2">Contact Us</h1>
          <p className="text-center text-muted-foreground mb-12">Get in touch with us for any queries</p>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {contactCards.map((card) => (
              <div key={card.title} className="bg-card rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center mb-3">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.line1}</p>
                {card.line2 && <p className="text-xs text-muted-foreground mt-0.5">{card.line2}</p>}
              </div>
            ))}
          </div>

          {/* Form + Sidebar */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-sm space-y-4 h-fit">
              <h3 className="font-heading font-bold text-xl mb-2">Send Us a Message</h3>
              <div>
                <Label>Your Name *</Label>
                <Input required placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email *</Label>
                  <Input type="email" required placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Subject *</Label>
                <Input required placeholder="How can we help you?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <Label>Message *</Label>
                <Textarea required placeholder="Your message..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Working Hours */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-lg">Working Hours</h3>
                </div>
                <div className="space-y-3">
                  {workingHours.map((item) => (
                    <div key={item.service} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{item.service}</span>
                      <span className={`text-sm font-medium ${item.highlight ? "text-primary" : "text-foreground"}`}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connect With Us */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-heading font-bold text-lg mb-2">Connect With Us</h3>
                <p className="text-sm text-muted-foreground mb-4">Follow us on social media for health tips and updates</p>
                <div className="grid grid-cols-2 gap-3">
                  <a href="https://www.facebook.com/avirahospital/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-accent transition-colors">
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                  <a href="https://www.instagram.com/avirahospital21/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-accent transition-colors">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                </div>
              </div>

              {/* Emergency */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-1">Emergency?</h3>
                <p className="text-sm text-foreground/80 mb-4">For immediate medical assistance, call our emergency hotline</p>
                <a
                  href="tel:02692354201"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Emergency: 02692 354 201
                </a>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg mb-4">Find Us on Map</h3>
            <div className="rounded-xl overflow-hidden h-[350px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.8!2d72.9519!3d22.5566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4e743b000001%3A0x1!2s210%2C%20R.S.Platinum%20Building%2C%20Bhalej%20Road%2C%20Ganesh%20Colony%2C%20Anand%2C%20Gujarat%20388001!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Avira Hospital Location"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
