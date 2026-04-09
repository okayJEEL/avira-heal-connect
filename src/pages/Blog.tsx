import { useState } from "react";
import { Calendar, Clock, ArrowRight, User, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Diabetes: Early Signs, Prevention & Modern Management",
    excerpt:
      "Diabetes is one of the most prevalent lifestyle diseases in India, affecting over 77 million adults. Early detection through regular blood sugar monitoring and lifestyle changes can prevent serious complications like kidney damage, vision loss, and nerve disorders.",
    content:
      "At our clinic, we see patients who have lived with undiagnosed diabetes for years. Simple fasting blood sugar and HbA1c tests can reveal pre-diabetic conditions early. Combined with dietary modifications, regular exercise, and modern medication, diabetes can be managed effectively. We also offer personalised diabetes management plans including continuous glucose monitoring guidance and insulin therapy when needed.",
    image: blog1,
    date: "April 5, 2026",
    readTime: "5 min read",
    author: "Dr. Vivek Sidhapura",
    category: "Diabetes Care",
  },
  {
    id: 2,
    title: "Heart Health 101: Signs You Should Never Ignore",
    excerpt:
      "Cardiovascular disease remains the leading cause of death worldwide. Recognising early warning signs — chest discomfort, shortness of breath, unusual fatigue — and seeking immediate medical attention can be the difference between life and death.",
    content:
      "Symptoms like persistent chest tightness, pain radiating to the left arm, dizziness during physical activity, and swelling in the legs should never be dismissed. Patients with diabetes and hypertension are at especially high risk. Regular ECG, lipid profile tests, and blood pressure monitoring are essential. Our general medicine practice includes comprehensive cardiac risk assessments as part of routine check-ups.",
    image: blog2,
    date: "March 28, 2026",
    readTime: "7 min read",
    author: "Dr. Vivek Sidhapura",
    category: "Heart & General Medicine",
  },
  {
    id: 3,
    title: "Monsoon Diseases: Protecting Yourself from Malaria, Dengue & Typhoid",
    excerpt:
      "Every monsoon season brings a spike in vector-borne and waterborne diseases. Malaria, dengue, chikungunya, and typhoid can be life-threatening if not treated promptly. Know the symptoms and when to seek medical help.",
    content:
      "High fever lasting more than 2 days, body aches, rashes, and low platelet counts are red flags during monsoon. Dengue in particular can escalate rapidly. Preventive measures include eliminating stagnant water, using mosquito nets, and drinking purified water. If symptoms appear, early diagnosis through blood tests and timely treatment with proper hydration and medication can prevent complications. We provide rapid diagnostic testing and emergency care for all seasonal infections.",
    image: blog3,
    date: "March 15, 2026",
    readTime: "6 min read",
    author: "Dr. Vivek Sidhapura",
    category: "Seasonal Health",
  },
  {
    id: 4,
    title: "PRP Hair Treatment: A Non-Surgical Solution for Hair Loss & Baldness",
    excerpt:
      "Platelet-Rich Plasma (PRP) therapy is revolutionising hair restoration. This minimally invasive treatment uses your own blood's growth factors to stimulate dormant hair follicles, promoting natural hair regrowth without surgery.",
    content:
      "PRP involves drawing a small amount of blood, processing it to concentrate the platelets, and injecting it into the scalp. The growth factors in PRP activate stem cells in the hair follicle, leading to thicker, stronger hair over 3-6 months. It's ideal for early-stage hair thinning and can be combined with medicated treatments for best results. Sessions are quick, virtually painless, and require no downtime. We offer customised PRP protocols based on individual hair loss patterns.",
    image: blog4,
    date: "March 2, 2026",
    readTime: "5 min read",
    author: "Dr. Preeti Sidhapura",
    category: "Aesthetic Medicine",
  },
  {
    id: 5,
    title: "Laser Hair Removal: Everything You Need to Know Before Your First Session",
    excerpt:
      "Tired of shaving, waxing, and threading? Laser hair removal offers a long-lasting solution for unwanted hair. Learn how the procedure works, what to expect, and why it's one of the most sought-after aesthetic treatments today.",
    content:
      "Laser hair removal works by targeting the melanin in hair follicles with concentrated light, disabling their ability to regrow. Most patients need 6-8 sessions for optimal results. The procedure is safe for most skin types and can be used on the face, underarms, legs, bikini area, and more. Mild redness post-treatment subsides within hours. We use advanced diode laser technology that ensures effective results with minimal discomfort and no scarring.",
    image: blog2,
    date: "February 20, 2026",
    readTime: "4 min read",
    author: "Dr. Preeti Sidhapura",
    category: "Aesthetic Medicine",
  },
  {
    id: 6,
    title: "Acne Scars & Dark Circles: Modern Treatments That Actually Work",
    excerpt:
      "Acne scars and dark circles can significantly impact self-confidence. From chemical peels and micro-needling to advanced laser therapy, modern dermatology offers effective solutions to restore clear, radiant skin.",
    content:
      "Acne scars come in different forms — ice pick, boxcar, and rolling scars — each requiring a tailored approach. Chemical peels with glycolic or salicylic acid work well for superficial scarring, while micro-needling with radiofrequency targets deeper scars. For dark circles, PRP under-eye treatment and hyaluronic acid fillers deliver visible improvement. We also recommend medical-grade skincare routines to maintain results long-term. Every treatment plan is customised after a thorough skin analysis.",
    image: blog1,
    date: "February 10, 2026",
    readTime: "6 min read",
    author: "Dr. Preeti Sidhapura",
    category: "Cosmetology",
  },
  {
    id: 7,
    title: "Botox & Thread Fillers: Myths vs. Facts About Anti-Ageing Treatments",
    excerpt:
      "Anti-ageing treatments like Botox and thread fillers are surrounded by misconceptions. When performed by a qualified cosmetologist, these procedures are safe, effective, and deliver natural-looking results without surgery.",
    content:
      "Botox works by temporarily relaxing facial muscles that cause wrinkles, particularly on the forehead and around the eyes. Results last 4-6 months and look completely natural when done correctly. Thread fillers, on the other hand, lift and tighten sagging skin using dissolvable threads that also stimulate collagen production. Combined with permanent makeup techniques for brows and lips, these treatments can take years off your appearance. We offer detailed consultations to set realistic expectations and create personalised anti-ageing plans.",
    image: blog3,
    date: "January 25, 2026",
    readTime: "5 min read",
    author: "Dr. Preeti Sidhapura",
    category: "Cosmetology",
  },
  {
    id: 8,
    title: "Managing Blood Pressure & Thyroid: A Comprehensive Guide",
    excerpt:
      "Hypertension and thyroid disorders often go undetected for years. Regular screening, proper medication, and lifestyle adjustments are key to keeping these silent conditions under control and preventing long-term organ damage.",
    content:
      "High blood pressure damages blood vessels gradually, increasing the risk of stroke, heart attack, and kidney failure. Similarly, thyroid imbalances — both hypo and hyper — affect metabolism, energy levels, mood, and weight. Simple blood tests (TSH, T3, T4 for thyroid; regular BP monitoring) can catch these early. Treatment typically involves daily medication, dietary changes (low-sodium diet for BP, iodine-balanced diet for thyroid), and regular follow-ups. We provide comprehensive metabolic health packages that cover all essential screenings.",
    image: blog4,
    date: "January 12, 2026",
    readTime: "7 min read",
    author: "Dr. Vivek Sidhapura",
    category: "General Medicine",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const Blog = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="container-custom max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
              <Tag className="w-3.5 h-3.5 mr-1.5" />
              Health & Wellness
            </Badge>
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-3 text-foreground">
              Health Blog
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Expert articles, health tips, and medical insights from our
              specialist doctors to help you live a healthier life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-background">
        <motion.div
          className="container-custom max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Featured Post (first) */}
          <motion.article
            variants={cardVariants}
            className="mb-12 group cursor-pointer"
            onClick={() =>
              setExpandedId(expandedId === blogPosts[0].id ? null : blogPosts[0].id)
            }
          >
            <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-card shadow-lg border border-border hover:shadow-xl transition-shadow duration-300">
              <div className="overflow-hidden h-64 md:h-auto">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  width={800}
                  height={512}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/20">
                    {blogPosts[0].category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {blogPosts[0].date}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {blogPosts[0].excerpt}
                </p>
                {expandedId === blogPosts[0].id && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-muted-foreground text-sm leading-relaxed mb-4"
                  >
                    {blogPosts[0].content}
                  </motion.p>
                )}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    {blogPosts[0].author}
                    <span className="mx-1">•</span>
                    <Clock className="w-3.5 h-3.5" />
                    {blogPosts[0].readTime}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary gap-1">
                    {expandedId === blogPosts[0].id ? "Read less" : "Read more"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Remaining posts grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <motion.article
                key={post.id}
                variants={cardVariants}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-card shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                onClick={() =>
                  setExpandedId(expandedId === post.id ? null : post.id)
                }
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={512}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-primary/10 text-primary border-0 text-[11px] hover:bg-primary/20">
                      {post.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-3">
                    {post.excerpt}
                  </p>
                  {expandedId === post.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-muted-foreground text-sm leading-relaxed mb-3"
                    >
                      {post.content}
                    </motion.p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
