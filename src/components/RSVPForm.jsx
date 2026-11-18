import { useEffect, useState } from 'react'
import { CalendarCheck, CalendarDays, Check, Clock3, Frown, IdCard, MapPin, MessageSquareText, Music2, Send, Sparkles, UserRound } from 'lucide-react'
import { submitRSVP } from '../services/rsvpService.js'

const initialForm = { name: '', attendance: '', dni: '', song: '', message: '' }

function RSVPForm({ event }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [submittedForm, setSubmittedForm] = useState(null)

  useEffect(() => {
    if (status !== 'success') return

    const scrollTimer = window.setTimeout(() => {
      document.querySelector('.rsvp-confirmation')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 420)

    return () => window.clearTimeout(scrollTimer)
  }, [status])

  const updateField = ({ target }) => {
    const value = target.name === 'dni'
      ? target.value.replace(/\D/g, '').slice(0, 8)
      : target.value

    setForm((current) => ({ ...current, [target.name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')

    try {
      await submitRSVP(form)
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      setSubmittedForm({ ...form })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="rsvp-section" id="confirmar">
      <img className="rsvp-decoration rsvp-decoration--glass" src="/images/decorations/copa.png" alt="" aria-hidden="true" />
      <img className="rsvp-decoration rsvp-decoration--stars" src="/images/decorations/star4.png" alt="" aria-hidden="true" />
      {status === 'success' ? (
        <div className="rsvp-confirmation" role="status" aria-live="polite">
          <span className="rsvp-confirmation__check" aria-hidden="true"><Check /></span>
          <div className="rsvp-confirmation__title">
            <Sparkles aria-hidden="true" />
            <h2>{submittedForm?.attendance === 'yes' ? '¡Asistencia confirmada!' : '¡Respuesta registrada!'}</h2>
            <Sparkles aria-hidden="true" />
          </div>
          <p className="rsvp-confirmation__message">
            {submittedForm?.attendance === 'yes'
              ? <>¡Qué emoción! Ya estás en mi lista de invitados.<br />Nos vemos para celebrar mis 20 años.</>
              : <>Gracias por avisarme y ser parte de este momento.<br />Tu respuesta quedó registrada correctamente.</>}
          </p>

          <dl className="rsvp-confirmation__details">
            <div><dt><UserRound aria-hidden="true" /> Invitado</dt><dd>{submittedForm?.name}</dd></div>
            <div><dt><IdCard aria-hidden="true" /> DNI</dt><dd>{submittedForm?.dni}</dd></div>
            <div><dt><CalendarDays aria-hidden="true" /> Fecha</dt><dd>{event.displayDate}</dd></div>
            <div><dt><Clock3 aria-hidden="true" /> Hora</dt><dd>{event.time}</dd></div>
            <div><dt><MapPin aria-hidden="true" /> Lugar</dt><dd>{event.venue}<small>{event.address}</small></dd></div>
            {submittedForm?.song && <div><dt><Music2 aria-hidden="true" /> Canción</dt><dd>{submittedForm.song}</dd></div>}
          </dl>

          <div className="rsvp-confirmation__farewell">
            {submittedForm?.attendance === 'yes' ? (
              <span>¡Nos vemos en la fiesta!</span>
            ) : (
              <><Frown aria-hidden="true" /><span>Gracias por tu sinceridad</span></>
            )}
          </div>
        </div>
      ) : (
        <div className="rsvp-card">
        <div className="rsvp-card__intro">
          <h2>Confirma<br /> tu asistencia</h2>
          <span />
          <p>¡Me encantará<br /> celebrar contigo!</p>
        </div>

        <form className="rsvp-form" onSubmit={handleSubmit}>
          <label>
            <span className="field-label">Nombre <em>*</em></span>
            <span className="field-control"><i aria-hidden="true"><UserRound /></i><input name="name" placeholder="Tu nombre" value={form.name} onChange={updateField} required /></span>
          </label>
          <label>
            <span className="field-label">¿Asistirás? <em>*</em></span>
            <span className="field-control"><i aria-hidden="true"><CalendarCheck /></i><select name="attendance" value={form.attendance} onChange={updateField} required>
              <option value="" disabled>Selecciona una opción</option>
              <option value="yes">Sí, allí estaré</option>
              <option value="no">No podré asistir</option>
            </select></span>
          </label>
          <label>
            <span className="field-label">DNI <em>*</em></span>
            <span className="field-control"><i aria-hidden="true"><IdCard /></i><input
              name="dni"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]{8}"
              maxLength="8"
              title="Ingresa un DNI de 8 dígitos"
              placeholder="8 dígitos"
              value={form.dni}
              onChange={updateField}
              required
            /></span>
          </label>
          <label>
            <span className="field-label">Mensaje (opcional)</span>
            <span className="field-control field-control--message"><i aria-hidden="true"><MessageSquareText /></i><textarea name="message" rows="2" placeholder="Escríbenos un mensaje..." value={form.message} onChange={updateField} /></span>
          </label>
          <label className="rsvp-form__song" id="cancion">
            <span className="field-label">Canción para la playlist (opcional)</span>
            <span className="field-control"><i aria-hidden="true"><Music2 /></i><input
              name="song"
              type="text"
              placeholder="Canción – artista"
              value={form.song}
              onChange={updateField}
            /></span>
          </label>
          <button className="button button--primary rsvp-form__submit" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Enviando…' : <><Send aria-hidden="true" /> Confirmar asistencia</>}
          </button>
          {status === 'error' && <p className="form-message form-message--error">No pudimos guardar tu respuesta. Inténtalo nuevamente.</p>}
        </form>
        </div>
      )}
    </section>
  )
}

export default RSVPForm
