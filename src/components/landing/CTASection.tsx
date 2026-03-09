import { Link } from "react-router-dom";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const CTASection = () => {
  const { user } = useAuth();

  return (
    <aside className="py-20 sm:py-24 relative overflow-hidden" aria-label="Call to action">
      {/* Glow background */}
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, hsl(var(--primary) / 0.3), transparent)",
        }}
      />

      <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground">
          Start Tracking for Free —{" "}
          <span className="text-transparent bg-clip-text bg-gradient-primary">
            No Limits
          </span>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Create unlimited tracking links, monitor in real-time, and share
          securely. Free forever for personal use.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button
              size="lg"
              className="gap-2 text-base px-8 shadow-elevated w-full sm:w-auto h-12"
            >
              <MapPin className="w-5 h-5" aria-hidden="true" />
              {user ? "Go to Dashboard" : "Start Free"}
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8 w-full sm:w-auto h-12"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              View Docs
            </Button>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default CTASection;
