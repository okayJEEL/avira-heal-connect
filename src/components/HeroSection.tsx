import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import hospitalFront from "@/assets/hospital-front.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Full-width hospital image hero */}
      <div className="relative w-full h-[70vh] md:h-[85vh]">
        <img
          src={hospitalFront}
          alt="Avira Hospital - Front view of our state-of-the-art facility"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom w-full pb-12 md:pb-20 px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <span className="inline-block bg-primary/90 text-primary-foreground font-medium text-sm px-4 py-1.5 rounded-full mb-4">
                Trusted Healthcare Partner
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-4 text-white drop-shadow-lg">
                Get the Care You{" "}
                <span className="text-primary">Deserve</span>
              </h1>
              <p className="text-white/85 text-base md:text-lg leading-relaxed mb-6 max-w-lg drop-shadow">
                Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/book-appointment">
                  <Button size="lg" className="gap-2 shadow-lg">
                    Book Appointment <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="tel:02692354201">
                  <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
                    <Phone className="w-4 h-4" /> Call Now
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
