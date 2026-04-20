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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 md:p-8 shadow-sm mb-10">
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
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-5 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-3">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-bold mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-heading font-bold mb-3 text-primary">Our Mission</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                To provide accessible, affordable, and high-quality healthcare services to all members of our community,
                while maintaining the highest standards of medical ethics and patient satisfaction.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-heading font-bold mb-3 text-primary">Our Vision</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                To be the leading healthcare provider in the region, recognized for clinical excellence, innovative
                treatments, and compassionate care that improves the health and well-being of our patients.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "15+", label: "Years of Service" },
              { value: "2+", label: "Medical Experts" },
              { value: "10,000+", label: "Happy Patients" },
              { value: "24/7", label: "Emergency Care" },
            ].map((s) => (
              <div key={s.label} className="bg-primary rounded-xl p-5 text-center">
                <p className="text-2xl font-heading font-extrabold text-primary-foreground">{s.value}</p>
                <p className="text-sm text-primary-foreground/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
