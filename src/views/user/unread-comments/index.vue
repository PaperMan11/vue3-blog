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
                :src="comment.userAvatar"
                alt="用户头像"
                class="user-avatar"
              />
              <span class="user-name">{{ comment.userName }}</span>
            </div>
            <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>
          <div class="comment-article">
            <el-link :href="`/article/1/detail`" target="_blank">
              查看文章: 示例文章
            </el-link>
          </div>
          <div class="comment-actions">
            <el-button type="primary" size="small" @click="markAsRead(comment.id)">
              标记为已读
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
import { getArticleComments, createArticleComment, deleteArticleComment, getUnreadComments } from '@/api/article-comments/comment';
import type { Reply } from '@/api/article-comments/types';
import { formatTime } from '@/utils/time';

const userStore = useUserStore();

// 未读评论数据
const unreadComments = ref<Reply[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 获取未读评论
const fetchUnreadCommentsList = async () => {
  try {
    // 获取未读评论列表
    const res = await getUnreadComments({
      page: currentPage.value,
      pageSize: pageSize.value
    });

    const { replies, total: resTotal } = res.data || {};
    unreadComments.value = replies || [];
    total.value = resTotal || 0;
  } catch (error) {
    console.error('获取未读评论失败:', error);
  }
};

// 标记为已读
const markAsRead = async (commentId: number) => {
  try {
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
const replyToComment = (reply: Reply) => {
  // 跳转到文章详情页并定位到具体评论
  window.open(`/article/1/detail#comment-${reply.id}`, '_blank');
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchUnreadCommentsList();
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
  fetchUnreadCommentsList();
};

// 初始化
onMounted(() => {
  fetchUnreadCommentsList();
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
