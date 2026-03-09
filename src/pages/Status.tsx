import { CheckCircle2, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const services = [
  { name: "API", status: "operational", uptime: "99.98%" },
  { name: "Dashboard", status: "operational", uptime: "99.99%" },
  { name: "Tracking Service", status: "operational", uptime: "99.97%" },
  { name: "Map Rendering", status: "operational", uptime: "99.95%" },
  { name: "Authentication", status: "operational", uptime: "99.99%" },
];

const statusConfig = {
  operational: { label: "Operational", color: "text-emerald-500", icon: CheckCircle2, bg: "bg-emerald-500/10" },
  degraded: { label: "Degraded", color: "text-amber-500", icon: AlertCircle, bg: "bg-amber-500/10" },
};

const Status = () => {
  const allOperational = services.every((s) => s.status === "operational");

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live/" },
      { "@type": "ListItem", position: 2, name: "Status", item: "https://mapme.live/status" },
    ],
  };

  return (
    <Layout showFooter>
      <SEO
        title="System Status — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Real-time system status and uptime for MᴀᴘMᴇ.Lɪᴠᴇ services."
        canonical="https://mapme.live/status"
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">System Status</h1>
        <p className="text-muted-foreground mb-8">Current status of all MᴀᴘMᴇ.Lɪᴠᴇ services.</p>

        {/* Overall banner */}
        <div className={`rounded-xl p-5 mb-8 border ${allOperational ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
          <div className="flex items-center gap-3">
            {allOperational ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-500" />
            )}
            <span className="text-lg font-semibold text-foreground">
              {allOperational ? "All Systems Operational" : "Some Services Degraded"}
            </span>
          </div>
        </div>

        {/* Services list */}
        <div className="space-y-3">
          {services.map((service) => {
            const cfg = statusConfig[service.status as keyof typeof statusConfig];
            return (
              <div key={service.name} className="bg-card border rounded-xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                  <span className="font-medium text-foreground">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{service.uptime} uptime</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Last checked: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </main>
    </Layout>
  );
};

export default Status;
