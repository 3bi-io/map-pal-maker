import { Home, LayoutDashboard, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname === path;

  const navItems = user ? [
    { path: "/", icon: Home, label: "Home" },
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ] : [
    { path: "/", icon: Home, label: "Home" },
    { path: "/auth", icon: LogIn, label: "Sign In" },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="navigation" 
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            aria-label={item.label}
            aria-current={isActive(item.path) ? 'page' : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full min-w-[64px] rounded-xl transition-all duration-200 touch-manipulation relative",
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground active:text-foreground"
            )}
          >
            {/* Active indicator dot */}
            {isActive(item.path) && (
              <div className="absolute top-1 w-4 h-1 rounded-full bg-primary" />
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-200",
              isActive(item.path) && "scale-110"
            )} />
            <span className={cn(
              "text-xs font-medium",
              isActive(item.path) && "font-semibold"
            )}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
