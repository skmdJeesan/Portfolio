'use client'
import React from 'react'
import { motion } from 'motion/react'
import GithubStats from './GithubStats'
import LeetCodeStats from './LeetCodeStats'

const Activity = () => {
  return (
    <section id='activity' className="px-4 py-24   flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center">
        Github <span className="text-amber-500"> Activity</span>
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-6xl'
      >
        <GithubStats username="skmdJeesan" />
        <div className="mt-16 sm:mt-24">
          <LeetCodeStats username="Jeesan" />
        </div>
      </motion.div>
    </section>
  )
}

export default Activity