<template>
  <div class="unread-comments-container">
    <div class="unread-comments-content">
      <h2 class="page-title">未读评论</h2>

      <!-- 未读评论列表 -->
      <div v-if="unreadComments.length > 0" class="comments-list">
        <div
          v-for="comment in unreadComments"
          :key="comment.id"
          class="comment-item"
        >
          <div class="comment-header">
            <div class="comment-user">
              <img
                :src="comment.avatar || defaultAvatar"
                alt="用户头像"
                class="user-avatar"
              />
              <span class="user-name">{{ comment.username }}</span>
            </div>
            <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>
          <div class="comment-article">
            <el-link :href="`/article/${comment.articleId}/detail`" target="_blank">
              查看文章: {{ comment.articleTitle }}
            </el-link>
          </div>
          <div class="comment-actions">
            <el-button v-if="!comment.isRead" type="primary" size="small" @click="markAsRead(comment.id)">
              标记为已读
            </el-button>
            <el-button v-else type="primary" size="small" disabled>
              已读
            </el-button>

            <el-button type="success" size="small" @click="replyToComment(comment)">
              回复
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-comments">
        <el-empty description="暂无未读评论" />
      </div>

      <!-- 分页 -->
      <div v-if="unreadComments.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { getUnreadComments, markCommentAsRead } from '@/api/comment/comment';
import type { Comment } from '@/api/comment/types';

const userStore = useUserStore();

// 未读评论数据
const unreadComments = ref<Comment[]>([
  {
    id: 1,
    articleId: 1,
    articleTitle: '示例文章1',
    userId: 1,
    username: '用户1',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    content: '这是一条评论',
    parentId: null,
    replyTo: null,
    createTime: '2026-03-06 14:06:04',
    isRead: true
  },
  {
    id: 2,
    articleId: 2,
    articleTitle: '示例文章2',
    userId: 2,
    username: '用户2',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    content: '这是另一条评论',
    parentId: null,
    replyTo: null,
    createTime: '2026-03-06 14:06:04',
    isRead: false
  },
]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return '';
  return time.replace('T', ' ');
};

// 获取未读评论
const getUnreadCommentsList = async () => {
  try {
    const response = await getUnreadComments({
      userId: userStore.userId,
      page: currentPage.value,
      pageSize: pageSize.value
    }) as any;
    unreadComments.value = response.comments;
    total.value = response.total;
  } catch (error) {
    console.error('获取未读评论失败:', error);
  }
};

// 标记为已读
const markAsRead = async (commentId: number) => {
  try {
    await markCommentAsRead(commentId);
    // 从列表中移除已读评论
    unreadComments.value = unreadComments.value.filter(comment => comment.id !== commentId);
    total.value--;
    // 显示成功提示
    ElMessage.success('已标记为已读');
  } catch (error) {
    console.error('标记为已读失败:', error);
    ElMessage.error('标记失败，请重试');
  }
};

// 回复评论
const replyToComment = (comment: Comment) => {
  // 跳转到文章详情页并定位到具体评论
  window.open(`/article/${comment.articleId}/detail#comment-${comment.id}`, '_blank');
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  getUnreadCommentsList();
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
  getUnreadCommentsList();
};

// 初始化
onMounted(() => {
  getUnreadCommentsList();
});
</script>

<style scoped>
.unread-comments-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.unread-comments-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.comments-list {
  margin-bottom: 24px;
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.comment-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 12px;
  word-break: break-word;
}

.comment-article {
  margin-bottom: 12px;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.empty-comments {
  text-align: center;
  padding: 40px 0;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .unread-comments-container {
    padding: 10px;
  }

  .unread-comments-content {
    padding: 16px;
  }

  .page-title {
    font-size: 18px;
  }
}
</style>
