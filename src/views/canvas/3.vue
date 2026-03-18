<template>
  <div class="canvas-wrapper" :class="{ loaded: isLoaded }">
    <canvas ref="canvasRef"></canvas>

    <!-- 模拟加载完成后的主页内容 -->
    <div class="main-content" v-if="isLoaded">
      <h1 class="glitch">WELCOME TO THE FUTURE</h1>
      <p>System Initialized Successfully</p>
      <button class="enter-btn">ENTER SYSTEM</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Application, Text, Graphics, Container, Ticker } from 'pixi.js';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

const canvasRef = useTemplateRef('canvasRef');
const isLoaded = ref(false);
let app: Application | null = null;

onMounted(async () => {
  if (!canvasRef.value) return;

  app = new Application();
  await app.init({
    canvas: canvasRef.value,
    resizeTo: window,
    background: '#050510', // 深邃宇宙蓝/黑
    antialias: true,
  });

  const center = { x: app.screen.width / 2, y: app.screen.height / 2 };

  // 核心容器
  const loaderContainer = new Container();
  loaderContainer.x = center.x;
  loaderContainer.y = center.y;
  app.stage.addChild(loaderContainer);

  // 1. 加载百分比文字
  const loadingText = new Text({
    text: '0%',
    style: {
      fontFamily: '"Orbitron", "Courier New", Courier, monospace',
      fontSize: 64,
      fontWeight: 'bold',
      fill: '#ffffff',
      letterSpacing: 5,
      dropShadow: {
        alpha: 0.8,
        angle: Math.PI / 4,
        blur: 10,
        color: 0x00ffff,
        distance: 0
      }
    }
  });
  loadingText.anchor.set(0.5);
  loaderContainer.addChild(loadingText);

  // 2. 炫酷旋转圆环
  const rings: { graphics: Graphics, speed: number, direction: number }[] = [];
  const colors = [0x00ffff, 0xff00ff, 0x00ffaa]; // 赛博朋克色系：青、紫、绿
  const radiuses = [120, 140, 160];
  const speeds = [0.03, 0.02, 0.04];
  const directions = [1, -1, 1];

  for (let i = 0; i < 3; i++) {
    const ring = new Graphics();
    // 绘制分段圆弧，让转动效果更好看
    ring.arc(0, 0, radiuses[i]!, 0, Math.PI * 1.5);
    ring.stroke({ width: 3 + i, color: colors[i], cap: 'round' });
    ring.alpha = 0.8;

    // 内置的辉光模拟 (重叠更粗但透明度更低的线条)
    const glow = new Graphics();
    glow.arc(0, 0, radiuses[i]!, 0, Math.PI * 1.5);
    glow.stroke({ width: 10 + i * 2, color: colors[i], cap: 'round' });
    glow.alpha = 0.2;

    ring.addChild(glow);
    loaderContainer.addChild(ring);
    rings.push({ graphics: ring, speed: speeds[i]!, direction: directions[i]! });
  }

  // 3. 星屑粒子系统
  const particles: { graphics: Graphics, angle: number, radius: number, speed: number, maxRadius: number }[] = [];
  for (let i = 0; i < 80; i++) {
    const p = new Graphics();
    const size = Math.random() * 2 + 1;
    let color = colors[Math.floor(Math.random() * colors.length)];
    p.circle(0, 0, size);
    p.fill({ color: color });
    p.alpha = Math.random() * 0.5 + 0.3; // 半透明

    const angle = Math.random() * Math.PI * 2;
    const radius = 200 + Math.random() * app.screen.width / 2;
    const speed = 0.005 + Math.random() * 0.015;

    p.x = Math.cos(angle) * radius;
    p.y = Math.sin(angle) * radius;

    loaderContainer.addChild(p);
    particles.push({ graphics: p, angle, radius, speed, maxRadius: radius });
  }

  // 中心光球
  const coreGlow = new Graphics();
  coreGlow.circle(0, 0, 40);
  coreGlow.fill({ color: 0x00ffff });
  coreGlow.alpha = 0.1; // 淡淡的蓝光
  loaderContainer.addChild(coreGlow);

  let progress = 0;
  let finished = false;

  const update = (ticker: Ticker) => {
    const delta = ticker.deltaTime;

    // 背景粒子闪烁 & 飘动
    particles.forEach(p => {
      p.angle += p.speed * delta;
      p.radius -= 1 * delta; // 呈现逐渐吸入核心的效果
      if (p.radius < 100) p.radius = p.maxRadius; // 回到外围
      p.graphics.x = Math.cos(p.angle) * p.radius;
      p.graphics.y = Math.sin(p.angle) * p.radius;
      p.graphics.alpha = 0.5 + Math.sin(p.angle * 10) * 0.5; // 明暗闪烁
    });

    if (!finished) {
      // 旋转外环
      rings.forEach(r => r.graphics.rotation += r.speed * r.direction * delta);

      // 中心光球呼吸
      coreGlow.scale.x = 1 + Math.sin(progress * 0.1) * 0.2;
      coreGlow.scale.y = 1 + Math.sin(progress * 0.1) * 0.2;

      // 模拟加载进度推进
      progress += (Math.random() * 0.5 + 0.1) * delta;
      if (progress >= 100) {
        progress = 100;
        finished = true;
        loadingText.text = '100%';
        explodeEffect();
      } else {
        loadingText.text = `${Math.floor(progress)}%`;
      }
    }
  };

  if (!app.ticker) {
    Ticker.shared.add(update);
  } else {
    app.ticker.add(update);
  }

  // 完成后的爆炸扩展特效
  function explodeEffect() {
    let size = 1;
    let alpha = 1;

    const explode = (ticker: Ticker) => {
      const delta = ticker.deltaTime;
      size += 0.05 * delta;
      alpha -= 0.02 * delta;

      loaderContainer.scale.x = size;
      loaderContainer.scale.y = size;
      loaderContainer.alpha = alpha;

      // 粒子向外飞散
      particles.forEach(p => {
        p.radius += 10 * delta;
        p.graphics.x = Math.cos(p.angle) * p.radius;
        p.graphics.y = Math.sin(p.angle) * p.radius;
      });

      if (alpha <= 0) {
        if (app?.ticker) {
          app.ticker.remove(explode);
          app.ticker.remove(update);
          app.stop();
        } else {
          Ticker.shared.remove(explode);
          Ticker.shared.remove(update);
        }
        isLoaded.value = true;
      }
    };

    if (app?.ticker) {
      app.ticker.add(explode);
    } else {
      Ticker.shared.add(explode);
    }
  }

  const onResize = () => {
    if (app && loaderContainer) {
      loaderContainer.x = app.screen.width / 2;
      loaderContainer.y = app.screen.height / 2;
    }
  };
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  if (app) {
    app.destroy();
  }
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&display=swap');

.canvas-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #050510;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition: opacity 1s ease-in-out;
  }

  &.loaded canvas {
    opacity: 0;
    pointer-events: none;
  }

  .main-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    color: white;
    text-align: center;
    font-family: 'Orbitron', sans-serif;
    animation: contentReveal 2s ease forwards;
    display: flex;
    flex-direction: column;
    align-items: center;

    .glitch {
      font-size: 5rem;
      margin-bottom: 20px;
      position: relative;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.1em;

      &::before,
      &::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
      }

      &::before {
        left: 2px;
        text-shadow: -2px 0 red;
        clip-path: inset(10% 0 85% 0);
        animation: glitch-anim-1 2s infinite linear alternate-reverse;
      }

      &::after {
        left: -2px;
        text-shadow: -2px 0 blue;
        clip-path: inset(80% 0 10% 0);
        animation: glitch-anim-2 3s infinite linear alternate-reverse;
      }
    }

    p {
      font-size: 1.5rem;
      color: #00ffff;
      letter-spacing: 5px;
      margin-bottom: 40px;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      animation: pulse 2s infinite alternate;
    }

    .enter-btn {
      background: transparent;
      border: 2px solid #00ffff;
      color: #00ffff;
      padding: 15px 40px;
      font-size: 1.2rem;
      font-family: 'Orbitron', sans-serif;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.2) inset, 0 0 15px rgba(0, 255, 255, 0.2);

      &:hover {
        background: #00ffff;
        color: #050510;
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.6) inset, 0 0 25px rgba(0, 255, 255, 0.6);
        text-shadow: none;
      }
    }
  }
}

// 简单的内容淡入和上浮
@keyframes contentReveal {
  from {
    opacity: 0;
    transform: translate(-50%, -40%) scale(0.9);
    filter: blur(10px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(0);
  }
}

// 简单的呼吸效果
@keyframes pulse {
  from {
    opacity: 0.6;
  }

  to {
    opacity: 1;
  }
}

@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(5% 0 15% 0);
  }

  20% {
    clip-path: inset(75% 0 10% 0);
  }

  40% {
    clip-path: inset(15% 0 80% 0);
  }

  60% {
    clip-path: inset(45% 0 35% 0);
  }

  80% {
    clip-path: inset(10% 0 60% 0);
  }

  100% {
    clip-path: inset(50% 0 30% 0);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(15% 0 5% 0);
  }

  20% {
    clip-path: inset(10% 0 75% 0);
  }

  40% {
    clip-path: inset(80% 0 15% 0);
  }

  60% {
    clip-path: inset(35% 0 45% 0);
  }

  80% {
    clip-path: inset(60% 0 10% 0);
  }

  100% {
    clip-path: inset(30% 0 50% 0);
  }
}
</style>
