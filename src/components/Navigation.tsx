import { LogOut, LayoutDashboard, User, Sun, Moon, Smartphone, Menu, MapPin, Tag, BookOpen } from "lucide-react";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Toggle theme">
          {theme === 'light' ? (
            <Sun className="w-5 h-5" />
          ) : theme === 'oled' ? (
            <Smartphone className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuLabel>Display Mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-accent' : ''}>
          <Sun className="w-4 h-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-accent' : ''}>
          <Moon className="w-4 h-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('oled')} className={theme === 'oled' ? 'bg-accent' : ''}>
          <Smartphone className="w-4 h-4 mr-2" />
          OLED Black
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <nav className={`border-b sticky top-0 z-50 safe-area-top transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl shadow-sm" : "bg-transparent backdrop-blur-md"}`} role="navigation" aria-label="Main navigation">
      <div className={`container mx-auto px-4 flex items-center justify-between transition-all duration-300 ${scrolled ? "py-2" : "py-3"}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center group" aria-label="MᴀᴘMᴇ.Lɪᴠᴇ Home">
          <Logo size="md" className="group-hover:scale-105 transition-transform" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" className="h-10">Home</Button>
          </Link>

          <ThemeToggle />
          
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="gap-2 h-10">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" aria-label="Account menu">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover">
                  <DropdownMenuItem className="text-muted-foreground text-sm">
                    <User className="w-4 h-4 mr-2" />
                    <span className="truncate">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button className="h-10">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation - Hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {user && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Signed in</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <Link to="/" onClick={() => setSheetOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                      <MapPin className="w-4 h-4" />
                      Home
                    </Button>
                  </Link>
                  {user && (
                    <Link to="/dashboard" onClick={() => setSheetOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
                
                {user ? (
                  <div className="pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        signOut();
                        setSheetOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t">
                    <Link to="/auth" onClick={() => setSheetOpen(false)}>
                      <Button className="w-full h-12">Sign In</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
