import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

const CONSENT_KEY = "cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[60] p-4 transition-transform duration-500",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="container mx-auto max-w-2xl">
        <div className="rounded-xl border bg-card/95 backdrop-blur-md shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Cookie className="w-5 h-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-muted-foreground flex-1">
            We use cookies and local storage to maintain your session and preferences. No third-party tracking cookies are used.
            Read our{" "}
            <a href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
              Privacy Policy
            </a>{" "}
            for details.
          </p>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={decline} className="flex-1 sm:flex-none">
              Decline
            </Button>
            <Button size="sm" onClick={accept} className="flex-1 sm:flex-none">
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
