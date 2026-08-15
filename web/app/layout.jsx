import "./globals.css";
import { business, schema, waLink } from "../lib/site";

export const metadata = {
  metadataBase: new URL(business.url),
  title: `${business.tagline} | ${business.name}`,
  description:
    "Buy wholesale rice in Coimbatore from M Shahul Hameed Rowther Sons — trusted rice suppliers since 1965. Idli, boiled, raw & basmati rice. 100+ mills. Enquire now.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${business.tagline} | ${business.name}`,
    description:
      "Trusted wholesale rice suppliers since 1965. Idli, boiled, raw & basmati rice.",
    url: business.url,
    type: "website",
    // PNG on purpose: WhatsApp link previews are a primary channel here and its
    // WebP support is unreliable.
    images: [`${business.url}brand/ms-logo.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.tagline} | ${business.name}`,
    images: [`${business.url}brand/ms-logo.png`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Karla:wght@400;500;600&display=swap"
        />
        <link rel="icon" href="/brand/ms-logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>
        <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/5 bg-bone/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
            <a href="/" className="pressable font-[family-name:var(--font-display)] text-[1.25rem] tracking-[-0.01em]">
              MS <span className="text-ink-soft">· since 1965</span>
            </a>
            <div className="flex items-center gap-6">
              <a href="#products" className="pressable hidden min-h-[44px] items-center text-ink-soft hover:text-ink sm:inline-flex">
                Products
              </a>
              <a
                href="#enquiry"
                className="pressable inline-flex min-h-[44px] items-center rounded-full bg-crimson px-5 text-bone hover:bg-crimson-deep"
              >
                Enquire
              </a>
            </div>
          </nav>
        </header>

        {children}

        <footer className="border-t border-ink/10 px-6 py-14 sm:px-10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 text-[0.9375rem] text-ink-soft">
            <p>© {new Date().getFullYear()} {business.name}</p>
            <a
              href={waLink(`Hi ${business.name}, I have an enquiry regarding `)}
              target="_blank"
              rel="noopener"
              className="pressable inline-flex min-h-[44px] items-center hover:text-crimson"
            >
              WhatsApp {business.phone}
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
