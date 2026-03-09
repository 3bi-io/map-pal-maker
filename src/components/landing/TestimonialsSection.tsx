import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Logistics Manager, FastFreight",
    initials: "SC",
    color: "bg-blue-500",
    rating: 5,
    quote:
      "MᴀᴘMᴇ.Lɪᴠᴇ replaced our expensive fleet tracking software. The link-based approach means our drivers don't need a separate app.",
  },
  {
    name: "James Okafor",
    role: "Parent",
    initials: "JO",
    color: "bg-emerald-500",
    rating: 5,
    quote:
      "I share a link with my kids when they walk home from school. Simple, free, and I can stop tracking the moment they arrive. Love it.",
  },
  {
    name: "Priya Sharma",
    role: "Full-Stack Developer",
    initials: "PS",
    color: "bg-violet-500",
    rating: 5,
    quote:
      "I integrated location tracking into my delivery app in minutes — just embed the tracking link. No SDK, no API key hassle.",
  },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`py-20 sm:py-24 bg-muted/30 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4">
        <h2
          id="testimonials-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-14"
        >
          Trusted by Thousands
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="p-6 space-y-4 shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold text-white`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
