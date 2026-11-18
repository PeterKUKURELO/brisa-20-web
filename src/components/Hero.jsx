import { ArrowRight, CalendarCheck } from 'lucide-react'

function Hero() {
  return (
    <section className="hero" id="inicio">
      <img className="hero__disco hero__disco--left" src="/images/decorations/bolaDisco.png" alt="" aria-hidden="true" />
      <img className="hero__disco hero__disco--right" src="/images/decorations/bolaDisco.png" alt="" aria-hidden="true" />
      <img className="hero__stars hero__stars--left" src="/images/decorations/star4.png" alt="" aria-hidden="true" />
      <img className="hero__stars hero__stars--right" src="/images/decorations/star4.png" alt="" aria-hidden="true" />
      <img className="hero__ribbon-decoration" src="/images/decorations/lazo.png" alt="" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__intro">
          <p className="hero__kicker">¡Estás invitado!</p>
          <p className="hero__subtitle">a celebrar mis</p>
        </div>

        <div className="hero__visuals">
          <div className="hero__portrait-wrap">
            <img
              className="hero__portrait"
              src="/images/decorations/bri%20bebe.png"
              alt="Brisa de niña con sombrero de fiesta"
            />
          </div>

          <div className="hero__age-wrap">
            <img
              className="hero__age-image"
              src="/images/decorations/20Globos.png"
              alt="20 años"
            />
            <p className="hero__years"><span /> años <span /></p>
            <a className="button button--primary hero__cta" href="#confirmar">
              <CalendarCheck aria-hidden="true" /> Confirmar asistencia <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
