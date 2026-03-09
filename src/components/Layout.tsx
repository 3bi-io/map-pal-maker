import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showMobileNav?: boolean;
  showFooter?: boolean;
}

const Layout = ({ 
  children, 
  showNav = true, 
  showMobileNav = true,
  showFooter = false 
}: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col overflow-x-hidden">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {showNav && <Navigation />}
      
      <div 
        id="main-content" 
        className={`flex-1 ${showMobileNav && isMobile ? 'pb-20' : ''}`}
      >
        {children}
      </div>
      
      {showFooter && (
        <footer className="border-t py-8 sm:py-12 text-sm text-muted-foreground">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} MᴀᴘMᴇ.Lɪᴠᴇ — Real-time location tracking platform.</p>
              <nav aria-label="Footer navigation" className="flex gap-4">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              </nav>
            </div>
          </div>
        </footer>
      )}
      
      {showMobileNav && <MobileNav />}
    </div>
  );
};

export default Layout;
