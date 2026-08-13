import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Phone,
  Clock,
  Menu,
  X,
  Home,
  Info,
  Stethoscope,
  Images,
  Newspaper,
  Mail,
  CalendarPlus,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import aviraLogo from "@/assets/avira-logo.png";

const navLinks = [
  { label: "Home", to: "/", icon: Home, hint: "Welcome to Avira" },
  { label: "About Us", to: "/about", icon: Info, hint: "Our story & team" },
  { label: "Our Doctors", to: "/doctors", icon: Stethoscope, hint: "Meet our specialists" },
  { label: "Gallery", to: "/gallery", icon: Images, hint: "Inside the hospital" },
  { label: "Blog", to: "/blog", icon: Newspaper, hint: "Health articles" },
  { label: "Contact", to: "/contact", icon: Mail, hint: "Reach out to us" },
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
            className="lg:hidden relative p-2.5 rounded-xl bg-primary/10 text-primary active:scale-95 transition-transform"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.span>
          </button>
        </div>

        {/* Mobile / tablet menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden border-t bg-gradient-to-b from-primary/[0.06] via-card to-card"
            >
              <div className="px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {navLinks.map((link, i) => {
                    const Icon = link.icon;
                    const active = location.pathname === link.to;
                    return (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * i, duration: 0.25 }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setMobileOpen(false)}
                          className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all active:scale-[0.98] ${
                            active
                              ? "border-primary/40 bg-primary/10 shadow-sm"
                              : "border-border bg-card hover:border-primary/30 hover:bg-primary/5"
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[15px] font-heading font-semibold ${
                                active ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {link.label}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {link.hint}
                            </span>
                          </span>
                          <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.25 }}
                  className="mt-4 space-y-3"
                >
                  <Link to="/book-appointment" onClick={() => setMobileOpen(false)} className="block">
                    <Button size="lg" className="w-full gap-2 rounded-2xl text-base shadow-md">
                      <CalendarPlus className="h-5 w-5" />
                      Book Appointment
                    </Button>
                  </Link>

                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary/10 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">
                        24/7 Emergency Helpline
                      </p>
                      <a
                        href="tel:02692354201"
                        className="block truncate font-heading text-base font-bold text-primary"
                      >
                        02692 354 201
                      </a>
                    </div>
                    <a
                      href="tel:02692354201"
                      aria-label="Call emergency helpline"
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md active:scale-95 transition-transform"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                  </div>

                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    OPD 10:00 AM – 1:00 PM &amp; 5:00 PM – 8:00 PM
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </header>
  );
};

export default Header;
