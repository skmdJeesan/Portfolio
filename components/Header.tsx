'use client'
import { Download, Menu, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { header_container, header_item, header_variants } from '@/constants/anime'

interface CursorPosition {
  left: number
  width: number
  opacity: number
}

interface TabProps {
  label: string
  is_active: boolean
  on_select: () => void
  set_position: React.Dispatch<React.SetStateAction<CursorPosition>>
}

interface DesktopNavProps {
  menu: string[]
  active: string
  on_select: (id: string) => void
}

// One menu item. It reports its own offset and width to the parent on hover.
const Tab = ({ label, is_active, on_select, set_position }: TabProps) => {
  const ref = useRef<HTMLLIElement>(null)

  const move_cursor_here = () => {
    if (!ref.current) return
    // offsetLeft is measured from the nearest positioned ancestor,
    // which is the `relative` <ul>, the same box the cursor is absolutely placed in
    set_position({ left: ref.current.offsetLeft, width: ref.current.offsetWidth, opacity: 1 })
  }

  return (
    <li ref={ref} onMouseEnter={move_cursor_here} className="relative">
      <Link
        href={`/#${label}`}
        onClick={on_select}
        onFocus={move_cursor_here}
        className="block px-4 py-1.5 text-sm font-light capitalize text-white mix-blend-difference"
      >
        {label}
      </Link>

      {/* small amber dot marks the section you're currently on; it glides between tabs */}
      {is_active && (
        <motion.span
          layoutId="nav-active-dot"
          className="absolute bottom-0.5 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-amber-500/50"
        />
      )}
    </li>
  )
}

// The sliding pill behind the text
const Cursor = ({ position }: { position: CursorPosition }) => (
  <motion.li
    aria-hidden
    initial={false}
    animate={position}
    transition={{
      left: { type: 'spring', stiffness: 400, damping: 32 },
      width: { type: 'spring', stiffness: 400, damping: 32 },
      opacity: { duration: 0.15 },
    }}
    className="pointer-events-none absolute inset-y-1 rounded-full bg-amber-300/90"
  />
)

const DesktopNav = ({ menu, active, on_select }: DesktopNavProps) => {
  const [position, set_position] = useState<CursorPosition>({ left: 0, width: 0, opacity: 0 })

  return (
    <ul
      // leaving the nav hides the pill but keeps its left/width, so it fades out in place
      onMouseLeave={() => set_position((p) => ({ ...p, opacity: 0 }))}
      // relative: the pill positions itself against this box
      // isolate: the blend below only mixes with this box, not the whole page
      className="relative isolate flex items-center rounded-full bg-transparent border border-white/20 p-1"
    >
      {/* first in the DOM, so it paints underneath the tabs */}
      <Cursor position={position} />

      {menu.map((m) => (
        <Tab
          key={m}
          label={m}
          is_active={active === m}
          on_select={() => on_select(m)}
          set_position={set_position}
        />
      ))}
    </ul>
  )
}

const Header = () => {
  const menu = ['about', 'skills', 'projects', 'activity', 'contact']
  const [active, setActive] = useState('about')
  const [menu_clicked, set_menu_clicked] = useState(false)
  const [is_scrolled, set_is_crolled] = useState(false);

  useEffect(() => {
    const handle_scroll = () => {
      set_is_crolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handle_scroll);
    return () => window.removeEventListener("scroll", handle_scroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      // a section becomes "active" when it crosses the middle band of the screen
      { rootMargin: '-40% 0px -55% 0px' }
    )

    menu.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <motion.header
      variants={header_variants} initial="hidden" animate="show"
      className={`fixed top-0 inset-x-0 z-50 mx-auto text-white px-4 w-[84vw] ${is_scrolled ? "backdrop-blur-xs border-none" : ""}`}>

      <div className={`flex items-center justify-between w-full ${is_scrolled ? "py-2" : "sm:py-3 py-2"} tracking-normal duration-200`}>
        <motion.div variants={header_item} className="">
          <Link href={`/`} className="text-xl font-semibold text-amber-400 hover:text-amber-500 transition-colors duration-500">SMJ</Link>
        </motion.div>

        {/* Desktop nav: sliding pill */}
        <motion.div variants={header_item} className="hidden sm:flex items-center">
          <DesktopNav menu={menu} active={active} on_select={setActive} />
        </motion.div>

        <motion.div variants={header_item} className="hidden sm:flex">
          <a
            href="/Sk_Md_Jeesan_Resume.pdf"
            download="Sk_Md_Jeesan_Resume.pdf"
            className="btn-class"
          >
            <Download size={14} />
            <span className="text-sm font-light">Resume</span>
          </a>
        </motion.div>

        <motion.div
          variants={header_item}
          onClick={() => set_menu_clicked(!menu_clicked)}
          whileTap={{ scale: 0.85 }}
          className="flex items-center justify-center sm:hidden border rounded-full border-white/40 hover:border-amber-400 w-6 h-6 cursor-pointer transition-colors duration-500 hover:text-amber-400"
        >
          {menu_clicked ? <X size={14} /> : <Menu size={14} />}
        </motion.div>

      </div>

      {/* Mobile Menu items */}
      <AnimatePresence>
        {menu_clicked && (
          <motion.div
            variants={header_container} initial="hidden" animate="show" exit="exit"
            className="backdrop-blur-xs sm:hidden overflow-hidden flex flex-col items-center justify-center text-4xl font-semibold w-full"
          >
            {menu.map((m) => (
              <motion.div key={m} variants={header_item} className="w-full">
                <Link
                  href={`/#${m}`}
                  onClick={() => {
                    setActive(m)
                    set_menu_clicked(false) // close the menu after navigating
                  }}
                  className={`py-2 block w-full text-center capitalize transition-colors duration-500 hover:bg-amber-400/50 border-t border-white/10 ${active === m ? 'bg-amber-400 text-black' : 'text-white'}`}
                >
                  {m}
                </Link>
              </motion.div>
            ))}

            <motion.a
              variants={header_item}
              href="/Sk_Md_Jeesan_Resume.pdf"
              download="Sk_Md_Jeesan_Resume.pdf"
              onClick={() => set_menu_clicked(false)}
              className="cursor-pointer flex items-center gap-2 transition-colors duration-500 hover:bg-amber-400/50 w-full justify-center border-t border-white/10 mb-1"
            >
              <Download size={26} className="font-semibold" />
              <span>Resume</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  )
}

export default Header