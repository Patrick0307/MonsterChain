import '../../css/maps/MapUI.css'

function MapUI({ character, playerPos, tileSize, onExit, playerCurrentHp, playerWeapon, onOpenInventory, onOpenMarketplace }) {
  // 计算玩家总攻击力
  const weaponAttack = playerWeapon ? playerWeapon.attack : 0
  const totalAttack = (character.attack || 0) + weaponAttack
  const maxHp = character.max_hp || character.hp || 100
  const currentHp = playerCurrentHp !== undefined ? playerCurrentHp : maxHp
  const hpPercentage = (currentHp / maxHp) * 100

  return (
    <div className="mapui-game-container">
      {/* 左上角 - 玩家信息卡片 */}
      <div className="mapui-player-card">
        {/* 装饰角 */}
        <div className="mapui-corner mapui-corner-tl"></div>
        <div className="mapui-corner mapui-corner-tr"></div>
        <div className="mapui-corner mapui-corner-bl"></div>
        <div className="mapui-corner mapui-corner-br"></div>
        
        {/* 生命值条 */}
        <div className="mapui-stat-row">
          <span className="mapui-stat-icon">🩸</span>
          <span className="mapui-stat-label">HP</span>
          <div className="mapui-stat-bar">
            <div className="mapui-stat-bar-fill mapui-hp-fill" style={{ width: `${hpPercentage}%` }}>
              <div className="mapui-bar-shine"></div>
            </div>
            <div className="mapui-stat-value">{currentHp} / {maxHp}</div>
          </div>
        </div>

        {/* 攻击力 */}
        <div className="mapui-stat-row">
          <span className="mapui-stat-icon">💀</span>
          <span className="mapui-stat-label">ATK</span>
          <div className="mapui-attack-info">
            <span className="mapui-attack-total">{totalAttack}</span>
            {weaponAttack > 0 && (
              <span className="mapui-attack-detail">({character.attack || 0} + {weaponAttack})</span>
            )}
          </div>
        </div>
      </div>

      {/* 右上角 - 功能按钮 */}
      <div className="mapui-action-buttons">
        <button onClick={onOpenInventory} className="mapui-action-btn mapui-inventory-btn">
          <div className="mapui-btn-inner">
            <div className="mapui-btn-face mapui-btn-front">
              <span className="mapui-btn-icon">⚰️</span>
            </div>
            <div className="mapui-btn-face mapui-btn-back">
              <div className="mapui-btn-label">
                <div>BAG</div>
                <div>(I)</div>
              </div>
            </div>
          </div>
        </button>
        <button onClick={onOpenMarketplace} className="mapui-action-btn mapui-market-btn">
          <div className="mapui-btn-inner">
            <div className="mapui-btn-face mapui-btn-front">
              <span className="mapui-btn-icon">🪦</span>
            </div>
            <div className="mapui-btn-face mapui-btn-back">
              <div className="mapui-btn-label">
                <div>SHOP</div>
                <div>(M)</div>
              </div>
            </div>
          </div>
        </button>
        <button onClick={onExit} className="mapui-action-btn mapui-exit-btn">
          <div className="mapui-btn-inner">
            <div className="mapui-btn-face mapui-btn-front">
              <span className="mapui-btn-icon">☠️</span>
            </div>
            <div className="mapui-btn-face mapui-btn-back">
              <div className="mapui-btn-label">
                <div>EXIT</div>
                <div>(ESC)</div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* 底部 - 控制提示 */}
      <div className="mapui-controls-hint"></div>
    </div>
  )
}

export default MapUI
