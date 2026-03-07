<template>
  <div class="article-tag">
    <div class="tag-header">
      <h1>文章标签</h1>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索标签"
          style="width: 200px;"
          clearable
        />
      </div>
    </div>
    <div class="tag-content">
      <el-card v-for="tag in filteredTags" :key="tag.id" class="tag-card">
        <template #header>
          <div class="tag-header-content">
            <el-link :href="`/article/tag/${tag.id}`" class="tag-name">{{ tag.name }}</el-link>
          </div>
        </template>
        <div class="tag-articles">
          <el-empty v-if="tag.articles.length === 0" description="暂无文章" />
          <div v-else class="article-list">
            <div v-for="article in tag.articles" :key="article.id" class="article-item">
              <el-link :href="`/article/${article.id}/detail`" target="_blank">{{ article.title }}</el-link>
              <span class="article-date">{{ article.date }}</span>
            </div>
            <div v-if="tag.articleCount > tag.articles.length" class="more-articles">
              <el-link :href="`/article/tag/${tag.id}`">查看更多文章</el-link>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

// 搜索关键词
const searchKeyword = ref('');

// 模拟标签数据
const tags = ref([
  {
    id: 1,
    name: 'Vue3',
    articles: [
      {
        id: 1,
        title: 'Vue 3 入门指南',
        date: '2026-03-01'
      },
      {
        id: 2,
        title: 'Vue 3 Composition API 详解',
        date: '2026-03-02'
      }
    ],
    articleCount: 2
  },
  {
    id: 2,
    name: 'TypeScript',
    articles: [
      {
        id: 2,
        title: 'TypeScript 高级特性',
        date: '2026-03-02'
      },
      {
        id: 3,
        title: 'TypeScript 类型系统',
        date: '2026-03-03'
      }
    ],
    articleCount: 2
  },
  {
    id: 3,
    name: 'Markdown',
    articles: [
      {
        id: 4,
        title: 'Markdown 语法指南',
        date: '2026-03-04'
      }
    ],
    articleCount: 1
  },
  {
    id: 4,
    name: '前端开发',
    articles: [],
    articleCount: 0
  }
]);

// 生命周期
onMounted(() => {
  // 实际项目中这里应该调用API获取标签数据
  // getTags();
});

// 过滤后的标签列表
const filteredTags = computed(() => {
  if (!searchKeyword.value) {
    return tags.value;
  }
  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});
</script>

<style scoped>
.article-tag {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.tag-header h1 {
  font-size: 24px;
  color: #333;
}

.tag-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.tag-card {
  height: 100%;
}

.tag-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}



.tag-articles {
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

.tag-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.dialog-footer {
  text-align: right;
}
</style>
