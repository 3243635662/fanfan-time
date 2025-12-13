<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface TextCursorProps {
  text?: string;
  delay?: number;
  spacing?: number;
  followMouseDirection?: boolean;
  randomFloat?: boolean;
  exitDuration?: number;
  removalInterval?: number;
  maxPoints?: number;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  angle: number;
  randomX?: number;
  randomY?: number;
  randomRotate?: number;
  opacity: number;
  scale: number;
}

const props = withDefaults(defineProps<TextCursorProps>(), {
  text: "💚",
  delay: 0.01,
  spacing: 80,
  followMouseDirection: true,
  randomFloat: true,
  exitDuration: 0.8,
  removalInterval: 50,
  maxPoints: 8,
});

const containerRef = ref<HTMLDivElement>();
const trail = ref<TrailItem[]>([]);
const lastMoveTime = ref(Date.now());
const idCounter = ref(0);

let removalIntervalId: number | null = null;

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return;

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  let newTrail = [...trail.value];

  if (newTrail.length === 0) {
    newTrail.push({
      id: idCounter.value++,
      x: mouseX,
      y: mouseY,
      angle: 0,
      opacity: 1,
      scale: 1,
      ...(props.randomFloat && {
        randomX: Math.random() * 10 - 5,
        randomY: Math.random() * 10 - 5,
        randomRotate: Math.random() * 10 - 5,
      }),
    });
  } else {
    const last = newTrail[newTrail.length - 1];
    const dx = mouseX - last!.x;
    const dy = mouseY - last!.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= props.spacing) {
      let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (rawAngle > 90) rawAngle -= 180;
      else if (rawAngle < -90) rawAngle += 180;
      const computedAngle = props.followMouseDirection ? rawAngle : 0;
      const steps = Math.floor(distance / props.spacing);

      for (let i = 1; i <= steps; i++) {
        const t = (props.spacing * i) / distance;
        const newX = last!.x + dx * t;
        const newY = last!.y + dy * t;

        // 计算透明度（越老的点越透明）
        const newOpacity = Math.max(0.2, 1 - (i / props.maxPoints) * 0.8);
        const newScale = Math.max(0.5, 1 - (i / props.maxPoints) * 0.5);

        newTrail.push({
          id: idCounter.value++,
          x: newX,
          y: newY,
          angle: computedAngle,
          opacity: newOpacity,
          scale: newScale,
          ...(props.randomFloat && {
            randomX: Math.random() * 10 - 5,
            randomY: Math.random() * 10 - 5,
            randomRotate: Math.random() * 10 - 5,
          }),
        });
      }
    }
  }

  if (newTrail.length > props.maxPoints) {
    newTrail = newTrail.slice(newTrail.length - props.maxPoints);
  }

  trail.value = newTrail;
  lastMoveTime.value = Date.now();
};

const startRemovalInterval = () => {
  if (removalIntervalId) {
    clearInterval(removalIntervalId);
  }

  removalIntervalId = setInterval(() => {
    if (Date.now() - lastMoveTime.value > 200) {
      if (trail.value.length > 0) {
        trail.value = trail.value.slice(1);
      }
    }
  }, props.removalInterval);
};

onMounted(() => {
  // 直接在window上监听鼠标移动
  window.addEventListener("mousemove", handleMouseMove);
  startRemovalInterval();
});

onUnmounted(() => {
  // 移除window上的事件监听
  window.removeEventListener("mousemove", handleMouseMove);
  if (removalIntervalId) {
    clearInterval(removalIntervalId);
  }
});
</script>

<template>
  <div ref="containerRef" class="cursor-container">
    <div class="cursor-overlay">
      <div
        v-for="item in trail"
        :key="item.id"
        class="cursor-text"
        :style="{
          left: `${item.x}px`,
          top: `${item.y}px`,
          opacity: item.opacity,
          transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.angle}deg)`,
        }"
      >
        {{ props.text }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cursor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;

  .cursor-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .cursor-text {
      position: absolute;
      user-select: none;
      white-space: nowrap;
      font-size: 1.8rem;
      pointer-events: none;
      color: #4ade80;
      text-shadow: 0 0 15px rgba(74, 222, 128, 0.8),
        0 0 25px rgba(74, 222, 128, 0.4);
      font-weight: 600;
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
      transform-origin: center center;
      z-index: 10;

      // 发光效果
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          circle,
          rgba(74, 222, 128, 0.3) 0%,
          transparent 70%
        );
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        animation: glow-pulse 2s ease-in-out infinite alternate;
      }
    }
  }
}

@keyframes glow-pulse {
  0% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.2);
  }
}
.trail-enter-active,
.trail-leave-active {
  transition: all 0.5s ease;
}

.trail-enter-from {
  opacity: 0;
  transform: scale(0);
}

.trail-leave-to {
  opacity: 0;
  transform: scale(0);
}

// 响应式设计
@media (max-width: 768px) {
  .cursor-container {
    .cursor-overlay {
      .cursor-text {
        font-size: 1.2rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .cursor-container {
    .cursor-overlay {
      .cursor-text {
        font-size: 1rem;
      }
    }
  }
}
</style>
