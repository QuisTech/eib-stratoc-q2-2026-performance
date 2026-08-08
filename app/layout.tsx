import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { ForcePasswordChange } from '@/components/force-password-change'
import { TooltipProvider } from '@/components/ui/tooltip'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
})

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
    siteName: 'EIB Group LMS',
    type: 'website',
    images: [
      {
        url: 'https://lms.eibstratoc.com/eiblogo.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'EIB Group LMS',
      },
    ],
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
