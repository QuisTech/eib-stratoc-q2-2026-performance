---
name: whatsapp-og-favicons
description: Standard operating procedure for generating lightweight 1200x630 course cover_og.jpg images (< 200 KB) and properly sized 32x32 favicons for WhatsApp link unfurling and preview cards.
---

# WhatsApp Open Graph & Favicon Optimization Workflow

This skill documents the mandatory workflow when generating or updating course images and LMS catalog metadata for WhatsApp link sharing.

## Key Rules & Specifications

### 1. OpenGraph Image Requirements (WhatsApp Unfurling)
- **Dimensions**: 1200 x 630 pixels.
- **File Format**: JPEG (`cover_og.jpg`).
- **File Size Limit**: **Strictly <= 200 KB** (WhatsApp discards images > 300 KB).
- **URL Format**: Clean HTTPS CDN URL without query parameters (e.g. `https://cdn.jsdelivr.net/gh/QuisTech/eib-lms-images@main/<course-slug>/cover_og.jpg`).

### 2. Favicon & Icon Requirements
- **32x32 Icon**: `public/favicon-32x32.png` (type: `image/png`, sizes: `32x32`).
- **16x16 Icon**: `public/favicon-16x16.png` (type: `image/png`, sizes: `16x16`).
- **Apple Touch Icon**: `public/apple-touch-icon.png` (180x180 PNG).
- **ICO Fallback**: `public/favicon.ico` (32x32 PNG buffer).

### 3. Next.js `generateMetadata` Configuration
```typescript
const baseCdn = `https://cdn.jsdelivr.net/gh/QuisTech/eib-lms-images@main/${slug}`;
const ogImageUrl = `${baseCdn}/cover_og.jpg`;

return {
  metadataBase: new URL("https://lms.eibstratoc.com"),
  title: `${course.title} | EIB Group LMS`,
  description: course.description,
  icons: {
    icon: [
      { url: "https://lms.eibstratoc.com/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "https://lms.eibstratoc.com/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "https://lms.eibstratoc.com/favicon.png", type: "image/png" },
      { url: "https://lms.eibstratoc.com/eiblogo.png", type: "image/png" },
    ],
    shortcut: "https://lms.eibstratoc.com/favicon-32x32.png",
    apple: "https://lms.eibstratoc.com/apple-touch-icon.png",
  },
  openGraph: {
    title: `${course.title} | EIB Group LMS`,
    description: course.description,
    url: `https://lms.eibstratoc.com/lms/${slug}`,
    siteName: "EIB Group LMS",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: course.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${course.title} | EIB Group LMS`,
    description: course.description,
    images: [ogImageUrl],
  },
};
```

## Image Compression Automation Script

When generating new course covers, always execute `sharp` compression to generate `cover_og.jpg`:

```javascript
await sharp(inputCoverPng)
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 80 })
  .toFile('cover_og.jpg');
```
