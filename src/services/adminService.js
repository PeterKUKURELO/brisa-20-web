const endpoint = import.meta.env.VITE_RSVP_API_URL

export async function getRegisteredGuests(adminKey) {
  if (!endpoint) {
    throw new Error('Configura VITE_RSVP_API_URL para consultar las respuestas.')
  }

  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${adminKey}` },
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error || 'No fue posible cargar las respuestas.')
    error.status = response.status
    throw error
  }

  return payload.items || []
}
