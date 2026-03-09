import { UserPlus, Share2, Eye } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: UserPlus,
    title: "Create an Account",
    description: "Sign up for free in seconds with just your email.",
  },
  {
    icon: Share2,
    title: "Generate & Share a Link",
    description: "Create a tracking link and share via text, email, or QR.",
  },
  {
    icon: Eye,
    title: "Monitor in Real-Time",
    description: "View live GPS on an interactive map from your dashboard.",
  },
];

const HowItWorksSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="how-it-works"
      ref={ref}
      className={`py-20 sm:py-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4">
        <h2
          id="how-it-works-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-14"
        >
          How It Works
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting dashed line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[16.6%] right-[16.6%] border-t-2 border-dashed border-primary/30" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="text-center space-y-4 relative"
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto relative z-10 bg-background">
                  <step.icon className="w-8 h-8 text-primary" aria-hidden="true" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
