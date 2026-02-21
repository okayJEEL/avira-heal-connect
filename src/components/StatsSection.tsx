import { User, Users, CalendarCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: User, value: "15+ Years", label: "Experience" },
  { icon: Users, value: "10+ Staff", label: "Members" },
  { icon: CalendarCheck, value: "Easy", label: "Appointments" },
  { icon: Clock, value: "24/7", label: "Emergency" },
];

const StatsSection = () => {
  return (
    <section className="relative -mt-8 z-10 px-4 md:px-8">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl shadow-lg p-6 text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xl font-heading font-bold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
