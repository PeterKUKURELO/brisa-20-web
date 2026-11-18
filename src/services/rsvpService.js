const endpoint = import.meta.env.VITE_RSVP_API_URL

export async function submitRSVP(data) {
  if (!endpoint) {
    const responses = JSON.parse(localStorage.getItem('brisa-rsvp') || '[]')
    responses.push({ ...data, submittedAt: new Date().toISOString() })
    localStorage.setItem('brisa-rsvp', JSON.stringify(responses))
    return { ok: true, local: true }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error('No fue posible registrar la confirmación')
  return response.json()
}
