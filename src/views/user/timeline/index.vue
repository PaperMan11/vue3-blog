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
            :timestamp="item.createTime"
            placement="top"
            type="primary"
            size="large"
          >
            <div class="timeline-card" @click="handleClick(item)">
              <div class="card-content">
                <h4 class="article-title">
                  {{ item.articleTitle }}
                </h4>
                <p class="article-time">{{ item.createTime }}</p>
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
import type { UserArticleTimeline } from '@/api/article/types';

const userStore = useUserStore();
const router = useRouter();

const exampleTimelineData: UserArticleTimeline[] = [
  { id: 1, articleTitle: '示例文章1', createTime: '2026-03-06 14:06:04' },
  { id: 2, articleTitle: '示例文章2', createTime: '2026-03-03 14:06:04' },
  { id: 3, articleTitle: '示例文章3', createTime: '2025-12-02 14:06:04' },
  { id: 4, articleTitle: '示例文章4', createTime: '2025-11-15 10:30:00' },
  { id: 5, articleTitle: '示例文章5', createTime: '2024-09-20 09:15:00' },
  { id: 6, articleTitle: '示例文章6', createTime: '2024-08-10 16:45:00' },
  { id: 7, articleTitle: '示例文章7', createTime: '2024-07-05 12:30:00' },
  { id: 8, articleTitle: '示例文章8', createTime: '2024-06-20 18:00:00' },
  { id: 9, articleTitle: '示例文章9', createTime: '2024-05-10 10:00:00' },
  { id: 10, articleTitle: '示例文章10', createTime: '2024-04-01 15:45:00' },
];

// 获取用户文章时间线
const timelineData = ref<UserArticleTimeline[]>(exampleTimelineData);

// 按年份分组文章数据
const groupedTimelineData = computed(() => {
  const grouped: Record<string, UserArticleTimeline[]> = {};

  timelineData.value.forEach(item => {
    // 提取年份
    const year = item.createTime.substring(0, 4);
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
  getArticleTimeline().then(data => {
    timelineData.value = data as any;
  })
};

const handleClick = (item: UserArticleTimeline) => {
  // 跳转到文章详情页(另开页面)
  // router.push(`/article/${item.id}/detail`);
  window.open(`/article/${item.id}/detail`, '_blank');
};

onMounted(() => {
  // initTimelineData();
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
