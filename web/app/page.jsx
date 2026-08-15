import Image from "next/image";
import { business, products, proofPoints, waLink } from "../lib/site";
import { Reveal, Stagger, StaggerItem } from "../components/Motion";
import Enquiry from "../components/Enquiry";

/* Audit change #1 — four screens, not 8.6: hero, proof + products, credentials,
   enquiry. The 18-logo supplier band is gone; "choose us" is folded into the
   numbers strip.
   Audit change #4 — every section carries an enquiry path. The old page had
   exactly one CTA in 7715px. */

export default function Home() {
  return (
    <main>
      {/* ---------------------------------------------------- 1. HERO
          One product, one headline, one CTA group. Audit change #2: the old
          first three screens were 100% ink; this one is mostly air. */}
      <section className="relative flex min-h-[92svh] items-center px-6 pt-28 pb-16 sm:px-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <p className="mb-6 text-ink-soft tracking-[0.14em] uppercase text-[0.8125rem]">
                Coimbatore · Since {business.founded}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="display text-ink">
                Rice, by the tonne.
                <br />
                <span className="text-crimson">Sixty years of it.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead mt-7">
                Wholesale supply to retailers, hotels and caterers across Tamil Nadu.
                One hundred partner mills behind every order.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a
                  href="#enquiry"
                  className="pressable rounded-full bg-crimson px-8 py-4 text-bone hover:bg-crimson-deep"
                >
                  Get wholesale rates
                </a>
                <a
                  href={waLink(`Hi ${business.name}, I'd like wholesale rates for `)}
                  target="_blank"
                  rel="noopener"
                  className="pressable inline-flex min-h-[44px] items-center text-ink underline underline-offset-4 hover:text-crimson"
                >
                  WhatsApp us
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={24}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-oat">
              <Image
                src="/products/ms-black-bag.webp"
                alt="MS Win Zeeragam Ponni royal rice, 26 kg wholesale sack"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ 2. PROOF (audit change #6)
          The numbers replace "quality assurance is our cornerstone". */}
      <section className="border-y border-ink/10 bg-oat/50 px-6 py-20 sm:px-10">
        <Stagger className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((p) => (
            <StaggerItem key={p.label}>
              <p className="section-title text-crimson">{p.figure}</p>
              <p className="mt-2 text-ink-soft">{p.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ------------------------------------- 3. PRODUCTS (audit change #3)
          Six with room around each, not 21 competing. */}
      <section id="products" className="px-6 py-28 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="section-title">What we supply</h2>
            <p className="lead mt-4">
              Every variety in 5 to 75 kg sacks. Tell us the volume and we quote the same day.
            </p>
          </Reveal>

          <Stagger className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <StaggerItem key={p.slug}>
                <article>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-oat">
                    <Image
                      src={p.image}
                      alt={`${p.name} — wholesale sack`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-6 text-[1.375rem] leading-tight tracking-[-0.01em]">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-ink-soft">{p.note}</p>
                  <p className="mt-3 text-[0.9375rem] text-ink-soft/80">{p.sizes}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal>
            <div className="mt-16">
              <a
                href="#enquiry"
                className="pressable inline-flex min-h-[44px] items-center rounded-full border border-ink/20 px-7 py-3 hover:border-crimson hover:text-crimson"
              >
                Ask about a variety not listed
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------- 4. ENQUIRY */}
      <section id="enquiry" className="border-t border-ink/10 bg-oat/40 px-6 py-28 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="section-title">Send an enquiry</h2>
            <p className="lead mt-4">
              We reply on WhatsApp with rates, usually within the hour during trading days.
            </p>
            <address className="mt-10 not-italic text-ink-soft leading-relaxed">
              {business.address.street}
              <br />
              {business.address.city} {business.address.postal}, {business.address.region}
              <br />
              <a
                href={`tel:${business.phoneRaw}`}
                className="pressable mt-4 inline-flex min-h-[44px] items-center text-ink hover:text-crimson"
              >
                {business.phone}
              </a>
              <br />
              <a
                href={`mailto:${business.email}`}
                className="pressable inline-flex min-h-[44px] items-center text-ink hover:text-crimson"
              >
                {business.email}
              </a>
            </address>
          </Reveal>

          <Reveal delay={0.08}>
            <Enquiry />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
