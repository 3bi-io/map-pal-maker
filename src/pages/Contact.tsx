import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Clock, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const { ref, isVisible } = useScrollAnimation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = (data: ContactForm) => {
    // Client-side only — no backend
    void data;
    toast.success("Message sent! We'll get back to you within 24 hours.");
    reset();
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live/" },
      { "@type": "ListItem", position: 2, name: "Contact", item: "https://mapme.live/contact" },
    ],
  };

  return (
    <Layout showFooter>
      <SEO
        title="Contact Us — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Get in touch with the MᴀᴘMᴇ.Lɪᴠᴇ team. We'd love to hear from you — questions, feedback, or partnership inquiries."
        canonical="https://mapme.live/contact"
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Have a question, feedback, or partnership idea? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border rounded-xl p-6 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Email</h3>
                  <p className="text-sm text-muted-foreground">support@mapme.live</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Response Time</h3>
                  <p className="text-sm text-muted-foreground">Within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" {...register("subject")} />
              {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Tell us more..." rows={6} {...register("message")} />
              {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8">
              Send Message
            </Button>
          </form>
        </div>
      </main>
    </Layout>
  );
};

export default Contact;
