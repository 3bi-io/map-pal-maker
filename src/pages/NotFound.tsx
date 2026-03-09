import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const NotFound = () => {
  return (
    <>
      <SEO
        title="404 - Page Not Found | MᴀᴘMᴇ.Lɪᴠᴇ"
        description="The page you are looking for does not exist. Return to MᴀᴘMᴇ.Lɪᴠᴇ homepage to create tracking links and monitor device locations."
        keywords="404, page not found"
        canonical="https://mapme.live/404"
        noindex
      />
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="text-center space-y-6" role="main">
          <h1 className="text-6xl sm:text-8xl font-bold text-foreground">404</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">Page not found</p>
          <p className="text-sm text-muted-foreground/70 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="gap-2 h-12">
              <Home className="w-4 h-4" aria-hidden="true" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
