<template>
  <!-- 外部图标渲染：适用于 http/https 开头的在线 SVG 链接 -->
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-bind="$attrs"
  />

  <!-- 本地 SVG 图标渲染：适用于 svg-sprite 生成的本地图标 -->
  <svg
    v-else
    :class="svgClass"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <!-- 引用 svg-sprite 中的图标 symbol -->
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isExternal as isExternalUrl } from '@/utils/validate'

/**
 * SVG 图标通用组件（Vue3 + TS 版本）
 * 支持两种使用方式：
 * 1. 本地 SVG 图标：基于 svg-sprite-loader/vite-plugin-svg-icons，传入图标名称（如 iconClass="user"）
 * 2. 外部 SVG 图标：传入完整的在线 SVG 链接（如 iconClass="https://xxx.com/icon.svg"）
 *
 * 使用示例：
 * <SvgIcon iconClass="user" className="icon-large" @click="handleClick" /> <!-- 本地图标 + 点击事件 -->
 * <SvgIcon iconClass="https://xxx.com/icon.svg" size="24" color="#409eff" /> <!-- 外部图标 + 自定义样式 -->
 */

// 定义组件 Props 并添加 TS 类型约束
interface SvgIconProps {
  /** 本地图标名称或外部 SVG 链接（必传） */
  iconClass: string
  /** 自定义样式类名（可选） */
  className?: string
}

// 定义 Props 并设置默认值
const props = withDefaults(defineProps<SvgIconProps>(), {
  className: '' // 自定义类名默认空
})

/**
 * 判断是否为外部图标（http/https/mailto/tel 开头）
 * @returns {boolean} true=外部图标，false=本地图标
 */
const isExternal = computed(() => {
  return isExternalUrl(props.iconClass)
})

/**
 * 拼接本地 SVG 图标的引用 ID（对应 svg-sprite 的 symbol ID）
 * @returns {string} 如 #icon-user
 */
const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})

/**
 * 拼接图标最终的样式类名
 * @returns {string} 基础类名 + 自定义类名
 */
const svgClass = computed(() => {
  return props.className ? `svg-icon ${props.className}` : 'svg-icon'
})

/**
 * 外部图标样式：通过 mask 实现 SVG 颜色继承 currentColor
 * @returns {Record<string, string>} 样式对象
 */
const styleExternalIcon = computed(() => {
  return {
    // mask 属性：将外部 SVG 作为遮罩，实现颜色自定义
    mask: `url(${props.iconClass}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`, // 兼容webkit内核
    maskSize: 'cover' // 遮罩大小覆盖容器
  } as const
})

// 组件暴露的属性（可选，若父组件需要调用内部属性）
defineExpose({
  isExternal,
  iconName
})
</script>

<style scoped>
/* 基础 SVG 图标样式 */
.svg-icon {
  width: 1em;          /* 图标宽度：基于字体大小自适应 */
  height: 1em;         /* 图标高度：与宽度一致 */
  vertical-align: -0.15em; /* 垂直对齐：修正图标与文字的基线偏差 */
  fill: currentColor;  /* 填充色：继承父元素的 color 属性，方便修改颜色 */
  overflow: hidden;    /* 隐藏溢出内容 */
}

/* 外部 SVG 图标样式 */
.svg-external-icon {
  background-color: currentColor; /* 背景色：配合 mask 实现颜色显示 */
  mask-size: cover !important;    /* 强制遮罩大小覆盖容器 */
  display: inline-block;          /* 行内块级：与文字同行显示 */
  width: 1em;                     /* 与本地图标保持一致的大小 */
  height: 1em;
}
</style>