import { Stethoscope, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const departments = [
  {
    icon: Stethoscope,
    title: "Consulting Physician & Diabetologist",
    description: "Expert care for general medicine and diabetes management",
    services: [
      "Treatment of diabetes, blood pressure, thyroid",
      "Heart, lungs, brain, kidneys, liver and stomach diseases",
      "Malaria, dengue, chikungunya, typhoid, jaundice",
      "Poisonous gas, snakebite, electric shock treatment",
    ],
  },
  {
    icon: Sparkles,
    title: "Aesthetic Physician & Cosmetologist",
    description: "Advanced aesthetic treatments and cosmetic procedures",
    services: [
      "Hair loss and baldness treatment (PRP)",
      "Laser hair removal",
      "Dark circles, acne, acne scars treatment",
      "Botox, Thread Filler and Permanent Makeup",
      "Medicated hair and chemical peeling",
    ],
  },
];

const DepartmentsSection = () => {
  return (
    <section className="section-padding bg-section-alt">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Our Departments</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive healthcare services across multiple specializations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {departments.map((dept, i) => (
            <motion.div
              key={dept.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <dept.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-bold text-primary mb-2">{dept.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{dept.description}</p>
              <ul className="space-y-2">
                {dept.services.map((s) => (
                  <li key={s} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
