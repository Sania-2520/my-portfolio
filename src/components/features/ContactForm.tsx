import { useId, useRef, useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { CircleAlert, CircleCheck, Ellipsis, LoaderCircle, Send, Sprout } from 'lucide-react'
import { contact } from '../../data/contact'
import { useGarden } from '../../context/gardenContext'
import { hasFormEndpoint, mailtoHref, submitContact, type ContactPayload } from '../../lib/formSubmit'
import { cn } from '../../lib/cn'
import { EASE } from '../../lib/motion'

type Field = keyof ContactPayload
type StepState = 'pending' | 'active' | 'done' | 'error'

const EMPTY: ContactPayload = { name: '', email: '', subject: '', message: '' }

function validate(f: Field, v: string): string {
  const val = v.trim()
  if (f === 'name' && val.length < 2) return 'Please enter your name (at least 2 characters).'
  if (f === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val))
    return 'Enter an email like name@example.com so Sania can reply.'
  if (f === 'subject' && val.length < 3) return 'Add a short topic (at least 3 characters).'
  if (f === 'message' && val.length < 10) return 'Share a little more: at least 10 characters.'
  return ''
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function ContactForm() {
  const uid = useId()
  const { triggerBurst } = useGarden()
  const [data, setData] = useState<ContactPayload>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [steps, setSteps] = useState<StepState[] | null>(null)
  const [notice, setNotice] = useState<{ tone: 'ok' | 'error' | 'info'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const honeypot = useRef<HTMLInputElement>(null)

  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    subject: `${uid}-subject`,
    message: `${uid}-message`,
  }

  const onBlur = (f: Field) => {
    setTouched((t) => ({ ...t, [f]: true }))
    setErrors((e) => ({ ...e, [f]: validate(f, data[f]) }))
  }
  const onChange = (f: Field, v: string) => {
    setData((d) => ({ ...d, [f]: v }))
    if (touched[f]) setErrors((e) => ({ ...e, [f]: validate(f, v) }))
  }
  const setStep = (i: number, s: StepState) =>
    setSteps((prev) => (prev ? prev.map((x, j) => (j === i ? s : x)) : prev))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    const all = (Object.keys(EMPTY) as Field[]).reduce(
      (acc, f) => ({ ...acc, [f]: validate(f, data[f]) }),
      {} as Record<Field, string>,
    )
    setErrors(all)
    setTouched({ name: true, email: true, subject: true, message: true })
    const invalid = (Object.keys(all) as Field[]).filter((f) => all[f])
    if (invalid.length) {
      setNotice(null)
      requestAnimationFrame(() =>
        invalid.length > 1 ? summaryRef.current?.focus() : document.getElementById(ids[invalid[0]])?.focus(),
      )
      return
    }
    if (honeypot.current?.value) return // bots fill hidden fields; silently ignore

    setBusy(true)
    setNotice(null)
    setSteps(['active', 'pending', 'pending', 'pending'])
    try {
      await wait(450) // payload packaging + verification
      setStep(0, 'done')
      setStep(1, 'active')
      if (hasFormEndpoint) {
        await submitContact(data, (phase) => {
          if (phase === 'uploading') {
            setStep(1, 'done')
            setStep(2, 'active')
          }
        })
        setStep(2, 'done')
        setStep(3, 'done')
        setNotice({ tone: 'ok', text: 'Your message reached the garden. Sania will reply soon.' })
      } else {
        await wait(350)
        setStep(1, 'done')
        setStep(2, 'active')
        window.location.assign(mailtoHref(contact.email, data))
        await wait(400)
        setStep(2, 'done')
        setStep(3, 'done')
        setNotice({
          tone: 'info',
          text:
            'Your email app should open with the message ready to send. If it doesn’t, write to ' +
            contact.email +
            '.',
        })
      }
      triggerBurst()
      setData(EMPTY)
      setTouched({})
      setErrors({})
    } catch (err) {
      setSteps((prev) => (prev ? prev.map((s) => (s === 'active' ? 'error' : s)) : prev))
      setNotice({
        tone: 'error',
        text: `${err instanceof Error ? err.message : 'Something went wrong.'} Please try again, or email ${contact.email}.`,
      })
    } finally {
      setBusy(false)
    }
  }

  const errorList = (Object.keys(errors) as Field[]).filter((f) => errors[f])

  const field = (f: Field, label: string, type: 'text' | 'email' | 'textarea', auto?: string) => {
    const err = touched[f] ? errors[f] : ''
    const common = {
      id: ids[f],
      name: f,
      value: data[f],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(f, e.target.value),
      onBlur: () => onBlur(f),
      required: true,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${ids[f]}-err` : undefined,
      className: 'field',
      disabled: busy,
    }
    return (
      <div className={f === 'message' ? 'sm:col-span-2' : undefined}>
        <label htmlFor={ids[f]} className="text-bark-900 mb-1.5 block text-sm font-semibold">
          {label}{' '}
          <span className="text-rose-700" aria-hidden>
            *
          </span>
        </label>
        {type === 'textarea' ? (
          <textarea rows={5} {...common} className="field min-h-36 resize-y" />
        ) : (
          <input type={type} autoComplete={auto} {...common} />
        )}
        <AnimatePresence>
          {err && (
            <m.p
              id={`${ids[f]}-err`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-rose-700"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {err}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative">
      {errorList.length > 1 && Object.values(touched).some(Boolean) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="bg-blush-100 mb-5 rounded-2xl border border-rose-500/40 p-4 text-sm text-rose-700"
        >
          <p className="font-semibold">Please fix {errorList.length} fields:</p>
          <ul className="mt-1.5 list-disc pl-5">
            {errorList.map((f) => (
              <li key={f}>
                <a
                  href={`#${ids[f]}`}
                  className="underline underline-offset-2"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(ids[f])?.focus()
                  }}
                >
                  {contact.fields[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {field('name', contact.fields.name, 'text', 'name')}
        {field('email', contact.fields.email, 'email', 'email')}
        <div className="sm:col-span-2">{field('subject', contact.fields.subject, 'text', 'off')}</div>
        {field('message', contact.fields.message, 'textarea')}
      </div>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <m.button
        type="submit"
        disabled={busy}
        whileHover={busy ? undefined : { y: -2 }}
        whileTap={busy ? undefined : { scale: 0.98 }}
        className="bg-moss-800 text-parchment-50 hover:bg-moss-700 mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full px-6 font-semibold shadow-[0_12px_30px_-12px_rgb(47_69_33/0.7)] transition-colors disabled:opacity-70 sm:w-auto"
      >
        {busy ? (
          <LoaderCircle className="size-5 animate-spin" aria-hidden />
        ) : (
          <Send className="size-5" aria-hidden />
        )}
        {busy ? 'Transmitting…' : contact.submit}
      </m.button>
      {!hasFormEndpoint && <p className="text-muted mt-3 text-xs">Sends through your email app.</p>}

      <div aria-live="polite" className="mt-6 space-y-3">
        <AnimatePresence>
          {steps && (
            <m.ol
              key="steps"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto', transition: { duration: 0.4, ease: EASE } }}
              exit={{ opacity: 0, height: 0 }}
              className="border-line space-y-2 overflow-hidden rounded-2xl border bg-white/60 p-4 font-mono text-[0.78rem]"
            >
              {contact.steps.map((label, i) => {
                const s = steps[i]
                return (
                  <li
                    key={label}
                    className={cn(
                      'flex items-start gap-2.5',
                      s === 'pending' ? 'text-muted' : s === 'error' ? 'text-rose-700' : 'text-bark-900',
                    )}
                  >
                    <span className="mt-0.5 shrink-0" aria-hidden>
                      {s === 'done' ? (
                        i === 3 ? (
                          <Sprout className="text-moss-700 size-4" />
                        ) : (
                          <CircleCheck className="text-moss-700 size-4" />
                        )
                      ) : s === 'active' ? (
                        <LoaderCircle className="text-moss-700 size-4 animate-spin" />
                      ) : s === 'error' ? (
                        <CircleAlert className="size-4" />
                      ) : (
                        <Ellipsis className="size-4" />
                      )}
                    </span>
                    <span>
                      {label}
                      <span className="sr-only"> ({s})</span>
                    </span>
                  </li>
                )
              })}
            </m.ol>
          )}
        </AnimatePresence>
        {notice && (
          <p
            role={notice.tone === 'error' ? 'alert' : undefined}
            className={cn(
              'flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-medium',
              notice.tone === 'ok' && 'bg-moss-100 text-moss-900',
              notice.tone === 'info' && 'bg-twilight-100 text-twilight-700',
              notice.tone === 'error' && 'bg-blush-100 text-rose-700',
            )}
          >
            {notice.tone === 'error' ? (
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            ) : (
              <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
            )}
            {notice.text}
          </p>
        )}
      </div>
    </form>
  )
}
