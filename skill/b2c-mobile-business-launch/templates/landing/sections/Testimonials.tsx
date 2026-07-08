"use client";

/**
 * Testimonials — stagger reveal + cursor spotlight.
 * Quotes are real text server-side; the spotlight is a pointer-driven
 * radial-gradient overlay that never affects legibility and is disabled
 * under reduced motion.
 */
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from "motion/react";
import { readMotionTokens } from "../lib/motion-tokens";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface TestimonialsProps {
  heading: string;
  testimonials: Testimonial[];
}

export function Testimonials({ heading, testimonials }: TestimonialsProps) {
  const reduced = useReducedMotion();
  const tokens = readMotionTokens();
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(240px at ${pointerX}% ${pointerY}%, var(--color-surface-elevated), transparent 70%)`;

  return (
    <section
      className="lm-testimonials"
      onPointerMove={(event) => {
        if (reduced) {
          return;
        }
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
        pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
      }}
    >
      {!reduced && <motion.div className="lm-spotlight" style={{ backgroundImage: spotlight }} aria-hidden="true" />}
      <h2 className="lm-section-heading">{heading}</h2>
      <div className="lm-testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <motion.figure
            key={testimonial.name}
            className="lm-testimonial"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: tokens.reveal, ease: tokens.easeEmphasis, delay: index * tokens.stagger }}
          >
            <blockquote>{testimonial.quote}</blockquote>
            <figcaption>
              <strong>{testimonial.name}</strong> · {testimonial.role}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
