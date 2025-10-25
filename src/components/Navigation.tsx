import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-card group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Geo-Follower</h1>
            <p className="text-xs text-muted-foreground">WHERE ARE YOU?</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/create">
            <Button>Create Tracker</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
