import { m } from 'motion/react'
import { BookOpen, Clock } from 'lucide-react'
import { blogs, journalIntro } from '../../data/blogs'
import { sectionById } from '../../data/sections'
import { useGarden } from '../../context/gardenContext'
import { GardenSection } from '../ui/GardenSection'
import { SectionHeading } from '../ui/SectionHeading'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import { Leaf } from '../scenes/art/Botanicals'
import { useTheme } from '../../lib/theme'

const ACCENTS = {
  light: ['#e58fae', '#8f78c4', '#6a8a4a'],
  dark: ['#ff9cc6', '#c6a4f6', '#a9d08a'],
}

function Fox({ onClick }: { onClick: () => void }) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      aria-label="A fox peeks out from the hedge"
      className="absolute -top-14 right-6 z-0 sm:right-16"
      initial={{ y: 26 }}
      whileInView={{ y: 6 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.6 }}
    >
      <svg viewBox="0 0 80 60" className="h-14 w-20" aria-hidden>
        <path d="M14 8 26 24H10Z" fill="#c9714f" />
        <path d="M66 8 54 24h16Z" fill="#c9714f" />
        <path d="M17 13l6 9h-8Z" fill="#3b2417" opacity=".5" />
        <path d="M63 13l-6 9h8Z" fill="#3b2417" opacity=".5" />
        <path d="M8 26c0-8 14-12 32-12s32 4 32 12c0 14-16 30-32 30S8 40 8 26Z" fill="#d98a63" />
        <path
          d="M18 34c6 0 14 6 22 20-10 0-22-8-22-20ZM62 34c-6 0-14 6-22 20 10 0 22-8 22-20Z"
          fill="#fbf5e9"
        />
        <circle cx="28" cy="30" r="3" fill="#3b2417" />
        <circle cx="52" cy="30" r="3" fill="#3b2417" />
        <circle cx="29" cy="29" r="1" fill="#fff" />
        <circle cx="53" cy="29" r="1" fill="#fff" />
        <ellipse cx="40" cy="47" rx="3.6" ry="2.6" fill="#3b2417" />
      </svg>
    </m.button>
  )
}

export function Journal() {
  const meta = sectionById['blogs-section']
  const { openBlog, toast } = useGarden()
  const accents = ACCENTS[useTheme()]

  return (
    <GardenSection id="blogs-section" bg="parchment" vines="left">
      <div className="wrap">
        <SectionHeading
          id="blogs-section"
          number={meta.number}
          garden={meta.garden}
          title={journalIntro.title}
          subtitle={journalIntro.subtitle}
        />
        <div className="relative">
          <Fox onClick={() => toast('A fox keeps watch over the Garden Journal.')} />
          <RevealGroup className="relative z-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b, i) => (
              <RevealItem key={b.id}>
                <m.article
                  whileHover={{ y: -6, rotate: i === 1 ? 0 : i === 0 ? -0.6 : 0.6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="card-parchment group flex h-full flex-col overflow-hidden"
                >
                  <div className="relative h-2" style={{ background: accents[i] }} aria-hidden />
                  <div
                    className="flex flex-1 flex-col p-6 sm:p-7"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(180deg, transparent 0 31px, var(--ruled-line) 31px 32px)',
                      backgroundPositionY: '10px',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="chip" style={{ color: accents[i], borderColor: `${accents[i]}55` }}>
                        <Leaf color={accents[i]} className="size-3.5" />
                        {b.category}
                      </span>
                      <span className="text-muted inline-flex items-center gap-1 text-xs">
                        <Clock className="size-3.5" aria-hidden />
                        {b.readTime}
                      </span>
                    </div>
                    <h3 className="mt-5 text-[1.45rem] leading-snug font-medium">{b.cardTitle}</h3>
                    <p className="mt-3 flex-1 leading-relaxed">{b.excerpt}</p>
                    <button
                      type="button"
                      onClick={() => openBlog(b.id)}
                      aria-haspopup="dialog"
                      aria-label={`Read Log: ${b.cardTitle}`}
                      className="border-moss-700/30 bg-parchment-50 text-moss-800 hover:bg-moss-800 hover:text-parchment-50 mt-6 inline-flex min-h-11 items-center gap-2 self-start rounded-full border px-4 font-semibold transition-colors"
                    >
                      <BookOpen className="size-4" aria-hidden />
                      Read Log
                    </button>
                  </div>
                </m.article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </GardenSection>
  )
}
