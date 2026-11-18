import { useEffect, useRef } from 'react'
import { Pause, Play } from 'lucide-react'

const VISUALIZER_BARS = 12

function MusicPlayer({ analyserRef, isPlaying, onToggle }) {
  const playerRef = useRef(null)
  const visualizerRef = useRef(null)

  useEffect(() => {
    const player = playerRef.current
    const bars = [...(visualizerRef.current?.children || [])]
    const analyser = analyserRef.current

    if (!isPlaying || !analyser) {
      player?.style.setProperty('--audio-glow', '0px')
      player?.style.setProperty('--audio-spread', '0px')
      player?.style.setProperty('--button-glow', '0px')
      bars.forEach((bar) => bar.style.setProperty('--bar-level', '.12'))
      return undefined
    }

    const frequencyData = new Uint8Array(analyser.frequencyBinCount)
    let animationFrame

    const drawVisualizer = () => {
      analyser.getByteFrequencyData(frequencyData)

      let totalEnergy = 0
      bars.forEach((bar, index) => {
        const frequencyIndex = Math.min(2 + Math.round(index * 1.45), frequencyData.length - 1)
        const energy = frequencyData[frequencyIndex] / 255
        const level = Math.max(.12, Math.min(1, Math.pow(energy, .72)))
        totalEnergy += energy
        bar.style.setProperty('--bar-level', level.toFixed(3))
      })

      const averageEnergy = bars.length ? totalEnergy / bars.length : 0
      player?.style.setProperty('--audio-glow', `${(averageEnergy * 16).toFixed(2)}px`)
      player?.style.setProperty('--audio-spread', `${(averageEnergy * 3).toFixed(2)}px`)
      player?.style.setProperty('--button-glow', `${(averageEnergy * 18).toFixed(2)}px`)
      animationFrame = window.requestAnimationFrame(drawVisualizer)
    }

    drawVisualizer()
    return () => window.cancelAnimationFrame(animationFrame)
  }, [analyserRef, isPlaying])

  return (
    <aside ref={playerRef} className="music-player" aria-label="Reproductor de música">
      <span className={`music-player__disc${isPlaying ? ' music-player__disc--playing' : ''}`} aria-hidden="true" />
      <div className="music-player__info">
        <strong>SUPERESTRELLA · Aitana</strong>
        <span ref={visualizerRef} className="music-player__visualizer" aria-hidden="true">
          {Array.from({ length: VISUALIZER_BARS }, (_, index) => <i key={index} />)}
        </span>
      </div>
      <button type="button" onClick={onToggle} aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}>
        {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
    </aside>
  )
}

export default MusicPlayer
