import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
          Book an appointment with our expert doctors today and take the first step towards better health
        </p>
        <Link to="/book-appointment">
          <Button
            size="lg"
            className="bg-card text-primary hover:bg-card/90 font-semibold"
          >
            Book Appointment Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
