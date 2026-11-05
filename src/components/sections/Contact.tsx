import { useMemo, useState } from 'react'
import { m } from 'motion/react'
import { Copy, FileText, Globe, Mail, Phone, ShieldCheck, Timer } from 'lucide-react'
import { Github } from '../ui/GithubIcon'
import { contact } from '../../data/contact'
import { profile } from '../../data/profile'
import { sectionById } from '../../data/sections'
import { useGarden } from '../../context/gardenContext'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Vignette } from '../scenes/Vignette'
import { Moon } from '../scenes/art/Botanicals'
import { Button } from '../ui/Button'

function Fireflies({ count = 18 }: { count?: number }) {
  const flies = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 53) % 100,
        top: 20 + ((i * 37) % 75),
        size: 3 + (i % 3),
        delay: -((i * 0.73) % 6),
        dur: 4 + (i % 4),
      })),
    [count],
  )
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {flies.map((f, i) => (
        <span
          key={i}
          className="motion-safe:animate-twinkle absolute rounded-full bg-[#ffe9a8] shadow-[0_0_10px_3px_rgb(255_221_140/0.75)]"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

export function Contact() {
  const meta = sectionById['contact-section']
  const { reduced, toast } = useGarden()
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      toast('Email address copied.')
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      toast(contact.email)
    }
  }

  const rows = [
    { Icon: Phone, label: contact.labels.phone, value: contact.phone, href: contact.phoneHref },
    { Icon: Globe, label: contact.labels.location, value: contact.location },
  ]

  return (
    <section
      id="contact-section"
      aria-labelledby="contact-section-title"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,#fff6f3_0%,#f3ecf9_18%,#e7d9f2_48%,#efdbe6_78%,#f8e3da_100%)] py-20 sm:py-28 lg:py-32 dark:bg-[linear-gradient(180deg,#190b1a_0%,#2b1236_20%,#47195a_50%,#6a2166_78%,#3a1240_100%)]"
    >
      {/* Twilight sky */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute top-16 right-[6%] -z-10 w-40 sm:w-56 lg:w-72"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
      >
        <Moon className="w-full" />
      </m.div>
      <Fireflies count={reduced ? 10 : 18} />
      <svg
        aria-hidden
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 w-full"
      >
        <path
          d="M0 60c180-30 360 30 540 10s360-50 540-20 270 30 360 10v80H0Z"
          className="fill-[#d8c8ec] dark:fill-[#7a2f78]"
          opacity=".7"
        />
        <path
          d="M0 90c240-20 480 20 720 6s480-26 720 0v44H0Z"
          className="fill-[#cdbbe6] dark:fill-[#5d2260]"
          opacity=".6"
        />
        <path
          d="M200 100h120M700 112h160M1100 104h90"
          stroke="#fff"
          strokeOpacity=".5"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="wrap">
        <SectionHeading
          id="contact-section"
          number={meta.number}
          garden={meta.garden}
          title={contact.title}
          subtitle={contact.subtitle}
          tone="twilight"
        />

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal className="hidden sm:block">
            <div className="relative mx-auto max-w-[19rem] lg:max-w-[25rem]">
              <div
                aria-hidden
                className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(255_233_168/0.5),transparent_70%)]"
              />
              <Vignette
                name="moonlit"
                alt="A twilight garden: a tree hung with glowing lanterns above hydrangeas and a still pond with fireflies."
                width={362}
                height={464}
                glows={[
                  { x: 62, y: 25, size: 34 },
                  { x: 22, y: 18, size: 18 },
                ]}
                className="w-full"
                sizes="(min-width: 1024px) 400px, 300px"
              />
            </div>
          </Reveal>

          <Reveal className="glass-parchment [container-type:inline-size] rounded-[2rem] p-7 shadow-(--shadow-bloom) sm:p-10 lg:p-12">
            <p className="text-twilight-700 font-mono text-[0.7rem] tracking-[0.22em]">
              {contact.terminalTitle.toUpperCase()}
            </p>

            <p className="text-muted mt-6 font-mono text-[0.66rem] tracking-[0.18em]">
              {contact.labels.email}
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="font-display text-bark-900 hover:text-moss-700 mt-1 block text-[clamp(1rem,6.2cqw,2.6rem)] leading-tight [overflow-wrap:anywhere] underline decoration-[#c9b8e8] decoration-2 underline-offset-[0.28em] transition-colors hover:decoration-[#6a8a4a] dark:decoration-[#ff8dbb]"
            >
              {contact.email}
            </a>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button magnetic href={`mailto:${contact.email}`} icon={<Mail className="size-4.5" />}>
                Send an email
              </Button>
              <Button
                variant="secondary"
                iconLeft={<Copy className="text-moss-800 size-4.5" />}
                onClick={copyEmail}
              >
                {copied ? 'Copied!' : 'Copy address'}
              </Button>
              <Button
                variant="secondary"
                href={`${import.meta.env.BASE_URL}${profile.resume}`}
                target="_blank"
                iconLeft={<FileText className="text-moss-800 size-4.5" />}
              >
                View Resume
                <span className="sr-only"> (PDF, opens in a new tab)</span>
              </Button>
            </div>

            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {rows.map(({ Icon, label, value, href }) => {
                const inner = (
                  <>
                    <span className="bg-twilight-100 text-twilight-700 grid size-12 shrink-0 place-items-center rounded-2xl">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <small className="text-muted block font-mono text-[0.62rem] tracking-[0.14em]">
                        {label}
                      </small>
                      <span className="text-bark-900 block font-semibold [overflow-wrap:anywhere]">
                        {value}
                      </span>
                    </span>
                  </>
                )
                const cls =
                  'border-line flex items-center gap-3.5 rounded-2xl border bg-white/60 p-3.5 transition-all'
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        className={`${cls} hover:-translate-y-0.5 hover:bg-white hover:shadow-md`}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </li>
                )
              })}
              <li className="sm:col-span-2">
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-line flex items-center gap-3.5 rounded-2xl border bg-white/60 p-3.5 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                >
                  <span className="bg-bark-900 text-parchment-50 grid size-12 shrink-0 place-items-center rounded-2xl">
                    <Github className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <small className="text-muted block font-mono text-[0.62rem] tracking-[0.14em]">
                      GITHUB
                    </small>
                    <span className="text-bark-900 block font-semibold">saniakotharkar</span>
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>

            <div className="border-line mt-8 border-t pt-6">
              <p className="text-muted font-mono text-[0.66rem] tracking-[0.18em]">{contact.metricsTitle}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {contact.metrics.map((m, i) => (
                  <div key={m.label} className="border-line rounded-2xl border bg-white/65 p-4">
                    {i === 0 ? (
                      <Timer className="text-twilight-700 size-5" aria-hidden />
                    ) : (
                      <ShieldCheck className="text-moss-700 size-5" aria-hidden />
                    )}
                    <p className="font-display text-bark-900 mt-2 text-xl">{m.value}</p>
                    <p className="text-muted text-xs">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
