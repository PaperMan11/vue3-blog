<template>
  <el-card class="clock-container">
    <div class="clock-header">
      <svg-icon icon-class="time"/>
      <span>时钟</span>
    </div>
    <div class="split-line"></div>
    <div class="clock-content">
      <div class="date-text">{{ currentDate }}</div>
      <div class="time-text">{{ currentTime }}</div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式日期和时间
const currentDate = ref('')
const currentTime = ref('')

// 补零方法：个位数前面补0 (例: 9 → 09, 5 → 05)
const addZero = (num: number) => num.toString().padStart(2, '0')

// 星期中文转换
const getWeekText = (week: number) => {
  const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekList[week]
}

// 更新日期和时间的核心方法
const updateClock = () => {
  const now = new Date()
  // 日期：2026年01月17日 星期六
  currentDate.value = `${now.getFullYear()}年${addZero(now.getMonth() + 1)}月${addZero(now.getDate())}日 ${getWeekText(now.getDay())}`
  // 时间：18:25:36 实时跳动
  currentTime.value = `${addZero(now.getHours())}:${addZero(now.getMinutes())}:${addZero(now.getSeconds())}`
}

// 定时器：每秒更新一次时间
let timer: NodeJS.Timeout | null = null
onMounted(() => {
  updateClock() // 初始化执行一次
  timer = setInterval(updateClock, 1000)
})

// 组件销毁时清除定时器，防止内存泄漏
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.clock-container {
  width: 100%;
  box-sizing: border-box;
}

// 时钟头部：图标+标题 居中布局，和公告栏头部样式一致
.clock-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 6px;

  .el-icon-time {
    color: #409eff; // 主题色，和用户卡统计数字/公告栏图标同色
    font-size: 20px;
  }
}

.split-line {
  width: 40px;
  height: 1px;
  background-color: #e5e7eb;
  margin: 2px auto 12px;
}

// 时钟内容区域：日期+时间 居中排版
.clock-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 6px 0 12px;
  border-radius: 8px;
  transition: all 0.22s ease-in-out; // 和其他组件一致的过渡动画

  // 全站统一悬浮样式
  &:hover {
    background-color: #f9fafb;
    color: #409eff;
  }

  // 日期文字样式
  .date-text {
    font-size: 15px;
    color: #606266;
    line-height: 1.6;
  }

  // 时间文字样式（放大突出，核心展示）
  .time-text {
    font-size: 26px;
    font-weight: 700;
    color: #409eff;
    line-height: 1.5;
    letter-spacing: 2px; // 字间距，更美观
  }
}
</style>
