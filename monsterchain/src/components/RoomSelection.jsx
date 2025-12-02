import { useState, useEffect } from 'react'
import websocketClient from '../services/websocketClient'
import '../css/RoomSelection.css'

function RoomSelection({ character, onRoomJoined, onBack }) {
  const [mode, setMode] = useState('menu') // 'menu', 'create', 'join', 'public'
  const [roomId, setRoomId] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [publicRooms, setPublicRooms] = useState([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // 连接 WebSocket
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
    
    websocketClient.connect(wsUrl).catch(err => {
      console.error('Failed to connect WebSocket:', err)
      setError('Unable to connect to server')
    })

    // 监听房间创建成功
    websocketClient.on('room_created', (data) => {
      console.log('Room created:', data)
      setIsConnecting(false)
      // 创建者就是主机
      onRoomJoined(data.roomId, data.mapName, [], true, null, []) // players, isHost, hostId, monsters
    })

    // 监听加入房间成功
    websocketClient.on('room_joined', (data) => {
      console.log('Room joined:', data)
      console.log('Players in room:', data.players)
      console.log('Is host:', data.isHost)
      console.log('Monsters from server:', data.monsters?.length || 0)
      setIsConnecting(false)
      onRoomJoined(data.roomId, 'forest', data.players, data.isHost, data.hostId, data.monsters || [])
    })

    // 监听公开房间列表
    websocketClient.on('public_rooms', (data) => {
      setPublicRooms(data.rooms)
    })

    // 监听错误
    websocketClient.on('error', (data) => {
      const message = data?.message || 'Unknown error occurred'
      // Friendly error messages
      if (message.includes('Room is full')) {
        setError('Room is full (Max 2 players)')
      } else if (message.includes('Room not found')) {
        setError('Room not found, check room ID')
      } else {
        setError(message)
      }
      setIsConnecting(false)
    })

    return () => {
      // 清理监听器
      websocketClient.off('room_created')
      websocketClient.off('room_joined')
      websocketClient.off('public_rooms')
      websocketClient.off('error')
    }
  }, [onRoomJoined])

  const handleCreateRoom = () => {
    if (isConnecting) return

    setIsConnecting(true)
    setError('')

    const playerId = window.currentWalletAddress || character.owner
    const playerData = {
      name: character.name,
      classId: character.id,
      hp: character.hp,
      attack: character.attack,
      customization: character.customization // Include character customization for appearance sync
    }

    websocketClient.createRoom(playerId, playerData, 'forest', isPublic)
  }

  const handleJoinRoom = (targetRoomId) => {
    if (isConnecting) return

    const finalRoomId = targetRoomId || roomId.trim()
    
    if (!finalRoomId) {
      setError('Please enter room ID')
      return
    }

    setIsConnecting(true)
    setError('')

    const playerId = window.currentWalletAddress || character.owner
    const playerData = {
      name: character.name,
      classId: character.id,
      hp: character.hp,
      attack: character.attack,
      customization: character.customization // Include character customization for appearance sync
    }

    console.log('🔍 Joining room:', finalRoomId, 'as player:', playerId)
    websocketClient.joinRoom(finalRoomId, playerId, playerData)
  }

  const handleShowPublicRooms = () => {
    setMode('public')
    websocketClient.getPublicRooms()
  }

  const renderMenu = () => (
    <div className="room-menu">
      <h2>👻 MULTIPLAYER</h2>
      
      <div className="menu-buttons">
        <button 
          className="menu-button create"
          onClick={() => setMode('create')}
        >
          <span className="button-icon">⚰️</span>
          <span className="button-text">CREATE ROOM</span>
        </button>

        <button 
          className="menu-button join"
          onClick={() => setMode('join')}
        >
          <span className="button-icon">🗝️</span>
          <span className="button-text">JOIN ROOM</span>
        </button>

        <button 
          className="menu-button public"
          onClick={handleShowPublicRooms}
        >
          <span className="button-icon">💀</span>
          <span className="button-text">PUBLIC ROOMS</span>
        </button>

        <button 
          className="menu-button back"
          onClick={onBack}
        >
          <span className="button-icon">🩸</span>
          <span className="button-text">BACK</span>
        </button>
      </div>
    </div>
  )

  const renderCreate = () => (
    <div className="room-create">
      <h2>⚰️ CREATE ROOM</h2>
      
      <div className="create-options">
        <div className="option-group">
          <label>☠ ROOM TYPE:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                checked={isPublic} 
                onChange={() => setIsPublic(true)}
              />
              <span>PUBLIC (Visible to all)</span>
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                checked={!isPublic} 
                onChange={() => setIsPublic(false)}
              />
              <span>PRIVATE (Requires room ID)</span>
            </label>
          </div>
        </div>

        <div className="option-info">
          <p>🪦 MAP: Haunted Forest</p>
          <p>💀 CHARACTER: {character.name} ({character.id})</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="action-buttons">
        <button 
          className="action-button primary"
          onClick={handleCreateRoom}
          disabled={isConnecting}
        >
          {isConnecting ? 'SUMMONING...' : 'CREATE & ENTER'}
        </button>
        <button 
          className="action-button secondary"
          onClick={() => setMode('menu')}
          disabled={isConnecting}
        >
          BACK
        </button>
      </div>
    </div>
  )

  const renderJoin = () => (
    <div className="room-join">
      <h2>🗝️ JOIN ROOM</h2>
      
      <div className="join-form">
        <label>☠ ROOM ID:</label>
        <input 
          type="text"
          className="room-input"
          placeholder="ENTER 8-DIGIT ROOM ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          maxLength={8}
          disabled={isConnecting}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="action-buttons">
        <button 
          className="action-button primary"
          onClick={() => handleJoinRoom()}
          disabled={isConnecting || !roomId.trim()}
        >
          {isConnecting ? 'ENTERING...' : 'JOIN ROOM'}
        </button>
        <button 
          className="action-button secondary"
          onClick={() => setMode('menu')}
          disabled={isConnecting}
        >
          BACK
        </button>
      </div>
    </div>
  )

  const renderPublic = () => (
    <div className="room-public">
      <h2>💀 PUBLIC ROOMS</h2>
      
      <div className="rooms-list">
        {publicRooms.length === 0 ? (
          <div className="no-rooms">
            <p>NO SOULS FOUND...</p>
            <p>SUMMON A NEW ROOM!</p>
          </div>
        ) : (
          publicRooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-info">
                <div className="room-id">☠ ROOM: {room.id}</div>
                <div className="room-map">🪦 MAP: {room.mapName}</div>
                <div className="room-players">
                  👻 SOULS: {room.playerCount}/{room.maxPlayers}
                </div>
              </div>
              <button 
                className="join-button"
                onClick={() => handleJoinRoom(room.id)}
                disabled={isConnecting || room.playerCount >= room.maxPlayers}
              >
                {room.playerCount >= room.maxPlayers ? 'SEALED' : 'ENTER'}
              </button>
            </div>
          ))
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="action-buttons">
        <button 
          className="action-button secondary"
          onClick={() => setMode('menu')}
          disabled={isConnecting}
        >
          BACK
        </button>
      </div>
    </div>
  )

  return (
    <div className="room-selection-container">
      {/* 血雨效果 */}
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

      <div className="room-selection-content">
        {mode === 'menu' && renderMenu()}
        {mode === 'create' && renderCreate()}
        {mode === 'join' && renderJoin()}
        {mode === 'public' && renderPublic()}
      </div>
    </div>
  )
}

export default RoomSelection
