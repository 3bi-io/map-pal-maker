

## Remove False Metrics from Homepage

The app is new, so fabricated social proof undermines credibility. Three areas contain false metrics:

### 1. Remove SocialProofBar entirely
The entire `SocialProofBar` component shows fake stats (10,000+ links, 150+ countries, 4.9/5 rating). Remove it from `Home.tsx` and optionally delete the component file.

### 2. Remove TestimonialsSection entirely
Contains 3 fabricated testimonials with fake names and quotes. Remove from `Home.tsx`.

### 3. Remove fake aggregateRating from structured data
The `structuredData` in `Home.tsx` includes a fabricated `aggregateRating` (4.8 stars, 127 reviews). Remove that block to avoid misleading search engines.

### 4. Update TestimonialsSection heading reference
The heading "Trusted by Thousands" is also false — removing the whole section handles this.

### Files changed
- **`src/pages/Home.tsx`**: Remove `SocialProofBar` and `TestimonialsSection` imports/usage; remove `aggregateRating` from structured data.
- **Optionally delete**: `src/components/landing/SocialProofBar.tsx` and `src/components/landing/TestimonialsSection.tsx` (dead code cleanup).

The remaining sections (Features, Use Cases, How It Works, FAQ, CTA) describe product capabilities — not fabricated metrics — so they stay.

