import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Clock } from "lucide-react";
import aviraLogo from "@/assets/avira-logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Emergency banner */}
      <div className="bg-primary">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between py-5 px-4 md:px-8 gap-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-primary-foreground">Emergency?</h3>
            <p className="text-primary-foreground/80 text-sm">
              For immediate medical assistance, call our emergency hotline
            </p>
          </div>
          <a
            href="tel:02692354201"
            className="bg-card text-primary font-heading font-bold px-6 py-3 rounded-lg hover:bg-card/90 transition-colors"
          >
            Call 02692 354 201
          </a>
        </div>
      </div>

      <div className="container-custom py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={aviraLogo} alt="Avira Hospital Logo" className="w-10 h-10 rounded-lg object-contain" />
              <div>
                <h3 className="text-lg font-heading font-bold">Avira Hospital</h3>
                <p className="text-xs text-background/60">Care You Can Trust</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Providing quality healthcare services with compassion and excellence. Your health is our priority.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.facebook.com/avirahospital/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/avirahospital21/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Our Doctors", to: "/doctors" },
                { label: "Gallery", to: "/gallery" },
                { label: "Blog", to: "/blog" },
                { label: "Contact Us", to: "/contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-heading font-bold mb-4">Working Hours</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-background">Emergency Services</p>
                  <p>24/7 Available</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-background">OPD Services</p>
                  <p>10:00 AM – 1:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-background">Pharmacy</p>
                  <p>8:00 AM – 10:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold mb-4">Contact Information</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>02692 354 201</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>avirahospital@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>210, R.S.Platinum Building, Bhalej Road, Ganesh Colony, Anand, Gujarat, 388001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center text-sm text-background/50">
          © {new Date().getFullYear()} Avira Hospital. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
