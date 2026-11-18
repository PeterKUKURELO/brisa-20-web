import { Music2, Play, X } from 'lucide-react'

function AudioModal({ isOpen, onAccept, onDecline }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="audio-modal" role="dialog" aria-modal="true" aria-labelledby="audio-title">
        <button className="audio-modal__close" type="button" onClick={onDecline} aria-label="Cerrar"><X aria-hidden="true" /></button>
        <span className="audio-modal__icon" aria-hidden="true"><Music2 /></span>
        <h2 id="audio-title">¡Bienvenido a<br />mi invitación!</h2>
        <p>Esta experiencia incluye música para que disfrutes la invitación al máximo.</p>
        <div className="audio-modal__actions">
          <button className="button button--primary" type="button" onClick={onAccept}><Play aria-hidden="true" /> Activar audio</button>
          <button className="button button--link" type="button" onClick={onDecline}>Continuar sin audio</button>
        </div>
      </section>
    </div>
  )
}

export default AudioModal
