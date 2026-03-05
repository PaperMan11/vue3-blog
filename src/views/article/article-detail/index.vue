<template>
  <div class="article-page">
    <!-- 主容器：文章内容 + 侧边目录 -->
    <div class="article-main-container">
      <!-- 文章容器 -->
      <div class="article-container">
        <!-- 文章主内容（包含头部和内容） -->
        <ArticleMain :article-info="articleInfo" @like="handleLike" />
      </div>
    </div>

    <!-- 评论区域 -->
    <ArticleComments
      :comments="comments"
      @comment-added="handleCommentAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ArticleMain from './components/ArticleMain.vue';
import ArticleComments from './components/ArticleComments.vue';

// 1. 定义类型接口
interface ArticleInfo {
  title: string;
  createdTime: string;
  updatedTime: string;
  author: string;
  content: string;
  views: number;
  likes: number;
  comments: number;
}

// 评论类型
interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
  images: string[];
  replies?: Reply[];
  replyCount?: number;
  isExpanded?: boolean;
}

// 回复类型
interface Reply {
  id: number;
  author: string;
  content: string;
  time: string;
  replyTo: string;
}

// 2. 定义文章数据
const articleInfo = ref<ArticleInfo>({
  title: 'Vue3 + TS 实现Markdown文章展示',
  createdTime: '2026-02-24',
  updatedTime: '2026-02-25',
  author: 'Vue开发者',
  views: 1234,
  likes: 567,
  comments: 89,
  content: `
# Markdown 一级标题
这是用 Vue3 + TypeScript 渲染的Markdown文章示例。

## **二级标题 - 代码高亮演示**
### \`三级标题 - TypeScript示例\`
\`\`\`typescript
// Vue3 + TS 示例代码
import { ref, computed } from 'vue';

const count = ref<number>(0);
const doubleCount = computed(() => count.value * 2);

const increment = (): void => {
  count.value++;
};
\`\`\`

## 二级标题 - 列表示例
### 三级标题 - 无序列表
- Vue3 特性
  - **组合式API**
  - TypeScript支持
  - \`更小的体积\`

### 三级标题 - 有序列表
1. 初始化项目
2. 安装依赖
3. 编写代码


- [X] 任务项1
- [ ] 任务项2
- [ ] 任务项3
- [ ] 任务项4

  `.trim()
});

// 4. 评论相关数据
const comments = ref<Comment[]>([
  {
    id: 1,
    author: '用户1',
    content: '这篇文章写得真好！😊',
    time: '2026-03-01 10:00',
    images: [],
    replies: [
      {
        id: 101,
        author: '用户3',
        content: '是的，我也这么认为',
        time: '2026-03-01 11:00',
        replyTo: '用户1'
      },
      {
        id: 102,
        author: '用户4',
        content: '学到了很多',
        time: '2026-03-01 12:00',
        replyTo: '用户1'
      }
    ],
    replyCount: 2,
    isExpanded: false
  },
  {
    id: 2,
    author: '用户2',
    content: '学习了很多新知识',
    time: '2026-03-02 14:30',
    images: [],
    replies: [],
    replyCount: 0,
    isExpanded: false
  }
]);

// 处理评论添加
const handleCommentAdded = (comment: Comment) => {
  comments.value.unshift(comment);
  articleInfo.value.comments++;
};

// 处理点赞
const handleLike = (likes: number) => {
  articleInfo.value.likes = likes;
};
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
