import { useParams, useNavigate } from "react-router-dom";
import { Video, ArrowLeft, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VideoCallRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const jitsiUrl = `https://meet.jit.si/${roomId}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 section-padding bg-section-alt">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-heading font-bold">Video Consultation</h1>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
            <div className="bg-primary/5 border-b border-border px-4 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Monitor className="w-4 h-4" />
                <span>Room: <span className="font-medium text-foreground">{roomId}</span></span>
              </div>
              <a href={jitsiUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">Open in New Tab</Button>
              </a>
            </div>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={jitsiUrl}
                className="absolute inset-0 w-full h-full"
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                style={{ border: "none" }}
                title="Video Consultation"
              />
            </div>
          </div>

          <div className="mt-4 bg-accent rounded-lg p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">💡 Tips for your video consultation:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure you have a stable internet connection</li>
              <li>Allow camera and microphone access when prompted</li>
              <li>Find a quiet, well-lit space for the call</li>
              <li>Keep your medical records handy for reference</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default VideoCallRoom;
