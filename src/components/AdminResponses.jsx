import { useEffect, useMemo, useState } from 'react'
import { LockKeyhole, LogOut, RefreshCw, Search, UserCheck, Users, UserX } from 'lucide-react'
import { getRegisteredGuests } from '../services/adminService.js'

const SESSION_KEY = 'brisa-admin-key'
const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Lima',
})

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

function AdminResponses() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [keyInput, setKeyInput] = useState('')
  const [guests, setGuests] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(adminKey ? 'loading' : 'locked')
  const [error, setError] = useState('')
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    if (!adminKey) return undefined

    let active = true

    getRegisteredGuests(adminKey)
      .then((items) => {
        if (!active) return
        setGuests(items)
        setStatus('ready')
      })
      .catch((requestError) => {
        if (!active) return
        if (requestError.status === 401) {
          sessionStorage.removeItem(SESSION_KEY)
          setAdminKey('')
          setStatus('locked')
          setError('La clave ingresada no es correcta.')
          return
        }
        setError(requestError.message)
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [adminKey, refreshToken])

  const visibleGuests = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es')
    if (!normalizedQuery) return guests

    return guests.filter((guest) => (
      [guest.name, guest.dni, guest.song, guest.message]
        .some((value) => String(value || '').toLocaleLowerCase('es').includes(normalizedQuery))
    ))
  }, [guests, query])

  const attending = guests.filter((guest) => guest.attendance === 'yes').length
  const notAttending = guests.length - attending

  const unlock = (event) => {
    event.preventDefault()
    const key = keyInput.trim()
    if (!key) return
    sessionStorage.setItem(SESSION_KEY, key)
    setStatus('loading')
    setError('')
    setAdminKey(key)
    setKeyInput('')
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAdminKey('')
    setGuests([])
    setQuery('')
    setStatus('locked')
  }

  const reload = () => {
    setStatus('loading')
    setError('')
    setRefreshToken((current) => current + 1)
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <a href="/" className="admin-header__brand">Brisa <span>20</span></a>
        {adminKey && (
          <div className="admin-header__actions">
            <button type="button" onClick={reload} disabled={status === 'loading'}><RefreshCw aria-hidden="true" /> Actualizar</button>
            <button type="button" onClick={logout}><LogOut aria-hidden="true" /> Salir</button>
          </div>
        )}
      </header>

      <main className="admin-main">
        {!adminKey ? (
          <section className="admin-login" aria-labelledby="admin-login-title">
            <span className="admin-login__icon" aria-hidden="true"><LockKeyhole /></span>
            <p className="admin-eyebrow">Panel privado</p>
            <h1 id="admin-login-title">Respuestas de invitados</h1>
            <p>Ingresa tu clave administrativa para consultar las confirmaciones.</p>
            <form onSubmit={unlock}>
              <label htmlFor="admin-key">Clave administrativa</label>
              <input
                id="admin-key"
                type="password"
                autoComplete="current-password"
                value={keyInput}
                onChange={({ target }) => setKeyInput(target.value)}
                required
              />
              {error && <span className="admin-error" role="alert">{error}</span>}
              <button className="button button--primary" type="submit">Ingresar</button>
            </form>
          </section>
        ) : (
          <>
            <div className="admin-title">
              <p className="admin-eyebrow">Panel privado</p>
              <h1>Respuestas de invitados</h1>
              <p>Confirmaciones registradas para Brisa 20.</p>
            </div>

            <section className="admin-stats" aria-label="Resumen de confirmaciones">
              <article><span><Users aria-hidden="true" /></span><div><strong>{guests.length}</strong><small>Total</small></div></article>
              <article><span><UserCheck aria-hidden="true" /></span><div><strong>{attending}</strong><small>Asistirán</small></div></article>
              <article><span><UserX aria-hidden="true" /></span><div><strong>{notAttending}</strong><small>No asistirán</small></div></article>
            </section>

            <section className="admin-responses" aria-labelledby="responses-title">
              <div className="admin-responses__toolbar">
                <div>
                  <h2 id="responses-title">Listado</h2>
                  <span>{visibleGuests.length} resultado{visibleGuests.length === 1 ? '' : 's'}</span>
                </div>
                <label className="admin-search">
                  <Search aria-hidden="true" />
                  <span className="sr-only">Buscar respuestas</span>
                  <input type="search" placeholder="Buscar nombre, DNI o canción" value={query} onChange={({ target }) => setQuery(target.value)} />
                </label>
              </div>

              {status === 'loading' && <p className="admin-state">Cargando respuestas…</p>}
              {status === 'error' && <p className="admin-state admin-error" role="alert">{error}</p>}
              {status === 'ready' && visibleGuests.length === 0 && <p className="admin-state">No se encontraron respuestas.</p>}

              {status === 'ready' && visibleGuests.length > 0 && (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Invitado</th><th>Respuesta</th><th>DNI</th><th>Canción y mensaje</th><th>Actualizado</th></tr></thead>
                    <tbody>
                      {visibleGuests.map((guest) => (
                        <tr key={guest.id}>
                          <td data-label="Invitado"><strong>{guest.name}</strong></td>
                          <td data-label="Respuesta"><span className={`admin-status admin-status--${guest.attendance}`}>{guest.attendance === 'yes' ? 'Sí asistirá' : 'No asistirá'}</span></td>
                          <td data-label="DNI">{guest.dni}</td>
                          <td data-label="Detalles"><div><strong>{guest.song || 'Sin canción'}</strong><small>{guest.message || 'Sin mensaje'}</small></div></td>
                          <td data-label="Actualizado">{formatDate(guest.updatedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default AdminResponses
