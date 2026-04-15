<template>
  <div class="search-page">
    <div class="search-content">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>
      <div v-else-if="error" class="error-container">
        <el-empty description="搜索失败，请稍后重试" />
      </div>
      <div v-else-if="searchResult.results.length === 0" class="empty-container">
        <el-empty description="未找到相关内容" />
      </div>
      <div v-else class="result-container">
        <div class="result-stats">
          找到 {{ searchResult.total }} 条结果，用时 {{ searchTime }} 毫秒
        </div>

        <div class="result-list">
          <div v-for="item in searchResult.results" :key="item.id" class="result-item">
            <div class="result-header">
              <div
                class="result-title"
                v-html="highlightKeyword(item.title)"
                @click="navigateToArticle(item.id)"
              >
              </div>
            </div>
            <div class="result-content" v-html="highlightKeyword(item.summary)">
            </div>
            <div class="result-meta">
              <span class="result-author">
                <el-icon><User /></el-icon>
                {{ item.authorName }}
              </span>
              <span class="result-date">{{ formatTime(item.createdTime || 0) }}</span>
              <span class="result-views">
                <el-icon><View /></el-icon>
                {{ item.views || 0 }}
              </span>
              <span class="result-likes">
                <el-icon><Star /></el-icon>
                {{ item.likes || 0 }}
              </span>
              <span class="result-comments">
                <el-icon><ChatDotRound /></el-icon>
                {{ item.comments || 0 }}
              </span>
              <span v-if="item.tags && item.tags.length > 0" class="result-tags">
                <el-tag
                  v-for="tag in item.tags.slice(0, 3)"
                  :key="tag"
                  size="small"
                  type="info"
                  class="tag-item"
                >
                  {{ tag }}
                </el-tag>
              </span>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="searchResult.total > searchForm.pageSize" class="pagination-container">
          <el-pagination
            v-model:current-page="searchForm.page"
            v-model:page-size="searchForm.pageSize"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="searchResult.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, View, Star, ChatDotRound } from '@element-plus/icons-vue'
import { search } from '@/api/search/search'
import { formatTime } from '@/utils/time'
import type { SearchReq, SearchResp } from '@/api/search/search'
import type { Article } from '@/api/article/types'

const route = useRoute()
const router = useRouter()

// 搜索表单
const searchForm = ref<SearchReq>({
  keyword: '',
  type: 'all',
  page: 1,
  pageSize: 10
})

// 搜索结果
const searchResult = ref<SearchResp>({
  results: [],
  total: 0,
  totalPage: 0,
  page: 1,
  pageSize: 10
})

// 状态
const loading = ref(false)
const error = ref(false)
const searchTime = ref(0)

// 高亮关键词
const highlightKeyword = (text: string | undefined): string => {
  if (!text || !searchForm.value.keyword) {
    return text || ''
  }

  const keyword = searchForm.value.keyword.trim()
  if (!keyword) {
    return text
  }

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, 'gi')
  return text.replace(regex, '<span class="keyword-highlight">$1</span>')
}

// 导航到文章详情页
const navigateToArticle = (articleId: number) => {
  router.push(`/article/${articleId}/detail`)
}

// 示例数据
const sampleData = {
  results: [
    {
      id: 1,
      authorId: 1,
      authorName: '张三',
      title: 'Vue3 组合式 API 完全指南',
      summary: '本文详细介绍 Vue3 组合式 API 的使用方法，包括 setup 函数、ref、reactive、computed、watch 等核心概念，帮助你快速上手 Vue3 开发。',
      content: '这是文章的内容',
      views: 1234,
      likes: 56,
      comments: 23,
      tags: ['Vue3', '前端', 'JavaScript'],
      cover: 'https://example.com/cover.jpg',
      createdTime: Date.now() - 86400000 * 3,
      updatedTime: Date.now(),
    },
    {
      id: 2,
      authorId: 2,
      authorName: '李四',
      title: 'TypeScript 高级类型详解',
      summary: '深入理解 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等，让你写出更优雅的类型定义。',
      content: '这是文章的内容',
      views: 892,
      likes: 45,
      comments: 12,
      tags: ['TypeScript', '前端', '类型系统'],
      cover: 'https://example.com/cover.jpg',
      createdTime: Date.now() - 86400000 * 7,
      updatedTime: Date.now(),
    },
    {
      id: 3,
      authorId: 1,
      authorName: '张三',
      title: 'React Hooks 最佳实践',
      summary: '总结 React Hooks 的使用经验和最佳实践，包括 useState、useEffect、useMemo、useCallback 等常用 Hook 的正确使用方式。',
      content: '这是文章的内容',
      views: 2341,
      likes: 89,
      comments: 34,
      tags: ['React', 'Hooks', '前端'],
      cover: 'https://example.com/cover.jpg',
      createdTime: Date.now() - 86400000 * 14,
      updatedTime: Date.now(),
    },
    {
      id: 4,
      authorId: 3,
      authorName: '王五',
      title: 'Node.js 性能优化指南',
      summary: '从多个维度介绍 Node.js 应用的性能优化方法，包括代码优化、内存管理、并发处理等方面的实用技巧。',
      content: '这是文章的内容',
      views: 567,
      likes: 23,
      comments: 8,
      tags: ['Node.js', '后端', '性能优化'],
      cover: 'https://example.com/cover.jpg',
      createdTime: Date.now() - 86400000 * 21,
      updatedTime: Date.now(),
    },
    {
      id: 5,
      authorId: 2,
      authorName: '李四',
      title: 'CSS Grid 布局完全指南',
      summary: '全面介绍 CSS Grid 网格布局系统，从基础概念到高级技巧，帮助你掌握现代 CSS 布局的核心技术。',
      content: '这是文章的内容',
      views: 1876,
      likes: 67,
      comments: 19,
      tags: ['CSS', '布局', '前端'],
      cover: 'https://example.com/cover.jpg',
      createdTime: Date.now() - 86400000 * 30,
      updatedTime: Date.now(),
    },
  ],
  total: 5
}

// 获取搜索结果
const fetchSearchResults = async () => {
  loading.value = true
  error.value = false
  const startTime = Date.now()

  try {
    const response = await search(searchForm.value)
    // 模拟API调用延迟
    // await new Promise(resolve => setTimeout(resolve, 500))
    searchResult.value = response.data
    searchTime.value = Date.now() - startTime
  } catch (err) {
    console.error('搜索失败:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handleCurrentChange = async (page: number) => {
  searchForm.value.page = page
  await fetchSearchResults()
}

// 处理每页大小变化
const handleSizeChange = async (size: number) => {
  searchForm.value.pageSize = size
  searchForm.value.page = 1
  await fetchSearchResults()
}

// 组件挂载时获取搜索参数并执行搜索
onMounted(() => {
  const keyword = route.query.keyword as string
  if (keyword) {
    searchForm.value.keyword = keyword
    fetchSearchResults()
  }
})

// 监听关键词变化
watch(() => route.query.keyword, (newKeyword) => {
  if (newKeyword) {
    searchForm.value.keyword = newKeyword as string
    searchForm.value.page = 1 // 重置到第一页
    fetchSearchResults()
  }
}, { immediate: false })
</script>

<style scoped lang="scss">
.search-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.search-content {
  min-height: 400px;
}

.loading-container {
  padding: 40px 0;
}

.error-container,
.empty-container {
  padding: 100px 0;
  text-align: center;
}

.result-container {
  .result-stats {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
  }

  .result-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .result-item {
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
      border-color: #e0e0e0;
    }

    .result-header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;

        .result-title {
          font-size: 18px;
          font-weight: 500;
          color: #333;
          cursor: pointer;

          &:hover {
            color: #409eff;
          }

          &:active {
            color: #66b1ff;
          }
        }

      .result-type {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 500;

        &.article-type {
          background-color: #ecf5ff;
          color: #409eff;
        }

        &.tag-type {
          background-color: #f0f9eb;
          color: #67c23a;
        }

        &.category-type {
          background-color: #fdf6ec;
          color: #e6a23c;
        }
      }
    }

    .result-content {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .result-meta {
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;

      .result-author,
      .result-date,
      .result-views,
      .result-likes,
      .result-comments {
        display: flex;
        align-items: center;
        gap: 4px;

        .el-icon {
          font-size: 14px;
        }
      }

      .result-author {
        color: #606266;
        font-weight: 500;
      }

      .result-views {
        color: #909399;
      }

      .result-likes {
        color: #f56c6c;
      }

      .result-comments {
        color: #409eff;
      }

      .result-tags {
        display: flex;
        gap: 6px;
        margin-left: auto;

        .tag-item {
          font-size: 11px;
          height: 20px;
          line-height: 20px;
          padding: 0 8px;
          border-radius: 10px;
        }
      }
    }
  }

  .pagination-container {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
}

// 关键词高亮
:deep(.keyword-highlight) {
  color: #e63946;
  font-weight: 600;
  background-color: #ffe5e7;
  padding: 0 2px;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(230, 57, 70, 0.1);
}
</style>
