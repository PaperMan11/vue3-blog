<template>
  <el-container class="blog-layout">
    <!-- 顶部导航栏 - 你的Header组件 -->
    <el-header class="blog-header">
      <Header />
    </el-header>

    <!-- 主体内容区 - 路由视图 + 你保留的过渡动画 -->
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

// 核心主体内容区 - 重中之重，解决滚动/留白/居中问题
.blog-main {
  flex: 1; // 关键：自动占满除header+footer外的所有剩余高度
  width: 100%;
  max-width: 100%; // 博客标配：内容最大宽度，大屏不会撑满，阅读更舒适
  margin: 0 auto; // 内容水平居中
  padding: 14px 10px; // 上下左右留白，内容不贴边
  box-sizing: border-box;
  overflow-y: auto; // 内容超出时，只在主体区滚动，顶部导航固定不动
  background-color: #f9fafb2a; // 柔和背景色，护眼，符合博客阅读场景
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