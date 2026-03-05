<template>
  <div class="category-detail">
    <div class="detail-header">
      <h1>{{ category?.name }}分类</h1>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><router-link to="/">首页</router-link></el-breadcrumb-item>
        <el-breadcrumb-item><router-link to="/article/category">文章分类</router-link></el-breadcrumb-item>
        <el-breadcrumb-item>{{ category?.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="detail-content">
      <div v-if="category" class="articles-container">
        <div v-if="paginatedArticles.length > 0" class="article-list">
          <el-card v-for="article in paginatedArticles" :key="article.id" class="article-card">
            <template #header>
              <div class="article-header">
                <el-link :href="`/article/${article.id}/detail`" target="_blank" class="article-title">{{ article.title }}</el-link>
                <span class="article-date">{{ article.date }}</span>
              </div>
            </template>
            <div class="article-excerpt">{{ article.excerpt || '暂无摘要' }}</div>
          </el-card>
        </div>
        <el-empty v-else description="该分类下暂无文章" />

        <!-- 分页组件 -->
        <div v-if="totalPages > 1" class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="category.articles.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div v-else class="loading">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// 路由参数
const route = useRoute();
const categoryId = ref<number>(Number(route.params.id) || 0);

// 模拟分类数据
const categories = ref([
  {
    id: 1,
    name: '技术',
    articles: [
      {
        id: 1,
        title: 'Vue 3 入门指南',
        date: '2026-03-01',
        excerpt: 'Vue 3 是 Vue.js 的最新版本，带来了许多新特性和改进...'
      },
      {
        id: 2,
        title: 'TypeScript 高级特性',
        date: '2026-03-02',
        excerpt: 'TypeScript 提供了许多高级特性，如泛型、接口、类型别名等...'
      },
      {
        id: 3,
        title: 'React Hooks 详解',
        date: '2026-03-03',
        excerpt: 'React Hooks 让我们可以在函数组件中使用状态和其他 React 特性...'
      },
      {
        id: 4,
        title: 'Node.js 性能优化',
        date: '2026-03-04',
        excerpt: 'Node.js 性能优化的一些技巧和最佳实践...'
      },
      {
        id: 5,
        title: 'GraphQL 入门',
        date: '2026-03-05',
        excerpt: 'GraphQL 是一种用于 API 的查询语言，也是一个满足你数据查询的运行时...'
      },
      {
        id: 6,
        title: 'Docker 容器化部署',
        date: '2026-03-06',
        excerpt: 'Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用...'
      },
      {
        id: 7,
        title: 'Kubernetes 集群管理',
        date: '2026-03-07',
        excerpt: 'Kubernetes 是一个用于自动部署、扩展和管理容器化应用程序的开源系统...'
      },
      {
        id: 8,
        title: '微服务架构设计',
        date: '2026-03-08',
        excerpt: '微服务架构是一种将应用程序设计为一系列松耦合服务的方法...'
      },
      {
        id: 9,
        title: '前端性能优化',
        date: '2026-03-09',
        excerpt: '前端性能优化的一些技巧和最佳实践...'
      },
      {
        id: 10,
        title: '后端架构设计',
        date: '2026-03-10',
        excerpt: '后端架构设计的一些原则和最佳实践...'
      }
    ]
  },
  {
    id: 2,
    name: '生活',
    articles: [
      {
        id: 11,
        title: '周末旅行攻略',
        date: '2026-03-03',
        excerpt: '周末旅行的一些好去处和攻略...'
      },
      {
        id: 12,
        title: '美食制作教程',
        date: '2026-03-04',
        excerpt: '一些简单美味的家常菜制作教程...'
      }
    ]
  },
  {
    id: 3,
    name: '学习',
    articles: []
  }
]);

// 当前分类
const category = computed(() => {
  return categories.value.find(c => c.id === categoryId.value);
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);

// 计算总页数
const totalPages = computed(() => {
  if (!category.value) return 0;
  return Math.ceil(category.value.articles.length / pageSize.value);
});

// 分页后的文章列表
const paginatedArticles = computed(() => {
  if (!category.value) return [];
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return category.value.articles.slice(start, end);
});

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

// 处理每页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  categoryId.value = Number(newId) || 0;
  currentPage.value = 1;
  // todo: 从后端获取分类详情
});
</script>

<style scoped>
.category-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.detail-header {
  margin-bottom: 30px;
}

.detail-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.detail-content {
  min-height: 400px;
}

.articles-container {
  width: 100%;
}

.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.article-card {
  height: 100%;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.article-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
}

.article-title:hover {
  color: #0066cc;
}

.article-date {
  font-size: 12px;
  color: #999;
}

.article-excerpt {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 16px;
  color: #999;
}
</style>
