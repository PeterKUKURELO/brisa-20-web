import { useEffect, useState } from 'react'

const emptyTime = { days: 0, hours: 0, minutes: 0, seconds: 0 }
const labels = { days: 'Días', hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos' }

function getTimeLeft(targetDate) {
  if (!targetDate) return emptyTime

  const difference = new Date(targetDate).getTime() - Date.now()
  if (Number.isNaN(difference) || difference <= 0) return emptyTime

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  }
}

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => window.clearInterval(timer)
  }, [targetDate])

  return (
    <section className="countdown-section" aria-label="Cuenta regresiva">
      <div className="ornament-title ornament-title--small">
        <span />
        <h2>Falta poco para mi cumpleaños</h2>
        <span />
      </div>
      {!targetDate ? (
        <p className="countdown-empty">Muy pronto revelaremos la fecha.</p>
      ) : (
        <div className="countdown">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div className="countdown__item" key={label}>
              <strong>{String(value).padStart(2, '0')}</strong>
              <span>{labels[label]}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Countdown
