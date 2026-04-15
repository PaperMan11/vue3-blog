<template>
  <el-card class="info-container">
    <div class="user-info">
      <el-avatar size="large" :src="userStore.avatar" />
      <div class="user-info-text">
        <span>{{ userName }}</span>
        <div class="split-line"></div>
        <div class="soup">{{ obj.output }}</div>
        <!-- <EllipsisText :text="userStore.introduction || '这个人什么都没留下这个人什么都没留下这个人什么都没留下这个人什么都没留下这个人什么都没留下...'"/> -->
      </div>
    </div>
    <div class="article-stats">
      <div class="article">
        <span>{{ articleStats.articleNum || 0 }}</span>
        <span>文章数</span>
      </div>
      <div class="article-category">
        <span>{{ articleStats.categoryNum || 0 }}</span>
        <span>分类数</span>
      </div>
      <div class="article-comment">
        <span>{{ articleStats.commentNum || 0 }}</span>
        <span>评论数</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { getHitokotoTypewriter } from '@/api/third-party/hitokoto';
import useUserStore from '@/stores/user';
const userStore = useUserStore();
const userName = ref(userStore.username)
// 用户数据统计
import { getArticleStats } from '@/api/home/home';
import type { ArticleStats } from '@/api/home/types';
import { onMounted } from 'vue';

const articleStats = ref<ArticleStats>({
  articleNum: 0,
  categoryNum: 0,
  commentNum: 0,
})

// 获取文章统计
onMounted(() => {
  getArticleStats().then(res => {
    const { articleNum, categoryNum, commentNum } = res.data
    articleStats.value = { articleNum, categoryNum, commentNum }
  }).catch(err => {
    ElMessage({
      message: err.message || 'Error',
      type: 'error',
      duration: 5 * 1000
    });
  })
})

// 每日一言
const obj = reactive({
  output: "",
  isEnd: false,
  speed: 300,
  singleBack: false,
  sleep: 3000,
  type: "rollback",
  backSpeed: 100,
  sentencePause: false,
})
getHitokotoTypewriter(obj)
</script>

<style scoped lang="scss">
.info-container {
  width: 100%;
  box-sizing: border-box;
}

.user-info {
  display: flex;
  flex-direction: column; // 纵向排列，头像独占一行
  align-items: center;    // 水平居中
  justify-content: center;
  gap: 16px;              // 头像 和 昵称+简介 之间的间距
  width: 100%;
  padding-bottom: 12px;

  :deep(.el-avatar) {
    cursor: pointer;
    transition: transform 0.2s ease;
    &:hover {
      transform: scale(1.05); // 头像悬浮轻微放大
    }
  }

  // 内层文字信息容器（昵称+简介）
  .user-info-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center; // 文字内容也居中
    width: 100%;
    .split-line {
      width: 40px;
      height: 1px;
      background-color: #e5e7eb;
      margin: 2px 0 10px;
      transition: background-color 0.2s ease;
    }
  }
  .user-info-text:hover .split-line {
    background-color: #409eff;
  }

  // 用户名样式
  .user-info-text > span {
    font-size: 19px;
    font-weight: 600;
    color: #303133;
    line-height: 1.4;
  }
}

// 数据统计区域
.article-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 16px 0;
  margin-top: 8px;
  border-top: 1px solid #f0f2f5;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    border-radius: 8px;
    transition: all 0.22s ease-in-out;
    * {
      cursor: pointer;
    }

    span:first-child {
      font-size: 24px;
      font-weight: 700;
      color: #409eff;
      line-height: 1.5;
    }

    span:last-child {
      font-size: 14px;
      color: #909399;
      line-height: 1.4;
      margin-top: 5px;
    }

    &:hover {
      background-color: #f9fafb;
      color: #409eff;
    }
  }
}
</style>
