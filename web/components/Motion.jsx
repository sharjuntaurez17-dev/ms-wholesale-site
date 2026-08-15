"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ---------------------------------------------------------------------------
   apple-design SKILL.md §4: think in damping + response, not duration.
   Default to critically damped (no overshoot); bounce is reserved for motion
   that follows a real gesture, and a marketing page has none.

   find-animation-opportunities: the old site's scroll reveals set
   visibility:hidden and waited for a scroll event, so content vanished if the
   trigger missed. These reveals animate opacity/transform only — the content
   is in the DOM and readable regardless, and `once` means it never re-hides.
--------------------------------------------------------------------------- */

const SPRING = { type: "spring", bounce: 0, duration: 0.5 };

export function Reveal({ children, delay = 0, y = 16, className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ ...SPRING, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/* Stagger capped at 6 children. The skill rejects stagger beyond ~8 — at 21
   items a 60ms step runs 1.26s before the last card lands. */
export function Stagger({ children, className, step = 0.06 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ shown: { transition: { staggerChildren: reduce ? 0 : step } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = 20 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
        shown: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
      }}
      transition={SPRING}
    >
      {children}
    </motion.div>
  );
}

export { motion, SPRING };
