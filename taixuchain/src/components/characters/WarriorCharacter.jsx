import { useEffect, useRef } from 'react'

function WarriorCharacter({ gender, customization, scale = 2 }) {
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

    // 从customization获取颜色，应用恐怖风格变换
    const skinColor = customization?.skinColor || '#d4c4a8'
    const hairStyle = customization?.hairStyle || 'none'
    const hairColor = customization?.hairColor || '#1a1a1a'
    const clothesColor = customization?.clothesColor || '#4a0000'
    const shoesColor = customization?.shoesColor || '#2a2a2a'
    
    // 骷髅骨头颜色基于皮肤色调整
    const boneColor = adjustBrightness(skinColor, -20)
    const darkBone = adjustBrightness(skinColor, -60)
    const lightBone = adjustBrightness(skinColor, 20)
    
    // 血色效果
    const bloodRed = '#8b0000'
    const freshBlood = '#cc0000'
    const darkBlood = '#4a0000'
    
    // 盔甲颜色基于衣服颜色
    const armorColor = adjustBrightness(clothesColor, -30)
    const darkArmor = adjustBrightness(clothesColor, -60)
    const rustMetal = adjustBrightness(clothesColor, -40)
    
    // 布料颜色
    const tornCloth = adjustBrightness(clothesColor, -50)
    const darkCloth = adjustBrightness(clothesColor, -70)
    
    // 靴子颜色
    const bootColor = shoesColor
    const darkBoot = adjustBrightness(shoesColor, -30)
    
    // 眼睛发光颜色
    const eyeGlow = '#ff0000'
    const eyeGlowDark = '#990000'
    
    // 绘制骷髅头
    drawSkullHead(pixel, boneColor, darkBone, lightBone, bloodRed, freshBlood, eyeGlow, eyeGlowDark, gender)
    
    // 绘制头发（如果有）
    if (hairStyle && hairStyle !== 'none' && hairStyle !== 'frontponytail') {
      drawWarriorHair(pixel, adjustBrightness, hairStyle, hairColor, gender)
    }
    
    // 绘制骷髅身体
    drawSkeletonBody(pixel, boneColor, darkBone, lightBone, bloodRed, gender)
    
    // 绘制破烂盔甲
    drawTatteredArmor(pixel, armorColor, darkArmor, rustMetal, tornCloth, darkCloth, bloodRed, freshBlood, darkBlood, gender)
    
    // 绘制靴子
    drawBoots(pixel, bootColor, darkBoot)
    
    // 绘制血迹效果
    drawBloodEffects(pixel, bloodRed, freshBlood, darkBlood)
    
  }, [gender, customization, scale])

  // 绘制战士头发
  const drawWarriorHair = (pixel, adjustBrightness, hairStyle, hairColor, gender) => {
    const darkHair = adjustBrightness(hairColor, -30)
    const lightHair = adjustBrightness(hairColor, 20)
    
    if (hairStyle === 'short') {
      // 短发 - 稀疏的残发
      for (let x = 30; x <= 50; x += 2) {
        pixel(x, 8, darkHair)
        pixel(x, 9, hairColor)
        if (x % 4 === 0) pixel(x, 10, darkHair)
      }
      for (let x = 28; x <= 32; x++) {
        pixel(x, 10 + (x - 28), darkHair)
      }
      for (let x = 48; x <= 52; x++) {
        pixel(x, 10 + (52 - x), darkHair)
      }
    } else if (hairStyle === 'long') {
      // 长发 - 破烂的长发
      for (let x = 26; x <= 54; x++) {
        if (x % 3 !== 0) {
          pixel(x, 8, darkHair)
          pixel(x, 9, hairColor)
        }
      }
      // 两侧垂下的头发
      for (let y = 10; y <= 45; y++) {
        if (y % 2 === 0) {
          pixel(26, y, darkHair)
          pixel(27, y, hairColor)
          pixel(53, y, hairColor)
          pixel(54, y, darkHair)
        }
      }
    } else if (hairStyle === 'topknot') {
      // 发髻 - 骷髅顶上的发髻
      for (let x = 36; x <= 44; x++) {
        for (let y = 2; y <= 8; y++) {
          if ((x - 40) * (x - 40) + (y - 5) * (y - 5) <= 16) {
            pixel(x, y, hairColor)
          }
        }
      }
      pixel(40, 1, darkHair)
      pixel(39, 2, darkHair)
      pixel(41, 2, darkHair)
    } else if (hairStyle === 'bun') {
      // 发髻（女性）
      for (let x = 36; x <= 44; x++) {
        for (let y = 4; y <= 10; y++) {
          if ((x - 40) * (x - 40) + (y - 7) * (y - 7) <= 12) {
            pixel(x, y, hairColor)
          }
        }
      }
      // 装饰骨头发簪
      pixel(40, 3, '#d4c4a8')
      pixel(40, 4, '#f5f0e6')
    } else if (hairStyle === 'braids') {
      // 辫子 - 两条破烂的辫子
      for (let y = 8; y <= 50; y++) {
        if (y % 3 !== 0) {
          pixel(26, y, hairColor)
          pixel(27, y, darkHair)
          pixel(53, y, darkHair)
          pixel(54, y, hairColor)
        }
      }
      // 头顶
      for (let x = 30; x <= 50; x += 2) {
        pixel(x, 8, hairColor)
        pixel(x, 9, darkHair)
      }
    }
  }


  // 绘制骷髅头
  const drawSkullHead = (pixel, boneColor, darkBone, lightBone, bloodRed, freshBlood, eyeGlow, eyeGlowDark, gender) => {
    // 骷髅头主体
    for (let x = 28; x <= 52; x++) {
      for (let y = 8; y <= 38; y++) {
        if (x === 28 && (y < 14 || y > 32)) continue
        if (x === 29 && (y < 12 || y > 34)) continue
        if (x === 30 && (y < 10 || y > 36)) continue
        if (x === 52 && (y < 14 || y > 32)) continue
        if (x === 51 && (y < 12 || y > 34)) continue
        if (x === 50 && (y < 10 || y > 36)) continue
        pixel(x, y, boneColor)
      }
    }
    
    // 头骨高光
    for (let x = 34; x <= 46; x++) {
      pixel(x, 10, lightBone)
      pixel(x, 11, lightBone)
    }
    for (let x = 32; x <= 48; x++) {
      pixel(x, 12, lightBone)
    }
    
    // 头骨阴影
    for (let y = 30; y <= 36; y++) {
      pixel(29, y, darkBone)
      pixel(30, y, darkBone)
      pixel(50, y, darkBone)
      pixel(51, y, darkBone)
    }
    
    // 眼眶
    for (let x = 31; x <= 37; x++) {
      for (let y = 18; y <= 26; y++) {
        pixel(x, y, '#000000')
      }
    }
    for (let x = 43; x <= 49; x++) {
      for (let y = 18; y <= 26; y++) {
        pixel(x, y, '#000000')
      }
    }
    
    // 眼眶边缘
    for (let x = 31; x <= 37; x++) {
      pixel(x, 17, darkBone)
      pixel(x, 27, darkBone)
    }
    for (let x = 43; x <= 49; x++) {
      pixel(x, 17, darkBone)
      pixel(x, 27, darkBone)
    }
    
    // 发光红眼
    pixel(33, 21, eyeGlowDark)
    pixel(34, 21, eyeGlow)
    pixel(35, 21, eyeGlow)
    pixel(33, 22, eyeGlow)
    pixel(34, 22, '#ff3333')
    pixel(35, 22, eyeGlow)
    pixel(34, 23, eyeGlowDark)
    
    pixel(45, 21, eyeGlowDark)
    pixel(46, 21, eyeGlow)
    pixel(47, 21, eyeGlow)
    pixel(45, 22, eyeGlow)
    pixel(46, 22, '#ff3333')
    pixel(47, 22, eyeGlow)
    pixel(46, 23, eyeGlowDark)
    
    // 鼻腔
    for (let y = 27; y <= 31; y++) {
      const width = y - 26
      for (let dx = -width; dx <= width; dx++) {
        pixel(40 + dx, y, '#000000')
      }
    }
    pixel(40, 26, darkBone)
    
    // 牙齿
    for (let x = 33; x <= 47; x++) {
      pixel(x, 33, lightBone)
      pixel(x, 34, boneColor)
      pixel(x, 35, boneColor)
    }
    // 牙缝
    pixel(35, 33, darkBone); pixel(35, 34, darkBone); pixel(35, 35, darkBone)
    pixel(38, 33, darkBone); pixel(38, 34, darkBone); pixel(38, 35, darkBone)
    pixel(40, 33, darkBone); pixel(40, 34, darkBone); pixel(40, 35, darkBone)
    pixel(42, 33, darkBone); pixel(42, 34, darkBone); pixel(42, 35, darkBone)
    pixel(45, 33, darkBone); pixel(45, 34, darkBone); pixel(45, 35, darkBone)
    
    // 下颌
    for (let x = 32; x <= 48; x++) {
      pixel(x, 36, boneColor)
      pixel(x, 37, boneColor)
      pixel(x, 38, darkBone)
    }
    
    // 头骨裂缝和血迹
    pixel(36, 12, darkBone); pixel(37, 13, darkBone); pixel(37, 14, darkBone)
    pixel(38, 15, darkBone); pixel(38, 16, darkBone)
    pixel(37, 15, bloodRed); pixel(37, 16, bloodRed); pixel(38, 17, freshBlood)
    
    pixel(44, 10, darkBone); pixel(45, 11, darkBone); pixel(45, 12, darkBone)
    pixel(45, 13, bloodRed); pixel(46, 14, bloodRed); pixel(46, 15, freshBlood)
    
    // 颈椎
    for (let y = 39; y <= 44; y++) {
      for (let x = 36; x <= 44; x++) {
        pixel(x, y, boneColor)
      }
    }
    pixel(38, 40, darkBone); pixel(42, 40, darkBone)
    pixel(40, 41, darkBone); pixel(38, 42, darkBone)
    pixel(42, 42, darkBone); pixel(40, 43, darkBone)
  }


  // 绘制骷髅身体
  const drawSkeletonBody = (pixel, boneColor, darkBone, lightBone, bloodRed, gender) => {
    // 锁骨
    for (let x = 26; x <= 35; x++) {
      pixel(x, 45, boneColor)
      pixel(x, 46, darkBone)
    }
    for (let x = 45; x <= 54; x++) {
      pixel(x, 45, boneColor)
      pixel(x, 46, darkBone)
    }
    
    // 肋骨架
    for (let i = 0; i < 6; i++) {
      const y = 48 + i * 4
      for (let x = 28; x <= 38; x++) {
        pixel(x, y, boneColor)
        pixel(x, y + 1, darkBone)
      }
      for (let x = 42; x <= 52; x++) {
        pixel(x, y, boneColor)
        pixel(x, y + 1, darkBone)
      }
    }
    
    // 脊椎
    for (let y = 46; y <= 74; y++) {
      pixel(39, y, boneColor)
      pixel(40, y, lightBone)
      pixel(41, y, boneColor)
    }
    for (let y = 48; y <= 72; y += 4) {
      pixel(38, y, darkBone)
      pixel(42, y, darkBone)
    }
    
    // 骨盆
    for (let x = 30; x <= 50; x++) {
      pixel(x, 75, boneColor)
      pixel(x, 76, boneColor)
      pixel(x, 77, darkBone)
    }
    for (let x = 34; x <= 38; x++) pixel(x, 76, darkBone)
    for (let x = 42; x <= 46; x++) pixel(x, 76, darkBone)
    
    // 手臂骨
    for (let y = 47; y <= 68; y++) {
      pixel(18, y, boneColor); pixel(19, y, lightBone)
      pixel(20, y, boneColor); pixel(21, y, darkBone)
      pixel(59, y, darkBone); pixel(60, y, boneColor)
      pixel(61, y, lightBone); pixel(62, y, boneColor)
    }
    
    // 手骨
    for (let x = 16; x <= 22; x++) {
      pixel(x, 69, boneColor); pixel(x, 70, darkBone)
    }
    pixel(16, 71, boneColor); pixel(17, 71, boneColor)
    pixel(18, 72, boneColor); pixel(19, 71, boneColor)
    pixel(20, 72, boneColor); pixel(21, 71, boneColor)
    pixel(22, 71, boneColor)
    
    for (let x = 58; x <= 64; x++) {
      pixel(x, 69, boneColor); pixel(x, 70, darkBone)
    }
    pixel(58, 71, boneColor); pixel(59, 71, boneColor)
    pixel(60, 72, boneColor); pixel(61, 71, boneColor)
    pixel(62, 72, boneColor); pixel(63, 71, boneColor)
    pixel(64, 71, boneColor)
    
    // 腿骨
    for (let y = 78; y <= 94; y++) {
      pixel(32, y, boneColor); pixel(33, y, lightBone)
      pixel(34, y, boneColor); pixel(35, y, darkBone)
      pixel(45, y, darkBone); pixel(46, y, boneColor)
      pixel(47, y, lightBone); pixel(48, y, boneColor)
    }
  }


  // 绘制破烂盔甲
  const drawTatteredArmor = (pixel, armorColor, darkArmor, rustMetal, tornCloth, darkCloth, bloodRed, freshBlood, darkBlood, gender) => {
    // 左胸甲残片
    for (let x = 28; x <= 38; x++) {
      for (let y = 48; y <= 62; y++) {
        if ((x === 32 || x === 33) && (y >= 52 && y <= 56)) continue
        if ((x === 35 || x === 36) && (y >= 58 && y <= 60)) continue
        pixel(x, y, armorColor)
      }
    }
    
    // 右胸甲残片
    for (let x = 42; x <= 52; x++) {
      for (let y = 48; y <= 60; y++) {
        if ((x >= 44 && x <= 46) && (y >= 50 && y <= 54)) continue
        if ((x >= 48 && x <= 50) && (y >= 56 && y <= 59)) continue
        pixel(x, y, armorColor)
      }
    }
    
    // 盔甲边缘
    for (let y = 48; y <= 62; y++) {
      pixel(28, y, darkArmor); pixel(38, y, darkArmor)
    }
    for (let y = 48; y <= 60; y++) {
      pixel(42, y, darkArmor); pixel(52, y, darkArmor)
    }
    
    // 盔甲血迹
    pixel(30, 50, bloodRed); pixel(31, 51, bloodRed)
    pixel(30, 52, freshBlood); pixel(31, 53, bloodRed)
    pixel(48, 52, bloodRed); pixel(49, 53, freshBlood)
    
    // 左肩甲
    for (let x = 14; x <= 26; x++) {
      for (let y = 44; y <= 52; y++) {
        if (x >= 18 && x <= 20 && y >= 48 && y <= 50) continue
        pixel(x, y, rustMetal)
      }
    }
    pixel(14, 43, rustMetal); pixel(15, 42, darkArmor); pixel(16, 43, rustMetal)
    
    // 右肩甲
    for (let x = 54; x <= 66; x++) {
      for (let y = 44; y <= 52; y++) {
        if (x >= 58 && x <= 62 && y >= 46 && y <= 50) continue
        pixel(x, y, rustMetal)
      }
    }
    pixel(66, 43, rustMetal); pixel(65, 42, darkArmor)
    
    // 腰带
    for (let x = 28; x <= 52; x++) {
      if (x >= 36 && x <= 38) continue
      pixel(x, 73, darkCloth); pixel(x, 74, tornCloth); pixel(x, 75, darkCloth)
    }
    pixel(40, 73, darkArmor); pixel(41, 73, rustMetal); pixel(42, 73, darkArmor)
    pixel(40, 74, rustMetal); pixel(41, 74, '#8b4513'); pixel(42, 74, rustMetal)
    
    // 战裙
    for (let y = 76; y <= 86; y++) {
      for (let x = 28; x <= 36; x++) {
        if (y >= 82 && (x === 30 || x === 33)) continue
        pixel(x, y, tornCloth)
      }
      for (let x = 44; x <= 52; x++) {
        if (y >= 80 && (x === 46 || x === 49 || x === 51)) continue
        pixel(x, y, tornCloth)
      }
    }
    for (let y = 76; y <= 86; y++) {
      pixel(28, y, darkCloth); pixel(52, y, darkCloth)
    }
    
    // 布条血迹
    pixel(32, 78, bloodRed); pixel(33, 79, bloodRed)
    pixel(32, 80, freshBlood); pixel(47, 77, bloodRed)
    pixel(48, 78, freshBlood); pixel(47, 79, bloodRed)
    
    // 护腿金属片
    for (let y = 82; y <= 90; y++) {
      pixel(31, y, rustMetal); pixel(32, y, darkArmor)
      pixel(48, y, darkArmor); pixel(49, y, rustMetal)
    }
  }


  // 绘制靴子
  const drawBoots = (pixel, bootColor, darkBoot) => {
    // 左靴
    for (let x = 28; x <= 38; x++) {
      pixel(x, 95, darkBoot)
      pixel(x, 96, bootColor)
      pixel(x, 97, darkBoot)
    }
    // 右靴
    for (let x = 42; x <= 52; x++) {
      pixel(x, 95, darkBoot)
      pixel(x, 96, bootColor)
      pixel(x, 97, darkBoot)
    }
    // 靴子破损效果
    pixel(30, 96, darkBoot)
    pixel(35, 96, darkBoot)
    pixel(45, 96, darkBoot)
    pixel(50, 96, darkBoot)
  }

  // 绘制血迹效果
  const drawBloodEffects = (pixel, bloodRed, freshBlood, darkBlood) => {
    // 头骨滴血
    pixel(34, 39, bloodRed); pixel(34, 40, freshBlood)
    pixel(35, 41, bloodRed); pixel(35, 42, bloodRed)
    pixel(46, 38, bloodRed); pixel(46, 39, freshBlood)
    pixel(47, 40, bloodRed)
    
    // 胸口血迹
    pixel(40, 55, bloodRed); pixel(40, 56, freshBlood)
    pixel(41, 57, bloodRed); pixel(40, 58, bloodRed)
    pixel(41, 59, freshBlood); pixel(40, 60, bloodRed)
    pixel(41, 61, darkBlood)
    
    // 手臂血迹
    pixel(19, 55, bloodRed); pixel(20, 56, freshBlood)
    pixel(19, 57, bloodRed)
    pixel(61, 54, bloodRed); pixel(60, 55, freshBlood)
    pixel(61, 56, bloodRed); pixel(60, 57, darkBlood)
    
    // 腿部血迹
    pixel(33, 85, bloodRed); pixel(34, 86, freshBlood)
    pixel(33, 87, bloodRed)
    pixel(47, 84, bloodRed); pixel(46, 85, freshBlood)
    pixel(47, 86, bloodRed); pixel(46, 87, darkBlood)
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

export default WarriorCharacter
