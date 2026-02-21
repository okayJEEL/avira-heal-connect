import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import drVivek from "@/assets/dr-vivek.jpg";
import drPreeti from "@/assets/dr-preeti.jpg";

export const doctors = [
  {
    id: "dr-vivek",
    name: "Dr. Vivek Sidhapura",
    specialty: "Consulting Physician & Diabetologist",
    qualifications: "MBBS, M.D. (Medicine), PGCDM",
    opd: "10:00 AM – 1:00 PM",
    feeNew: 700,
    feeExisting: 350,
    rating: 4.5,
    reviews: 287,
    image: drVivek,
  },
  {
    id: "dr-preeti",
    name: "Dr. Preeti Sidhapura",
    specialty: "Aesthetic Physician & Cosmetologist",
    qualifications: "MBBS, FAM, PGDCC, PGDCD",
    opd: "10:00 AM – 1:00 PM",
    feeNew: 600,
    feeExisting: 300,
    rating: 4.3,
    reviews: 245,
    image: drPreeti,
  },
];

const DoctorsSection = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Meet Our Doctors</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experienced healthcare professionals dedicated to your well-being
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg">{doc.name}</h3>
                <p className="text-primary text-sm font-medium">{doc.specialty}</p>
                <p className="text-xs text-muted-foreground mt-1">{doc.qualifications}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3.5 h-3.5 ${
                          si < Math.floor(doc.rating)
                            ? "fill-gold text-gold"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({doc.reviews})</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  OPD: {doc.opd}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Fee: ₹{doc.feeNew} (New) / ₹{doc.feeExisting} (Existing)
                </div>
                <Link to={`/book-appointment?doctor=${doc.id}`}>
                  <Button className="w-full mt-4" size="sm">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
