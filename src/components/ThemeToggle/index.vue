<!-- src/components/ThemeToggle.vue -->
<template>
  <div class="theme-toggle" @click="toggleTheme">
    <el-icon class="theme-icon">
      <Moon v-if="isDark" />
      <Sunny v-else />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import useAppStore from '@/stores/app'

const appStore = useAppStore()

// 初始化：读取本地缓存的主题状态，页面刷新不丢失
const theme = appStore.theme
const isDark = ref(theme === 'dark')
const isDarkMode = theme === 'dark' || (theme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
isDark.value = isDarkMode
document.documentElement.classList.toggle('dark', isDarkMode)

// 切换主题核心方法
const toggleTheme = () => {
  isDark.value = !isDark.value
  // 切换html根节点的class
  document.documentElement.classList.toggle('dark', isDark.value)
  // 本地缓存主题状态
  appStore.setTheme(isDark.value ? 'dark' : 'light')
}
</script>

<style scoped lang="scss">
.theme-toggle {
  cursor: pointer;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  border-radius: 18px;
  transition: all 0.25s ease;

  &:hover {
    background-color: var(--hover-color);
  }

  .theme-icon {
    font-size: 18px;
    color: var(--text-color);
  }
}
</style>
