import { useState } from "react";
import { ImageIcon, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const albums = [
  { id: "reception", label: "Reception", icon: "🏥" },
  { id: "lobby", label: "Lobby", icon: "🏛️" },
  { id: "doctors-cabin", label: "Doctors Cabin", icon: "👨‍⚕️" },
  { id: "pharmacy", label: "Pharmacy", icon: "💊" },
  { id: "icu", label: "ICU", icon: "🫀" },
  { id: "instruments", label: "Instruments & Facility", icon: "🔬" },
  { id: "patient-rooms", label: "Patient Rooms", icon: "🛏️" },
  { id: "general-ward", label: "General Ward Room", icon: "🏨" },
];

// Placeholder: photos will be added later per album
const albumPhotos: Record<string, string[]> = {};

const Gallery = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  const currentAlbum = albums.find((a) => a.id === selectedAlbum);
  const photos = selectedAlbum ? albumPhotos[selectedAlbum] || [] : [];

  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding bg-section-alt">
        <div className="container-custom max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Gallery</h1>
            <p className="text-muted-foreground">A glimpse into our hospital facilities</p>
          </div>

          {!selectedAlbum ? (
            /* Album Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {albums.map((album, i) => (
                <motion.button
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedAlbum(album.id)}
                  className="group bg-card rounded-2xl border border-border/60 shadow-sm hover:shadow-xl transition-shadow p-6 flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl group-hover:bg-primary/20 transition-colors">
                    {album.icon}
                  </div>
                  <span className="font-heading font-semibold text-sm md:text-base text-foreground text-center leading-tight">
                    {album.label}
                  </span>
                </motion.button>
              ))}
            </div>
          ) : (
            /* Album Detail View */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="flex items-center gap-2 text-primary font-medium mb-6 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Albums
              </button>

              <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">{currentAlbum?.icon}</span>
                {currentAlbum?.label}
              </h2>

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-xl overflow-hidden border border-border/50 shadow-sm"
                    >
                      <img src={photo} alt={`${currentAlbum?.label} ${idx + 1}`} className="w-full h-48 object-cover" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl p-12 text-center border border-border/50">
                  <ImageIcon className="w-14 h-14 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Photos coming soon</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Photos for {currentAlbum?.label} will be added shortly.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Gallery;
