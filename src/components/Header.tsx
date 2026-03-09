import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Clock, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import aviraLogo from "@/assets/avira-logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Doctors", to: "/doctors" },
  { label: "Gallery", to: "/gallery" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-custom flex items-center justify-between py-2 px-4 md:px-8 text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              02692 354 201
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              24/7 Emergency Services
            </span>
          </div>
          <Link to="/staff-login">
            <Button variant="outline" size="sm" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground">
              Staff Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-card shadow-sm">
        <div className="container-custom flex items-center justify-between py-3 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={aviraLogo} alt="Avira Hospital Logo" className="w-10 h-10 rounded-lg object-contain" />
            <div>
              <h1 className="text-xl font-heading font-bold text-primary leading-tight">
                Avira Hospital
              </h1>
              <p className="text-xs text-muted-foreground">Care You Can Trust</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-primary font-semibold"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/book-appointment">
              <Button className="ml-3">Book Appointment</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-card border-t px-4 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-primary font-semibold"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/book-appointment" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2">Book Appointment</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
