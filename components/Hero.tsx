'use client'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { motion, useReducedMotion } from 'motion/react'
import { hero_container, hero_reveal } from '@/constants/anime'
import { floating_icons } from '@/constants/constant'
import Image from 'next/image'

const Hero = () => {
  const reduce_motion = useReducedMotion()
  return (
    <section
      id="about"
      className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 pt-10 pb-10  "
    >
      {/* Glow div */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            reduce_motion
              ? { opacity: 1, scale: 1 }
              : { opacity: [0.6, 1, 0.6], scale: [0.95, 1.08, 0.95] }
          }
          transition={{
            duration: reduce_motion ? 1 : 8,
            repeat: reduce_motion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className="h-64 w-64 sm:h-96 sm:w-96 lg:h-136 lg:w-136 rounded-full bg-amber-400/10 blur-3xl"
        />
      </div>
      {/* Roaming icons */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.0, ease: 'easeOut' }} // starts when the hero text is done
        className="pointer-events-none absolute inset-0"
      >
        {floating_icons.map(({ Icon, position, visibility, color, x, y, rotate, duration, delay }, i) => (
          <div key={i} className={`absolute ${position} ${visibility}`}>
            <motion.div
              animate={
                reduce_motion
                  ? undefined
                  : { x: [0, x, 0], y: [0, y, 0], rotate: [0, rotate, 0] }
              }
              transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
              className={color}
            >
              <Icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </motion.div>
          </div>
        ))}
      </motion.div>
      {/* Main content */}
      <motion.div
        variants={hero_container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center"
      >
        <motion.div
          variants={hero_reveal}
          className='overflow-hidden w-45 h-45 rounded-full cursor-pointer'
        >
          <motion.img 
            src='/me3.png' alt='my-profile'
            initial={{opacity: 0.98}}
            whileHover={{opacity: 1.02, scale: 1.02}}
            className='w-full h-full object-cover object-top rounded-full'
          ></motion.img>
        </motion.div>
        <motion.h1
          variants={hero_reveal}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
        >
          Hi, I&apos;m <span className="text-amber-400">Sk Md Jeesan</span>
        </motion.h1>

        <motion.p
          variants={hero_reveal}
          className="text-base sm:text-lg lg:text-xl text-white/70 mb-4 sm:mb-6 max-w-2xl"
        >
          I build scalable full-stack and AI-integrated apps with MERN, Next.js, RAG, Docker and AWS
        </motion.p>

        <motion.div
          variants={hero_reveal}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link 
            href="https://www.linkedin.com/in/smjeesan/" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-class"
          >
            <FaLinkedin className="w-4 h-4" />
            LinkedIn
          </Link>
          <Link
            href="https://github.com/skmdJeesan"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-class"
          >
            <FaGithub className="w-4 h-4" />
            Github
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero