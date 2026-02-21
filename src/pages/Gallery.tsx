import { ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Gallery = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding bg-section-alt">
        <div className="container-custom max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Gallery</h1>
          <p className="text-muted-foreground mb-12">A glimpse into our hospital facilities</p>

          <div className="bg-card rounded-xl p-12 shadow-sm">
            <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Hospital facility images will be added soon.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Including ICU, doctor cabin, compound, general room, and more.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Gallery;
