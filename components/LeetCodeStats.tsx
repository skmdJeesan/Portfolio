'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  Variants,
  animate,
  useInView,
  useReducedMotion,
} from 'motion/react'
import { Award, CalendarCheck, ExternalLink, Flame, Globe, Percent, Trophy } from 'lucide-react'

interface Props { username: string }

type LeetCodeData = {
  username: string
  realName: string
  avatar: string
  ranking: number
  solved: { all: number; easy: number; medium: number; hard: number }
  totals: { easy: number; medium: number; hard: number }
  contest: {
    rating: number
    globalRanking: number
    totalParticipants: number
    attended: number
    topPercentage: number
  } | null
  badges: { name: string; icon: string }[]
  calendar: { totalActiveDays: number; submissions: Record<string, number> }
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const reveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const card = 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6'

const difficulties = [
  { key: 'easy', label: 'Easy', text: 'text-emerald-400', bar: 'bg-emerald-400' },
  { key: 'medium', label: 'Medium', text: 'text-amber-400', bar: 'bg-amber-400' },
  { key: 'hard', label: 'Hard', text: 'text-red-400', bar: 'bg-red-400' },
] as const

// counts from 0 to `to` the first time it scrolls into view
const CountUp = ({
  to,
  decimals = 0,
  duration = 1.2,
  className,
}: {
  to: number
  decimals?: number
  duration?: number
  className?: string
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const in_view = useInView(ref, { once: true, amount: 0.5 })
  const reduce_motion = useReducedMotion()
  const [value, set_value] = useState(0)

  useEffect(() => {
    if (!in_view) return
    if (reduce_motion) {
      set_value(to)
      return
    }
    const controls = animate(0, to, { duration, ease: 'easeOut', onUpdate: set_value })
    return () => controls.stop()
  }, [in_view, to, duration, reduce_motion])

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  )
}

const cell_color = (count: number, max: number) => {
  if (count === 0) return 'bg-zinc-600/60'
  const pct = (count / max) * 100
  if (pct <= 25) return 'bg-amber-400/30'
  if (pct <= 50) return 'bg-amber-400/50'
  if (pct <= 75) return 'bg-amber-400/70'
  return 'bg-amber-400'
}

const LeetCodeStats = ({ username }: Props) => {
  const [data, set_data] = useState<LeetCodeData | null>(null)
  const [loading, set_loading] = useState(true)
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/leetcode?username=${username}`)
        if (!res.ok) throw new Error(res.statusText)
        set_data(await res.json())
      } catch (e) {
        console.error(e)
        set_error('Failed to fetch LeetCode stats')
      } finally {
        set_loading(false)
      }
    }
    load()
  }, [username])

  // heatmap: last 53 weeks, Sunday-first columns. Runs only after data has loaded (client only)
  const heat = useMemo(() => {
    if (!data) return null
    const DAY = 86400000
    const now = new Date()
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    const start = today - 364 * DAY // last 365 days

    type Block = {
      id: number
      label: string
      pad: number // empty cells above the first day so weekdays line up
      days: { key: string; count: number; t: number }[]
    }
    const blocks: Block[] = []
    let total = 0, max = 1, streak = 0, max_streak = 0

    for (let t = start; t <= today; t += DAY) {
      const d = new Date(t)
      const key = d.toISOString().slice(0, 10)
      const count = data.calendar.submissions[key] ?? 0
      const id = d.getUTCFullYear() * 12 + d.getUTCMonth()

      let block = blocks[blocks.length - 1]
      if (!block || block.id !== id) {
        block = {
          id,
          label: d.toLocaleDateString(undefined, { month: 'short', timeZone: 'UTC' }),
          pad: d.getUTCDay(),
          days: [],
        }
        blocks.push(block)
      }
      block.days.push({ key, count, t })

      total += count
      max = Math.max(max, count)
      streak = count > 0 ? streak + 1 : 0
      max_streak = Math.max(max_streak, streak)
    }

    return { blocks, total, max, max_streak }
  }, [data])

  // one shared tooltip for the whole heatmap
  const wrap_ref = useRef<HTMLDivElement>(null)
  const scroll_ref = useRef<HTMLDivElement>(null)
  const [hover, set_hover] = useState<{ label: string; left: number; top: number } | null>(null)

  // start the heatmap scrolled to the most recent weeks (matters on mobile)
  useEffect(() => {
    if (scroll_ref.current) scroll_ref.current.scrollLeft = scroll_ref.current.scrollWidth
  }, [heat])

  const show_tip = (e: React.PointerEvent<HTMLDivElement>, label: string) => {
    const wrap = wrap_ref.current
    if (!wrap) return
    const c = e.currentTarget.getBoundingClientRect()
    const w = wrap.getBoundingClientRect()
    set_hover({ label, left: c.left - w.left + c.width / 2, top: c.top - w.top })
  }

  if (loading) {
    return (
      <div className={card}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 rounded bg-zinc-600" />
          <div className="h-24 rounded bg-zinc-600" />
          <div className="h-32 rounded bg-zinc-600" />
        </div>
      </div>
    )
  }

  if (error || !data || !heat) {
    return (
      <div className={card}>
        <p className="text-red-400">{error ?? 'No LeetCode data found'}</p>
      </div>
    )
  }

  const { solved, totals, contest } = data
  const total_questions = totals.easy + totals.medium + totals.hard
  const headline = Math.max(10, Math.floor(solved.all / 10) * 10) // 657 -> 650
  const ring_radius = 52
  const ring_fraction = total_questions ? solved.all / total_questions : 0

  const tiles = [
    { label: 'Contest Rating', Icon: Trophy, value: contest ? <CountUp to={contest.rating} /> : '—' },
    {
      label: 'Global Ranking',
      Icon: Globe,
      value: contest ? (
        <>
          <CountUp to={contest.globalRanking} />
          <span className="text-xs font-light text-white/40">
            {' '}/ {contest.totalParticipants.toLocaleString()}
          </span>
        </>
      ) : (
        '—'
      ),
    },
    { label: 'Contests Attended', Icon: CalendarCheck, value: contest ? <CountUp to={contest.attended} /> : '—' },
    {
      label: 'Top',
      Icon: Percent,
      value: contest ? (
        <>
          <CountUp to={contest.topPercentage} decimals={2} />%
        </>
      ) : (
        '—'
      ),
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Heading */}
      <motion.div variants={reveal} className="text-center">
        <h3 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
          <CountUp to={headline} className="text-amber-400" />+ DSA problems solved on{' '}
          <span className="text-amber-400">LeetCode</span>
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/50 sm:text-base">
          Live stats from my LeetCode profile: practice across arrays, graphs, DP and more.
        </p>
      </motion.div>

      {/* Profile + contest */}
      <motion.div variants={reveal} className={`${card} grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center`}>
        <div className="flex items-center gap-4">
          {data.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.avatar}
              alt={data.realName}
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-xl border border-amber-400/40 object-cover sm:h-20 sm:w-20"
            />
          )}
          <div>
            <p className="text-lg font-semibold">{data.realName}</p>
            <p className="text-xs font-light text-white/50">@{data.username}</p>
            <p className="mt-1 text-sm text-white/70">
              Rank <span className="font-semibold text-amber-400">{data.ranking.toLocaleString()}</span>
            </p>
            <a
              href={`https://leetcode.com/u/${data.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-light text-white/50 transition-colors duration-500 hover:text-amber-400"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View profile
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map(({ label, Icon, value }) => (
            <div key={label} className="rounded-lg bg-zinc-600/40 p-3 sm:p-4">
              <Icon className="mb-2 h-4 w-4 text-amber-500" />
              <p className="text-xs text-white/50">{label}</p>
              <p className="text-lg font-bold sm:text-xl">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Solved ring + badges */}
      <div className="grid gap-6 sm:gap-8 md:grid-cols-[1.6fr_1fr]">
        <motion.div variants={reveal} className={`${card} flex flex-col items-center gap-6 sm:flex-row sm:justify-around`}>
          <div className="relative h-36 w-36 shrink-0 sm:h-40 sm:w-40">
            <svg viewBox="0 0 120 120" className="h-full w-full">
              <g transform="rotate(-90 60 60)">
                <circle cx="60" cy="60" r={ring_radius} fill="none" strokeWidth="8" className="stroke-white/10" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r={ring_radius}
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="stroke-amber-400"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: ring_fraction }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                />
              </g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">
                <CountUp to={solved.all} />
              </p>
              <p className="text-xs text-white/50">/ {total_questions.toLocaleString()} solved</p>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-4">
            {difficulties.map(({ key, label, text, bar }) => {
              const done = solved[key]
              const all = totals[key]
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className={`font-medium ${text}`}>{label}</span>
                    <span className="text-white/60">
                      {done} <span className="text-white/30">/ {all}</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className={`h-full rounded-full ${bar}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${all ? (done / all) * 100 : 0}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div variants={reveal} className={`${card} flex flex-col justify-between gap-4`}>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <p className="text-sm text-white/50">Badges</p>
          </div>
          <p className="text-3xl font-bold">
            <CountUp to={data.badges.length} />
          </p>
          <div className="flex items-center gap-3">
            {data.badges.slice(-3).map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <motion.img
                key={b.name}
                src={b.icon}
                alt={b.name}
                title={b.name}
                referrerPolicy="no-referrer"
                whileHover={{ y: -4, scale: 1.1 }}
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              />
            ))}
          </div>
          {data.badges.length > 0 && (
            <p className="text-xs text-white/40">
              Latest: <span className="text-white/70">{data.badges[data.badges.length - 1].name}</span>
            </p>
          )}
        </motion.div>
      </div>

      {/* Submission heatmap */}
      <motion.div variants={reveal} className={card}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm">
            <span className="text-lg font-semibold text-amber-400">{heat.total.toLocaleString()}</span>{' '}
            <span className="text-white/60">submissions in the past year</span>
          </p>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <CalendarCheck className="h-3.5 w-3.5 text-amber-500" />
              Active days: <b className="text-white/80">{data.calendar.totalActiveDays}</b>
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              Max streak: <b className="text-white/80">{heat.max_streak}</b>
            </span>
          </div>
        </div>

        {/* wrapper is not clipped, so the tooltip can sit above the scroll area */}
        <div ref={wrap_ref} className="relative">
          <div ref={scroll_ref} className="overflow-x-auto scrollbar-hide pb-2">
            <motion.div
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              className="flex w-max gap-2"
              onPointerLeave={() => set_hover(null)}
            >
              {heat.blocks.map((b) => {
                const cols = Math.ceil((b.pad + b.days.length) / 7)
                return (
                  <div key={b.id} className="flex flex-col">
                    <div className="grid grid-rows-7 grid-flow-col gap-0.5">
                      {Array.from({ length: b.pad }, (_, i) => (
                        <div key={`pad-${i}`} aria-hidden className="h-3 w-3" />
                      ))}

                      {b.days.map((d) => {
                        const label = `${d.count} submission${d.count === 1 ? '' : 's'} on ${new Date(
                          d.t
                        ).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          timeZone: 'UTC',
                        })}`
                        return (
                          <div
                            key={d.key}
                            role="img"
                            aria-label={label}
                            onPointerEnter={(e) => show_tip(e, label)}
                            onPointerLeave={(e) => e.pointerType === 'mouse' && set_hover(null)}
                            className={`h-3 w-3 rounded-[3px] transition-transform duration-150 hover:scale-125 ${cell_color(
                              d.count,
                              heat.max
                            )}`}
                          />
                        )
                      })}
                    </div>

                    {/* month name under its block (skipped for 1-column partial months so labels don't collide) */}
                    {cols >= 2 && (
                      <span className="mt-2 whitespace-nowrap text-center text-[10px] text-white/40">
                        {b.label}
                      </span>
                    )}
                  </div>
                )
              })}
            </motion.div>
          </div>

          <AnimatePresence>
            {hover && (
              <div
                key="tip"
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full"
                style={{ left: hover.left, top: hover.top - 8 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-semibold text-black shadow-lg"
                >
                  {hover.label}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LeetCodeStats