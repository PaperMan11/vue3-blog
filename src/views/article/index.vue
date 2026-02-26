<template>
  <div class="article-page">
    <!-- 主容器：侧边目录 + 文章内容 -->
    <div class="article-main-container">
      <!-- 文章容器 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ articleInfo.title }}</h1>
        
        <!-- 文章元信息 -->
        <div class="article-meta">
          <div class="article-author">
            <div>发布：{{ articleInfo.createdTime }}</div>
            <div>更新：{{ articleInfo.updatedTime }}</div>
            <div>作者：{{ articleInfo.author }}</div>
          </div>
          <div class="article-stat">
            <div>访问量:{{ articleInfo.views }}</div>
            <div>评论数:{{ articleInfo.comments }}</div>
            <div>点赞量:{{ articleInfo.likes }}</div>
          </div>
        </div>
        
        <!-- Markdown内容渲染区域（添加v-if确保渲染器配置完成后再渲染） -->
        <div 
          class="markdown-content"
          v-if="isRendererReady"
          v-html="renderedMarkdown"
        ></div>
      </div>

      <!-- 侧边目录 -->
      <div class="sidebar">
        <div class="sidebar-title">文章目录</div>
        <ul class="toc-list" v-if="tocData.length">
          <li 
            v-for="(item, index) in tocData" 
            :key="index"
            :class="['toc-item', `toc-level-${item.level}`]"
          >
            <a 
              :href="`#${item.id}`"
              class="toc-link"
              @click="handleTocClick"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
        <div class="empty-toc" v-else>暂无目录</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { marked, Renderer, type Tokens } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.min.css';

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

// 目录项类型
interface TocItem {
  text: string; // 标题文本
  level: number; // 标题层级（1-6）
  id: string; // 锚点ID
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
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
3. 编写代码
  `.trim()
});

// 3. 定义目录数据
const tocData = ref<TocItem[]>([]); // 目录数据
let titleIndex = 0; // 标题计数器
const isRendererReady = ref(false); // 渲染器配置完成开关

// 辅助函数：从tokens中提取标题纯文本
const extractHeadingText = (tokens: Tokens.Heading['tokens'] | undefined): string => {
  let text = '';
  tokens?.forEach(token => {
    if (token.type === 'text') {
      text += token.text;
    } else if (token.type === 'strong' || token.type === 'em') {
      text += extractHeadingText(token.tokens);
    }
  });
  return text;
};

// 4. 配置marked渲染器（同步执行，确保parse前生效）
const renderer = new Renderer();
// 重置目录数据和计数器
tocData.value = [];
titleIndex = 0;

// 重载heading方法（此时配置，marked.parse时能生效）
renderer.heading = ({ tokens, depth }: Tokens.Heading) => {
  // console.log('Rendering heading:', { tokens, depth });
  const anchorId = `heading-${titleIndex++}`;
  const pureText = extractHeadingText(tokens);
  
  // 目录数据正常收集
  tocData.value.push({
    text: pureText,
    level: depth,
    id: anchorId
  });

  // 渲染标题（用纯文本避免重复解析，保留原样式）
  return `<h${depth} id="${anchorId}">${pureText}</h${depth}>`;
};

// 重载code方法实现代码高亮
renderer.code = ({ text, lang }: Tokens.Code) => {
  // console.log('Rendering code block:', { text, lang });
  let highlightedCode = '';
  if (lang && hljs.getLanguage(lang)) {
    highlightedCode = hljs.highlight(text, { language: lang }).value;
  } else {
    highlightedCode = hljs.highlightAuto(text).value;
  }
  return `<pre><code class="language-${lang || 'plain'}">${highlightedCode}</code></pre>`;
};

// 配置marked（同步执行，确保parse前生效）
marked.setOptions({
  renderer: renderer,
  breaks: true,
  gfm: true
});

// 5. 计算属性：解析Markdown为HTML（仅当渲染器就绪后执行）
const renderedMarkdown = computed(() => {
  if (!isRendererReady.value) return ''; // 未就绪时返回空
  return marked.parse(articleInfo.value.content);
});

// 6. onMounted中打开开关（确保DOM挂载后再渲染Markdown）
onMounted(() => {
  isRendererReady.value = true;
});

// 7. 处理目录点击
const handleTocClick = (e: Event) => {
  e.preventDefault();
  const target = e.target as HTMLAnchorElement;
  const anchorId = target.getAttribute('href')?.slice(1);
  if (!anchorId) return;

  const element = document.getElementById(anchorId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
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

/* ===================== 侧边目录样式 ===================== */
/* 侧边栏容器：固定宽度，粘性定位（滚动时固定在顶部） */
.sidebar {
  /* 固定宽度：不随内容伸缩 */
  width: 280px;
  /* 禁止收缩：确保宽度固定，不受Flex布局影响 */
  flex-shrink: 0;
  /* 背景色：白色卡片样式 */
  background-color: #fff;
  /* 圆角：柔和的卡片边角 */
  border-radius: 8px;
  /* 阴影：轻微阴影提升层次感 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  /* 内边距：内容与容器边缘的间距 */
  padding: 20px;
  /* 高度自适应内容：避免空容器高度异常 */
  height: fit-content;
  /* 粘性定位：滚动时固定在视口顶部（top:20px） */
  position: sticky;
  top: 20px;
  /* 最大高度：限制侧边栏高度，内容过多时滚动 */
  max-height: calc(100vh - 40px);
  /* 纵向滚动：内容超出最大高度时显示滚动条 */
  overflow-y: auto;
}

/* 侧边栏标题：目录标题样式 */
.sidebar-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  /* 下边框：分隔标题与目录列表 */
  border-bottom: 1px solid #eee;
}

/* 目录列表：重置默认列表样式 */
.toc-list {
  list-style: none; /* 移除默认列表圆点 */
  padding: 0;       /* 移除默认内边距 */
  margin: 0;        /* 移除默认外边距 */
}

/* 目录列表项：统一上下间距 */
.toc-item {
  margin: 8px 0;
}

/* 目录层级缩进：不同层级标题的缩进距离，区分层级关系 */
.toc-level-1 { padding-left: 0; }    /* 一级标题：无缩进 */
.toc-level-2 { padding-left: 10px; } /* 二级标题：缩进10px */
.toc-level-3 { padding-left: 20px; } /* 三级标题：缩进20px */
.toc-level-4 { padding-left: 30px; } /* 四级标题：缩进30px */
.toc-level-5 { padding-left: 40px; } /* 五级标题：缩进40px */
.toc-level-6 { padding-left: 50px; } /* 六级标题：缩进50px */

/* 目录链接样式：基础样式 + hover效果 */
.toc-link {
  color: #333;                /* 链接默认颜色 */
  text-decoration: none;      /* 移除默认下划线 */
  font-size: 0.95rem;         /* 略小于正文，突出正文层级 */
  transition: color 0.2s;     /* 颜色过渡：hover时平滑变色 */
}
/* 链接hover状态：变色+下划线，提示可点击 */
.toc-link:hover {
  color: #0066cc;
  text-decoration: underline;
}

/* 空目录提示：无标题时显示的占位样式 */
.empty-toc {
  color: #888;         /* 浅灰色，弱化提示 */
  font-size: 0.9rem;   /* 小号字体 */
  text-align: center;  /* 居中显示 */
  padding: 10px 0;     /* 上下内边距，增加点击区域 */
}

/* ===================== 文章内容容器样式 ===================== */
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

/* 文章标题：突出显示，底部边框分隔 */
.article-title {
  font-size: 2rem;      /* 大号字体，突出标题 */
  font-weight: 700;     /* 加粗 */
  margin-bottom: 20px;  /* 下外边距，与元信息分隔 */
  color: #222;          /* 比正文稍深，突出标题 */
  border-bottom: 1px solid #eee; /* 底部边框，视觉分隔 */
  padding-bottom: 15px; /* 下内边距，增加边框与文字的间距 */
}

/* 文章元信息：发布时间/作者，弱化显示 */
.article-meta {
  color: #888;         /* 浅灰色，不抢正文焦点 */
  font-size: 0.9rem;   /* 小号字体 */
  margin-bottom: 30px; /* 下外边距，与正文分隔 */
  /* 新增：Flex布局，左右分栏 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 新增：小屏自适应 */
  flex-wrap: wrap;
  gap: 16px;
  /* 浅灰色背景+圆角，区分元信息区域 */
  background-color: #fafafa;
  padding: 16px 20px;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

/* 作者/时间区域样式 */
.article-author {
  /* Flex横向排列，间距均匀 */
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

/* 统计数据区域样式 */
.article-stat {
  /* Flex横向排列，间距均匀 */
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  /* 右侧区域加浅边框分隔，视觉更清晰 */
  padding-left: 20px;
  border-left: 1px solid #e8e8e8;
}

/* 元信息子项样式优化 */
.article-author > div,
.article-stat > div {
  /* 图标+文字垂直居中 */
  display: inline-flex;
  align-items: center;
  gap: 6px;
  /* 防止文字挤压 */
  white-space: nowrap;
}

/* 为统计项添加简易图标（伪元素实现，无额外依赖） */
.article-stat > div::before {
  display: inline-block;
  width: 14px;
  height: 14px;
  font-size: 12px;
  line-height: 1;
}

/* 新增：访问量图标 */
.article-stat > div:nth-child(1)::before {
  content: '👁️';
}

/* 新增：评论数图标 */
.article-stat > div:nth-child(2)::before {
  content: '💬';
}

/* 新增：点赞量图标 */
.article-stat > div:nth-child(3)::before {
  content: '👍';
}

/* 新增：响应式适配：小屏时取消分隔线，全屏宽度 */
@media (max-width: 768px) {
  .article-meta {
    padding: 12px 16px;
  }
  .article-author,
  .article-stat {
    gap: 12px;
    width: 100%;
  }
  .article-stat {
    padding-left: 0;
    border-left: none;
    padding-top: 12px;
    border-top: 1px solid #e8e8e8;
  }
}

/* Markdown内容容器：基础字体大小 */
.markdown-content {
  font-size: 1rem;
}

/* ===================== Markdown内容深度样式（:deep穿透） ===================== */
/* 一级标题样式：调整字号和间距，scroll-margin-top避免滚动时被顶部遮挡 */
.markdown-content :deep(h1) {
  font-size: 1.8rem;
  margin: 25px 0 15px;
  scroll-margin-top: 20px; /* 锚点滚动偏移量 */
}

/* 二级标题样式 */
.markdown-content :deep(h2) {
  font-size: 1.6rem;
  margin: 20px 0 10px;
  scroll-margin-top: 20px;
}

/* 三级标题样式 */
.markdown-content :deep(h3) {
  font-size: 1.4rem;
  margin: 18px 0 8px;
  scroll-margin-top: 20px;
}

/* 四/五/六级标题样式：统一间距和偏移量 */
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 16px 0 8px;
  scroll-margin-top: 20px;
}

/* 段落样式：统一下外边距，提升可读性 */
.markdown-content :deep(p) { margin-bottom: 16px; }

/* 列表样式：无序列表/有序列表统一缩进和间距 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 10px 0 20px 25px; /* 左缩进25px，区分正文 */
}

/* 列表项样式：统一下外边距 */
.markdown-content :deep(li) { margin-bottom: 8px; }

/* 代码块样式：背景色+内边距+圆角+横向滚动 */
.markdown-content :deep(pre) {
  background-color: #f5f5f5; /* 浅灰色背景，区分正文 */
  padding: 16px;             /* 内边距，让代码有呼吸空间 */
  border-radius: 4px;        /* 圆角，柔和样式 */
  margin: 15px 0;            /* 上下外边距，分隔代码块与正文 */
  overflow-x: auto;          /* 代码过长时横向滚动 */
}

/* 行内代码/代码块文字样式：等宽字体，提升代码可读性 */
.markdown-content :deep(code) {
  font-family: "Consolas", "Monaco", monospace; /* 等宽字体，代码专用 */
  font-size: 0.9rem;                            /* 略小字体，紧凑显示 */
}

/* 引用块样式：左侧边框+背景色，区分引用内容 */
.markdown-content :deep(blockquote) {
  border-left: 4px solid #ddd; /* 左侧灰色边框，标识引用 */
  padding: 10px 15px;          /* 内边距 */
  margin: 15px 0;              /* 上下外边距 */
  background-color: #f9f9f9;   /* 浅灰色背景，弱化引用 */
}

/* 图片样式：自适应宽度，圆角，上下间距 */
.markdown-content :deep(img) {
  max-width: 100%; /* 不超出容器宽度 */
  border-radius: 4px;
  margin: 20px 0;
}

/* 链接样式：统一颜色和hover效果 */
.markdown-content :deep(a) {
  color: #0066cc;          /* 蓝色，符合用户对链接的视觉预期 */
  text-decoration: none;   /* 移除默认下划线 */
}
/* 链接hover状态：下划线提示可点击 */
.markdown-content :deep(a:hover) {
  text-decoration: underline;
}
</style>
