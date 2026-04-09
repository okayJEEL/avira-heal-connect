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
    title: "Understanding Preventive Healthcare: Why Regular Check-ups Save Lives",
    excerpt:
      "Preventive healthcare is the cornerstone of a long, healthy life. Many serious conditions — including diabetes, hypertension, and certain cancers — can be detected early through routine screenings, dramatically improving treatment outcomes and survival rates.",
    content:
      "Regular health check-ups allow doctors to catch warning signs before they become critical. Blood pressure monitoring, blood sugar tests, cholesterol panels, and cancer screenings are simple procedures that take minimal time but can add years to your life. At our hospital, we recommend annual comprehensive health check-ups for adults over 30 and bi-annual visits for those with a family history of chronic diseases.",
    image: blog1,
    date: "April 5, 2026",
    readTime: "5 min read",
    author: "Dr. Rajesh Sharma",
    category: "Preventive Care",
  },
  {
    id: 2,
    title: "Heart Health 101: Signs You Should Never Ignore",
    excerpt:
      "Cardiovascular disease remains the leading cause of death worldwide. Recognising early warning signs — chest discomfort, shortness of breath, unusual fatigue — and seeking immediate medical attention can be the difference between life and death.",
    content:
      "Our cardiology department sees hundreds of patients every month, and the most common regret we hear is 'I wish I had come sooner.' Symptoms like persistent chest tightness, pain radiating to the left arm, dizziness during physical activity, and swelling in the legs should never be dismissed. Modern cardiology offers minimally invasive diagnostics — from stress tests to angiograms — that can pinpoint issues quickly.",
    image: blog2,
    date: "March 28, 2026",
    readTime: "7 min read",
    author: "Dr. Priya Mehta",
    category: "Cardiology",
  },
  {
    id: 3,
    title: "Joint Pain After 40? What an Orthopaedic Specialist Wants You to Know",
    excerpt:
      "Age-related joint pain is common, but it doesn't have to limit your life. From physiotherapy and lifestyle modifications to advanced joint replacement surgery, modern orthopaedics offers a wide spectrum of solutions tailored to every stage.",
    content:
      "Osteoarthritis affects nearly 15% of Indians over the age of 40. Early intervention — weight management, low-impact exercises, and anti-inflammatory nutrition — can slow progression significantly. When conservative treatments aren't enough, procedures like arthroscopy and robotic-assisted joint replacements provide excellent outcomes with faster recovery. Our orthopaedic team uses the latest techniques to get patients back on their feet.",
    image: blog3,
    date: "March 15, 2026",
    readTime: "6 min read",
    author: "Dr. Anil Verma",
    category: "Orthopaedics",
  },
  {
    id: 4,
    title: "Childhood Vaccinations: A Complete Guide for New Parents",
    excerpt:
      "Vaccinations are one of the most effective ways to protect your child from life-threatening diseases. Our paediatrics team breaks down the recommended immunisation schedule, addresses common concerns, and explains why timely vaccination matters.",
    content:
      "The Indian Academy of Pediatrics (IAP) recommends a comprehensive vaccination schedule starting from birth. Vaccines for Hepatitis B, BCG, Polio, DPT, MMR, and newer ones like Rotavirus and Pneumococcal are critical in the first two years. Despite myths circulating online, vaccines are rigorously tested and have saved millions of lives globally. Our paediatric department provides personalised vaccination calendars and gentle administration techniques to make the experience stress-free for both parents and children.",
    image: blog4,
    date: "March 2, 2026",
    readTime: "8 min read",
    author: "Dr. Sneha Kulkarni",
    category: "Paediatrics",
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
