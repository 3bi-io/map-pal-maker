import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqItems = [
  {
    question: "How does MᴀᴘMᴇ.Lɪᴠᴇ work?",
    answer:
      "MᴀᴘMᴇ.Lɪᴠᴇ generates a unique tracking link you can share with any device. When opened, the link requests location permission and sends real-time GPS coordinates to your dashboard, displayed on an interactive map.",
  },
  {
    question: "Is MᴀᴘMᴇ.Lɪᴠᴇ free to use?",
    answer:
      "Yes. MᴀᴘMᴇ.Lɪᴠᴇ is completely free for personal use. Create an account, generate tracking links, and monitor locations at no cost.",
  },
  {
    question: "Is my location data secure?",
    answer:
      "Absolutely. All data is encrypted in transit and at rest. Only authenticated tracker owners can view location data. You can pause or delete trackers at any time.",
  },
  {
    question: "What devices are supported?",
    answer:
      "Any device with a modern web browser and GPS capability — smartphones, tablets, and laptops on iOS, Android, Windows, macOS, and Linux.",
  },
  {
    question: "Do tracked users need to install an app?",
    answer:
      "No. Tracked users simply open the shared link in their browser — no app download required. The browser's built-in Geolocation API handles everything.",
  },
];

const FAQSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`py-20 sm:py-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4">
        <h2
          id="faq-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
