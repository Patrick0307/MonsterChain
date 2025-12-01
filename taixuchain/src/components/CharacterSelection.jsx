import { useState, useEffect } from 'react'
import '../css/CharacterSelection.css'
import AnimatedCharacter from './AnimatedCharacter'
import WalletRegistration from './WalletRegistration'

function CharacterSelection({ onCharacterSelected, onWalletConnected, shouldShowSelection = false }) {
  const [showWalletRegistration, setShowWalletRegistration] = useState(!shouldShowSelection)
  const [selectedClass, setSelectedClass] = useState(null)
  const [hoveredClass, setHoveredClass] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [characterScale, setCharacterScale] = useState(1.8)

  // 监听 shouldShowSelection 变化
  useEffect(() => {
    if (shouldShowSelection) {
      setShowWalletRegistration(false)
    }
  }, [shouldShowSelection])

  // 响应式缩放
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth
      if (width >= 1400) {
        setCharacterScale(2.2)
      } else if (width >= 900) {
        setCharacterScale(1.8)
      } else if (width >= 480) {
        setCharacterScale(1.5)
      } else {
        setCharacterScale(1.3)
      }
    }
    
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const classes = [
    {
      id: 'warrior',
      name: 'Death Knight',
      description: 'Risen from the grave, bound by dark magic',
      stats: { hp: 500, attack: 15 },
      color: '#4a0000'
    },
    {
      id: 'archer',
      name: 'Pumpkin Hunter',
      description: 'A cursed soul trapped in a jack-o-lantern',
      stats: { hp: 500, attack: 18 },
      color: '#228b22'
    },
    {
      id: 'mage',
      name: 'Succubus',
      description: 'A seductive demon queen thirsting for blood',
      stats: { hp: 500, attack: 20 },
      color: '#4b0082'
    }
  ]

  useEffect(() => {
    // 入场动画
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSelect = (classData) => {
    if (selectedClass !== classData.id) {
      setSelectedClass(classData.id)
    }
  }

  const handleConfirm = () => {
    if (selectedClass) {
      const classData = classes.find(c => c.id === selectedClass)
      onCharacterSelected(classData)
    }
  }

  const handleWalletRegistrationSuccess = async (walletAddress) => {
    // 通知父组件钱包已连接，等待检查完成
    await onWalletConnected(walletAddress)
    // 检查完成后，如果还在这个组件（说明没有现有角色），则显示角色选择
    setShowWalletRegistration(false)
  }

  if (showWalletRegistration) {
    return <WalletRegistration onRegistrationSuccess={handleWalletRegistrationSuccess} />
  }

  return (
    <div className="character-selection">
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

      <div className="selection-content">
        {/* 标题区域 */}
          <h1 className="selection-title">
            <span className="title-main">Choose Your Fate</span>
          </h1>
          <div className="title-decoration">
            <div className="decoration-line left"></div>
            <div className="decoration-center">☠</div>
            <div className="decoration-line right"></div>
          </div>

        {/* 角色卡片容器 */}
        <div className="classes-grid">
          {classes.map((classData, index) => (
            <div
              key={classData.id}
              className={`class-card ${selectedClass === classData.id ? 'selected' : ''} ${hoveredClass === classData.id ? 'hovered' : ''}`}
              onClick={() => handleSelect(classData)}
              onMouseEnter={() => setHoveredClass(classData.id)}
              onMouseLeave={() => setHoveredClass(null)}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* 光环效果 */}
              <div className="card-aura"></div>
              
              {/* 卡片光效 */}
              <div className="card-glow"></div>
              <div className="card-shine"></div>
              
              {/* 角色展示区 */}
              <div className="character-display">
                <div className="character-frame">
                  <div className="frame-corners">
                    <span className="corner top-left">☠</span>
                    <span className="corner top-right">☠</span>
                    <span className="corner bottom-left">☠</span>
                    <span className="corner bottom-right">☠</span>
                  </div>
                  <AnimatedCharacter 
                    character={{
                      ...classData,
                      customization: {
                        gender: 'male',
                        skinColor: classData.id === 'warrior' ? '#d4c4a8' : 
                                   classData.id === 'archer' ? '#ff8c00' : 
                                   classData.id === 'mage' ? '#e8c4c4' : '#ffd4a3',
                        hairStyle: classData.id === 'warrior' ? 'frontponytail' : 
                                   classData.id === 'archer' ? 'frontponytail' : 
                                   classData.id === 'mage' ? 'long' : 'short',
                        hairColor: classData.id === 'mage' ? '#1a0a1a' : '#000000',
                        clothesStyle: 'default',
                        clothesColor: classData.color,
                        shoesColor: classData.id === 'warrior' ? '#2a2a2a' : 
                                    classData.id === 'archer' ? '#2a2a2a' : 
                                    classData.id === 'mage' ? '#1a1a1a' : '#4a4a4a'
                      }
                    }}
                    scale={characterScale}
                  />
                </div>
              </div>

              {/* 角色信息 */}
              <div className="character-info">
                <h2 className="class-name">
                  <span className="name-en">{classData.name}</span>
                </h2>
                
                <p className="class-description">{classData.description}</p>

                {/* 属性条 */}
                <div className="stats-container">
                  {Object.entries(classData.stats).map(([key, value]) => (
                    <div key={key} className="stat-row">
                      <span className="stat-label">{key.toUpperCase()}</span>
                      <div className="stat-bar-bg">
                        <div 
                          className="stat-bar-fill" 
                          style={{ 
                            width: `${(value / 20) * 100}%`,
                            animationDelay: `${index * 0.1}s`
                          }}
                        ></div>
                      </div>
                      <span className="stat-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 选中指示器 */}
              {selectedClass === classData.id && (
                <div className="selected-indicator">
                  <img src="/logo.png" alt="Selected" className="indicator-icon" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 确认按钮 */}
        {selectedClass && (
          <button className="selection-confirm-btn" onClick={handleConfirm}>
            <span className="button-text">Enter the Darkness</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default CharacterSelection
