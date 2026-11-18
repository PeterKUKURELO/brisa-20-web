import { CalendarDays, Clock3, MapPin } from 'lucide-react'

function EventDetails({ displayDate, time, venue, address, mapEmbedUrl }) {
  return (
    <section className="event-section" id="evento">
      <div className="ornament-title">
        <span />
        <h2>Detalles del evento</h2>
        <span />
      </div>

      <div className="event-card">
        <div className="event-card__schedule">
          <article className="event-card__detail">
            <CalendarDays className="event-icon" aria-hidden="true" />
            <strong>{displayDate}</strong>
          </article>
          <article className="event-card__detail event-card__detail--time">
            <Clock3 className="event-icon" aria-hidden="true" />
            <strong>{time}</strong>
          </article>
        </div>

        <article className="event-card__place">
          <div>
            <MapPin className="event-icon" aria-hidden="true" />
            <p className="event-card__address">
              <span>Ubicación</span>
              <strong>{venue}</strong>
              <small>{address}</small>
            </p>
          </div>
          <div className="event-card__map-wrap">
            <iframe
              className="event-card__map"
              src={mapEmbedUrl}
              title={`Mapa de ${venue}, ${address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </article>
      </div>
    </section>
  )
}

export default EventDetails
