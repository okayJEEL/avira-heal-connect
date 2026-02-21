import { FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding bg-section-alt">
        <div className="container-custom max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Health Blog</h1>
          <p className="text-muted-foreground mb-12">Health tips and articles from our experts</p>

          <div className="bg-card rounded-xl p-12 shadow-sm">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Blog articles coming soon.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Stay tuned for health tips, medical news, and wellness advice from our doctors.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;
