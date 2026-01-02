import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const NotFound = () => {
  return (
    <>
      <SEO
        title="404 - Page Not Found | TrackView"
        description="The page you are looking for does not exist. Return to TrackView homepage to create tracking links and monitor device locations."
        keywords="404, page not found"
        canonical="https://trackview.lovable.app/404"
      />
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">Page not found</p>
          <Link to="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
