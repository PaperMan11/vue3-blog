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
              <el-button size="small" @click="handleEditCategory(category)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteCategory(category.id)">删除</el-button>
            </div>
          </div>
        </template>
        <div class="category-articles">
          <el-empty v-if="category.articles.length === 0" description="暂无文章" />
          <div v-else class="article-list">
            <div v-for="article in category.articles" :key="article.id" class="article-item">
              <el-link :href="`/article/${article.id}/detail`" target="_blank">{{ article.title }}</el-link>
              <span class="article-date">{{ article.date }}</span>
            </div>
            <div v-if="category.articleCount > category.articles.length" class="more-articles">
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

// 搜索关键词
const searchKeyword = ref('');

// 模拟分类数据
const categories = ref([
  {
    id: 1,
    name: '技术',
    articles: [
      {
        id: 1,
        title: 'Vue 3 入门指南',
        date: '2026-03-01'
      },
      {
        id: 2,
        title: 'TypeScript 高级特性',
        date: '2026-03-02'
      },
      {
        id: 4,
        title: 'React 性能优化',
        date: '2026-03-04'
      },
      {
        id: 5,
        title: 'Node.js 开发',
        date: '2026-03-05'
      },
      {
        id: 6,
        title: 'Python 数据处理',
        date: '2026-03-06'
      },
      {
        id: 7,
        title: '数据可视化',
        date: '2026-03-07'
      },
      {
        id: 8,
        title: '机器学习',
        date: '2026-03-08'
      },
      {
        id: 9,
        title: '深度学习',
        date: '2026-03-09'
      },
      {
        id: 10,
        title: '自然语言处理',
        date: '2026-03-10'
      },
    ],
    articleCount: 11
  },
  {
    id: 2,
    name: '生活',
    articles: [
      {
        id: 3,
        title: '周末旅行攻略',
        date: '2026-03-03'
      }
    ],
    articleCount: 1
  },
  {
    id: 3,
    name: '学习',
    articles: [],
    articleCount: 0
  }
]);

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref('添加分类');
const categoryForm = ref({
  id: 0,
  name: ''
});

// 生命周期
onMounted(() => {
  // 实际项目中这里应该调用API获取分类数据
  // getCategories();
});

// 添加分类
const handleAddCategory = () => {
  dialogTitle.value = '添加分类';
  categoryForm.value = {
    id: 0,
    name: ''
  };
  dialogVisible.value = true;
};

// 编辑分类
const handleEditCategory = (category: any) => {
  dialogTitle.value = '编辑分类';
  categoryForm.value = {
    id: category.id,
    name: category.name
  };
  dialogVisible.value = true;
};

// 提交分类
const handleSubmitCategory = () => {
  if (!categoryForm.value.name) {
    ElMessage.error('请输入分类名称');
    return;
  }

  if (categoryForm.value.id) {
    // 编辑分类
    const index = categories.value.findIndex(c => c.id === categoryForm.value.id);
    if (index !== -1) {
      categories.value[index]!.name = categoryForm.value.name;
      ElMessage.success('分类编辑成功');
    }
  } else {
    // 添加分类
    const newCategory = {
      id: Date.now(),
      name: categoryForm.value.name,
      articles: [],
      articleCount: 0
    };
    categories.value.push(newCategory);
    ElMessage.success('分类添加成功');
  }

  dialogVisible.value = false;
};

// 删除分类
const handleDeleteCategory = (id: number) => {
  const index = categories.value.findIndex(c => c.id === id);
  if (index !== -1) {
    const category = categories.value[index]!;
    if (category.articles.length > 0) {
      ElMessage.warning('该分类下还有文章，无法删除');
      return;
    }
    categories.value.splice(index, 1);
    ElMessage.success('分类删除成功');
  }
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
