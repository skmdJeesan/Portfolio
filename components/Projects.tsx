'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, PanInfo, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { projects } from '@/constants/projects'
import { project_heading_container, project_reveal } from '@/constants/anime'

type Project = (typeof projects)[number]

// w = card width, spacing = distance between the center card and its neighbour,
// reach = how many cards are visible on each side of the center
type Stage = { w: number; spacing: number; reach: number }

const useStage = () => {
  const [stage, set_stage] = useState<Stage | null>(null)
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      if (vw >= 1024) set_stage({ w: 400, spacing: 290, reach: 2 })
      else if (vw >= 640) set_stage({ w: 360, spacing: 250, reach: 2 })
      else {
        const w = Math.min(Math.round(vw * 0.72), 320)
        set_stage({ w, spacing: Math.round(w * 0.62), reach: 1 })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return stage
}

const ROTATE = [0, 32, 40, 40]

type SlideProps = {
  project: Project
  offset: number // 0 = center, negative = left, positive = right
  stage: Stage
  instant: boolean
  on_select: () => void
  block_click: (e: React.MouseEvent) => void
}

const Slide = ({ project, offset, stage, instant, on_select, block_click }: SlideProps) => {
  const active = offset === 0
  const sign = Math.sign(offset)
  const abs = Math.abs(offset)
  const hidden = abs > stage.reach
  const a = Math.min(abs, stage.reach + 1) // hidden cards park just outside the visible range

  const x = sign * stage.spacing * (a === 0 ? 0 : 1 + (a - 1) * 0.6)
  const scale = 1 - a * 0.14
  const rotate_y = -sign * ROTATE[Math.min(a, 3)] // inner edge turns away, so cards face the center
  const dim = a === 0 ? 0 : 0.35 + (a - 1) * 0.15

  return (
    <motion.div
      initial={false}
      animate={{ x, scale, rotateY: rotate_y, z: -a * 50, opacity: hidden ? 0 : 1 }}
      transition={instant ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 28 }}
      style={{ width: stage.w, zIndex: Math.max(0, 10 - abs), pointerEvents: hidden ? 'none' : 'auto' }}
      onClick={on_select}
      role="group"
      aria-label={project.title}
      className={`flex [grid-area:1/1] justify-self-center ${active ? '' : 'cursor-pointer'}`}
    >
      <article
        className={`group relative flex w-full select-none flex-col overflow-hidden rounded-2xl border bg-zinc-900/90 backdrop-blur-sm transition-[border-color,box-shadow] duration-500 ${
          active
            ? 'border-amber-400/50 shadow-[0_0_50px_-12px] shadow-amber-400/40'
            : 'border-white/10'
        }`}
      >
        <div className="relative aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.images[0]}
            alt={project.title}
            draggable={false}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3
            className={`line-clamp-2 text-lg font-semibold transition-colors duration-500 sm:text-xl ${
              active ? 'text-amber-400' : ''
            }`}
          >
            {project.title}
          </h3>
          <p className="line-clamp-3 text-sm text-white/50">{project.description}</p>
          <Link
            href={`/projects/${project.slug}`}
            onClick={block_click}
            draggable={false}
            tabIndex={active ? 0 : -1}
            // side cards only select; a click on their button falls through to the card
            style={{ pointerEvents: active ? 'auto' : 'none' }}
            className="btn-class mt-auto w-fit"
          >
            View Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* darkens the cards that sit behind the center one */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: dim }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0 bg-black"
        />
      </article>
    </motion.div>
  )
}

const Projects = () => {
  const stage = useStage()
  const reduce_motion = useReducedMotion()
  const [active, set_active] = useState(() => projects.findIndex((project) => project.slug === 'convolution'))
  const dragged = useRef(false)
  const last = projects.length - 1

  const go = (n: number) => set_active(Math.min(Math.max(n, 0), last))

  const on_drag_end = (_: unknown, info: PanInfo) => {
    setTimeout(() => (dragged.current = false), 60)
    const swipe = info.offset.x + info.velocity.x * 0.2
    if (swipe < -60) go(active + 1)
    else if (swipe > 60) go(active - 1)
  }

  // a drag that ends on the button must not count as a click
  const block_click = (e: React.MouseEvent) => {
    if (dragged.current) e.preventDefault()
  }

  const select = (i: number) => () => {
    if (dragged.current || i === active) return
    set_active(i)
  }

  const on_key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(active + 1)
    if (e.key === 'ArrowLeft') go(active - 1)
  }

  return (
    <section id="projects" className="relative overflow-hidden px-4 py-20 scroll-mt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl sm:h-[28rem] sm:w-[28rem]"
      />

      <motion.div
        variants={project_heading_container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        <div className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <motion.h2 variants={project_reveal} className="mb-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Featured <span className="text-amber-400">Projects</span>
          </motion.h2>
          <motion.p variants={project_reveal} className="max-w-xl text-sm text-white/50 sm:text-base">
            Full-stack and AI-powered products I&apos;ve built. Swipe, click a card or use the arrows.
          </motion.p>
        </div>

        <motion.div variants={project_reveal}>
          <div
            tabIndex={0}
            onKeyDown={on_key}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured projects"
            className="outline-none"
          >
            {stage ? (
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                dragSnapToOrigin
                onDragStart={() => (dragged.current = true)}
                onDragEnd={on_drag_end}
                style={{ perspective: 1200 }}
                className="grid cursor-grab py-6 active:cursor-grabbing"
              >
                {projects.map((p, i) => (
                  <Slide
                    key={p.slug}
                    project={p}
                    offset={i - active}
                    stage={stage}
                    instant={!!reduce_motion}
                    on_select={select(i)}
                    block_click={block_click}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="min-h-[26rem]" />
            )}
          </div>

          {/* arrows, dots and counter */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              className="cursor-pointer rounded-full border border-white/20 p-2 transition-colors duration-300 hover:border-amber-400 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {projects.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  aria-label={`Go to ${p.title}`}
                  onClick={() => go(i)}
                  className="cursor-pointer p-1"
                >
                  <motion.span
                    animate={{
                      width: i === active ? 20 : 6,
                      backgroundColor: i === active ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                    }}
                    transition={{ duration: 0.3 }}
                    className="block h-1.5 rounded-full"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="Next project"
              onClick={() => go(active + 1)}
              disabled={active === last}
              className="cursor-pointer rounded-full border border-white/20 p-2 transition-colors duration-300 hover:border-amber-400 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-center text-xs font-light text-white/40">
            {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Projects