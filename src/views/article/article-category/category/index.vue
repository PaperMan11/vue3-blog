<template>
  <div class="article-category">
    <div class="category-header">
      <h1>文章分类管理</h1>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索分类"
          style="width: 200px; margin-right: 10px;"
          clearable
        />
        <el-button type="primary" @click="handleAddCategory">添加分类</el-button>
      </div>
    </div>
    <div class="category-content">
      <el-card v-for="category in filteredCategories" :key="category.id" class="category-card">
        <template #header>
          <div class="category-header-content">
            <el-link :href="`/article/category/${category.id}`" class="category-name">{{ category.name }}</el-link>
            <div class="category-actions">
              <el-button size="small" @click="handleEditCategory(category)" :disabled="category.id === 0">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteCategory(category.id)" :disabled="category.id === 0">删除</el-button>
            </div>
          </div>
        </template>
        <div class="category-articles">
          <el-empty v-if="category.articles?.length === 0" description="暂无文章" />
          <div v-else class="article-list">
            <div v-for="article in category.articles" :key="article.id" class="article-item">
              <el-link :href="`/article/${article.id}/detail`" target="_blank">{{ article.title }}</el-link>
              <div class="article-actions">
                <span class="article-date">{{ formatTime(article.createdTime) }}</span>
                <el-button size="small" @click="handleEditArticle(article.id)">编辑</el-button>
              </div>
            </div>
            <div v-if="(category.articleCount || 0) > (category.articles?.length || 0)" class="more-articles">
              <el-link :href="`/article/category/${category.id}`">查看更多文章</el-link>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input
            v-model="categoryForm.description"
            placeholder="请输入分类描述"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitCategory">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { formatTime } from '@/utils/time';
import { listArticleCategories, createArticleCategory, updateArticleCategory, deleteArticleCategory } from '@/api/article/article';
import type { ArticleCategory } from '@/api/article/types';

const router = useRouter();

// 搜索关键词
const searchKeyword = ref('');

// 模拟分类数据
const categories = ref<ArticleCategory[]>([]);

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref('添加分类');
const categoryForm = ref({
  id: 0,
  name: '',
  description: ''
});

// 生命周期
onMounted(() => {
  fetchCategories();
});

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await listArticleCategories({
      page: 1,
      pageSize: 10,
      fullQuery: true
    });
    const { categories: categoryList } = response.data;
    categories.value = categoryList;
  } catch (error) {
    ElMessage.error('获取分类列表失败');
  }
};

// 添加分类
const handleAddCategory = () => {
  dialogTitle.value = '添加分类';
  categoryForm.value = {
    id: 0,
    name: '',
    description: ''
  };
  dialogVisible.value = true;
};

// 编辑分类
const handleEditCategory = (category: ArticleCategory) => {
  dialogTitle.value = '编辑分类';
  categoryForm.value = {
    id: category.id,
    name: category.name,
    description: category.description
  };
  dialogVisible.value = true;
};

// 提交分类
const handleSubmitCategory = async () => {
  if (!categoryForm.value.name) {
    ElMessage.error('请输入分类名称');
    return;
  }

  try {
    if (categoryForm.value.id) {
      // 编辑分类
      await updateArticleCategory({
        id: categoryForm.value.id,
        name: categoryForm.value.name,
        description: categoryForm.value.description
      });
      ElMessage.success('分类编辑成功');
    } else {
      // 添加分类
      await createArticleCategory({
        name: categoryForm.value.name,
        description: categoryForm.value.description
      });
      ElMessage.success('分类添加成功');
    }
    // 刷新分类列表
    await fetchCategories();
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error('操作失败，请稍后重试');
  }
};

// 删除分类
const handleDeleteCategory = async (id: number) => {
  try {
    await deleteArticleCategory({ id });
    ElMessage.success('分类删除成功');
    // 刷新分类列表
    await fetchCategories();
  } catch (error) {
    ElMessage.error('删除失败，请稍后重试');
  }
};

// 编辑文章
const handleEditArticle = (articleId: number) => {
  router.push(`/article/write/${articleId}`);
};

// 过滤后的分类列表
const filteredCategories = computed(() => {
  if (!searchKeyword.value) {
    return categories.value;
  }
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});
</script>

<style scoped>
.article-category {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.category-header h1 {
  font-size: 24px;
  color: #333;
}

.category-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.category-card {
  height: 100%;
}

.category-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.category-actions {
  display: flex;
  gap: 10px;
}

.category-articles {
  margin-top: 20px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
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

.article-item:last-child {
  border-bottom: none;
}

.article-date {
  font-size: 12px;
  color: #999;
}

.more-articles {
  margin-top: 10px;
  text-align: right;
}

.more-articles .el-link {
  font-size: 12px;
}

.category-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.dialog-footer {
  text-align: right;
}
</style>
