import { useState } from 'react'

function ImageSlot({ src, alt = '', label, className = '', fit = 'contain' }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={`image-slot ${isLoaded ? 'image-slot--loaded' : ''} ${className}`}>
      <span className="image-slot__placeholder">
        <strong>Espacio para imagen</strong>
        <small>{label || src}</small>
      </span>
      <img
        src={src}
        alt={alt}
        style={{ objectFit: fit }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(false)}
      />
    </div>
  )
}

export default ImageSlot
