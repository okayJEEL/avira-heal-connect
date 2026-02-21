import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { doctors } from "@/components/DoctorsSection";
import { motion } from "framer-motion";

const OurDoctors = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding bg-section-alt">
        <div className="container-custom max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-2">Our Expert Doctors</h1>
          <p className="text-center text-muted-foreground mb-12">Meet our team of experienced healthcare professionals</p>

          <div className="space-y-6">
            {doctors.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-64 h-64 md:h-auto shrink-0 overflow-hidden">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-6 flex-1">
                  <h2 className="text-xl font-heading font-bold">{doc.name}</h2>
                  <p className="text-primary font-medium">{doc.specialty}</p>
                  <p className="text-sm text-muted-foreground mt-1">{doc.qualifications}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className={`w-4 h-4 ${si < Math.floor(doc.rating) ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({doc.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    OPD: {doc.opd}
                  </div>
                  <p className="text-sm mt-2 text-foreground/80">
                    Consultation Fee: ₹{doc.feeNew} (New) / ₹{doc.feeExisting} (Existing)
                  </p>
                  <Link to={`/book-appointment?doctor=${doc.id}`}>
                    <Button className="mt-4">Book Appointment</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OurDoctors;
