  // History API 相关状态
 export const ModalAndDrawer_STATE_KEY = 'PostDetailModal-Open'

export const markedAndPushNewState: () => void = () => {
      history.replaceState({ [ModalAndDrawer_STATE_KEY]: true, timestamp: Date.now() }, '', location.href)
      // 再 push 一个空状态，这样用户返回时会触发 popstate
      history.pushState({}, '', location.href)
}
