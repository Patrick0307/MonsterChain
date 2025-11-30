import { useState, useEffect } from 'react'
import '../css/CharacterNaming.css'
import AnimatedCharacter from './AnimatedCharacter'
import { createPlayerOnChain } from '../utils/suiClient'

function CharacterNaming({ character, onNamingComplete, onBack }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [characterScale, setCharacterScale] = useState(2.5)

  // 响应式缩放
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth
      const isLandscape = window.innerWidth > window.innerHeight
      
      if (width >= 1400) {
        setCharacterScale(3)
      } else if (width >= 768 && isLandscape) {
        setCharacterScale(1.8)
      } else if (width >= 480) {
        setCharacterScale(2.5)
      } else {
        setCharacterScale(2)
      }
    }
    
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const handleNameChange = (e) => {
    const value = e.target.value
    setName(value)
    setError('')
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }
    
    if (name.length < 3) {
      setError('Name must be at least 3 characters')
      return
    }
    
    if (name.length > 20) {
      setError('Name must be less than 20 characters')
      return
    }

    setIsRegistering(true)
    setError('')

    try {
      // Get Sui wallet
      if (!window.suiWallet) {
        throw new Error('Please connect your wallet first')
      }

      // Register to blockchain
      console.log('Registering character to blockchain...')
      console.log('Character customization:', character.customization)
      console.log('Character class name:', character.name)
      const result = await createPlayerOnChain(
        name.trim(),
        character.name, // className (Mage, Warrior, Archer)
        window.suiWallet,
        character.customization // 传递角色自定义数据
      )

      console.log('Registration successful!', result)

      // 提取玩家对象 ID
      const playerObjectId = result.effects?.created?.[0]?.reference?.objectId

      // 将stats展开到顶层，确保与已有角色的数据结构一致
      const finalCharacter = {
        ...character,
        name: name.trim(),
        hp: character.stats.hp,
        max_hp: character.stats.hp,
        attack: character.stats.attack,
        defense: character.stats.defense,
        level: 1,
        exp: 0,
        playerObjectId, // 保存玩家对象 ID
        txDigest: result.digest // 保存交易哈希
      }
      
      onNamingComplete(finalCharacter)
    } catch (err) {
      console.error('Registration failed:', err)
      setError(err.message || 'Registration failed, please try again')
    } finally {
      setIsRegistering(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="character-naming">
      {/* 血雨效果 */}
      <div className="blood-rain-container">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="blood-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`
            }}
          />
        ))}
      </div>

      <h1 className="naming-title">Name Your Hero</h1>
      
      <div className="naming-container">
        <div className="character-preview">
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <AnimatedCharacter 
              character={character}
              scale={characterScale}
            />
          </div>
          
          <div className="character-info">
            <p className="character-class">{character.name}</p>
            <div className="character-stats-mini">
              <span>HP: {character.stats.hp}</span>
              <span>ATK: {character.stats.attack}</span>
              <span>DEF: {character.stats.defense}</span>
            </div>
          </div>
        </div>

        <div className="naming-form">
          <div className="class-description-box">
            <h3 className="description-title">{character.name}</h3>
            <p className="description-text">{character.description}</p>
          </div>

          <div className="naming-rules">
            <h4 className="rules-title">Naming Rules</h4>
            <ul className="rules-list">
              <li>3-20 characters</li>
              <li>Letters & numbers</li>
              <li>Cannot Change!</li>
            </ul>
          </div>

          <label htmlFor="character-name">Character Name</label>
          <input
            id="character-name"
            type="text"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your hero's name"
            maxLength={20}
            autoFocus
          />
          
          {error && <p className="error-text">{error}</p>}
          
          <div className="name-length">
            {name.length}/20 characters
          </div>

          <div className="button-group-naming">
            <button 
              className="back-button-naming" 
              onClick={onBack}
              disabled={isRegistering}
            >
              Back
            </button>
            <button 
              className="start-button" 
              onClick={handleSubmit}
              disabled={!name.trim() || isRegistering}
            >
              {isRegistering ? 'Registering...' : 'Start Adventure'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterNaming
