"use client";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Calendar, GitBranch, GitCommit, Star } from "lucide-react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { animate } from "motion";

interface Props { username: string; }

interface GithubStats {
  user: { totalContribution: number; };
  contributions: {
    count: number;
    date: string;
  }[];
}

interface ContrubutionProps {
  day: { count: number; date: string };
  index: number;
  level_class: string;
}

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

// Replaces shadcn's Tooltip: each cell keeps its own open/closed state
const ContributionCell = ({ day, index, level_class }: ContrubutionProps) => {
  const [open, setOpen] = useState(false);

  const label = `${day.count} contribution${day.count === 1 ? "" : "s"} on ${new Date(
    day.date
  ).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: index * 0.02 }}
      className="relative"
    >
      <button
        type="button"
        aria-label={label}
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          // touch screens have no hover, so a tap toggles the tooltip
          if ((e.nativeEvent as PointerEvent).pointerType === "touch") setOpen((o) => !o);
        }}
        className={`block h-6 w-6 sm:h-8 sm:w-8 rounded-sm transition-transform duration-200 hover:scale-110 ${level_class}`}
      />

      {/* outer div centers, inner motion div animates, so the transforms don't clash */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2">
        <AnimatePresence>
          {open && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-semibold text-black shadow-lg"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const GithubStats = ({ username }: Props) => {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGithubStats = async () => {
      try {
        const response = await fetch(`/api/github?username=${username}`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`)
        }
        const data = await response.json();
        setStats(data)
      } catch (error) {
        setError("failed to fetch github stats")
        console.error(error)
      }
      finally {
        setLoading(false)
      }
    }
    fetchGithubStats();
  }, [username])

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-card border-border/5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-zinc-700 rounded w-3/4" />
          <div className="h-8 bg-zinc-700 rounded " />
          <div className="h-32 bg-zinc-700 rounded " />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-card border-border/5">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  // Calculate current streak
  const currentStreak = stats.contributions.slice().reverse().reduce((streak, day, index) => {
    if (index === 0 && day.count === 0) return 0;
    if (day.count > 0) return streak + 1;
    return streak;
  }, 0)

  // Calculate max contributions in a day
  const maxContributions = Math.max(...stats.contributions.map(day => day.count));

  // Calculate contribution levels
  const getContributionLevel = (count: number) => {
    if (count === 0) return "bg-zinc-700";
    const percentage = (count / maxContributions) * 100;

    if (percentage <= 25) return "bg-amber-400/30";
    if (percentage <= 50) return "bg-amber-400/50";
    if (percentage <= 75) return "bg-amber-400/70";

    return "bg-amber-400";
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-card border-border/5 backdrop-blur-sm overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-400/10">
            <GitCommit className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold">
            Contribution Activity
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-zinc-700/50 backdrop-blur-sm"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-2" />
            <p className="text-sm text-white/70">Current Streak</p>
            <p className="text-xl sm:text-2xl font-bold">
              <CountUp to={currentStreak} /> days
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-zinc-700/50 backdrop-blur-sm"
          >
            <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-2" />
            <p className="text-sm text-white/70">Total Contributions</p>
            <p className="text-xl sm:text-2xl font-bold">
              <CountUp to={stats.user.totalContribution} duration={1.6} />
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg bg-zinc-700/50 backdrop-blur-sm sm:col-span-2 lg:col-span-1"
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-2" />
            <p className="text-sm text-white/70">Best Day</p>
            <p className="text-xl sm:text-2xl font-bold">
              <CountUp to={maxContributions} /> commits
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/70">Last 30 days</h4>
          {/* pt-12 / px-16 leave room so tooltips above the cells aren't clipped by overflow-x-auto */}
          <div className="overflow-x-auto scrollbar-hide px-16 pt-12 pb-4 -mx-16 -mt-12">
            <div className="grid grid-rows-1 grid-flow-col gap-1 min-w-150">
              {stats.contributions.slice(-30).map((day, index) => (
                <ContributionCell
                  key={day.date}
                  day={day}
                  index={index}
                  level_class={getContributionLevel(day.count)}
                />
              ))}
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default GithubStats;