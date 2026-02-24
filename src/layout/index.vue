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

      <!-- 全局回到顶部组件 -->
      <el-backtop 
        class="blog-backtop-btn" 
        target=".blog-main"
        :visibility-height="200"            
        :bottom="100"            
      >
        <!-- <svg-icon icon-class="back_to_top"/> -->
        <el-icon><Top /></el-icon>
      </el-backtop>
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
  position: relative; // 关键：为Backtop提供定位参考
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

// ===================== 回到顶部按钮样式 =====================
.blog-backtop-btn {
  height: 100%;
  width: 100%;
  line-height: 48px;
  text-align: center;
  border-radius: 12px;
  // 主背景：渐变+半透明，适配不同背景色
  background: linear-gradient(135deg, var(--blog-backgroud-color, #ffffff) 0%, #f8fafc 100%);
  color: #64748b;
  font-size: 20px; // 图标放大，更醒目
  // 多层阴影：外层柔化阴影+内层轻微高光，提升立体感
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08), // 外层柔化阴影
    inset 0 1px 0 rgba(255, 255, 255, 0.8); // 内层高光
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); // 缓动曲线更丝滑
  border: 1px solid #e2e8f0;
  // 防止图标错位
  display: flex;
  align-items: center;
  justify-content: center;
  // 鼠标悬浮样式
  &:hover {
    // 主题色渐变，更有层次感
    background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
    color: #fff;
    // 悬浮动效：轻微放大+上移+阴影强化
    transform: translateY(-3px) scale(1.05);
    box-shadow: 
      0 8px 20px rgba(64, 158, 255, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    // 边框变色，和主题色统一
    border-color: #409eff;
  }
  // 点击按压效果
  &:active {
    transform: translateY(-1px) scale(0.98);
    box-shadow: 
      0 2px 8px rgba(64, 158, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    // 按压时圆角轻微缩小，强化质感
    border-radius: 10px;
  }
  // 图标内部微调，居中更精准
  :deep(.el-icon) {
    font-size: inherit;
    line-height: 1;
  }
}

// 确保Backtop组件层级，不被遮挡
:deep(.el-backtop) {
  z-index: 999;
  width: 48px;
  height: 48px;
}
</style>
