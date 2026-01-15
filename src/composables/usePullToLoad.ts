// composables/usePullToLoad.ts
import { ref, type Ref } from 'vue'

interface UsePullToLoadOptions {
  threshold?: number
  onRefresh?: () => Promise<void>
  onLoadMore?: () => Promise<void>
  hasMore?: boolean | Ref<boolean>
  isLoading?: boolean | Ref<boolean>
}

export function usePullToLoad(options: UsePullToLoadOptions = {}) {
  const {
    threshold = 60,
    onRefresh,
    onLoadMore,
    hasMore = true,
    isLoading = false
  } = options

  const isTouching = ref(false)
  const startY = ref(0)
  const pullDistance = ref(0)
  const isPulling = ref(false)

  // 滚动容器引用
  let containerEl: HTMLElement | null = null

  // 获取响应式的值
  const getHasMore = () => typeof hasMore === 'boolean' ? hasMore : hasMore.value
  const getIsLoading = () => typeof isLoading === 'boolean' ? isLoading : isLoading.value

  // 检测是否在顶部
  const isAtTop = () => {
    if (!containerEl) return false
    return containerEl.scrollTop <= 0
  }

  // 检测是否到底部
  const isAtBottom = () => {
    if (!containerEl) return false
    const { scrollTop, scrollHeight, clientHeight } = containerEl
    return scrollTop + clientHeight >= scrollHeight - threshold
  }

  // Touch事件（移动端）
  const onTouchStart = (e: TouchEvent) => {
    if (getIsLoading()) return
    isTouching.value = true
    startY.value = e.touches[0]?.clientY ?? 0
    pullDistance.value = 0
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!isTouching.value || getIsLoading() || !isAtTop()) return

    const touch = e.touches[0]
    if (!touch) return
    const currentY = touch.clientY
    const deltaY = currentY - startY.value

    if (deltaY > 0 && onRefresh) {
      e.preventDefault()
      pullDistance.value = Math.min(deltaY, threshold * 1.5)
      isPulling.value = pullDistance.value > 0
    }
  }

  const onTouchEnd = async () => {
    if (!isTouching.value || getIsLoading()) return
    isTouching.value = false

    if (pullDistance.value >= threshold && onRefresh) {
      await onRefresh()
    }

    pullDistance.value = 0
    isPulling.value = false
  }

  // 鼠标事件（PC端）
  const onMouseDown = (e: MouseEvent) => {
    if (getIsLoading()) return
    isTouching.value = true
    startY.value = e.clientY
    pullDistance.value = 0
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!isTouching.value || getIsLoading() || !isAtTop()) return

    const currentY = e.clientY
    const deltaY = currentY - startY.value

    if (deltaY > 0 && onRefresh) {
      e.preventDefault()
      pullDistance.value = Math.min(deltaY, threshold * 1.5)
      isPulling.value = pullDistance.value > 0
    }
  }

  const onMouseUp = async () => {
    if (!isTouching.value || getIsLoading()) return
    isTouching.value = false

    if (pullDistance.value >= threshold && onRefresh) {
      await onRefresh()
    }

    pullDistance.value = 0
    isPulling.value = false
  }

  // 滚动事件
  const onScroll = async () => {
    if (getIsLoading() || !getHasMore()) return
    if (isAtBottom() && onLoadMore) {
      await onLoadMore()
    }
  }

  // 绑定事件
  const bindEvents = (el: HTMLElement) => {
    containerEl = el
    // 移动端事件
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    // PC端事件
    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mouseleave', onMouseUp)
    // 滚动事件
    el.addEventListener('scroll', onScroll)
  }

  const unbindEvents = () => {
    if (!containerEl) return
    // 移动端事件
    containerEl.removeEventListener('touchstart', onTouchStart)
    containerEl.removeEventListener('touchmove', onTouchMove)
    containerEl.removeEventListener('touchend', onTouchEnd)
    // PC端事件
    containerEl.removeEventListener('mousedown', onMouseDown)
    containerEl.removeEventListener('mousemove', onMouseMove)
    containerEl.removeEventListener('mouseup', onMouseUp)
    containerEl.removeEventListener('mouseleave', onMouseUp)
    // 滚动事件
    containerEl.removeEventListener('scroll', onScroll)
  }

  return {
    isPulling,
    pullDistance,
    bindEvents,
    unbindEvents
  }
}
