import { Phone, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EmergencyButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-card rounded-xl shadow-2xl p-5 w-72"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-heading font-bold text-primary">Emergency</h3>
                <p className="text-sm text-muted-foreground">24/7 Available</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-foreground/80 mb-4">
              For immediate medical assistance, call our emergency hotline
            </p>
            <a
              href="tel:02692354201"
              className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 02692 354 201
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={`ml-auto w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors ${open ? "hidden" : "flex"}`}
      >
        <Phone className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default EmergencyButton;
