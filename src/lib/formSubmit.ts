export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

export type SubmitPhase = 'connecting' | 'uploading'

const ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim() || ''
export const hasFormEndpoint = ENDPOINT.length > 0

/**
 * POSTs JSON to a Formspree / Web3Forms style endpoint, reporting real lifecycle
 * phases so the UI's status steps follow the actual request.
 */
export async function submitContact(
  data: ContactPayload,
  onPhase: (p: SubmitPhase) => void,
  signal?: AbortSignal,
) {
  onPhase('connecting')
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...data, _subject: `Portfolio: ${data.subject}` }),
    signal,
  })
  onPhase('uploading')
  if (!res.ok) {
    let detail = ''
    try {
      const j = (await res.json()) as { error?: string; message?: string }
      detail = j.error || j.message || ''
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail || `The garden gateway answered ${res.status}.`)
  }
  await res.text()
}

export function mailtoHref(to: string, data: ContactPayload) {
  const body = `${data.message}\n\n— ${data.name} (${data.email})`
  return `mailto:${to}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`
}
