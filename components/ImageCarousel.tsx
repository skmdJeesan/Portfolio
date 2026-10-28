import { motion, AnimatePresence, MotionValue, useInView, Variants, useReducedMotion, scale } from "motion/react"
import { useEffect, useRef, useState } from 'react'

const AUTOPLAY_MS = 3500

const slide_variants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

type CarouselProps = {
  images: string[]
  alt: string
  variants: Variants
  parallax_y: MotionValue<string>
}

const ImageCarousel = ({ images, alt, variants, parallax_y }: CarouselProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const in_view = useInView(ref, { amount: 0.4 })
  const reduce_motion = useReducedMotion()
  const [[index, dir], set_page] = useState<[number, number]>([0, 1])
  const [paused, set_paused] = useState(false)
  const count = images.length

  // preload all images once the card is first seen, so slides never flash blank
  useEffect(() => {
    if (!in_view) return
    images.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [in_view, images])

  // autoplay only while the card is on screen; leaving the screen resets to the first image
  useEffect(() => {
    if (!in_view) {
      set_page([0, 1])
      return
    }
    if (count < 2 || paused || reduce_motion) return

    const id = setInterval(() => {
      set_page(([i]) => [(i + 1) % count, 1])
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [in_view, paused, count, reduce_motion])

  const go_to = (next: number) => set_page([next, next > index ? 1 : -1])

  return (
    <motion.div
      ref={ref}
      variants={variants}
      onMouseEnter={() => set_paused(true)}
      onMouseLeave={() => set_paused(false)}
      className="relative aspect-video w-full overflow-hidden md:aspect-auto md:min-h-80 md:w-1/2"
    >
      {/* parallax wrapper: moves with scroll, slides happen inside it */}
      <motion.div style={{ y: parallax_y, scale: 1.2 }} className="absolute inset-0">
        <AnimatePresence initial={false} custom={dir}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            key={index}
            src={images[index]}
            alt={`${alt} screenshot ${index + 1}`}
            custom={dir}
            variants={slide_variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-contain scale-90 cursor-zoom-in"
            whileHover={{scale: 1.02, opacity: 0.9}}
          />
        </AnimatePresence>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => go_to(i)}
              className="cursor-pointer p-1"
            >
              <motion.span
                animate={{
                  width: i === index ? 20 : 6,
                  backgroundColor: i === index ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                }}
                transition={{ duration: 0.3 }}
                className="block h-1.5 rounded-full"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ImageCarousel
