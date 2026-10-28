import type { Variants } from 'motion/react'

export const header_container: Variants = {
  hidden: { height: 0, opacity: 0 },
  show: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
      when: 'beforeChildren',   // open the panel first, then the items
      staggerChildren: 0.07,    // each item starts 70ms after the previous
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

export const header_item = {
  hidden: { opacity: 0, y: -15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export const header_variants: Variants = {
  hidden: { y: -80, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
      delay: 1,               // wait for the Hero to finish
      when: 'beforeChildren',   // header drops in first, then its contents
      staggerChildren: 0.1,
    },
  },
}

export const hero_container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15, // each child reveals 150ms after the previous
      delayChildren: 0.1,
    },
  },
}

export const hero_reveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const skill_variants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } }, // heading first, then the grid
}

export const skill_reveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const skill_grid_variants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }, // cards pop in one by one
}

export const skill_card_variants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

export const project_reveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const project_heading_container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
}

// the card staggers its two halves, the content half staggers its own children
export const project_card_variants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.15 },
  },
}

export const project_body_variants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export const project_item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}