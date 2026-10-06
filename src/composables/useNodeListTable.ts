import { computed } from 'vue'
import { DEFAULT_NODE_LIST_ROW_HEIGHT } from '@/constants/nodeListTable'
import { useAppStore } from '@/stores/app'

/** 与 NodeList 一致的列表行高（主题 listRowHeight 优先，否则用统一默认值） */
export function useNodeListTable() {
  const appStore = useAppStore()

  const resolvedRowHeight = computed(() => {
    const configured = appStore.listRowHeight?.trim()
    return configured || DEFAULT_NODE_LIST_ROW_HEIGHT
  })

  const listTableStyle = computed(() => ({
    '--node-list-row-height': resolvedRowHeight.value,
  }))

  return { listTableStyle, resolvedRowHeight }
}
