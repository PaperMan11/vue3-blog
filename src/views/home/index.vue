<template>
  <div class="home-container">
    <!-- 左侧主内容区域 -->
    <div class="main-content">
      <div class="content-wrap">
        <ArticleList/>
      </div>
    </div>

    <!-- 右侧侧边栏区域 -->
    <div class="sider-bar">
      <information/>
      <notice/>
      <recommend/>
      <clock/>
    </div>   
  </div>
</template>

<script setup lang="ts">
import information from './components/information.vue'
import notice from './components/notice.vue'
import clock from './components/clock.vue'
import recommend from './components/recommend.vue'
import ArticleList from './components/article-list.vue'
</script>

<style scoped lang="scss">
// 全局外层容器 - 核心flex布局 自适应+间距优化
.home-container {
  display: flex;
  flex-wrap: wrap; // 小屏幕自动换行
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px; // 主内容区和侧边栏的间距
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  // background-color: #fafafa; 
}

// 左侧主内容区域 - 自适应宽度，独立滚动
.main-content {
  flex: 1; // 占满剩余宽度
  min-width: 600px; // 最小宽度，防止挤变形
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  padding: 30px 40px;
  box-sizing: border-box;
  background-color: #fff;

  // 内容内包裹层，防止文字贴边
  .content-wrap {
    width: 100%;
    text-align: center;
  }
}

// 右侧侧边栏 - 固定宽度，和你的3个卡片完美匹配
.sider-bar {
  width: 340px; // 固定宽度，和卡片的400px一致
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0; // 固定宽度，不被挤压
}
</style>