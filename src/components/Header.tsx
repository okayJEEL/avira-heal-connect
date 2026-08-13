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
              <div className="px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6 max-w-md mx-auto">
                {/* Centered drawer header */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-5 flex flex-col items-center text-center"
                >
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <img
                      src={aviraLogo}
                      alt="Avira Hospital"
                      className="h-8 w-8 rounded-md object-contain"
                    />
                  </div>
                  <p className="text-sm font-heading font-semibold text-foreground">Avira Hospital</p>
                  <p className="text-xs text-muted-foreground">Quick Navigation</p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {navLinks.map((link, i) => {
                    const Icon = link.icon;
                    const active = location.pathname === link.to;
                    return (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.04 * i, duration: 0.25 }}
                        className="col-span-1"
                      >
                        <Link
                          to={link.to}
                          onClick={() => setMobileOpen(false)}
                          className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-all active:scale-[0.97] ${
                            active
                              ? "border-primary/40 bg-primary/10 shadow-sm"
                              : "border-border bg-card hover:border-primary/30 hover:bg-primary/5"
                          }`}
                        >
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary group-hover:bg-primary/20"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0">
                            <span
                              className={`block text-sm font-heading font-semibold leading-tight ${
                                active ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {link.label}
                            </span>
                            <span className="block truncate text-[10px] text-muted-foreground mt-0.5">
                              {link.hint}
                            </span>
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.25 }}
                  className="mt-5 space-y-3"
                >
                  <Link to="/book-appointment" onClick={() => setMobileOpen(false)} className="block">
                    <Button size="lg" className="w-full gap-2 rounded-2xl text-base shadow-md">
                      <CalendarPlus className="h-5 w-5" />
                      Book Appointment
                    </Button>
                  </Link>

                  <a
                    href="tel:02692354201"
                    className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary/10 px-4 py-4 text-center transition-colors hover:bg-primary/15 active:scale-[0.98]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">24/7 Emergency Helpline</p>
                      <p className="font-heading text-lg font-bold text-primary">02692 354 201</p>
                    </div>
                  </a>

                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground text-center">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
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
