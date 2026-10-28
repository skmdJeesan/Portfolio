'use client'
import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'motion/react'
import { Send, Loader2, CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import { contact_schema } from '@/lib/contact-schema'

type FormValues = { name: string; email: string; message: string }
type Errors = Partial<Record<keyof FormValues, string>>
type Status = 'idle' | 'sending' | 'success' | 'error'

const section_variants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
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

// the form card reveals, then its fields stagger in one by one
const form_variants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const field_variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const input_base =
  'w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:bg-amber-400/5'

const input_class = (has_error: boolean) =>
  `${input_base} ${
    has_error
      ? 'border-red-400/60 focus:border-red-400'
      : 'border-white/10 focus:border-amber-400/60'
  }`

const FieldError = ({ id, message }: { id: string; message?: string }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        id={id}
        role="alert"
        initial={{ opacity: 0, height: 0, y: -4 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden pt-1.5 text-xs text-red-400"
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
)

const Contact = () => {
  const [values, set_values] = useState<FormValues>({ name: '', email: '', message: '' })
  const [website, set_website] = useState('') // honeypot, stays empty for real users
  const [errors, set_errors] = useState<Errors>({})
  const [status, set_status] = useState<Status>('idle')
  const [server_error, set_server_error] = useState('')

  const handle_change =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      set_values((v) => ({ ...v, [field]: e.target.value }))
      if (errors[field]) set_errors((prev) => ({ ...prev, [field]: undefined }))
      if (status === 'success' || status === 'error') set_status('idle')
    }

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return

    // client-side validation with the shared zod schema
    const result = contact_schema.safeParse(values)
    if (!result.success) {
      const next: Errors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormValues
        if (!next[key]) next[key] = issue.message
      }
      set_errors(next)
      return
    }

    set_status('sending')
    set_server_error('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, website }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (data.fieldErrors) set_errors(data.fieldErrors)
        set_server_error(data.error ?? 'Something went wrong. Please try again.')
        set_status('error')
        return
      }

      set_values({ name: '', email: '', message: '' })
      set_errors({})
      set_status('success')
    } catch {
      set_server_error('Network error. Please check your connection and try again.')
      set_status('error')
    }
  }

  const sending = status === 'sending'

  return (
    <section
      id="contact"
      className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 py-24 scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl sm:h-96 sm:w-96 lg:h-128 lg:w-lg"
      />

      <motion.div
        variants={section_variants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center"
      >
        <motion.h2 variants={reveal} className="mb-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
          Let&apos;s <span className="text-amber-400">Connect</span>
        </motion.h2>

        <motion.p variants={reveal} className="mb-10 max-w-md text-sm text-white/50 sm:text-base">
          Have a project, an opportunity or just want to say hi? Send me a message and I&apos;ll get
          back to you.
        </motion.p>

        <motion.form
          variants={form_variants}
          onSubmit={handle_submit}
          noValidate
          className="relative w-full space-y-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm sm:p-8"
        >
          {/* name + email in one row on sm and up */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <motion.div variants={field_variants}>
              <label htmlFor="name" className="mb-1.5 block text-xs font-light text-white/60">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={values.name}
                onChange={handle_change('name')}
                disabled={sending}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={input_class(!!errors.name)}
              />
              <FieldError id="name-error" message={errors.name} />
            </motion.div>

            <motion.div variants={field_variants}>
              <label htmlFor="email" className="mb-1.5 block text-xs font-light text-white/60">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={handle_change('email')}
                disabled={sending}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={input_class(!!errors.email)}
              />
              <FieldError id="email-error" message={errors.email} />
            </motion.div>
          </div>

          <motion.div variants={field_variants}>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="message" className="text-xs font-light text-white/60">
                Message
              </label>
              <span
                className={`text-xs ${values.message.length > 2000 ? 'text-red-400' : 'text-white/30'}`}
              >
                {values.message.length}/2000
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Tell me about your project or idea..."
              value={values.message}
              onChange={handle_change('message')}
              disabled={sending}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={`${input_class(!!errors.message)} resize-none`}
            />
            <FieldError id="message-error" message={errors.message} />
          </motion.div>

          {/* honeypot: hidden from people, bots tend to fill it */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => set_website(e.target.value)}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <motion.div variants={field_variants} className="space-y-3">
            <motion.button
              type="submit"
              disabled={sending}
              whileTap={{ scale: 0.97 }}
              className="btn-class w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-light">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="text-sm font-light">Send Message</span>
                </>
              )}
            </motion.button>

            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div
                  key="success"
                  role="status"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="flex items-center justify-center gap-2 text-sm text-green-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Message sent! I&apos;ll get back to you soon.
                  </p>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  key="error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="flex items-center justify-center gap-2 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {server_error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.form>

        <motion.a
          variants={reveal}
          href="mailto:skmdjeesan@gmail.com"
          className="mt-6 flex items-center gap-2 text-sm font-light text-white/50 transition-colors duration-500 hover:text-amber-400"
        >
          <Mail className="h-4 w-4" />
          or email me directly at skmdjeesan@gmail.com
        </motion.a>
      </motion.div>
    </section>
  )
}

export default Contact