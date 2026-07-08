"use client";

/**
 * Bento stat grid — in-view stagger reveal, hover lift.
 * Cards are real text server-side; the stagger is whileInView decoration
 * that collapses under reduced motion.
 */
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { readMotionTokens } from "../lib/motion-tokens";

export interface BentoCard {
  title: string;
  body: ReactNode;
  /** Grid span hint, e.g. "wide" | "tall"; consumed by the host's CSS. */
  variant?: string;
}

export interface BentoProps {
  heading: string;
  cards: BentoCard[];
}

export function Bento({ heading, cards }: BentoProps) {
  const reduced = useReducedMotion();
  const tokens = readMotionTokens();

  return (
    <section className="lm-bento">
      <h2 className="lm-section-heading">{heading}</h2>
      <div className="lm-bento-grid">
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            className={`lm-bento-card${card.variant ? ` lm-bento-${card.variant}` : ""}`}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: tokens.reveal, ease: tokens.easeEmphasis, delay: index * tokens.stagger }}
            whileHover={reduced ? undefined : { y: -6 }}
          >
            <h3>{card.title}</h3>
            <div>{card.body}</div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
