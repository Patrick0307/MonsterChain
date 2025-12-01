import { useEffect, useRef, useState } from 'react'
import PixelCharacter from './PixelCharacter'
import '../css/AnimatedCharacter.css'

function AnimatedCharacter({ character, scale = 2.5 }) {
  const containerRef = useRef(null)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!character) return

    // 根据职业生成不同的粒子特效
    const generateParticles = () => {
      const newParticles = []
      const particleCount = character.id === 'mage' ? 15 : character.id === 'archer' ? 8 : 5

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
    const interval = setInterval(generateParticles, 5000)

    return () => clearInterval(interval)
  }, [character])

  if (!character) return null

  const getAnimationClass = () => {
    switch (character.id) {
      case 'warrior':
        return 'warrior-idle'
      case 'archer':
        return 'archer-idle'
      case 'mage':
        return 'mage-idle'
      default:
        return ''
    }
  }

  const getParticleClass = () => {
    switch (character.id) {
      case 'warrior':
        return 'warrior-particle'
      case 'archer':
        return 'archer-particle'
      case 'mage':
        return 'mage-particle'
      default:
        return ''
    }
  }

  return (
    <div className="animated-character-container" ref={containerRef}>
      {/* 特效层 - 背景 */}
      <div className={`effect-layer effect-background ${character.id}-effect-bg`}>
        {character.id === 'warrior' && (
          <>
            <div className="warrior-aura"></div>
            <div className="warrior-glow"></div>
            <div className="warrior-skull-eyes"></div>
            <div className="warrior-blood-pool"></div>
          </>
        )}
        {character.id === 'archer' && (
          <>
            <div className="archer-wind"></div>
            <div className="archer-pumpkin-eyes"></div>
            <div className="archer-pumpkin-mouth"></div>
          </>
        )}
        {character.id === 'mage' && (
          <>
            <div className="mage-aura"></div>
            <div className="mage-circle circle-1"></div>
            <div className="mage-circle circle-2"></div>
            <div className="mage-eyes-glow"></div>
          </>
        )}
      </div>

      {/* 角色层 */}
      <div className={`character-layer ${getAnimationClass()}`}>
        <PixelCharacter 
          classId={character.id}
          gender={character.customization.gender}
          customization={character.customization}
          scale={scale}
        />
      </div>

      {/* 粒子特效层 */}
      <div className="particle-layer">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`particle ${getParticleClass()}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* 前景特效层 */}
      <div className={`effect-layer effect-foreground ${character.id}-effect-fg`}>
        {character.id === 'warrior' && (
          <>
            <div className="warrior-sparks">
              <div className="spark spark-1"></div>
              <div className="spark spark-2"></div>
              <div className="spark spark-3"></div>
            </div>
            <div className="warrior-souls">
              <div className="soul soul-1">💀</div>
              <div className="soul soul-2">💀</div>
              <div className="soul soul-3">☠</div>
            </div>
          </>
        )}
        {character.id === 'archer' && (
          <div className="archer-bats">
            <div className="bat bat-1">🦇</div>
            <div className="bat bat-2">🦇</div>
            <div className="bat bat-3">🦇</div>
          </div>
        )}
        {character.id === 'mage' && (
          <div className="mage-hearts">
            <div className="heart heart-1">🖤</div>
            <div className="heart heart-2">🖤</div>
            <div className="heart heart-3">💔</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnimatedCharacter
