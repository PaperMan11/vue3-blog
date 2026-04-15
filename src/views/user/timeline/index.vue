<template>
  <div class="timeline-container">
    <div class="timeline-content">
      <!-- 按年份分组显示 -->
      <template v-for="group in groupedTimelineData" :key="group.year">
        <!-- 年份显示 -->
        <div class="year-divider">{{ group.year }}</div>

        <!-- 该年份的文章 -->
        <el-timeline>
          <el-timeline-item
            v-for="item in group.articles"
            :key="item.id"
            :timestamp="formatTime(item.createdTime)"
            placement="top"
            type="primary"
            size="large"
          >
            <div class="timeline-card" @click="handleClick(item)">
              <div class="card-content">
                <h4 class="article-title">
                  {{ item.title }}
                </h4>
                <p class="article-time">{{ formatTime(item.createdTime) }}</p>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </template>
      <div v-if="timelineData.length === 0" class="empty-timeline">
        <el-empty description="暂无文章记录" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { getArticleTimeline } from '@/api/article/article';
import type { Article } from '@/api/article/types';
import { formatTime } from '@/utils/time';

const userStore = useUserStore();
const router = useRouter();
// 获取用户文章时间线
const timelineData = ref<Article[]>([]);

// 按年份分组文章数据
const groupedTimelineData = computed(() => {
  const grouped: Record<string, Article[]> = {};

  timelineData.value.forEach(item => {
    // 提取年份
    const year = formatTime(item.createdTime).substring(0, 4);
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(item);
  });

  // 按年份降序排序，返回数组形式以确保顺序
  return Object.keys(grouped)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .map(year => ({
      year,
      articles: grouped[year]
    }));
});

const initTimelineData = async () => {
  // 获取用户文章时间线
  getArticleTimeline().then(res => {
    timelineData.value = res.data;
  })
};

const handleClick = (item: Article) => {
  // 跳转到文章详情页(另开页面)
  // router.push(`/article/${item.id}/detail`);
  window.open(`/article/${item.id}/detail`, '_blank');
};

onMounted(() => {
  initTimelineData();
});
</script>

<style scoped>
.timeline-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.timeline-content {
  padding: 0;
}

.timeline-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  padding: 16px;
  background-color: #f8f9fa;
  * {
    cursor: pointer;
  }
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.card-content {
  padding: 0;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  transition: color 0.2s ease;
}

.article-title:hover {
  color: #409eff;
}

.article-time {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.el-timeline-item {
  margin-bottom: 20px;
}

.el-timeline-item__timestamp {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

/* 年份显示样式 */
.year-divider {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
  margin: 30px 0 20px 0;
  padding: 8px 0;
  /* border-bottom: 2px solid #e4e7ed; */
}

/* 第一个年份不需要顶部margin */
.year-divider:first-child {
  margin-top: 0;
}

.empty-timeline {
  text-align: center;
  padding: 40px 0;
}

@media (max-width: 768px) {
  .timeline-container {
    padding: 10px;
  }

  .timeline-content {
    padding: 0;
  }
}
</style>
