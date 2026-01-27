<template>
  <el-container class="blog-layout">
    <!-- 顶部导航栏 -->
    <el-header class="blog-header">
      <Header />
    </el-header>

    <!-- 主体内容区 -->
    <el-main class="blog-main">
      <router-view v-slot="{ Component }">
        <transition name="el-fade-in-linear" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>

    <!-- 底部版权栏 -->
    <el-footer class="blog-footer">
      <p>© 2026 Vue3+TS 个人博客 | 所有文章原创 转载请注明出处</p>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import Header from './header/index.vue'
</script>

<style scoped lang="scss">
// 根布局容器 - 全屏铺满，无滚动条溢出
.blog-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

// 顶部导航栏容器 - 适配你的Header组件高度，无多余间距
.blog-header {
  padding: 0;
  margin: 0;
  height: auto !important; // 关键：让header高度自适应你的导航组件，不再固定60px
  line-height: normal;
  background-color: var(--blog-backgroud-color); // 和你的header组件背景色统一
  box-shadow: var(--blog-header-box-shadow); // 导航栏底部轻阴影，层次感拉满
}

.blog-main {
  flex: 1; // 自动占满除header+footer外的所有剩余高度
  width: 100%;
  max-width: 100%; 
  margin: 0 auto; // 内容水平居中
  padding: 14px 10px; // 上下左右留白，内容不贴边
  box-sizing: border-box;
  overflow-y: auto; // 内容超出时，只在主体区滚动，顶部导航固定不动
  background-color: #f9fafb2a;
  // 1. Chrome/Safari/Edge 浏览器：隐藏滚动条占位，仅hover/滚动时显示
  &::-webkit-scrollbar {
    width: 0px; // 初始滚动条宽度为0（隐藏占位）
    height: 0px;
  }
  // 内容溢出时，滚动条hover/激活时显示
  &:hover::-webkit-scrollbar {
    width: 6px; // 显示滚动条（宽度可自定义）
  }
  // 滚动激活状态：强制显示滚动条
  // &.scroll-active::-webkit-scrollbar {
  //   width: 6px;
  // }

  // 滚动条轨道样式
  &::-webkit-scrollbar-track {
    background: transparent; // 轨道透明，无多余底色
    border-radius: 3px;
  }
  // 滚动条滑块样式
  &::-webkit-scrollbar-thumb {
    background: #d1d5db; // 滑块浅灰色
    border-radius: 3px;
    &:hover {
      background: #94a3b8; // hover时加深
    }
  }
}

// 底部版权栏
.blog-footer {
  height: 35px !important;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--blog-backgroud-color);
  border-top: var(--blog-footer-border-top);
  p {
    color: #94a3b8;
    font-size: 13px;
    margin: 0;
  }
}

// 覆盖ElementPlus默认样式，去掉自带的margin/padding，避免布局错乱
:deep(.el-container) {
  padding: 0;
  margin: 0;
}
</style>