import { ReactNode } from "react";
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
        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
          <div className="container mx-auto px-4">
            <p>© 2024 TrackView - All rights reserved.</p>
          </div>
        </footer>
      )}
      
      {showMobileNav && <MobileNav />}
    </div>
  );
};

export default Layout;
