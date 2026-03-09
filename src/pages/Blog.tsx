import { Calendar, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const posts = [
  {
    title: "How Real-Time Tracking Is Transforming Fleet Management",
    excerpt: "Learn how logistics companies are saving 30% on fuel costs and improving delivery times with GPS-based fleet tracking.",
    date: "Mar 5, 2026",
    category: "Industry",
    readTime: "5 min read",
  },
  {
    title: "Privacy-First Location Sharing: Our Approach",
    excerpt: "We built MᴀᴘMᴇ.Lɪᴠᴇ with privacy at its core. Here's how we keep your location data safe and give you full control.",
    date: "Feb 18, 2026",
    category: "Product",
    readTime: "4 min read",
  },
  {
    title: "Getting Started with the MᴀᴘMᴇ.Lɪᴠᴇ API",
    excerpt: "A step-by-step guide to integrating real-time location tracking into your own applications using our REST API.",
    date: "Feb 3, 2026",
    category: "Tutorial",
    readTime: "8 min read",
  },
  {
    title: "5 Creative Ways to Use Location Tracking Links",
    excerpt: "From scavenger hunts to delivery tracking — discover unexpected ways people are using shareable tracking links.",
    date: "Jan 20, 2026",
    category: "Tips",
    readTime: "3 min read",
  },
];

const Blog = () => {
  const { ref, isVisible } = useScrollAnimation();

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://mapme.live/blog" },
    ],
  };

  return (
    <Layout showFooter>
      <SEO
        title="Blog — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Insights, tutorials, and product updates from the MᴀᴘMᴇ.Lɪᴠᴇ team on real-time location tracking, privacy, and GPS technology."
        canonical="https://mapme.live/blog"
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Insights, tutorials, and updates from the MᴀᴘMᴇ.Lɪᴠᴇ team.
          </p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.title} className="group hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="text-xs text-muted-foreground">· {post.readTime}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 hidden sm:block" />
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          More articles coming soon. Stay tuned!
        </p>
      </main>
    </Layout>
  );
};

export default Blog;
