import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-doctor.jpg";

const stats = [
  { value: "15+", label: "Expert Doctors" },
  { value: "10k+", label: "Happy Patients" },
  { value: "24/7", label: "Emergency Care" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-primary/10 text-primary font-medium text-sm px-4 py-1.5 rounded-full mb-6">
              Trusted Healthcare Partner
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-6">
              Get the Care You{" "}
              <span className="text-primary">Deserve</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
              Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities. Your health and well-being are our top priority.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/book-appointment">
                <Button size="lg" className="gap-2">
                  Book Appointment <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/doctors">
                <Button size="lg" variant="outline">
                  Our Doctors
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-heading font-extrabold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <img
              src={heroImage}
              alt="Doctor consulting with patient at Avira Hospital"
              className="rounded-2xl shadow-2xl object-cover w-full h-[500px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
