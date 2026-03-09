import { useScrollAnimation, useCountUp } from "@/hooks/useScrollAnimation";

const stats = [
  { value: 10000, label: "Tracking Links Created", suffix: "+" },
  { value: 150, label: "Countries", suffix: "+" },
  { value: 99.9, label: "Uptime", suffix: "%", isDecimal: true },
  { value: 4.9, label: "Rating", prefix: "", suffix: "/5", isDecimal: true },
];

const StatItem = ({
  value,
  label,
  suffix = "",
  prefix = "",
  isDecimal = false,
  animate,
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  isDecimal?: boolean;
  animate: boolean;
}) => {
  const intPart = isDecimal ? Math.floor(value) : value;
  const count = useCountUp(isDecimal ? intPart * 10 : intPart, 2000, animate);
  const display = isDecimal
    ? (count / 10).toFixed(1)
    : count.toLocaleString();

  return (
    <div className="text-center space-y-1">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
        {prefix}
        {display}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

const SocialProofBar = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 border-y border-border/50 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} animate={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
