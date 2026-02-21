import { useState } from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
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

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        patient_name: form.name,
        mobile: form.phone,
        reason: form.message,
        to_email: "avirahospital@gmail.com",
      }, EMAILJS_PUBLIC_KEY);
      toast({ title: "Message sent successfully!" });
      setForm({ name: "", email: "", phone: "", message: "" });
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

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-sm space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">Phone</h3>
                    <p className="text-muted-foreground text-sm">02692 354 201</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">Email</h3>
                    <p className="text-muted-foreground text-sm">avirahospital@gmail.com</p>
                    <p className="text-xs text-muted-foreground">We'll respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">Address</h3>
                    <p className="text-muted-foreground text-sm">
                      210, R.S.Platinum Building, Bhalej Road, Ganesh Colony, Anand, Gujarat, 388001
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <a href="https://www.facebook.com/avirahospital/" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://www.instagram.com/avirahospital21/" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Google Map */}
              <div className="rounded-xl overflow-hidden shadow-sm h-[300px]">
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

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-sm space-y-4 h-fit">
              <h3 className="font-heading font-bold text-xl mb-2">Send us a Message</h3>
              <div>
                <Label>Name *</Label>
                <Input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="tel" placeholder="Your phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>Message *</Label>
                <Textarea required placeholder="Your message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={sending}>
                <Send className="w-4 h-4" />
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
