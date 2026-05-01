import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import LeadWidget from '@/components/widgets/LeadWidget';
import { ScrollToTop } from '@/components/widgets/ScrollToTop';
import { ExitIntentPopup } from '@/components/widgets/ExitIntentPopup';
import { CookieConsent } from '@/components/widgets/CookieConsent';
import { OrganizationSchema, WebSiteSchema } from '@/components/seo/OrganizationSchema';
import { site } from '@/data/site';
import Script from 'next/script';

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Digital Marketing, Web & App Development Agency in India`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'digital marketing agency India',
    'web development company India',
    'app development India',
    'SEO services India',
    'branding agency India',
    'Aurtos Studio',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: {
    telephone: true,
    email: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Digital Marketing, Web & App Development Agency in India`,
    description: site.description,
    images: [
      {
        url: `${site.url}/og/default.png`,
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Digital Agency in India`,
    description: site.description,
    images: [`${site.url}/og/default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  other: {
    'google-site-verification': '',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
      dir="ltr"
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0A0A0F" />
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {/* Google Tag Manager */}
        {gtmId && (
          <Script
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>

        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />

        {/* Widgets */}
        <LeadWidget />
        <ScrollToTop />
        <ExitIntentPopup />
        <CookieConsent />

        {/* GTM NoScript Fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
      </body>
    </html>
  );
}
