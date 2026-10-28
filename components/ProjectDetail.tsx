'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Check, ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { projects } from '@/constants/projects'
import { project_heading_container, project_reveal } from '@/constants/anime'

type Project = (typeof projects)[number]

const Gallery = ({ images, alt }: { images: string[]; alt: string }) => {
  const [i, set_i] = useState(0)
  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <AnimatePresence mode="wait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            key={i}
            src={images[i]}
            alt={`${alt} screenshot ${i + 1}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, n) => (
            <button
              key={src}
              type="button"
              aria-label={`Show screenshot ${n + 1}`}
              onClick={() => set_i(n)}
              className={`relative h-14 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 ${
                n === i ? 'border-amber-400' : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ProjectDetail = ({ project }: { project: Project }) => (
  <section className="relative overflow-hidden px-4 pt-28 pb-20">
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl sm:h-96 sm:w-96"
    />

    <motion.div
      variants={project_heading_container}
      initial="hidden"
      animate="show"
      className="relative z-10 mx-auto w-full max-w-4xl space-y-8"
    >
      <motion.div variants={project_reveal}>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-light text-white/50 transition-colors duration-500 hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </motion.div>

      <motion.h1 variants={project_reveal} className="text-3xl font-bold sm:text-4xl lg:text-5xl">
        {project.title}
      </motion.h1>

      <motion.div variants={project_reveal}>
        <Gallery images={project.images} alt={project.title} />
      </motion.div>

      <motion.p variants={project_reveal} className="text-white/60">
        {project.description}
      </motion.p>

      <motion.ul variants={project_reveal} className="flex flex-wrap gap-2">
        {project.technologies.map((t) => (
          <li key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            {t}
          </li>
        ))}
      </motion.ul>

      <motion.ul variants={project_reveal} className="space-y-2">
        {project.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/60">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            {f}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={project_reveal} className="flex flex-wrap gap-3">
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-class">
          <ExternalLink className="h-4 w-4" />
          Live Demo
        </a>
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-class">
          <FaGithub className="h-4 w-4" />
          Source Code
        </a>
      </motion.div>
    </motion.div>
  </section>
)

export default ProjectDetail