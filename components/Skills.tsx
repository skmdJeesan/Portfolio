'use client'
import { motion, Variants } from 'motion/react'
import { technologies } from '@/constants/constant' // wherever you keep the array
import { skill_card_variants, skill_grid_variants, skill_reveal, skill_variants } from '@/constants/anime'

// these logos are black SVGs and disappear on a dark background
const invert_logos = new Set(['Express.js'])

const Skills = () => {
  return (
    <section
      id="skills"
      className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 py-12   scroll-mt-24"
    >
      {/* soft glow behind the grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 sm:h-96 sm:w-96 lg:h-128 lg:w-lg rounded-full bg-amber-400/10 blur-3xl"
      />
      
      <motion.div
        variants={skill_variants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center"
      >
        <motion.h2
          variants={skill_reveal}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
        >
          Skills &amp; <span className="text-amber-400">Technologies</span>
        </motion.h2>

        <motion.p
          variants={skill_reveal}
          className="text-sm sm:text-base text-white/50 mb-10 sm:mb-12 max-w-xl"
        >
          The tools I use to build scalable web apps and AI-powered platforms.
        </motion.p>

        <motion.div
          variants={skill_grid_variants}
          className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4"
        >
          {technologies.map(({ name, logo }) => (
            <motion.div
              key={name}
              variants={skill_card_variants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-xl border border-white/10 bg-amber-100/20 backdrop-blur-sm p-3 sm:p-5 cursor-zoom-in transition-colors duration-500 hover:border-amber-400/50 hover:bg-amber-200/10 hover:shadow-[0_0_25px_-5px] hover:shadow-amber-400/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo} alt={name}
                width={40} height={40}
                loading="lazy"
                className={`h-8 w-8 sm:h-10 sm:w-10 object-contain ${invert_logos.has(name) ? 'brightness-0 invert' : ''}`}
              />
              <span className="text-xs sm:text-sm text-white/60 group-hover:text-amber-400 transition-colors duration-500">
                {name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Skills