<template>
  <div class="article-main">
    <div class="article-content">
      <div class="content-main">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="10" animated />
        </div>

        <!-- 错误信息 -->
        <div v-else-if="error" class="error-container">
          <el-alert
            :title="error"
            type="error"
            show-icon
            :closable="false"
          />
        </div>

        <!-- 文章内容 -->
        <template v-else>
          <!-- 文章头部信息 -->
          <div class="article-header">
            <h1 class="article-title">{{ articleInfo.title }}</h1>
            <div class="article-meta">
              <div class="article-author">
                <div>发布：{{ articleInfo.createdTime }}</div>
                <div>更新：{{ articleInfo.updatedTime }}</div>
                <div>作者：{{ articleInfo.author }}</div>
              </div>
              <div class="article-stat">
                <div class="stat-item">
                  <svg-icon icon-class="reading" class="stat-icon" />
                  <span>{{ articleInfo.views }}</span>
                </div>
                <div class="stat-item">
                  <svg-icon icon-class="comment" class="stat-icon" />
                  <span>{{ articleInfo.comments }}</span>
                </div>
                <div class="stat-item like-section" :class="{ 'liked': isLiked }">
                  <svg-icon
                    :icon-class="isLiked ? 'like' : 'like-selected'"
                    class="stat-icon like-icon"
                    @click="handleLike"
                  />
                  <span>{{ articleInfo.likes }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Markdown内容渲染区域 -->
          <div
            class="markdown-content"
            v-if="isRendererReady"
            v-html="renderedMarkdown"
          ></div>
        </template>
      </div>

      <!-- 侧边目录 -->
      <div class="content-sidebar">
        <div class="sidebar">
          <div class="sidebar-title">目录</div>
          <ul class="toc-list" v-if="tocData.length && !loading && !error">
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
          <div class="empty-toc" v-else-if="!loading && !error">暂无目录</div>
          <div v-else-if="loading" class="loading-toc">
            <el-skeleton :rows="5" animated />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { marked, Renderer, type Tokens } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.min.css';
import { getArticleById } from '@/api/article/article';

// 文章信息类型
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

const props = defineProps<{
  targetCommentId?: number;
  articleId: number;
}>();

// 定义文章数据
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

// 加载状态
const loading = ref(true);
// 错误信息
const error = ref('');

// 点赞
const isLiked = ref(false); // 是否已点赞
const handleLike = () => {
  // 模拟点赞操作（实际应发送请求到后端）
  articleInfo.value.likes = isLiked.value ? articleInfo.value.likes - 1 : articleInfo.value.likes + 1;
  isLiked.value = !isLiked.value;
};

// 定义目录数据
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

// 配置marked渲染器（同步执行，确保parse前生效）
const renderer = new Renderer();
// 重置目录数据和计数器
tocData.value = [];
titleIndex = 0;

// 重载heading方法（此时配置，marked.parse时能生效）
renderer.heading = ({ tokens, depth }: Tokens.Heading) => {
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

// 计算属性：解析Markdown为HTML（仅当渲染器就绪后执行）
const renderedMarkdown = computed(() => {
  if (!isRendererReady.value) return ''; // 未就绪时返回空
  return marked.parse(articleInfo.value.content);
});

// 查询文章
const queryArticle = async (id: number) => {
  try {
    loading.value = true;
    error.value = '';
    // todo 使用 getArticleById 或 getArticleDetail 获取文章详情
    // const response = await getArticleById(id);
    // articleInfo.value = response.data;
    // // 重新解析目录
    // parseToc();
  } catch (err) {
    console.error('查询文章失败:', err);
    error.value = '获取文章详情失败，请刷新页面重试';
  } finally {
    loading.value = false;
    // 确保渲染器就绪
    isRendererReady.value = true;
  }
};

// 解析目录
const parseToc = () => {
  // 重置目录数据和计数器
  tocData.value = [];
  titleIndex = 0;
  // 重新解析Markdown内容以生成目录
  marked.parse(articleInfo.value.content);
};

// onMounted中获取文章数据
onMounted(() => {
  if (props.articleId) {
    queryArticle(props.articleId);
  }
});

// 处理目录点击
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
.article-main {
  width: 100%;
}

.article-content {
  display: flex;
  gap: 30px;
}

.content-main {
  flex: 1;
}

.content-sidebar {
  width: 200px;
  flex-shrink: 0;
}

/* 文章头部样式 */
.article-header {
  margin-bottom: 30px;
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #222;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.article-meta {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background-color: #fafafa;
  padding: 16px 20px;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.article-author {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.article-stat {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding-left: 20px;
  border-left: 1px solid #e8e8e8;
}

.article-author > div {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-size: 0.9rem;
  color: #666;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: #999;
  transition: color 0.2s;
}

.stat-item:hover .stat-icon {
  color: #409eff;
}

.like-section {
  cursor: pointer;
}

.like-icon {
  transition: all 0.2s;
}

.like-section:hover .like-icon {
  color: #f56c6c;
  transform: scale(1.1);
}

.like-section.liked .like-icon {
  color: #f56c6c;
}

/* 目录样式 */
.sidebar {
  background-color: transparent;
  border-radius: 4px;
  box-shadow: none;
  padding: 15px;
  height: fit-content;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border: none;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 6px 0;
}

.toc-level-1 { padding-left: 0; }
.toc-level-2 { padding-left: 8px; }
.toc-level-3 { padding-left: 16px; }
.toc-level-4 { padding-left: 24px; }
.toc-level-5 { padding-left: 32px; }
.toc-level-6 { padding-left: 40px; }

.toc-link {
  color: #666;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}

.toc-link:hover {
  color: #0066cc;
  text-decoration: none;
}

.empty-toc {
  color: #888;
  font-size: 0.9rem;
  text-align: center;
  padding: 10px 0;
}

/* Markdown内容样式 */
.markdown-content {
  font-size: 1rem;
}

.markdown-content :deep(h1) {
  font-size: 1.8rem;
  margin: 25px 0 15px;
  scroll-margin-top: 20px;
}

.markdown-content :deep(h2) {
  font-size: 1.6rem;
  margin: 20px 0 10px;
  scroll-margin-top: 20px;
}

.markdown-content :deep(h3) {
  font-size: 1.4rem;
  margin: 18px 0 8px;
  scroll-margin-top: 20px;
}

.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 16px 0 8px;
  scroll-margin-top: 20px;
}

.markdown-content :deep(p) { margin-bottom: 16px; }

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 10px 0 20px 25px;
}

.markdown-content :deep(li) { margin-bottom: 8px; }

.markdown-content :deep(pre) {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  margin: 15px 0;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  font-family: "Consolas", "Monaco", monospace;
  font-size: 0.9rem;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #ddd;
  padding: 10px 15px;
  margin: 15px 0;
  background-color: #f9f9f9;
}

.markdown-content :deep(img) {
  max-width: 100%;
  border-radius: 4px;
  margin: 20px 0;
}

.markdown-content :deep(a) {
  color: #0066cc;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .article-content {
    gap: 20px;
  }

  .content-sidebar {
    width: 200px;
  }

  .sidebar {
    padding: 12px;
  }

  .sidebar-title {
    font-size: 0.9rem;
    margin-bottom: 8px;
    padding-bottom: 6px;
  }

  .toc-item {
    margin: 4px 0;
  }

  .toc-link {
    font-size: 0.8rem;
  }

  .toc-level-1 { padding-left: 0; }
  .toc-level-2 { padding-left: 6px; }
  .toc-level-3 { padding-left: 12px; }
  .toc-level-4 { padding-left: 18px; }
  .toc-level-5 { padding-left: 24px; }
  .toc-level-6 { padding-left: 30px; }

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

@media (max-width: 768px) {
  .content-sidebar {
    width: 160px;
  }

  .sidebar {
    padding: 10px;
  }

  .toc-link {
    font-size: 0.75rem;
  }
}
</style>
