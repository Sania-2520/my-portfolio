import { useEffect, useRef, useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { FileText, Mail, Phone, X } from 'lucide-react'
import { contact } from '../../data/contact'
import { profile } from '../../data/profile'
import { useGarden } from '../../context/gardenContext'
import { BrandLeaf } from '../layout/Brand'

/** Floating "Quick Transmissions" drawer (the legacy peek-a-boo contact drawer). */
export function QuickContact() {
  const [open, setOpen] = useState(false)
  const { loaderDone } = useGarden()
  const ref = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const links = [
    { Icon: Mail, label: 'Email', sub: contact.email, href: `mailto:${contact.email}` },
    { Icon: Phone, label: 'Phone', sub: contact.phone, href: contact.phoneHref },
    {
      Icon: FileText,
      label: 'View Resume',
      sub: 'PDF',
      href: `${import.meta.env.BASE_URL}${profile.resume}`,
      external: true,
    },
  ]

  return (
    <div
      ref={ref}
      className="fixed z-[35]"
      style={{
        right: 'max(1rem, env(safe-area-inset-right))',
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <AnimatePresence>
        {open && (
          <m.div
            id="quick-contact"
            role="group"
            aria-label={contact.quickTitle}
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="card-parchment absolute right-0 bottom-16 w-[min(18rem,calc(100vw-2rem))] origin-bottom-right p-3 shadow-(--shadow-bloom)"
          >
            <p className="eyebrow px-2 pt-1 pb-2 text-[0.66rem]">{contact.quickTitle}</p>
            <ul>
              {links.map(({ Icon, label, sub, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    className="hover:bg-blush-100 flex min-h-12 items-center gap-3 rounded-xl px-2 py-1.5 transition-colors"
                  >
                    <span className="bg-moss-100 text-moss-800 grid size-9 place-items-center rounded-full">
                      <Icon className="size-4.5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="text-bark-900 block text-sm font-semibold">{label}</span>
                      <span className="text-muted block truncate text-xs">{sub}</span>
                    </span>
                    {external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
      <m.button
        ref={btn}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="quick-contact"
        aria-label={open ? 'Close quick contact' : 'Quick contact'}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={loaderDone ? { opacity: 1, scale: 1 } : undefined}
        whileHover={{ rotate: -8, scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="border-parchment-50 bg-moss-800 text-parchment-50 grid size-14 place-items-center rounded-full border-2 shadow-[0_12px_30px_-10px_var(--btn-shadow)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <m.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="size-6" aria-hidden />
            </m.span>
          ) : (
            <m.span
              key="leaf"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <BrandLeaf className="size-7" />
            </m.span>
          )}
        </AnimatePresence>
      </m.button>
    </div>
  )
}
