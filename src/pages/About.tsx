import { Heart, Award, Users, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  { icon: Heart, title: "Compassion", desc: "We treat every patient with empathy, kindness, and respect." },
  { icon: Award, title: "Excellence", desc: "We strive for the highest standards in medical care and service." },
  { icon: Users, title: "Collaboration", desc: "We work together as a team to deliver comprehensive care." },
  { icon: Lightbulb, title: "Innovation", desc: "We embrace new technologies and methods to improve patient outcomes." },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding bg-section-alt">
        <div className="container-custom max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-2">About Avira Hospital</h1>
          <p className="text-center text-muted-foreground mb-12">Dedicated to providing exceptional healthcare</p>

          {/* Team Photo Feature */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-14"
          >
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-card">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 md:w-32 md:h-32 border-t-4 border-l-4 border-primary/30 rounded-tl-2xl md:rounded-tl-3xl z-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 border-t-4 border-r-4 border-primary/30 rounded-tr-2xl md:rounded-tr-3xl z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 md:w-32 md:h-32 border-b-4 border-l-4 border-primary/30 rounded-bl-2xl md:rounded-bl-3xl z-10 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-20 h-20 md:w-32 md:h-32 border-b-4 border-r-4 border-primary/30 rounded-br-2xl md:rounded-br-3xl z-10 pointer-events-none" />

              <div className="relative aspect-[16/9] md:aspect-[21/9]">
                <img
                  src={teamPhotoAsset.url}
                  alt="The Avira Hospital team standing together at the hospital entrance"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                {/* Soft gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-card/90 backdrop-blur-sm rounded-xl px-5 py-4 md:px-8 md:py-5 inline-block max-w-2xl"
                  >
                    <p className="text-sm md:text-base font-heading font-semibold text-foreground">
                      The Avira Team
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      United in our mission to deliver compassionate, world-class care to every patient.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -4, boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.2)" }}
            className="bg-card rounded-xl p-6 md:p-8 shadow-sm mb-10 transition-shadow"
          >
            <h2 className="text-2xl font-heading font-bold mb-4">Our Story</h2>
            <p className="text-foreground/80 leading-relaxed">
              Avira Hospital was established with a vision to provide world-class healthcare services to our community.
              Over the years, we have grown into a trusted healthcare institution, serving thousands of patients with
              dedication and excellence. Our state-of-the-art facility is equipped with the latest medical technology
              and staffed by a team of highly qualified doctors, nurses, and support staff who are committed to patient
              care and well-being.
            </p>
            <p className="text-foreground/80 leading-relaxed mt-4">
              We believe in a patient-centric approach where every individual receives personalized attention and
              treatment tailored to their specific needs. Our 24/7 emergency services ensure that quality healthcare
              is always accessible when you need it most.
            </p>
          </motion.div>

          <h2 className="text-2xl font-heading font-bold text-center mb-6">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 180 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-card rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow group cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-3"
                >
                  <v.icon className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="font-heading font-bold mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                title: "Our Mission",
                text: "To provide accessible, affordable, and high-quality healthcare services to all members of our community, while maintaining the highest standards of medical ethics and patient satisfaction.",
                from: -40,
              },
              {
                title: "Our Vision",
                text: "To be the leading healthcare provider in the region, recognized for clinical excellence, innovative treatments, and compassionate care that improves the health and well-being of our patients.",
                from: 40,
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: item.from }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.25)" }}
                className="bg-card rounded-xl p-6 shadow-sm transition-shadow"
              >
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">{item.title}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "15+", label: "Years of Service" },
              { value: "2+", label: "Medical Experts" },
              { value: "10,000+", label: "Happy Patients" },
              { value: "24/7", label: "Emergency Care" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ y: -6, scale: 1.05 }}
                className="bg-primary rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-shadow cursor-default"
              >
                <p className="text-2xl font-heading font-extrabold text-primary-foreground">{s.value}</p>
                <p className="text-sm text-primary-foreground/80">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
