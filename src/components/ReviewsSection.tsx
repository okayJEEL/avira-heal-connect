import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Ramesh Patel",
    date: "15/01/2024",
    service: "General Medicine",
    rating: 5,
    text: "Excellent service and caring staff. Dr. Vivek was very thorough and patient with all my questions.",
  },
  {
    name: "Priya Deshmukh",
    date: "10/01/2024",
    service: "Skin Treatment",
    rating: 5,
    text: "Very professional and clean hospital. The appointment booking process was smooth.",
  },
  {
    name: "Suresh Reddy",
    date: "08/01/2024",
    service: "Diabetes Consultation",
    rating: 4,
    text: "Good experience overall. Staff is friendly and facilities are modern.",
  },
  {
    name: "Meena Singh",
    date: "05/01/2024",
    service: "Cosmetic Treatment",
    rating: 5,
    text: "Dr. Preeti was wonderful and explained everything clearly. Highly recommend for skin care.",
  },
];

const ReviewsSection = () => {
  return (
    <section className="section-padding bg-section-alt">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Patient Reviews</h2>
          <p className="text-muted-foreground">Hear what our patients have to say about their experience</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-sm"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, si) => (
                  <Star
                    key={si}
                    className={`w-4 h-4 ${
                      si < review.rating ? "fill-gold text-gold" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{review.text}"</p>
              <div className="border-t pt-3 flex items-center justify-between">
                <div>
                  <p className="font-heading font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.service}</p>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
