import { useEffect, useRef } from 'react'

function ArcherCharacter({ gender, customization, scale = 2 }) {
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
    const skinColor = customization?.skinColor || '#ff8c00'  // 南瓜橙色
    const hairStyle = customization?.hairStyle || 'none'
    const hairColor = customization?.hairColor || '#1a1a1a'
    const clothesColor = customization?.clothesColor || '#228b22'
    const shoesColor = customization?.shoesColor || '#2a2a2a'
    
    // 南瓜颜色基于皮肤色
    const pumpkinColor = skinColor
    const darkPumpkin = adjustBrightness(skinColor, -50)
    const lightPumpkin = adjustBrightness(skinColor, 30)
    const stemColor = '#228b22'  // 南瓜茎绿色
    const darkStem = '#1a5c1a'
    
    // 衣服颜色
    const clothesDark = adjustBrightness(clothesColor, -40)
    const clothesLight = adjustBrightness(clothesColor, 30)
    
    // 靴子颜色
    const bootColor = shoesColor
    const darkBoot = adjustBrightness(shoesColor, -30)

    // 绘制蝙蝠（在角色周围飞舞）
    drawBats(pixel)
    
    // 绘制南瓜头
    drawPumpkinHead(pixel, pumpkinColor, darkPumpkin, lightPumpkin, stemColor, darkStem, gender)
    
    // 绘制头发（如果有）
    if (hairStyle && hairStyle !== 'none' && hairStyle !== 'frontponytail') {
      drawPumpkinHair(pixel, adjustBrightness, hairStyle, hairColor, gender)
    }
    
    // 绘制身体
    drawPumpkinBody(pixel, adjustBrightness, pumpkinColor, darkPumpkin, lightPumpkin, gender)
    
    // 绘制衣服
    drawPumpkinClothes(pixel, clothesColor, clothesDark, clothesLight, gender)
    
    // 绘制靴子
    drawPumpkinBoots(pixel, bootColor, darkBoot)
    
  }, [gender, customization, scale])

  // 绘制蝙蝠
  const drawBats = (pixel) => {
    const batColor = '#1a1a1a'
    const batEye = '#ff0000'
    
    // 左上蝙蝠
    // 身体
    pixel(8, 15, batColor); pixel(9, 15, batColor); pixel(10, 15, batColor)
    pixel(9, 16, batColor)
    // 翅膀
    pixel(5, 14, batColor); pixel(6, 14, batColor); pixel(7, 15, batColor)
    pixel(11, 15, batColor); pixel(12, 14, batColor); pixel(13, 14, batColor)
    pixel(4, 13, batColor); pixel(14, 13, batColor)
    // 眼睛
    pixel(8, 14, batEye); pixel(10, 14, batEye)
    // 耳朵
    pixel(8, 13, batColor); pixel(10, 13, batColor)
    
    // 右上蝙蝠
    pixel(68, 20, batColor); pixel(69, 20, batColor); pixel(70, 20, batColor)
    pixel(69, 21, batColor)
    pixel(65, 19, batColor); pixel(66, 19, batColor); pixel(67, 20, batColor)
    pixel(71, 20, batColor); pixel(72, 19, batColor); pixel(73, 19, batColor)
    pixel(64, 18, batColor); pixel(74, 18, batColor)
    pixel(68, 19, batEye); pixel(70, 19, batEye)
    pixel(68, 18, batColor); pixel(70, 18, batColor)
    
    // 小蝙蝠（右侧）
    pixel(72, 35, batColor); pixel(73, 35, batColor)
    pixel(71, 34, batColor); pixel(74, 34, batColor)
    pixel(72, 34, batEye)
  }

  // 绘制南瓜头发
  const drawPumpkinHair = (pixel, adjustBrightness, hairStyle, hairColor, gender) => {
    const darkHair = adjustBrightness(hairColor, -30)
    
    if (hairStyle === 'short') {
      // 短发 - 从南瓜茎旁边长出
      for (let x = 30; x <= 35; x++) {
        pixel(x, 8, darkHair); pixel(x, 9, hairColor)
      }
      for (let x = 45; x <= 50; x++) {
        pixel(x, 8, darkHair); pixel(x, 9, hairColor)
      }
    } else if (hairStyle === 'long') {
      // 长发 - 藤蔓般垂下
      for (let y = 10; y <= 45; y++) {
        if (y % 2 === 0) {
          pixel(26, y, hairColor); pixel(27, y, darkHair)
          pixel(53, y, darkHair); pixel(54, y, hairColor)
        }
      }
    } else if (hairStyle === 'topknot' || hairStyle === 'bun') {
      // 发髻 - 在南瓜茎上
      for (let x = 37; x <= 43; x++) {
        for (let y = 2; y <= 6; y++) {
          if ((x - 40) * (x - 40) + (y - 4) * (y - 4) <= 9) {
            pixel(x, y, hairColor)
          }
        }
      }
    } else if (hairStyle === 'braids') {
      // 辫子
      for (let y = 10; y <= 50; y++) {
        if (y % 3 !== 0) {
          pixel(26, y, hairColor); pixel(27, y, darkHair)
          pixel(53, y, darkHair); pixel(54, y, hairColor)
        }
      }
    }
  }


  // 绘制南瓜头
  const drawPumpkinHead = (pixel, pumpkinColor, darkPumpkin, lightPumpkin, stemColor, darkStem, gender) => {
    // 南瓜茎
    for (let x = 38; x <= 42; x++) {
      for (let y = 6; y <= 12; y++) {
        pixel(x, y, stemColor)
      }
    }
    pixel(39, 7, darkStem); pixel(41, 7, darkStem)
    pixel(40, 6, darkStem)
    // 茎的卷曲
    pixel(43, 8, stemColor); pixel(44, 7, stemColor); pixel(45, 7, stemColor)
    pixel(37, 9, stemColor); pixel(36, 8, stemColor)
    
    // 南瓜主体 - 圆形
    for (let x = 26; x <= 54; x++) {
      for (let y = 12; y <= 40; y++) {
        // 圆形边界
        const cx = 40, cy = 26
        const dx = x - cx, dy = y - cy
        if (dx * dx / 196 + dy * dy / 196 <= 1) {
          pixel(x, y, pumpkinColor)
        }
      }
    }
    
    // 南瓜纹路（竖条）
    for (let y = 14; y <= 38; y++) {
      pixel(30, y, darkPumpkin)
      pixel(35, y, darkPumpkin)
      pixel(40, y, darkPumpkin)
      pixel(45, y, darkPumpkin)
      pixel(50, y, darkPumpkin)
    }
    
    // 南瓜高光
    for (let y = 16; y <= 24; y++) {
      pixel(32, y, lightPumpkin)
      pixel(33, y, lightPumpkin)
      pixel(47, y, lightPumpkin)
      pixel(48, y, lightPumpkin)
    }
    
    // 邪恶的三角眼睛
    // 左眼
    for (let i = 0; i <= 4; i++) {
      for (let j = 0; j <= i; j++) {
        pixel(30 + j, 20 + i, '#000000')
        pixel(36 - j, 20 + i, '#000000')
      }
    }
    // 眼睛发光
    pixel(32, 22, '#ffff00'); pixel(33, 22, '#ffff00')
    pixel(32, 23, '#ff8c00')
    
    // 右眼
    for (let i = 0; i <= 4; i++) {
      for (let j = 0; j <= i; j++) {
        pixel(44 + j, 20 + i, '#000000')
        pixel(50 - j, 20 + i, '#000000')
      }
    }
    // 眼睛发光
    pixel(46, 22, '#ffff00'); pixel(47, 22, '#ffff00')
    pixel(47, 23, '#ff8c00')
    
    // 三角鼻子
    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= i; j++) {
        pixel(39 + j, 27 + i, '#000000')
        pixel(41 - j, 27 + i, '#000000')
      }
    }
    
    // 邪恶的锯齿嘴
    for (let x = 30; x <= 50; x++) {
      pixel(x, 33, '#000000')
      pixel(x, 34, '#000000')
      pixel(x, 35, '#000000')
      pixel(x, 36, '#000000')
    }
    // 锯齿牙齿
    for (let x = 31; x <= 49; x += 3) {
      pixel(x, 33, pumpkinColor)
      pixel(x + 1, 33, pumpkinColor)
      pixel(x, 36, pumpkinColor)
      pixel(x + 1, 36, pumpkinColor)
    }
    // 嘴巴内部发光
    for (let x = 32; x <= 48; x++) {
      pixel(x, 34, '#ff4500')
      pixel(x, 35, '#ff6600')
    }
    
    // 南瓜脖子
    for (let y = 41; y <= 45; y++) {
      for (let x = 36; x <= 44; x++) {
        pixel(x, y, pumpkinColor)
      }
    }
    pixel(37, 42, darkPumpkin); pixel(43, 42, darkPumpkin)
    pixel(40, 43, darkPumpkin)
  }


  // 绘制南瓜身体
  const drawPumpkinBody = (pixel, adjustBrightness, pumpkinColor, darkPumpkin, lightPumpkin, gender) => {
    // 南瓜藤蔓手臂
    const vineColor = '#228b22'
    const darkVine = '#1a5c1a'
    const lightVine = '#32cd32'
    
    // 左臂（藤蔓）
    for (let y = 46; y <= 68; y++) {
      pixel(18, y, vineColor); pixel(19, y, lightVine)
      pixel(20, y, vineColor); pixel(21, y, darkVine)
    }
    // 藤蔓卷曲
    pixel(17, 50, vineColor); pixel(16, 51, vineColor)
    pixel(17, 58, vineColor); pixel(16, 59, vineColor)
    pixel(17, 66, vineColor); pixel(16, 67, vineColor)
    
    // 右臂（藤蔓）
    for (let y = 46; y <= 68; y++) {
      pixel(59, y, darkVine); pixel(60, y, vineColor)
      pixel(61, y, lightVine); pixel(62, y, vineColor)
    }
    // 藤蔓卷曲
    pixel(63, 52, vineColor); pixel(64, 53, vineColor)
    pixel(63, 60, vineColor); pixel(64, 61, vineColor)
    
    // 藤蔓手（叶子形状）
    // 左手
    pixel(15, 69, vineColor); pixel(16, 69, lightVine)
    pixel(17, 69, vineColor); pixel(18, 70, vineColor)
    pixel(19, 70, lightVine); pixel(20, 70, vineColor)
    pixel(21, 71, vineColor); pixel(22, 71, darkVine)
    pixel(16, 71, darkVine); pixel(17, 72, vineColor)
    pixel(19, 72, vineColor)
    
    // 右手
    pixel(58, 69, vineColor); pixel(59, 69, lightVine)
    pixel(60, 70, vineColor); pixel(61, 70, lightVine)
    pixel(62, 70, vineColor); pixel(63, 69, vineColor)
    pixel(64, 71, darkVine); pixel(61, 72, vineColor)
    pixel(63, 72, vineColor)
    
    // 南瓜身体躯干
    for (let x = 28; x <= 52; x++) {
      for (let y = 46; y <= 74; y++) {
        pixel(x, y, pumpkinColor)
      }
    }
    
    // 身体纹路
    for (let y = 48; y <= 72; y++) {
      pixel(32, y, darkPumpkin)
      pixel(40, y, darkPumpkin)
      pixel(48, y, darkPumpkin)
    }
    
    // 身体高光
    for (let y = 50; y <= 68; y++) {
      pixel(34, y, lightPumpkin)
      pixel(35, y, lightPumpkin)
      pixel(45, y, lightPumpkin)
      pixel(46, y, lightPumpkin)
    }
    
    // 南瓜腿
    for (let y = 78; y <= 94; y++) {
      // 左腿
      for (let x = 30; x <= 38; x++) {
        pixel(x, y, pumpkinColor)
      }
      // 右腿
      for (let x = 42; x <= 50; x++) {
        pixel(x, y, pumpkinColor)
      }
    }
    // 腿部纹路
    for (let y = 80; y <= 92; y++) {
      pixel(34, y, darkPumpkin)
      pixel(46, y, darkPumpkin)
    }
  }


  // 绘制南瓜衣服
  const drawPumpkinClothes = (pixel, clothesColor, clothesDark, clothesLight, gender) => {
    // 披风/斗篷
    for (let x = 24; x <= 27; x++) {
      for (let y = 46; y <= 75; y++) {
        pixel(x, y, clothesColor)
      }
    }
    for (let x = 53; x <= 56; x++) {
      for (let y = 46; y <= 75; y++) {
        pixel(x, y, clothesColor)
      }
    }
    // 披风边缘
    for (let y = 48; y <= 73; y += 3) {
      pixel(24, y, clothesLight)
      pixel(56, y, clothesLight)
    }
    // 披风底部撕裂效果
    pixel(25, 76, clothesColor); pixel(26, 77, clothesColor)
    pixel(54, 76, clothesColor); pixel(55, 77, clothesColor)
    
    // 腰带（藤蔓编织）
    for (let x = 28; x <= 52; x++) {
      pixel(x, 74, '#1a5c1a')
      pixel(x, 75, '#228b22')
      pixel(x, 76, '#1a5c1a')
    }
    // 腰带扣（小南瓜）
    for (let x = 38; x <= 42; x++) {
      pixel(x, 74, '#ff8c00')
      pixel(x, 75, '#ffa500')
      pixel(x, 76, '#ff8c00')
    }
    pixel(40, 73, '#228b22')  // 小南瓜茎
    
    // 裤子/裙子
    for (let y = 77; y <= 86; y++) {
      for (let x = 28; x <= 38; x++) {
        pixel(x, y, clothesDark)
      }
      for (let x = 42; x <= 52; x++) {
        pixel(x, y, clothesDark)
      }
    }
    // 裤子装饰
    for (let y = 79; y <= 84; y++) {
      pixel(33, y, clothesLight)
      pixel(47, y, clothesLight)
    }
    
    // 箭袋（藤蔓编织）
    for (let y = 50; y <= 70; y++) {
      pixel(55, y, '#1a5c1a')
      pixel(56, y, '#228b22')
      pixel(57, y, '#1a5c1a')
    }
    // 箭羽
    pixel(54, 48, '#8b0000'); pixel(55, 48, '#ff0000')
    pixel(56, 48, '#8b0000'); pixel(57, 48, '#ff0000')
    pixel(55, 49, '#ff4500'); pixel(56, 49, '#ff4500')
    pixel(55, 50, '#ffa500'); pixel(56, 50, '#ffa500')
  }

  // 绘制南瓜靴子
  const drawPumpkinBoots = (pixel, bootColor, darkBoot) => {
    // 左靴
    for (let x = 28; x <= 40; x++) {
      pixel(x, 95, darkBoot)
      pixel(x, 96, bootColor)
      pixel(x, 97, darkBoot)
    }
    // 右靴
    for (let x = 40; x <= 52; x++) {
      pixel(x, 95, darkBoot)
      pixel(x, 96, bootColor)
      pixel(x, 97, darkBoot)
    }
    // 靴子装饰（南瓜图案）
    pixel(34, 96, '#ff8c00')
    pixel(46, 96, '#ff8c00')
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

export default ArcherCharacter
