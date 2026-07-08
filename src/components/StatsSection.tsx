import { User, Users, CalendarCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: User, value: "10+ Years", label: "Experience", gradient: "from-primary/20 to-primary/5" },
  { icon: Users, value: "10+ Staff", label: "Members", gradient: "from-primary/15 to-accent/30" },
  { icon: CalendarCheck, value: "Easy", label: "Appointments", gradient: "from-accent/30 to-primary/10" },
  { icon: Clock, value: "24/7", label: "Emergency", gradient: "from-primary/10 to-primary/20" },
];

const StatsSection = () => {
  return (
    <section className="relative -mt-12 z-10 px-4 md:px-8">
      <div className="container-custom max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-card/90 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 p-5 md:p-7 text-center group cursor-default"
            >
              <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
              </div>
              <p className="text-xl md:text-2xl font-heading font-extrabold text-foreground tracking-tight">{item.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
