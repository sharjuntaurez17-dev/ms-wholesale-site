"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { business, products, waLink } from "../lib/site";

/* find-animation-opportunities #1, the highest-leverage row in that report:
   the old site did `ok.style.display='block'` so the success message
   teleported in — at the one moment the interface should acknowledge the user.
   This is the conversion event of the whole business, and it is the rare /
   first-time frequency tier, which is exactly where the delight budget lives. */

export default function Enquiry() {
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();

  function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const line = (k, v) => (v ? `${k}: ${v}\n` : "");
    const msg =
      `*New Enquiry — ${business.name}*\n\n` +
      line("Name", f.get("name")) +
      line("Business", f.get("business")) +
      line("Phone", f.get("phone")) +
      line("Product", f.get("product")) +
      line("Quantity", f.get("qty")) +
      line("City", f.get("city"));
    window.open(waLink(msg), "_blank", "noopener");
    setSent(true);
    e.currentTarget.reset();
  }

  const field =
    "w-full bg-transparent border-b border-ink/15 py-3 text-[1.0625rem] " +
    "placeholder:text-ink-soft/60 focus:border-crimson focus:outline-none " +
    "transition-colors duration-200";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
      <input name="name" required placeholder="Your name" className={field} />
      <input name="business" placeholder="Business name" className={field} />
      <input name="phone" required type="tel" placeholder="Phone" className={field} />
      <select name="product" required defaultValue="" className={field}>
        <option value="" disabled>Product</option>
        {products.map((p) => (
          <option key={p.slug} value={p.name}>{p.name}</option>
        ))}
      </select>
      <input name="qty" placeholder="Quantity (e.g. 20 bags)" className={field} />
      <input name="city" placeholder="Delivery city" className={field} />

      <div className="sm:col-span-2 flex flex-wrap items-center gap-5 pt-2">
        <button
          type="submit"
          className="pressable rounded-full bg-crimson px-8 py-4 text-bone
                     hover:bg-crimson-deep"
        >
          Get wholesale rates
        </button>
        <a
          href={`tel:${business.phoneRaw}`}
          className="pressable inline-flex min-h-[44px] items-center text-ink-soft
                     underline underline-offset-4 hover:text-crimson"
        >
          or call {business.phone}
        </a>
      </div>

      <AnimatePresence>
        {sent && (
          <motion.p
            role="status"
            className="sm:col-span-2 text-crimson"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={
              reduce
                ? { duration: 0.15 }
                : { type: "spring", bounce: 0.15, duration: 0.45 }
            }
          >
            WhatsApp is opening — tap <strong>Send</strong> and we&rsquo;ll reply with rates.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
