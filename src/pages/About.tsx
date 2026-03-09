import { MapPin, Shield, Globe, Rocket, Users, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const values = [
  { icon: Shield, title: "Privacy First", desc: "Your location data belongs to you. We never sell or share it with third parties." },
  { icon: Globe, title: "Open & Accessible", desc: "Free for personal use, available worldwide, and designed for every device." },
  { icon: Rocket, title: "Simplicity", desc: "One click to create a tracker. One link to share. No complicated setup." },
  { icon: Users, title: "Community Driven", desc: "Built with feedback from thousands of users across 150+ countries." },
];

const timeline = [
  { year: "2024", event: "Idea born — frustrated by complex tracking solutions that cost a fortune." },
  { year: "2024", event: "MVP launched — free real-time tracking with shareable links." },
  { year: "2025", event: "10,000+ tracking links created. Expanded to 150+ countries." },
  { year: "2026", event: "Pro & Enterprise tiers, API access, geofencing, and advanced analytics." },
];

const About = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation();
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation();

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live/" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://mapme.live/about" },
    ],
  };

  return (
    <Layout showFooter>
      <SEO
        title="About — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Learn about MᴀᴘMᴇ.Lɪᴠᴇ — why we built the simplest real-time location tracking platform and our mission to make GPS tracking accessible to everyone."
        canonical="https://mapme.live/about"
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero */}
        <div
          ref={heroRef}
          className={`text-center mb-20 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why We Built MᴀᴘMᴇ.Lɪᴠᴇ
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe real-time location tracking should be simple, private, and free for everyone.
            No expensive hardware. No monthly subscriptions for basic use. Just create a link, share it, and track in real time.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-20">
          <div className="bg-card border rounded-2xl p-8 md:p-12 text-center">
            <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3">Our Mission</h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              To democratize location tracking by providing a powerful, privacy-respecting platform
              that anyone can use — from parents keeping their family safe, to logistics companies
              managing entire fleets.
            </p>
          </div>
        </section>

        {/* Values */}
        <section
          ref={valuesRef}
          className={`mb-20 transition-all duration-700 ${valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border rounded-xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section
          ref={timelineRef}
          className={`mb-8 transition-all duration-700 ${timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Our Journey</h2>
          <div className="relative border-l-2 border-primary/20 ml-4 space-y-8">
            {timeline.map((t, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                <span className="text-xs font-semibold text-primary">{t.year}</span>
                <p className="text-muted-foreground mt-1">{t.event}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default About;
