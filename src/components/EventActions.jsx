import { CalendarPlus, ListMusic, Music2 } from 'lucide-react'

function EventActions() {
  return (
    <section className="event-actions" aria-label="Acciones para el evento">
      <article className="event-action-card">
        <span className="event-action-card__icon" aria-hidden="true"><CalendarPlus /></span>
        <div>
          <span className="event-action-card__eyebrow">No olvides la fecha</span>
          <h3>Agéndalo en tu calendario</h3>
          <p>12 de diciembre de 2026 · 7:30 p. m.</p>
        </div>
        <a className="button button--primary" href="/brisa-20.ics" download>
          <CalendarPlus aria-hidden="true" /> Agendar
        </a>
      </article>

      <article className="event-action-card event-action-card--playlist">
        <span className="event-action-card__icon" aria-hidden="true"><ListMusic /></span>
        <div>
          <span className="event-action-card__eyebrow">Playlist de la noche</span>
          <h3>¿Qué canción no puede faltar?</h3>
          <p>Recomienda una canción para acompañar la celebración.</p>
        </div>
        <a className="button button--primary" href="#cancion">
          <Music2 aria-hidden="true" /> Recomendar
        </a>
      </article>
    </section>
  )
}

export default EventActions
