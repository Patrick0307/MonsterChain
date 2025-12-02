import { useEffect, useRef } from 'react'

function MageCharacter({ gender, customization, scale = 2 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const pixel = (x, y, color) => {
      ctx.fillStyle = color
      ctx.fillRect(x, y, 1, 1)
    }
    
    const adjustBrightness = (color, amount) => {
      const hex = color.replace('#', '')
      const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
      const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
      const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }

    // 从customization获取颜色
    const skinColor = customization?.skinColor || '#e8c4c4'  // 魅魔苍白肤色
    const hairStyle = customization?.hairStyle || 'long'
    const hairColor = customization?.hairColor || '#1a0a1a'  // 深紫黑色
    const clothesColor = customization?.clothesColor || '#4b0082'
    const shoesColor = customization?.shoesColor || '#1a1a1a'
    
    // 魅魔颜色
    const darkSkin = adjustBrightness(skinColor, -30)
    const lightSkin = adjustBrightness(skinColor, 20)
    const clothesDark = adjustBrightness(clothesColor, -40)
    const clothesLight = adjustBrightness(clothesColor, 30)
    
    // 血色和邪恶效果
    const bloodRed = '#8b0000'
    const freshBlood = '#cc0000'
    const darkBlood = '#4a0000'
    const demonPurple = '#4b0082'
    const glowPurple = '#9400d3'

    // 绘制恶魔翅膀
    drawDemonWings(pixel, darkBlood, bloodRed)
    
    // 绘制魅魔身体
    drawSuccubusBody(pixel, skinColor, darkSkin, lightSkin, gender)
    
    // 绘制恶魔角
    drawDemonHorns(pixel, darkBlood, bloodRed)
    
    // 绘制头发
    drawSuccubusHair(pixel, adjustBrightness, hairStyle, hairColor, gender)
    
    // 绘制魅魔脸部
    drawSuccubusFace(pixel, adjustBrightness, skinColor, darkSkin, bloodRed, gender)
    
    // 绘制邪恶服装
    drawSuccubusClothes(pixel, clothesColor, clothesDark, clothesLight, bloodRed, freshBlood, gender)
    
    // 绘制靴子
    drawSuccubusBoots(pixel, shoesColor, adjustBrightness(shoesColor, -30))
    
    // 绘制恶魔尾巴
    drawDemonTail(pixel, darkSkin, bloodRed)
    
    // 绘制血迹效果
    drawBloodEffects(pixel, bloodRed, freshBlood, darkBlood)
    
  }, [gender, customization, scale])

  // 绘制恶魔翅膀
  const drawDemonWings = (pixel, darkBlood, bloodRed) => {
    // 左翅膀
    for (let i = 0; i < 5; i++) {
      const startX = 10 - i * 2
      const startY = 35 + i * 5
      // 翅膀骨架
      for (let j = 0; j < 15 - i * 2; j++) {
        pixel(startX + j, startY, darkBlood)
        pixel(startX + j, startY + 1, bloodRed)
      }
      // 翅膀膜
      for (let j = 0; j < 12 - i * 2; j++) {
        pixel(startX + j + 2, startY + 2, '#2a0a1a')
        pixel(startX + j + 2, startY + 3, '#1a0a0a')
      }
    }
    // 翅膀尖刺
    pixel(6, 32, bloodRed); pixel(5, 31, bloodRed); pixel(4, 30, darkBlood)
    pixel(8, 38, bloodRed); pixel(7, 37, bloodRed)
    pixel(10, 44, bloodRed); pixel(9, 43, bloodRed)
    
    // 右翅膀
    for (let i = 0; i < 5; i++) {
      const startX = 70 + i * 2
      const startY = 35 + i * 5
      for (let j = 0; j < 15 - i * 2; j++) {
        pixel(startX - j, startY, darkBlood)
        pixel(startX - j, startY + 1, bloodRed)
      }
      for (let j = 0; j < 12 - i * 2; j++) {
        pixel(startX - j - 2, startY + 2, '#2a0a1a')
        pixel(startX - j - 2, startY + 3, '#1a0a0a')
      }
    }
    pixel(74, 32, bloodRed); pixel(75, 31, bloodRed); pixel(76, 30, darkBlood)
    pixel(72, 38, bloodRed); pixel(73, 37, bloodRed)
    pixel(70, 44, bloodRed); pixel(71, 43, bloodRed)
  }

  // 绘制恶魔角
  const drawDemonHorns = (pixel, darkBlood, bloodRed) => {
    // 左角
    for (let i = 0; i < 8; i++) {
      pixel(28 - i, 12 - i, darkBlood)
      pixel(29 - i, 12 - i, bloodRed)
      pixel(30 - i, 13 - i, darkBlood)
    }
    pixel(20, 4, bloodRed); pixel(21, 5, bloodRed)
    
    // 右角
    for (let i = 0; i < 8; i++) {
      pixel(52 + i, 12 - i, darkBlood)
      pixel(51 + i, 12 - i, bloodRed)
      pixel(50 + i, 13 - i, darkBlood)
    }
    pixel(60, 4, bloodRed); pixel(59, 5, bloodRed)
  }


  // 绘制魅魔身体
  const drawSuccubusBody = (pixel, skinColor, darkSkin, lightSkin, gender) => {
    // 头部 - 精致的脸型
    for (let x = 28; x <= 52; x++) {
      for (let y = 14; y <= 36; y++) {
        if (x === 28 && (y < 18 || y > 32)) continue
        if (x === 29 && (y < 16 || y > 34)) continue
        if (x === 52 && (y < 18 || y > 32)) continue
        if (x === 51 && (y < 16 || y > 34)) continue
        pixel(x, y, skinColor)
      }
    }
    
    // 尖下巴
    for (let x = 36; x <= 44; x++) {
      pixel(x, 37, skinColor)
    }
    pixel(38, 38, skinColor); pixel(39, 38, skinColor)
    pixel(40, 38, skinColor); pixel(41, 38, skinColor)
    pixel(42, 38, skinColor)
    pixel(39, 39, skinColor); pixel(40, 39, skinColor); pixel(41, 39, skinColor)
    
    // 修长脖子
    for (let x = 36; x <= 44; x++) {
      for (let y = 40; y <= 44; y++) {
        pixel(x, y, skinColor)
      }
    }
    
    // 脸部高光
    pixel(30, 20, lightSkin); pixel(31, 20, lightSkin)
    pixel(50, 20, lightSkin); pixel(49, 20, lightSkin)
    
    // 纤细手臂
    for (let y = 48; y <= 66; y++) {
      for (let x = 20; x <= 24; x++) {
        pixel(x, y, skinColor)
      }
      for (let x = 56; x <= 60; x++) {
        pixel(x, y, skinColor)
      }
    }
    
    // 修长手指
    for (let x = 18; x <= 24; x++) {
      pixel(x, 67, skinColor)
      pixel(x, 68, darkSkin)
    }
    // 尖锐指甲
    pixel(18, 69, '#1a1a1a'); pixel(20, 69, '#1a1a1a')
    pixel(22, 69, '#1a1a1a'); pixel(24, 69, '#1a1a1a')
    
    for (let x = 56; x <= 62; x++) {
      pixel(x, 67, skinColor)
      pixel(x, 68, darkSkin)
    }
    pixel(56, 69, '#1a1a1a'); pixel(58, 69, '#1a1a1a')
    pixel(60, 69, '#1a1a1a'); pixel(62, 69, '#1a1a1a')
    
    // 修长腿部
    for (let y = 82; y <= 94; y++) {
      for (let x = 32; x <= 36; x++) {
        pixel(x, y, skinColor)
      }
      for (let x = 44; x <= 48; x++) {
        pixel(x, y, skinColor)
      }
    }
  }

  // 绘制魅魔头发
  const drawSuccubusHair = (pixel, adjustBrightness, hairStyle, hairColor, gender) => {
    const darkHair = adjustBrightness(hairColor, -30)
    const lightHair = adjustBrightness(hairColor, 30)
    
    // 基础头发
    for (let x = 26; x <= 54; x++) {
      for (let y = 10; y <= 16; y++) {
        pixel(x, y, hairColor)
      }
    }
    
    if (hairStyle === 'short') {
      for (let y = 17; y <= 24; y++) {
        pixel(26, y, hairColor); pixel(27, y, darkHair)
        pixel(53, y, darkHair); pixel(54, y, hairColor)
      }
    } else if (hairStyle === 'long') {
      // 长发飘逸
      for (let y = 17; y <= 55; y++) {
        pixel(24, y, hairColor); pixel(25, y, hairColor)
        pixel(26, y, darkHair); pixel(27, y, hairColor)
        pixel(53, y, hairColor); pixel(54, y, darkHair)
        pixel(55, y, hairColor); pixel(56, y, hairColor)
      }
      // 发尾
      for (let y = 50; y <= 55; y++) {
        pixel(23, y, darkHair); pixel(57, y, darkHair)
      }
    } else if (hairStyle === 'topknot' || hairStyle === 'bun') {
      // 高髻
      for (let x = 36; x <= 44; x++) {
        for (let y = 4; y <= 10; y++) {
          pixel(x, y, hairColor)
        }
      }
      pixel(40, 3, darkHair)
      for (let y = 17; y <= 28; y++) {
        pixel(26, y, hairColor); pixel(27, y, darkHair)
        pixel(53, y, darkHair); pixel(54, y, hairColor)
      }
    } else if (hairStyle === 'braids') {
      // 双辫
      for (let y = 17; y <= 55; y++) {
        if (y % 3 !== 0) {
          pixel(24, y, hairColor); pixel(25, y, darkHair)
          pixel(26, y, hairColor)
          pixel(54, y, hairColor); pixel(55, y, darkHair)
          pixel(56, y, hairColor)
        }
      }
    } else {
      // 默认中长发
      for (let y = 17; y <= 35; y++) {
        pixel(26, y, hairColor); pixel(27, y, darkHair)
        pixel(53, y, darkHair); pixel(54, y, hairColor)
      }
    }
  }


  // 绘制魅魔脸部
  const drawSuccubusFace = (pixel, adjustBrightness, skinColor, darkSkin, bloodRed, gender) => {
    // 邪魅的眼睛 - 大而妖艳
    // 左眼
    for (let x = 30; x <= 37; x++) {
      pixel(x, 22, '#ffffff')
      pixel(x, 23, '#ffffff')
      pixel(x, 24, '#ffffff')
    }
    // 瞳孔 - 红色邪恶
    pixel(33, 23, bloodRed); pixel(34, 23, '#ff0000')
    pixel(35, 23, bloodRed)
    pixel(33, 24, '#ff0000'); pixel(34, 24, '#ff3333')
    pixel(35, 24, '#ff0000')
    pixel(34, 25, bloodRed)
    // 眼线
    pixel(30, 25, '#1a1a1a'); pixel(37, 25, '#1a1a1a')
    pixel(29, 24, '#1a1a1a'); pixel(38, 24, '#1a1a1a')
    
    // 右眼
    for (let x = 43; x <= 50; x++) {
      pixel(x, 22, '#ffffff')
      pixel(x, 23, '#ffffff')
      pixel(x, 24, '#ffffff')
    }
    pixel(45, 23, bloodRed); pixel(46, 23, '#ff0000')
    pixel(47, 23, bloodRed)
    pixel(45, 24, '#ff0000'); pixel(46, 24, '#ff3333')
    pixel(47, 24, '#ff0000')
    pixel(46, 25, bloodRed)
    pixel(43, 25, '#1a1a1a'); pixel(50, 25, '#1a1a1a')
    pixel(42, 24, '#1a1a1a'); pixel(51, 24, '#1a1a1a')
    
    // 妖艳眉毛
    for (let x = 30; x <= 38; x++) {
      pixel(x, 18, darkSkin)
      pixel(x, 19, darkSkin)
    }
    pixel(29, 19, darkSkin); pixel(39, 18, darkSkin)
    
    for (let x = 42; x <= 50; x++) {
      pixel(x, 18, darkSkin)
      pixel(x, 19, darkSkin)
    }
    pixel(41, 18, darkSkin); pixel(51, 19, darkSkin)
    
    // 精致鼻子
    pixel(40, 27, darkSkin)
    pixel(40, 28, darkSkin)
    pixel(40, 29, darkSkin)
    pixel(39, 30, darkSkin); pixel(41, 30, darkSkin)
    
    // 性感红唇
    for (let x = 36; x <= 44; x++) {
      pixel(x, 33, bloodRed)
    }
    pixel(37, 34, bloodRed); pixel(38, 34, '#ff0000')
    pixel(39, 34, '#ff0000'); pixel(40, 34, '#ff3333')
    pixel(41, 34, '#ff0000'); pixel(42, 34, '#ff0000')
    pixel(43, 34, bloodRed)
    // 嘴角上扬（邪笑）
    pixel(35, 32, darkSkin); pixel(45, 32, darkSkin)
    
    // 尖牙
    pixel(38, 35, '#ffffff'); pixel(42, 35, '#ffffff')
    
    // 脸颊红晕
    pixel(29, 28, adjustBrightness('#ff6666', -20))
    pixel(30, 28, adjustBrightness('#ff6666', -20))
    pixel(31, 28, adjustBrightness('#ff6666', -20))
    pixel(51, 28, adjustBrightness('#ff6666', -20))
    pixel(50, 28, adjustBrightness('#ff6666', -20))
    pixel(49, 28, adjustBrightness('#ff6666', -20))
  }

  // 绘制魅魔服装
  const drawSuccubusClothes = (pixel, clothesColor, clothesDark, clothesLight, bloodRed, freshBlood, gender) => {
    // 紧身胸衣
    for (let x = 30; x <= 50; x++) {
      for (let y = 45; y <= 68; y++) {
        pixel(x, y, clothesColor)
      }
    }
    
    // 胸衣装饰
    for (let y = 48; y <= 65; y++) {
      pixel(30, y, clothesDark); pixel(50, y, clothesDark)
    }
    // 系带
    for (let y = 50; y <= 64; y += 3) {
      pixel(38, y, bloodRed); pixel(39, y, clothesLight)
      pixel(40, y, bloodRed); pixel(41, y, clothesLight)
      pixel(42, y, bloodRed)
    }
    
    // 肩带
    for (let x = 26; x <= 29; x++) {
      pixel(x, 45, clothesColor); pixel(x, 46, clothesDark)
    }
    for (let x = 51; x <= 54; x++) {
      pixel(x, 45, clothesColor); pixel(x, 46, clothesDark)
    }
    
    // 袖子（若隐若现）
    for (let y = 48; y <= 60; y++) {
      pixel(25, y, clothesDark); pixel(26, y, clothesColor)
      pixel(54, y, clothesColor); pixel(55, y, clothesDark)
    }
    
    // 腰带
    for (let x = 28; x <= 52; x++) {
      pixel(x, 68, bloodRed)
      pixel(x, 69, freshBlood)
      pixel(x, 70, bloodRed)
    }
    // 腰带扣（五芒星）
    pixel(39, 68, '#ffd700'); pixel(40, 68, '#ffd700'); pixel(41, 68, '#ffd700')
    pixel(40, 67, '#ffd700'); pixel(40, 69, '#ffd700')
    pixel(38, 69, '#ffd700'); pixel(42, 69, '#ffd700')
    
    // 短裙
    for (let y = 71; y <= 82; y++) {
      for (let x = 28; x <= 52; x++) {
        pixel(x, y, clothesColor)
      }
    }
    // 裙摆撕裂效果
    for (let x = 28; x <= 52; x += 4) {
      pixel(x, 83, clothesColor); pixel(x + 1, 84, clothesDark)
    }
    // 裙子装饰
    for (let y = 73; y <= 80; y += 2) {
      pixel(32, y, clothesLight); pixel(48, y, clothesLight)
    }
    
    // 血迹装饰
    pixel(34, 75, bloodRed); pixel(35, 76, freshBlood)
    pixel(46, 74, bloodRed); pixel(45, 75, freshBlood)
  }


  // 绘制魅魔靴子
  const drawSuccubusBoots = (pixel, bootColor, darkBoot) => {
    // 高跟靴
    // 左靴
    for (let x = 30; x <= 38; x++) {
      pixel(x, 95, bootColor)
      pixel(x, 96, bootColor)
      pixel(x, 97, darkBoot)
    }
    // 高跟
    pixel(30, 98, darkBoot); pixel(31, 98, darkBoot)
    pixel(30, 99, darkBoot)
    // 靴子装饰
    pixel(34, 95, '#8b0000')
    
    // 右靴
    for (let x = 42; x <= 50; x++) {
      pixel(x, 95, bootColor)
      pixel(x, 96, bootColor)
      pixel(x, 97, darkBoot)
    }
    pixel(49, 98, darkBoot); pixel(50, 98, darkBoot)
    pixel(50, 99, darkBoot)
    pixel(46, 95, '#8b0000')
  }

  // 绘制恶魔尾巴
  const drawDemonTail = (pixel, skinColor, bloodRed) => {
    // 尾巴从背后伸出
    for (let i = 0; i < 20; i++) {
      const x = 55 + Math.sin(i * 0.3) * 5
      const y = 70 + i
      pixel(Math.floor(x), y, skinColor)
      pixel(Math.floor(x) + 1, y, skinColor)
    }
    // 尾巴尖端（心形）
    pixel(58, 90, bloodRed); pixel(62, 90, bloodRed)
    pixel(57, 91, bloodRed); pixel(59, 91, bloodRed)
    pixel(61, 91, bloodRed); pixel(63, 91, bloodRed)
    pixel(58, 92, bloodRed); pixel(60, 92, bloodRed); pixel(62, 92, bloodRed)
    pixel(59, 93, bloodRed); pixel(61, 93, bloodRed)
    pixel(60, 94, bloodRed)
  }

  // 绘制血迹效果
  const drawBloodEffects = (pixel, bloodRed, freshBlood, darkBlood) => {
    // 嘴角血迹
    pixel(35, 35, bloodRed); pixel(34, 36, freshBlood)
    pixel(45, 35, bloodRed); pixel(46, 36, freshBlood)
    
    // 手指血迹
    pixel(18, 70, bloodRed); pixel(19, 71, freshBlood)
    pixel(62, 70, bloodRed); pixel(61, 71, freshBlood)
    
    // 裙摆血迹
    pixel(30, 82, bloodRed); pixel(31, 83, freshBlood)
    pixel(50, 82, bloodRed); pixel(49, 83, freshBlood)
  }

  return (
    <canvas 
      ref={canvasRef} 
      width={80} 
      height={100}
      style={{ 
        width: `${80 * scale}px`, 
        height: `${100 * scale}px`,
        imageRendering: 'pixelated',
        imageRendering: '-moz-crisp-edges',
        imageRendering: 'crisp-edges'
      }}
    />
  )
}

export default MageCharacter
