'use client'
import Link from 'next/link'
import { motion, Variants, useReducedMotion } from 'motion/react'
import { Mail, MapPin, Heart } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { TbBrandLeetcode } from "react-icons/tb";
import { SiGeeksforgeeks } from "react-icons/si";

const socials = [
  { name: 'GitHub', href: 'https://github.com/skmdJeesan', Icon: FaGithub },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/smjeesan/', Icon: FaLinkedinIn },
  { name: 'X', href: 'https://x.com/skmdjeesan', Icon: FaXTwitter },
  { name: 'Leetcode', href: 'https://leetcode.com/u/Jeesan/', Icon: TbBrandLeetcode },
  { name: 'Geeksforgeeks', href: 'https://www.geeksforgeeks.org/profile/skmdjetapa', Icon: SiGeeksforgeeks },
  { name: 'Email', href: 'mailto:skmdjeesan@gmail.com', Icon: Mail },
]

const quick_links = ['about', 'skills', 'projects', 'activity', 'contact']

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const list_item: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const divider: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: 'easeOut' } },
}

const Footer = () => {
  const reduce_motion = useReducedMotion()

  return (
    <footer className="relative overflow-hidden px-4 pt-16 pb-8 text-white">
      {/* soft glow at the bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl sm:w-lg"
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto w-full max-w-5xl"
      >
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand */}
          <motion.div variants={reveal} className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-xl font-semibold text-amber-400 transition-colors duration-500 hover:text-amber-500"
            >
              Sk Md Jeesan
            </Link>
            <p className="mt-3 max-w-md text-sm font-light text-white/50">
              Full Stack Developer crafting modern web experiences with a focus on scalable
              architecture, AI integration and clean user experience.
            </p>

            <motion.ul variants={list} className="mt-5 flex flex-wrap gap-3">
              {socials.map(({ name, href, Icon }) => (
                <motion.li key={name} variants={list_item}>
                  <motion.a
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={name}
                    title={name}
                    whileHover={{ y: -4, scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors duration-300 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={reveal}>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <motion.ul variants={list} className="flex gap-2 sm:gap-3 w-40 flex-wrap">
              {quick_links.map((l) => (
                <motion.li key={l} variants={list_item}>
                  <Link
                    href={`/#${l}`}
                    className="inline-block text-sm font-light capitalize text-white/50 transition-all duration-300 hover:translate-x-1 hover:text-amber-400"
                  >
                    {l}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={reveal}>
            <h4 className="mb-4 text-sm font-semibold">Contact</h4>
            <motion.ul variants={list} className="space-y-2.5 text-sm font-light text-white/50">
              <motion.li variants={list_item} className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400/70" />
                Kolkata, India
              </motion.li>
              <motion.li variants={list_item}>
                <a
                  href="mailto:skmdjeesan@gmail.com"
                  className="flex items-center gap-2 break-all transition-colors duration-300 hover:text-amber-400 text-[11px] sm:text-base"
                >
                  <Mail className="h-4 w-4 shrink-0 text-amber-400/70" />
                  skmdjeesan@gmail.com
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        </div>

        {/* Divider draws in from the left */}
        <motion.div
          variants={divider}
          className="mt-12 h-px w-full origin-left bg-white/10"
        />

        {/* Bottom bar */}
        <motion.div
          variants={reveal}
          className="mt-6 flex flex-col items-center justify-between gap-3 text-xs font-light text-white/50 sm:flex-row"
        >
          <p>© 2026 Sk Md Jeesan. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with
            <motion.span
              animate={reduce_motion ? undefined : { scale: [1, 1.15, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
            </motion.span>
            using Next.js
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer