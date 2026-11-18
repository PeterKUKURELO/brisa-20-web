import { useEffect, useRef, useState } from 'react'
import AudioModal from './components/AudioModal.jsx'
import Countdown from './components/Countdown.jsx'
import EventActions from './components/EventActions.jsx'
import EventDetails from './components/EventDetails.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import RSVPForm from './components/RSVPForm.jsx'

const AUDIO_START_TIME = 0
const AUDIO_VOLUME = 0.4

const event = {
  date: import.meta.env.VITE_EVENT_DATE || '',
  displayDate: '12 de diciembre',
  time: '7:30 p. m.',
  venue: 'Av. Angamos Este 1533',
  address: 'Surquillo 15048',
  mapEmbedUrl: 'https://www.google.com/maps?q=Av.%20Angamos%20Este%201533%2C%20Surquillo%2015048&output=embed',
}

function App() {
  const audioRef = useRef(null)
  const analyserRef = useRef(null)
  const audioContextRef = useRef(null)
  const audioSourceRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return undefined

    const updateKeyboardState = () => {
      document.body.classList.toggle('keyboard-open', window.innerHeight - viewport.height > 140)
    }

    updateKeyboardState()
    viewport.addEventListener('resize', updateKeyboardState)
    return () => {
      viewport.removeEventListener('resize', updateKeyboardState)
      document.body.classList.remove('keyboard-open')
    }
  }, [])

  useEffect(() => {
    if (isModalOpen) return undefined

    document.body.classList.add('invitation-ready')
    return () => document.body.classList.remove('invitation-ready')
  }, [isModalOpen])

  useEffect(() => {
    if (isModalOpen) return undefined

    const groups = [
      { selector: '.hero__intro', variant: 'reveal--up', delay: 80 },
      { selector: '.hero__portrait-wrap', variant: 'reveal--image', delay: 140 },
      { selector: '.hero__age-wrap', variant: 'reveal--image', delay: 220 },
      { selector: '.ornament-title', variant: 'reveal--up' },
      { selector: '.countdown__item', variant: 'reveal--card', stagger: 80 },
      { selector: '.event-card__schedule', variant: 'reveal--card' },
      { selector: '.event-card__place', variant: 'reveal--card', delay: 100 },
      { selector: '.event-action-card', variant: 'reveal--card', stagger: 100 },
      { selector: '.rsvp-card__intro', variant: 'reveal--up' },
      { selector: '.rsvp-form label', variant: 'reveal--up', stagger: 70 },
      { selector: '.site-footer p', variant: 'reveal--up' },
      { selector: '.site-footer__sparkles', variant: 'reveal--image', delay: 120 },
      { selector: '.music-player', variant: 'reveal--card', delay: 250 },
    ]

    const elements = groups.flatMap(({ selector, variant, delay = 0, stagger = 0 }) => (
      [...document.querySelectorAll(selector)].map((element, index) => {
        element.classList.add('reveal', variant)
        element.style.setProperty('--reveal-delay', `${delay + (index * stagger)}ms`)
        return element
      })
    ))

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -35px' })

    const animationFrame = window.requestAnimationFrame(() => {
      elements.forEach((element) => observer.observe(element))
    })
    return () => {
      window.cancelAnimationFrame(animationFrame)
      observer.disconnect()
    }
  }, [isModalOpen])

  useEffect(() => () => {
    audioContextRef.current?.close()
  }, [])

  const enableAudioAnalysis = async () => {
    const audio = audioRef.current
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!audio || !AudioContext) return

    if (!audioContextRef.current) {
      const context = new AudioContext()
      const analyser = context.createAnalyser()
      const source = context.createMediaElementSource(audio)

      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.78
      source.connect(analyser)
      analyser.connect(context.destination)

      audioContextRef.current = context
      audioSourceRef.current = source
      analyserRef.current = analyser
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }
  }

  const playMusic = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      audio.volume = AUDIO_VOLUME

      try {
        await enableAudioAnalysis()
      } catch {
        // El audio puede continuar aunque el navegador no permita analizarlo.
      }

      if (audio.readyState >= 1) {
        if (audio.currentTime < AUDIO_START_TIME) audio.currentTime = AUDIO_START_TIME
      } else {
        audio.addEventListener('loadedmetadata', () => {
          audio.currentTime = AUDIO_START_TIME
        }, { once: true })
      }

      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const toggleMusic = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    await playMusic()
  }

  return (
    <>
      {!isModalOpen && <Header />}
      <main>
        <Hero />
        <Countdown targetDate={event.date} />
        <EventDetails {...event} />
        <EventActions />
        <RSVPForm event={event} />
      </main>

      <footer className="site-footer">
        <p>Brisa <span>20</span></p>
        <div className="site-footer__sparkles" aria-hidden="true">
          <img src="/images/decorations/inferior%20footer.png" alt="" />
        </div>
      </footer>

      <audio
        ref={audioRef}
        src="/audio/Aitana%20-%20SUPERESTRELLA%20%5Bvz_vU53JvvI%5D.m4a"
        preload="auto"
        onLoadedMetadata={({ currentTarget }) => {
          currentTarget.volume = AUDIO_VOLUME
          if (currentTarget.currentTime < AUDIO_START_TIME) currentTarget.currentTime = AUDIO_START_TIME
        }}
        onEnded={async ({ currentTarget }) => {
          currentTarget.currentTime = AUDIO_START_TIME
          try {
            await currentTarget.play()
            setIsPlaying(true)
          } catch {
            setIsPlaying(false)
          }
        }}
      />
      <MusicPlayer analyserRef={analyserRef} isPlaying={isPlaying} onToggle={toggleMusic} />
      <AudioModal
        isOpen={isModalOpen}
        onAccept={async () => {
          await playMusic()
          setIsModalOpen(false)
        }}
        onDecline={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default App
