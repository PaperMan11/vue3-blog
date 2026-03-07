<template>
  <div class="article-page">
    <!-- 主容器：文章内容 + 侧边目录 -->
    <div class="article-main-container">
      <!-- 文章容器 -->
      <div class="article-container">
        <!-- 文章主内容（包含头部和内容） -->
        <ArticleMain :article-id="articleId" />
      </div>
    </div>

    <!-- 评论区域 -->
    <ArticleComments :article-id="articleId" :target-comment-id="targetCommentId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ArticleMain from './components/ArticleMain.vue';
import ArticleComments from './components/ArticleComments.vue';
import { useRoute } from 'vue-router';

// 从URL哈希中获取评论ID
const getTargetCommentId = () => {
  const hash = window.location.hash;
  if (hash) {
    // 解析哈希值，格式为 #comment-123
    const match = hash.match(/^#comment-(\d+)$/);
    if (match && match[1]) {
      return parseInt(match[1]);
    }
  }
  return undefined;
};

// 目标评论ID（从URL哈希中获取）
const targetCommentId = ref<number | undefined>(getTargetCommentId());

// 从路由参数中获取文章ID
const route = useRoute();
const articleId = ref<number>(Number(route.params.id) || 0);

// 监听URL哈希变化
const handleHashChange = () => {
  targetCommentId.value = getTargetCommentId();
};

// 组件挂载时添加哈希变化监听
onMounted(() => {
  window.addEventListener('hashchange', handleHashChange);
});

// 组件卸载时移除哈希变化监听
onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange);
});
</script>

<style scoped>
/* ===================== 全局页面基础样式 ===================== */
/* 页面根容器：设置全局字体、行高、背景色和最小高度 */
.article-page {
  /* 字体栈：优先使用Inter，兼容中文字体（苹方/微软雅黑），兜底无衬线字体 */
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  /* 行高1.8：提升长文本阅读体验（符合中文排版最佳实践） */
  line-height: 1.8;
  /* 主文本色：深灰色，避免纯黑减少视觉疲劳 */
  color: #333;
  /* 页面背景色：浅灰色，与白色内容区形成对比 */
  background-color: #f8f9fa;
  /* 最小高度占满视口：避免内容不足时页面高度不够 */
  min-height: 100vh;
  /* 上下内边距：让内容与浏览器边缘保持间距 */
  padding: 20px 0;
}

/* ===================== 主布局容器样式 ===================== */
/* 主容器：包含文章内容+侧边目录，实现横向布局 */
.article-main-container {
  /* Flex布局：实现侧边栏+内容区的横向排列 */
  display: flex;
  /* 最大宽度：限制内容宽度，避免大屏下文本行过长 */
  max-width: 1200px;
  /* 水平居中：让容器在页面中居中显示 */
  margin: 0 auto;
  /* 间隙：侧边栏与内容区之间的间距 */
  gap: 30px;
  /* 左右内边距：小屏下保留侧边间距 */
  padding: 0 20px;
}

/* 文章容器：自适应宽度，卡片样式 */
.article-container {
  /* 弹性伸缩：占满剩余宽度 */
  flex: 1;
  /* 卡片样式：与侧边栏统一视觉风格 */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  /* 内边距：内容与容器边缘的间距，上下大于左右提升阅读体验 */
  padding: 40px;
}

@media (max-width: 768px) {
  .article-container {
    padding: 20px;
  }
}
</style>
