import { useMemo } from 'react'
import { m } from 'motion/react'
import { FileText, Globe, Mail, Phone, ShieldCheck, Timer } from 'lucide-react'
import { Github } from '../ui/GithubIcon'
import { contact } from '../../data/contact'
import { profile } from '../../data/profile'
import { sectionById } from '../../data/sections'
import { useGarden } from '../../context/gardenContext'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Vignette } from '../scenes/Vignette'
import { Moon } from '../scenes/art/Botanicals'
import { ContactForm } from '../features/ContactForm'

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
  const { reduced } = useGarden()

  const rows = [
    { Icon: Mail, label: contact.labels.email, value: contact.email, href: `mailto:${contact.email}` },
    { Icon: Phone, label: contact.labels.phone, value: contact.phone, href: contact.phoneHref },
    { Icon: Globe, label: contact.labels.location, value: contact.location },
  ]

  return (
    <section
      id="contact-section"
      aria-labelledby="contact-section-title"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,#fff6f3_0%,#f3ecf9_18%,#e7d9f2_48%,#efdbe6_78%,#f8e3da_100%)] py-20 sm:py-28 lg:py-32"
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
        <path d="M0 60c180-30 360 30 540 10s360-50 540-20 270 30 360 10v80H0Z" fill="#d8c8ec" opacity=".7" />
        <path d="M0 90c240-20 480 20 720 6s480-26 720 0v44H0Z" fill="#cdbbe6" opacity=".6" />
        <path
          d="M200 100h120M700 112h160M1100 104h90"
          stroke="#fff"
          strokeOpacity=".7"
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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.3fr)] lg:gap-10">
          <div className="space-y-6">
            <Reveal className="hidden sm:block">
              <Vignette
                name="moonlit"
                alt="A twilight garden: a tree hung with glowing lanterns above hydrangeas and a still pond with fireflies."
                width={362}
                height={464}
                glows={[
                  { x: 62, y: 25, size: 34 },
                  { x: 22, y: 18, size: 18 },
                ]}
                className="mx-auto max-w-[17rem] lg:max-w-[19rem]"
                sizes="300px"
              />
            </Reveal>
            <Reveal className="glass-parchment rounded-[1.5rem] p-6 shadow-(--shadow-leaf) sm:p-7">
              <h3 className="text-xl font-medium">{contact.terminalTitle}</h3>
              <ul className="mt-5 space-y-3">
                {rows.map(({ Icon, label, value, href }) => (
                  <li key={label}>
                    {(() => {
                      const inner = (
                        <>
                          <span className="bg-twilight-100 text-twilight-700 grid size-11 shrink-0 place-items-center rounded-xl">
                            <Icon className="size-5" aria-hidden />
                          </span>
                          <span className="min-w-0">
                            <small className="text-muted block font-mono text-[0.66rem] tracking-[0.14em]">
                              {label}
                            </small>
                            <span className="text-bark-900 block font-semibold [overflow-wrap:anywhere]">
                              {value}
                            </span>
                          </span>
                        </>
                      )
                      return href ? (
                        <a
                          href={href}
                          className="flex items-center gap-3 rounded-2xl p-1.5 transition-colors hover:bg-white/70"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 p-1.5">{inner}</div>
                      )
                    })()}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-bark-900 text-parchment-50 hover:bg-moss-800 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold"
                >
                  <Github className="size-4" aria-hidden /> GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a
                  href={`${import.meta.env.BASE_URL}${profile.resume}`}
                  target="_blank"
                  className="border-bark-500/35 bg-parchment-50 text-bark-900 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold hover:bg-white"
                >
                  <FileText className="text-moss-800 size-4" aria-hidden /> View Resume
                  <span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
              </div>

              <div className="border-line mt-6 border-t pt-5">
                <p className="text-muted font-mono text-[0.66rem] tracking-[0.18em]">
                  {contact.metricsTitle}
                </p>
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

          <Reveal
            delay={0.08}
            className="glass-parchment rounded-[1.5rem] p-6 shadow-(--shadow-bloom) sm:p-9"
          >
            <h3 className="mb-6 flex items-center gap-2.5 text-2xl font-medium">
              <span className="bg-moss-800 text-parchment-50 grid size-10 place-items-center rounded-full">
                <Mail className="size-5" aria-hidden />
              </span>
              {contact.formTitle}
            </h3>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
