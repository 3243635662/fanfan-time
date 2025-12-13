<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineComponent, h } from "vue";
import {
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
} from "motion-v";
import type { PropType } from "vue";

export type DockItemData = {
  icon: unknown;
  onClick: () => void;
  className?: string;
  title?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  setDockTitle?: (title: string) => void;
};

const props = withDefaults(defineProps<DockProps>(), {
  className: "",
  distance: 200,
  panelHeight: 64,
  baseItemSize: 50,
  dockHeight: 256,
  magnification: 70,
  spring: () => ({ mass: 0.1, stiffness: 150, damping: 12 }),
});

const mouseX = useMotionValue(Infinity);
const isHovered = useMotionValue(0);
const currentHeight = ref(props.panelHeight);

const maxHeight = computed(() =>
  Math.max(props.dockHeight, props.magnification + props.magnification / 2 + 4)
);

const heightRow = useTransform(
  isHovered,
  [0, 1],
  [props.panelHeight, maxHeight.value]
);
const height = useSpring(heightRow, props.spring);

let unsubscribeHeight: (() => void) | null = null;

onMounted(() => {
  unsubscribeHeight = height.on("change", (latest: number) => {
    currentHeight.value = latest;
  });
});

onUnmounted(() => {
  if (unsubscribeHeight) {
    unsubscribeHeight();
  }
});

const handleMouseMove = (event: MouseEvent) => {
  isHovered.set(1);
  mouseX.set(event.pageX);
};

const handleMouseLeave = () => {
  isHovered.set(0);
  mouseX.set(Infinity);
};
</script>

<template>
  <div
    :style="{ height: currentHeight + 'px', scrollbarWidth: 'none' }"
    class="dock-container"
  >
    <div
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      :class="`${props.className} dock-panel`"
      :style="{ height: props.panelHeight + 'px' }"
      role="toolbar"
      aria-="Application dock"
    >
      <DockItem
        v-for="(item, index) in props.items"
        :key="index"
        :onClick="item.onClick"
        :className="item.className"
        :mouseX="mouseX"
        :spring="props.spring"
        :distance="props.distance"
        :magnification="props.magnification"
        :baseItemSize="props.baseItemSize"
        :item="item"
        :title="item.title"
        :setDockTitle="props.setDockTitle"
      />
    </div>
  </div>
</template>

<script lang="ts">
const DockItem = defineComponent({
  name: "DockItem",
  props: {
    className: {
      type: String,
      default: "",
    },
    onClick: {
      type: Function,
      default: () => {},
    },
    mouseX: {
      type: Object as () => ReturnType<typeof useMotionValue<number>>,
      required: true,
    },
    spring: {
      type: Object as () => SpringOptions,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    baseItemSize: {
      type: Number,
      required: true,
    },
    magnification: {
      type: Number,
      required: true,
    },
    item: {
      type: Object as () => DockItemData,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    setDockTitle: {
      type: Function as PropType<(title: string) => void>,
      default: undefined,
    },
  },
  setup(props) {
    const itemRef = ref<HTMLDivElement>();
    const isHovered = useMotionValue(0);
    const currentSize = ref(props.baseItemSize);

    const mouseDistance = useTransform(props.mouseX, (val: number) => {
      const rect = itemRef.value?.getBoundingClientRect() ?? {
        x: 0,
        width: props.baseItemSize,
      };
      return val - rect.x - props.baseItemSize / 2;
    });

    const targetSize = useTransform(
      mouseDistance,
      [-props.distance, 0, props.distance],
      [props.baseItemSize, props.magnification, props.baseItemSize]
    );
    const size = useSpring(targetSize, props.spring);

    let unsubscribeSize: (() => void) | null = null;

    onMounted(() => {
      unsubscribeSize = size.on("change", (latest: number) => {
        currentSize.value = latest;
      });
    });

    onUnmounted(() => {
      if (unsubscribeSize) {
        unsubscribeSize();
      }
    });

    const handleHoverStart = () => {
      isHovered.set(1);
      if (props.title && props.setDockTitle) {
        props.setDockTitle(props.title);
      }
    };
    const handleHoverEnd = () => {
      isHovered.set(0);
      if (props.setDockTitle) {
        props.setDockTitle("欢迎来到fan时光");
      }
    };
    const handleFocus = () => isHovered.set(1);
    const handleBlur = () => isHovered.set(0);

    return {
      itemRef,
      size,
      currentSize,
      isHovered,
      handleHoverStart,
      handleHoverEnd,
      handleFocus,
      handleBlur,
    };
  },
  render() {
    const icon =
      typeof this.item.icon === "function" ? this.item.icon() : this.item.icon;

    return h(
      "div",
      {
        ref: "itemRef",
        style: {
          width: this.currentSize + "px",
          height: this.currentSize + "px",
        },
        onMouseenter: this.handleHoverStart,
        onMouseleave: this.handleHoverEnd,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onClick: this.onClick,
        class: `dock-item ${this.className}`,
        tabindex: 0,
        role: "button",
        "aria-haspopup": "true",
      },
      [h(DockIcon, {}, () => [icon])]
    );
  },
});

const DockIcon = defineComponent({
  name: "DockIcon",
  props: {
    className: {
      type: String,
      default: "",
    },
  },
  render() {
    return h(
      "div",
      {
        class: `dock-icon ${this.className}`,
      },
      this.$slots.default?.()
    );
  },
});

export default defineComponent({
  name: "Dock",
  components: {
    DockItem,
  },
});
</script>

<style scoped lang="scss">
.dock-container {
  margin: 0 8px;
  display: flex;
  max-width: 100%;
  align-items: center;
}

.dock-panel {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  width: fit-content;
  gap: 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 248, 240, 0.4);
  padding: 0 20px 10px;
  background: rgba(255, 248, 240, 0.75);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(255, 182, 108, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.dock-item {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 253, 250, 0.95);
  border: 1px solid rgba(255, 228, 204, 0.5);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03),
    0 2px 4px -1px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08),
      0 4px 6px -2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    background: rgba(255, 250, 245, 0.98);
    border-color: rgba(255, 182, 108, 0.6);
  }

  &:focus {
    outline: 2px solid #f59e0b;
    outline-offset: 2px;
  }
}

.dock-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 暗色模式适配
:global(.dark) {
  .dock-panel {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .dock-item {
    background: rgba(30, 30, 30, 0.9);
    border-color: rgba(255, 255, 255, 0.15);

    &:hover {
      background: rgba(40, 40, 40, 0.95);
    }
  }
}

// 响应式设计
@media (max-width: 640px) {
  .dock-panel {
    gap: 12px;
    padding: 0 12px 6px;
  }
}
</style>
