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
        <div v-if="category.articles && category.articles.length > 0" class="article-list">
          <el-card v-for="article in category.articles" :key="article.id" class="article-card">
            <template #header>
              <div class="article-header">
                <el-link :href="`/article/${article.id}/detail`" target="_blank" class="article-title">{{ article.title }}</el-link>
                <div class="article-actions">
                  <span class="article-date">{{ formatTime(article.createdTime) || '未知时间' }}</span>
                  <el-button size="small" @click="handleEditArticle(article.id)">编辑</el-button>
                </div>
              </div>
            </template>
            <div class="article-excerpt">{{ article.summary || '暂无摘要' }}</div>
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
            :total="category.articleCount || 0"
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
import { useRoute, useRouter } from 'vue-router';
import { listArticleByCategory, getArticleByCategory } from '@/api/article/article';
import type { ArticleCategory } from '@/api/article/types';
import { formatTime } from '@/utils/time';

// 路由参数
const route = useRoute();
const router = useRouter();
const categoryId = ref<number>(Number(route.params.id) || 0);
const category = ref<ArticleCategory>({
  id: 0,
  name: '',
  description: '',
  articleCount: 0,
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);

const totalPages = computed(() => {
  if (!category.value) return 0;
  return Math.ceil((category.value.articleCount || 0) / pageSize.value);
});

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchArticles();
};

// 处理每页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchArticles();
};

// // 监听路由参数变化
// watch(() => route.params.id, async (newId) => {
//   categoryId.value = Number(newId) || 0;
//   currentPage.value = 1;
//   // 从后端获取分类详情
//   try {
//     const res = await getArticleByCategory(categoryId.value);
//     category.value = res.data;
//   } catch (error) {
//     ElMessage.error('获取分类详情失败，请稍后重试');
//   }
// });

onMounted(async () => {
  currentPage.value = 1;
  // 从后端获取分类详情
  try {
    const res = await getArticleByCategory(categoryId.value);
    category.value = res.data;
  } catch (error) {
    ElMessage.error('获取分类详情失败，请稍后重试');
  }
});

// 编辑文章
const handleEditArticle = (articleId: number) => {
  router.push(`/article/write/${articleId}`);
};

const fetchArticles = async () => {
  if (!categoryId.value) return;
  try {
    const res = await listArticleByCategory({
      categoryId: categoryId.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    const { articles: newArticles, total: newTotal } = res.data || {};
    category.value.articles = newArticles || [];
    category.value.articleCount = newTotal || 0;
  } catch (error) {
    ElMessage.error('获取文章列表失败，请稍后重试');
  }
};

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

.article-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.article-actions .el-button {
  background-color: transparent;
  border: 1px solid #dcdfe6;
  color: #606266;
  transition: all 0.3s ease;
}

.article-actions .el-button:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-color: #409eff;
  color: #409eff;
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
