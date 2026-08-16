import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { ForcePasswordChange } from '@/components/force-password-change'
import { TooltipProvider } from '@/components/ui/tooltip'

// Font definitions with offline/system fallback compatibility for VPS builds
const geistSans = { variable: '--font-geist-sans' }
const geistMono = { variable: '--font-geist-mono' }
const sourceSerif = { variable: '--font-source-serif' }

export const metadata: Metadata = {
  metadataBase: new URL('https://lms.eibstratoc.com'),
  title: 'EIB Group | 90-Day Strategic Plan (Q3 2026)',
  description:
    'The 90-day strategic plan for the EIB Group Training & Organizational Development function (July–September 2026): strategic goal, phased roadmap, ROI dashboard, and consolidated subsidiary input from the Performance Improvement Task Force.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/eiblogo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'EIB Group | 90-Day Strategic Plan (Q3 2026)',
    description:
      'The 90-day strategic plan for the EIB Group Training & Organizational Development function (July–September 2026): strategic goal, phased roadmap, ROI dashboard, and consolidated subsidiary input from the Performance Improvement Task Force.',
    siteName: 'EIB Group LMS',
    type: 'website',
    images: [
      {
        url: 'https://lms.eibstratoc.com/opengraph-image.jpg',
        secureUrl: 'https://lms.eibstratoc.com/opengraph-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'EIB Group LMS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EIB Group | 90-Day Strategic Plan (Q3 2026)',
    description:
      'The 90-day strategic plan for the EIB Group Training & Organizational Development function (July–September 2026): strategic goal, phased roadmap, ROI dashboard, and consolidated subsidiary input from the Performance Improvement Task Force.',
    images: ['https://lms.eibstratoc.com/opengraph-image.jpg'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} bg-background print:bg-white`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased print:bg-white">
        <TooltipProvider>
          <ForcePasswordChange />
          <SiteHeader />
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
