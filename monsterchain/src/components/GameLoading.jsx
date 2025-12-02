import { useState, useEffect } from 'react'
import '../css/GameLoading.css'

function GameLoading({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)
  const [glitchText, setGlitchText] = useState(false)
  const [showJumpscare, setShowJumpscare] = useState(true)

  const loadingStages = [
    { text: 'Awakening the sleeping demon...', duration: 2000, progress: 20 },
    { text: 'Blood is boiling...', duration: 1500, progress: 40 },
    { text: 'Souls are being torn apart...', duration: 1500, progress: 60 },
    { text: 'Darkness is consuming everything...', duration: 1500, progress: 80 },
    { text: 'Welcome to hell...', duration: 2000, progress: 100 }
  ]

  // Jumpscare effect on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowJumpscare(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchText(true)
      setTimeout(() => setGlitchText(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(glitchInterval)
  }, [])

  useEffect(() => {
    let stageIndex = 0
    let progressValue = 0

    const updateProgress = () => {
      if (stageIndex < loadingStages.length) {
        const stage = loadingStages[stageIndex]
        const increment = (stage.progress - progressValue) / (stage.duration / 50)
        
        const interval = setInterval(() => {
          progressValue += increment
          if (progressValue >= stage.progress) {
            progressValue = stage.progress
            clearInterval(interval)
            stageIndex++
            setCurrentStage(stageIndex)
            if (stageIndex < loadingStages.length) {
              updateProgress()
            } else {
              setTimeout(() => {
                if (onLoadingComplete) {
                  onLoadingComplete()
                }
              }, 5000)
            }
          }
          setProgress(Math.min(progressValue, 100))
        }, 50)
      }
    }

    updateProgress()
  }, [onLoadingComplete])

  return (
    <div className="game-loading horror">
      {showJumpscare && (
        <div className="jumpscare-overlay">
          <img src="/logo.png" alt="Logo" className="jumpscare-logo" />
        </div>
      )}

      <div className="blood-drip-container">
        {[...Array(20)].map((_, i) => (
          <div 
            key={`drip-${i}`}
            className="blood-drip"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="red-flash"></div>
      <div className="cracks-overlay"></div>

      <div className="fog-container">
        <div className="fog fog-1"></div>
        <div className="fog fog-2"></div>
      </div>

      <div className="particles-container">
        {[...Array(30)].map((_, i) => (
          <div 
            key={`ash-${i}`}
            className="ash-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <div 
            key={`ember-${i}`}
            className="ember"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="loading-content">
        <h1 className={`loading-title horror-title ${glitchText ? 'glitch' : ''}`}>
          <span className="title-text" data-text="MONSTER CHAIN">MONSTER CHAIN</span>
        </h1>

        <p className="horror-subtitle">ABANDON ALL HOPE</p>

        <div className="progress-container horror-progress">
          <div className="progress-bar-wrapper">
            <div 
              className="progress-bar-fill blood-fill" 
              style={{ width: `${progress}%` }}
            >
              <div className="blood-bubble"></div>
            </div>
          </div>
          <div className="progress-text horror-text">{Math.floor(progress)}%</div>
        </div>

        <div className="loading-stage">
          <p className={`stage-text horror-stage ${glitchText ? 'glitch-text' : ''}`}>
            {progress >= 100 ? 'Are you ready to face your fears...' : loadingStages[currentStage]?.text}
          </p>
        </div>

        <div className="horror-symbols">
          <img src="/logo.png" alt="Logo" className="horror-logo" />
        </div>

        {progress >= 100 && (
          <div className="warning-text pulse">
            ⚠ ENTERING SOON... ⚠
          </div>
        )}
      </div>

      <div className="blood-vignette"></div>
    </div>
  )
}

export default GameLoading
