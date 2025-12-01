import { useState, useEffect } from 'react'
import '../css/CharacterCustomization.css'
import AnimatedCharacter from './AnimatedCharacter'

function CharacterCustomization({ characterClass, onCustomizationComplete, onBack }) {
  // 特殊角色风格的默认值
  const isWarrior = characterClass.id === 'warrior'
  const isArcher = characterClass.id === 'archer'
  const isMage = characterClass.id === 'mage'
  
  const [customization, setCustomization] = useState({
    gender: 'male',
    skinColor: isWarrior ? '#d4c4a8' :   // 战士用骨头色
               isArcher ? '#ff8c00' :     // 射手用南瓜橙色
               isMage ? '#e8c4c4' :       // 法师用魅魔苍白肤色
               '#ffd4a3',
    hairStyle: (isWarrior || isArcher) ? 'frontponytail' : 
               isMage ? 'long' : 'short',
    hairColor: isWarrior ? '#1a1a1a' : 
               isMage ? '#1a0a1a' : '#000000',
    clothesStyle: 'default',
    clothesColor: isWarrior ? '#4a0000' : 
                  isArcher ? '#228b22' : '#4b0082',
    shoesColor: (isWarrior || isArcher || isMage) ? '#1a1a1a' : '#4a4a4a'
  })
  const [characterScale, setCharacterScale] = useState(3)

  // 响应式缩放
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth
      const isLandscape = window.innerWidth > window.innerHeight
      
      if (width >= 1400) {
        setCharacterScale(4)
      } else if (width >= 900) {
        setCharacterScale(3)
      } else if (width >= 768 && isLandscape) {
        setCharacterScale(2)
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

  const hairStyles = customization.gender === 'male' 
    ? ['short', 'long', 'topknot', 'frontponytail']
    : ['short', 'long', 'bun', 'frontponytail', 'braids']

  const handleChange = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleConfirm = () => {
    onCustomizationComplete({
      ...characterClass,
      customization
    })
  }

  return (
    <div className="character-customization">
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

      {/* 标题 */}
      <div className="title-section">
        <h1 className="customization-title">
          <span className="title-main">Customize Your {characterClass.name}</span>
        </h1>
        <div className="title-decoration">
          <div className="decoration-line left"></div>
          <div className="decoration-center">☠</div>
          <div className="decoration-line right"></div>
        </div>
      </div>
      
      {/* 主内容区 */}
      <div className="customization-main">
        {/* 左侧预览 */}
        <div className="preview-section">
          <div className="preview-frame">
            <div className="frame-corners">
              <span className="corner top-left">☠</span>
              <span className="corner top-right">☠</span>
              <span className="corner bottom-left">☠</span>
              <span className="corner bottom-right">☠</span>
            </div>
            <AnimatedCharacter 
              character={{
                ...characterClass,
                customization
              }}
              scale={characterScale}
            />
          </div>
        </div>

        {/* 右侧选项 */}
        <div className="options-section">
          {/* Gender */}
          <div className="option-card">
            <h3 className="option-title">Gender</h3>
            <div className="button-row">
              <button 
                className={`option-btn ${customization.gender === 'male' ? 'selected' : ''}`}
                onClick={() => handleChange('gender', 'male')}
              >
                Male
              </button>
              <button 
                className={`option-btn ${customization.gender === 'female' ? 'selected' : ''}`}
                onClick={() => handleChange('gender', 'female')}
              >
                Female
              </button>
            </div>
          </div>

          {/* Hair Style */}
          <div className="option-card">
            <h3 className="option-title">Hair Style</h3>
            <div className="button-row">
              {hairStyles.map(style => (
                <button 
                  key={style}
                  className={`option-btn ${customization.hairStyle === style ? 'selected' : ''}`}
                  onClick={() => handleChange('hairStyle', style)}
                >
                  {style === 'short' ? 'Short' : 
                   style === 'long' ? 'Long' : 
                   style === 'bun' ? 'Bun' : 
                   style === 'frontponytail' ? 'Bald' :
                   style === 'braids' ? 'Braids' : 'Topknot'}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Grid */}
          <div className="colors-grid">
            <div className="color-card">
              <h3 className="color-title">
                {isWarrior ? 'Bone Color' : isArcher ? 'Pumpkin Color' : isMage ? 'Skin Tone' : 'Skin Color'}
              </h3>
              <input 
                type="color" 
                value={customization.skinColor}
                onChange={(e) => handleChange('skinColor', e.target.value)}
                className="color-picker"
              />
            </div>

            <div className="color-card">
              <h3 className="color-title">
                {isArcher ? 'Vine Color' : 'Hair Color'}
              </h3>
              <input 
                type="color" 
                value={customization.hairColor}
                onChange={(e) => handleChange('hairColor', e.target.value)}
                className="color-picker"
              />
            </div>

            <div className="color-card">
              <h3 className="color-title">
                {isWarrior ? 'Armor Color' : isArcher ? 'Cape Color' : isMage ? 'Corset Color' : 'Clothes Color'}
              </h3>
              <input 
                type="color" 
                value={customization.clothesColor}
                onChange={(e) => handleChange('clothesColor', e.target.value)}
                className="color-picker"
              />
            </div>

            <div className="color-card">
              <h3 className="color-title">
                {isMage ? 'Heels Color' : (isWarrior || isArcher) ? 'Boots Color' : 'Shoes Color'}
              </h3>
              <input 
                type="color" 
                value={customization.shoesColor}
                onChange={(e) => handleChange('shoesColor', e.target.value)}
                className="color-picker"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="action-section">
        <button className="custom-btn back-btn" onClick={onBack}>
          <span className="button-text">Back to Selection</span>
        </button>
        <button className="custom-btn confirm-btn" onClick={handleConfirm}>
          <span className="button-text">Continue to Naming</span>
        </button>
      </div>
    </div>
  )
}

export default CharacterCustomization
