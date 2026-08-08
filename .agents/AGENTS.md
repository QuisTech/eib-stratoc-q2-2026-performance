# Project Rules & Best Practices

## OpenGraph & WhatsApp Social Link Sharing Rule
Whenever generating or updating course assets, covers, or OpenGraph metadata for LMS courses:
1. **Lightweight OG Cover Images (< 200 KB)**: Always generate and serve a compressed 1200x630 JPEG `cover_og.jpg` image under 200 KB. WhatsApp crawlers (`facebookexternalhit/1.1`) discard `og:image` files > 300-400 KB.
2. **Explicit Favicon Declarations**: Declare explicit 32x32, 16x16, and 180x180 icons (`favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png`, `favicon.ico`) with explicit `sizes` in `generateMetadata`.
3. **Clean URLs**: Strip query parameters from `og:image` URLs so WhatsApp and social crawlers can reliably cache and unfurl preview cards.
