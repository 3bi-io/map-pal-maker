import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/trackers",
    description: "List all trackers for the authenticated user.",
    auth: true,
    response: `[
  {
    "id": "uuid",
    "name": "Delivery Van #3",
    "tracking_id": "abc123",
    "is_active": true,
    "created_at": "2026-01-15T10:00:00Z"
  }
]`,
  },
  {
    method: "POST",
    path: "/api/v1/trackers",
    description: "Create a new tracker.",
    auth: true,
    response: `{
  "id": "uuid",
  "name": "New Tracker",
  "tracking_id": "xyz789",
  "is_active": true
}`,
  },
  {
    method: "GET",
    path: "/api/v1/trackers/:id/locations",
    description: "Get location history for a specific tracker.",
    auth: true,
    response: `[
  {
    "latitude": 40.7128,
    "longitude": -74.006,
    "accuracy": 10.5,
    "created_at": "2026-03-09T14:30:00Z"
  }
]`,
  },
  {
    method: "POST",
    path: "/api/v1/track/:tracking_id",
    description: "Submit a location update (used by tracking links).",
    auth: false,
    response: `{ "success": true }`,
  },
  {
    method: "PATCH",
    path: "/api/v1/trackers/:id",
    description: "Update tracker settings (name, active status).",
    auth: true,
    response: `{ "id": "uuid", "name": "Updated Name", "is_active": false }`,
  },
  {
    method: "DELETE",
    path: "/api/v1/trackers/:id",
    description: "Delete a tracker and all associated location data.",
    auth: true,
    response: `{ "success": true }`,
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  POST: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  PATCH: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  DELETE: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const ApiReference = () => {
  const { ref, isVisible } = useScrollAnimation();

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live/" },
      { "@type": "ListItem", position: 2, name: "API Reference", item: "https://mapme.live/api" },
    ],
  };

  return (
    <Layout showFooter>
      <SEO
        title="API Reference — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="REST API documentation for MᴀᴘMᴇ.Lɪᴠᴇ — integrate real-time location tracking into your own applications."
        canonical="https://mapme.live/api"
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div
          ref={ref}
          className={`mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">API Reference</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Integrate MᴀᴘMᴇ.Lɪᴠᴇ location tracking into your own applications with our REST API.
          </p>

          {/* Auth */}
          <div className="bg-card border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-2">Authentication</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Authenticated endpoints require a Bearer token in the Authorization header:
            </p>
            <pre className="bg-muted rounded-lg p-4 text-sm text-foreground overflow-x-auto">
              Authorization: Bearer YOUR_API_TOKEN
            </pre>
          </div>

          <div className="bg-card border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-2">Base URL</h2>
            <pre className="bg-muted rounded-lg p-4 text-sm text-foreground overflow-x-auto">
              https://api.mapme.live/v1
            </pre>
          </div>
        </div>

        {/* Endpoints */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Endpoints</h2>
        <div className="space-y-6">
          {endpoints.map((ep, i) => (
            <div key={i} className="bg-card border rounded-xl overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <Badge className={`${methodColors[ep.method]} border-0 font-mono font-bold text-xs w-fit`}>
                  {ep.method}
                </Badge>
                <code className="text-sm font-mono text-foreground">{ep.path}</code>
                {ep.auth && (
                  <Badge variant="outline" className="text-xs w-fit ml-auto">Auth Required</Badge>
                )}
              </div>
              <div className="px-5 pb-3">
                <p className="text-sm text-muted-foreground">{ep.description}</p>
              </div>
              <details className="group">
                <summary className="px-5 py-2 text-xs font-medium text-primary cursor-pointer hover:underline">
                  Example Response
                </summary>
                <pre className="bg-muted m-3 mt-0 rounded-lg p-4 text-xs text-foreground overflow-x-auto">
                  {ep.response}
                </pre>
              </details>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Full interactive API docs with Swagger UI coming soon.
        </p>
      </main>
    </Layout>
  );
};

export default ApiReference;
