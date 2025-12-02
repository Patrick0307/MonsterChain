import { useState } from 'react'
import '../css/MapSelection.css'
import AnimatedCharacter from './AnimatedCharacter'
import RoomSelection from './RoomSelection'

function MapSelection({ character, onMapSelected }) {
  const [selectedMap, setSelectedMap] = useState(null)
  const [gameMode, setGameMode] = useState(null)
  const [showRoomSelection, setShowRoomSelection] = useState(false)
  const [roomData, setRoomData] = useState(null)

  const maps = [
    {
      id: 'forest',
      name: 'Haunted Forest',
      description: 'Cursed woods where lost souls wander eternally',
      difficulty: 'EASY',
      icon: '🪦',
      color: '#2d0000',
      locked: false,
      rewards: {
        swords: ['Iron Sword', 'Azure Edge Sword', 'Dragon Roar Sword'],
        bows: ['Hunter Bow', 'Swift Wind Bow', 'Cloud Piercer Bow'],
        staves: ['Wooden Stave', 'Starlight Stave', 'Primordial Stave']
      },
      enemies: [
        'Verdant Guardian',
        'Shadow Stalker'
      ]
    },
    {
      id: 'mountain',
      name: 'Bone Peak',
      description: 'Frozen graveyard of ancient warriors',
      difficulty: 'MEDIUM',
      icon: '💀',
      color: '#3a0000',
      locked: true,
      unlockRequirement: 'Comming Soon',
      rewards: {
        swords: ['Iron Sword', 'Azure Edge Sword', 'Dragon Roar Sword'],
        bows: ['Hunter Bow', 'Swift Wind Bow', 'Cloud Piercer Bow'],
        staves: ['Wooden Stave', 'Starlight Stave', 'Primordial Stave']
      },
      enemies: [
        'Frost Behemoth',
        'Ice Wraith'
      ]
    },
    {
      id: 'desert',
      name: 'Blood Wasteland',
      description: 'Crimson sands soaked with the blood of fallen',
      difficulty: 'HARD',
      icon: '☠️',
      color: '#4a0000',
      locked: true,
      unlockRequirement: 'Comming Soon',
      rewards: {
        swords: ['Iron Sword', 'Azure Edge Sword', 'Dragon Roar Sword'],
        bows: ['Hunter Bow', 'Swift Wind Bow', 'Cloud Piercer Bow'],
        staves: ['Wooden Stave', 'Starlight Stave', 'Primordial Stave']
      },
      enemies: [
        'Sandstorm Titan',
        'Dune Phantom'
      ]
    }
  ]

  const handleMapClick = (map) => {
    if (!map.locked) {
      setSelectedMap(map.id)
    }
  }

  const selectedMapData = maps.find(m => m.id === selectedMap)

  const handleConfirm = () => {
    if (selectedMap && gameMode) {
      if (gameMode === 'single') {
        onMapSelected(selectedMap, null)
      } else {
        setShowRoomSelection(true)
      }
    }
  }

  const handleRoomJoined = (roomId, mapName, players, isHost, hostId, monsters) => {
    setRoomData({ roomId, players, isHost, hostId, monsters })
    onMapSelected(mapName, roomId, players, isHost, hostId, monsters)
  }

  if (showRoomSelection) {
    return (
      <RoomSelection 
        character={character}
        onRoomJoined={handleRoomJoined}
        onBack={() => setShowRoomSelection(false)}
      />
    )
  }

  return (
    <div className="map-selection-new">
      {/* 马赛克背景层 */}
      <div className="mosaic-bg"></div>
      <div className="mosaic-overlay"></div>
      
      {/* 魔法圆环 */}
      <div className="magic-circle"></div>
      
      {/* 血雨效果容器 */}
      <div className="blood-rain-container">
        {[...Array(40)].map((_, i) => (
          <div
            key={`blood-${i}`}
            className="blood-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* 顶部标题区 */}
      <div className="title-section">
        <div className="title-decoration-top"></div>
        <h1 className="main-title">
          <span className="title-line"></span>
          <span className="title-text">CHOOSE YOUR ADVENTURE</span>
          <span className="title-line"></span>
        </h1>
        <div className="title-decoration-bottom"></div>
      </div>

      {/* 左侧栏 */}
      <div className="left-sidebar">
        {/* 角色信息卡片 */}
        <div className="character-card">
          <div className="card-corner tl"></div>
          <div className="card-corner tr"></div>
          <div className="card-corner bl"></div>
          <div className="card-corner br"></div>
          
          <div className="character-display">
            <div className="character-avatar">
              <AnimatedCharacter character={character} scale={1.5} />
            </div>
            <div className="character-details">
              <div className="character-name">{character.name}</div>
              <div className="character-class">{character.class}</div>
              {character.playerObjectId && (
                <div className="character-id">
                  ID: {character.playerObjectId.slice(0, 8)}...{character.playerObjectId.slice(-6)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 游戏模式选择 */}
        <div className="mode-section">
          <div className="section-label">GAME MODE</div>
          <div className="mode-grid">
            <div 
              className={`mode-tile ${gameMode === 'single' ? 'active' : ''}`}
              onClick={() => setGameMode('single')}
            >
              <div className="mode-icon">🩸</div>
              <div className="mode-name">SOLO</div>
              <div className="mode-pixels"></div>
            </div>
            <div 
              className={`mode-tile ${gameMode === 'multi' ? 'active' : ''}`}
              onClick={() => setGameMode('multi')}
            >
              <div className="mode-icon">👻</div>
              <div className="mode-name">MULTIPLAYER</div>
              <div className="mode-pixels"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧主内容区 - 左右分栏布局 */}
      <div className="right-content">
        {/* 左侧地图列表 */}
        <div className="maps-list-section">
          <div className="maps-list">
            {maps.map((map, index) => (
              <div
                key={map.id}
                className={`map-list-item ${selectedMap === map.id ? 'active' : ''} ${map.locked ? 'locked' : ''}`}
                onClick={() => handleMapClick(map)}
                style={{ '--map-color': map.color }}
              >
                <div className="map-list-bg"></div>
                
                {map.locked && (
                  <div className="lock-badge">
                    <span className="lock-icon-small">⚰️</span>
                  </div>
                )}
                
                <div className="map-list-icon" style={{ opacity: map.locked ? 0.3 : 1 }}>{map.icon}</div>
                <div className="map-list-info">
                  <div className="map-list-name" style={{ opacity: map.locked ? 0.5 : 1 }}>{map.name}</div>
                  <div className="map-list-difficulty">
                    <span className="difficulty-badge">{map.difficulty}</span>
                    {map.locked && <span className="locked-text">{map.unlockRequirement}</span>}
                  </div>
                </div>
                
                <div className="map-list-arrow">▶</div>
                <div className="map-list-pixels"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧地图详情信息区 */}
        <div className="map-details-section">
          {selectedMapData ? (
            <div className="map-details">
              <div className="details-header">
                <span className="details-icon">{selectedMapData.icon}</span>
                <div className="details-header-info">
                  <span className="details-title">{selectedMapData.name}</span>
                  <span className="details-desc">{selectedMapData.description}</span>
                </div>
              </div>

              <div className="details-content">
                <div className="details-section enemies-section">
                  <div className="section-title">💀 ENEMIES</div>
                  <div className="section-list">
                    {selectedMapData.enemies.map((enemy, i) => (
                      <div key={i} className="list-item">☠ {enemy}</div>
                    ))}
                  </div>
                </div>

                <div className="details-section rewards-section">
                  <div className="section-title">🩸 WEAPON DROPS</div>
                  <div className="rewards-columns">
                    <div className="reward-column">
                      <div className="reward-category">🗡️ Swords</div>
                      {selectedMapData.rewards.swords.map((sword, i) => (
                        <div key={i} className="list-item">☠ {sword}</div>
                      ))}
                    </div>
                    <div className="reward-column">
                      <div className="reward-category">🏹 Bows</div>
                      {selectedMapData.rewards.bows.map((bow, i) => (
                        <div key={i} className="list-item">☠ {bow}</div>
                      ))}
                    </div>
                    <div className="reward-column">
                      <div className="reward-category">🔮 Staves</div>
                      {selectedMapData.rewards.staves.map((stave, i) => (
                        <div key={i} className="list-item">☠ {stave}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="map-details-placeholder">
              <div className="placeholder-icon">🗺️</div>
              <div className="placeholder-text">SELECT A MAP</div>
            </div>
          )}
        </div>
      </div>

      {/* 确认按钮 */}
      <div className="action-section">
        <button 
          className={`confirm-btn ${(!selectedMap || !gameMode) ? 'disabled' : ''}`}
          onClick={handleConfirm}
          disabled={!selectedMap || !gameMode}
        >
          <span className="btn-bg"></span>
          <span className="btn-text">
            {selectedMap && gameMode 
              ? (gameMode === 'multi' ? '▶ SELECT ROOM' : '▶ ENTER MAP') 
              : 'SELECT MODE & MAP'}
          </span>
          <span className="btn-shine"></span>
        </button>
      </div>
    </div>
  )
}

export default MapSelection
