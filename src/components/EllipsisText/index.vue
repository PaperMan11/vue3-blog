<template>
  <span 
    class="text-ellipsis-count" 
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    {{ isHover ? text : ellipsisText }}
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  text: { type: String, required: true, default: '' },
  showCount: { type: Number, default: 20 }, // 默认显示前20字
  showEllipsis: { type: Boolean, default: true }
})

// 悬浮状态控制
const isHover = ref(false)

// 按字数截取逻辑
const ellipsisText = computed(() => {
  const { text, showCount, showEllipsis } = props
  if (!text || text.length <= showCount) return text
  const subText = text.substring(0, showCount)
  return showEllipsis ? `${subText}...` : subText
})
</script>

<style scoped lang="scss">
.text-ellipsis-count {
  display: inline-block;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
    color: #409eff;
    padding: 2px 4px;
    border-radius: 2px;
  }
}
</style>