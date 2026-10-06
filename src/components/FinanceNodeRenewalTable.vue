<script setup lang="ts">
import type { NodeData } from '@/stores/nodes'
import { NBadge, NEmpty, NList, NListItem, NTag, NText } from 'naive-ui'
import NodeListNameCell from '@/components/NodeListNameCell.vue'
import { useAppStore } from '@/stores/app'
import { getRegionCode, getRegionDisplayName } from '@/utils/regionHelper'
import { formatPriceWithCycle } from '@/utils/tagHelper'

export interface FinanceNodeTableRow {
  key: string
  node: NodeData
  expiredAt: Date | null
  daysLeft: number
  renewalCNY: number
}

defineProps<{
  title: string
  summary: string
  rows: FinanceNodeTableRow[]
  emptyDescription: string
  listTableStyle: Record<string, string>
  gridStyle: Record<string, string>
  listSurfaceClass: unknown[]
  nodes: NodeData[]
  formatAmount: (amount: number) => string
  formatExpiryDate: (date: Date) => string
  formatRemainingDays: (daysLeft: number) => string
}>()

const emit = defineEmits<{
  openNode: [node: NodeData]
}>()

const appStore = useAppStore()

function getFlagSrc(region: string): string {
  return `/images/flags/${getRegionCode(region)}.svg`
}
</script>

<template>
  <div class="finance-table-block flex flex-col gap-2">
    <div class="flex flex-wrap gap-2 items-baseline justify-between">
      <NText class="text-sm font-semibold">
        {{ title }}
      </NText>
      <NText depth="3" class="text-sm">
        {{ summary }}
      </NText>
    </div>
    <div class="node-list-table" :style="listTableStyle">
      <NList
        hoverable
        clickable
        bordered
        class="node-list-table__scroll app-scrollbar min-w-fit w-full"
        :class="listSurfaceClass"
      >
        <template #header>
          <div class="node-list-header panel-list-grid" :style="gridStyle">
            <div class="node-list-header__status">
              <NText :depth="3" class="text-xs">
                状态
              </NText>
            </div>
            <div class="node-list-header__region">
              <NText :depth="3" class="text-xs">
                地区
              </NText>
            </div>
            <div class="node-list-header__name">
              <NText :depth="3" class="text-xs">
                节点
              </NText>
            </div>
            <NText :depth="3" class="text-xs">
              到期
            </NText>
            <NText :depth="3" class="text-xs">
              剩余
            </NText>
            <NText :depth="3" class="text-xs">
              计费
            </NText>
            <NText :depth="3" class="text-xs text-right">
              续费
            </NText>
          </div>
        </template>
        <NListItem v-if="rows.length === 0" class="node-list-row">
          <NEmpty :description="emptyDescription" size="small" />
        </NListItem>
        <NListItem
          v-for="row in rows"
          :key="row.key"
          class="node-list-row"
          @click="emit('openNode', row.node)"
        >
          <div class="node-list-item panel-list-grid" :style="gridStyle">
            <div class="node-list-item__status panel-list-grid__status">
              <NTag v-if="appStore.listStatusStyle === 'tag'" :type="row.node.online ? 'success' : 'error'" size="small">
                {{ row.node.online ? '在线' : '离线' }}
              </NTag>
              <NBadge v-else :type="row.node.online ? 'success' : 'error'" :value="row.node.online ? '在线' : '离线'" />
            </div>
            <div class="node-list-item__region panel-list-grid__region">
              <img
                v-if="row.node.region"
                :src="getFlagSrc(row.node.region)"
                :alt="getRegionDisplayName(row.node.region)"
                class="region-flag"
              >
            </div>
            <NodeListNameCell :node="row.node" :nodes="nodes" subline-mode="list" />
            <NText depth="3" class="text-sm tabular-nums" :style="{ fontFamily: appStore.numberFontFamily }">
              {{ row.expiredAt && Number.isFinite(row.expiredAt.getTime()) ? formatExpiryDate(row.expiredAt) : '—' }}
            </NText>
            <NText depth="3" class="text-sm tabular-nums" :style="{ fontFamily: appStore.numberFontFamily }">
              {{ row.node.expired_at ? formatRemainingDays(row.daysLeft) : '—' }}
            </NText>
            <NText depth="3" class="text-sm truncate">
              {{ formatPriceWithCycle(row.node.price, row.node.billing_cycle, row.node.currency, appStore.lang) }}
            </NText>
            <NText class="text-sm font-semibold text-right tabular-nums" :style="{ fontFamily: appStore.numberFontFamily }">
              {{ formatAmount(row.renewalCNY) }}
            </NText>
          </div>
        </NListItem>
      </NList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.panel-list-grid {
  width: 100%;
  min-width: 880px;
}

.text-right {
  text-align: right;
}
</style>
