<template>
  <div class="comment-section">
    <h2 class="comment-title">评论</h2>

    <!-- 评论输入框 -->
    <div class="comment-input-section">
      <textarea
        v-model="newComment.content"
        placeholder="写下你的评论..."
        class="comment-textarea"
        ref="commentTextarea"
      ></textarea>

      <!-- 评论工具栏 -->
      <div class="comment-toolbar">
        <!-- 表情按钮 -->
        <el-button
          link
          @click="showEmojiPicker = !showEmojiPicker"
          class="tool-button"
        >
          😊
        </el-button>

        <!-- 提交按钮 -->
        <el-button
          type="primary"
          @click="submitComment"
          class="submit-button"
          :disabled="!newComment.content.trim()"
        >
          发布评论
        </el-button>
      </div>

      <!-- 表情选择器 -->
      <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="emoji-grid">
          <span
            v-for="emoji in emojis"
            :key="emoji"
            class="emoji-item"
            @click="addEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>

      <!-- 错误信息 -->
      <div v-else-if="error" class="error-container">
        <el-alert
          :title="error"
          type="error"
          show-icon
          :closable="false"
        />
      </div>

      <!-- 评论内容 -->
      <template v-else>
        <!-- 筛选工具栏 -->
        <div v-if="comments.length > 0" class="comment-filter">
          <el-button-group>
            <el-button
              :type="filterType === 'latest' ? 'primary' : 'default'"
              @click="setFilterType('latest')"
            >
              最新
            </el-button>
            <el-button
              :type="filterType === 'hot' ? 'primary' : 'default'"
              @click="setFilterType('hot')"
            >
              热门
            </el-button>
          </el-button-group>
        </div>

        <div v-if="comments.length === 0" class="no-comments">
          暂无评论，快来抢沙发吧！
        </div>
        <div v-else v-for="comment in comments" :key="comment.id" class="comment-item" :id="`comment-${comment.id}`">
          <div class="comment-avatar">
            {{ comment.userName.charAt(0) }}
          </div>
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.userName }}</span>
              <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
            </div>
            <div class="comment-text">{{ comment.content }}</div>
            <div class="comment-actions">
              <el-button
                link
                type="primary"
                size="small"
                @click="startReply(comment.id, comment.id, comment.userId, comment.userName)"
              >
                回复
              </el-button>
              <el-button
                v-if="comment.replyCount && comment.replyCount > 0"
                link
                type="primary"
                size="small"
                @click="toggleComment(comment.id)"
              >
                {{ expandedCommentIds.has(comment.id) ? '收起' : `查看${comment.replyCount}条回复` }}
              </el-button>
              <el-button
                v-if="userStore.userId && (parseInt(userStore.userId) === comment.userId || parseInt(userStore.userId) === authorId)"
                link
                type="danger"
                size="small"
                @click="deleteComment(comment.id)"
              >
                删除
              </el-button>
            </div>

            <!-- 父评论的回复输入框 -->
            <div v-if="replyState.isReplying && replyState.replyToCommentId === comment.id" class="reply-input-section">
              <div class="reply-to-info" v-if="replyState.replyToName">
                回复: {{ replyState.replyToName }}
              </div>
              <textarea
                v-model="replyState.content"
                placeholder="写下你的回复..."
                class="reply-textarea"
                ref="replyTextarea"
              ></textarea>
              <div class="reply-actions">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="replyState.showEmojiPicker = !replyState.showEmojiPicker"
                  class="tool-button"
                >
                  😊
                </el-button>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="cancelReply"
                >
                  取消
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="submitReply"
                  :disabled="!replyState.content.trim()"
                >
                  回复
                </el-button>
              </div>

              <!-- 回复表情选择器 -->
              <div v-if="replyState.showEmojiPicker" class="emoji-picker">
                <div class="emoji-grid">
                  <span
                    v-for="emoji in emojis"
                    :key="emoji"
                    class="emoji-item"
                    @click="addReplyEmoji(emoji)"
                  >
                    {{ emoji }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 回复列表 -->
            <div v-if="expandedCommentIds.has(comment.id)" class="reply-list">
              <!-- 回复加载状态 -->
              <div v-if="replyLoading[comment.id]" class="loading-container">
                <el-skeleton :rows="3" animated />
              </div>
              <div v-else-if="replyComments[comment.id] && (replyComments[comment.id] || []).length > 0">
                <transition-group name="reply-fade" tag="div">
                  <div v-for="reply in replyComments[comment.id]" :key="reply.id" class="reply-item" :id="`comment-${reply.id}`">
                    <div class="reply-avatar">
                      {{ reply.userName.charAt(0) }}
                    </div>
                    <div class="reply-content">
                      <div class="reply-header">
                        <span class="reply-author">{{ reply.userName }}</span>
                        <span class="reply-to">回复 {{ reply.replyUserName }}</span>
                        <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                      </div>
                      <div class="reply-text">{{ reply.content }}</div>
                      <div class="reply-actions">
                        <el-button
                          link
                          type="primary"
                          size="small"
                          @click="startReply(comment.id, reply.id, reply.userId, reply.userName)"
                        >
                          回复
                        </el-button>
                      </div>

                      <!-- 子评论的回复输入框 -->
                      <div v-if="replyState.isReplying && replyState.commentId === comment.id && replyState.replyToCommentId === reply.id" class="reply-input-section">
                        <div class="reply-to-info" v-if="replyState.replyToName">
                          回复: {{ replyState.replyToName }}
                        </div>
                        <textarea
                          v-model="replyState.content"
                          placeholder="写下你的回复..."
                          class="reply-textarea"
                          ref="replyTextarea"
                        ></textarea>
                        <div class="reply-actions">
                          <el-button
                            link
                            type="primary"
                            size="small"
                            @click="replyState.showEmojiPicker = !replyState.showEmojiPicker"
                            class="tool-button"
                          >
                            😊
                          </el-button>
                          <el-button
                            link
                            type="primary"
                            size="small"
                            @click="cancelReply"
                          >
                            取消
                          </el-button>
                          <el-button
                            type="primary"
                            size="small"
                            @click="submitReply"
                            :disabled="!replyState.content.trim()"
                          >
                            回复
                          </el-button>
                        </div>

                        <!-- 回复表情选择器 -->
                        <div v-if="replyState.showEmojiPicker" class="emoji-picker">
                          <div class="emoji-grid">
                            <span
                              v-for="emoji in emojis"
                              :key="emoji"
                              class="emoji-item"
                              @click="addReplyEmoji(emoji)"
                            >
                              {{ emoji }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </div>
              <div v-else class="no-replies">
                暂无回复
              </div>
              <!-- 回复分页 -->
              <div v-if="(replyComments[comment.id] || []).length < comment.replyCount" class="reply-pagination">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="loadMoreReplies(comment.id)"
                >
                  加载更多回复
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <!-- 父评论分页 -->
        <div v-if="computedTotalPages > 1" class="comment-pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="parentPageSize"
            :total="totalCount"
            @current-change="handlePageChange"
            layout="prev, pager, next"
            :pager-count="5"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { getArticleComments, createArticleComment, deleteArticleComment, getReplyComments } from '@/api/article-comments/comment';
import type { Comment, Reply } from '@/api/article-comments/types';
import useUserStore from '@/stores/user';

// 文本框引用
const commentTextarea = ref<HTMLTextAreaElement | null>(null);
const replyTextarea = ref<HTMLTextAreaElement | null>(null);

// 用户store
const userStore = useUserStore();

const props = defineProps<{
  targetCommentId?: number;
  articleId: number;
  authorId: number;
}>();

// 评论数据
const comments = ref<Comment[]>([]);
// 加载状态
const loading = ref(false);
// 错误信息
const error = ref('');

// 总数和总页数
const totalCount = ref(0);
const totalPages = ref(0);

// 新评论
const newComment = ref({
  content: ''
});

// 回复相关
const replyState = ref({
  isReplying: false,
  commentId: 0, // 父评论ID(0表示顶级评论)
  replyToId: 0, // 回复对象id
  replyToName: '', // 回复的用户名
  replyToCommentId: 0, // 要回复的具体评论ID（父评论或子评论）
  content: '',
  showEmojiPicker: false
});

// 回复数据
const replyComments = ref<Record<number, Reply[]>>({}); // 存储每个评论的回复列表
const replyLoading = ref<Record<number, boolean>>({}); // 存储每个评论的回复加载状态

// 表情选择器
const showEmojiPicker = ref(false);
const emojis = [
  '😊', '😂', '❤️', '👍', '🎉', '🔥', '🤔', '😢',
  '😎', '🤣', '😍', '👌', '👏', '🌟', '🤩', '😁'
];

// 筛选相关
const filterType = ref<'latest' | 'hot'>('latest'); // 筛选类型：latest-最新，hot-热门

// 分页相关
const parentPageSize = ref(10);
const childPageSize = ref(10);
const currentPage = ref(1);
const expandedCommentIds = ref<Set<number>>(new Set()); // 存储展开的评论ID

// 总页数（使用API返回的值）
const computedTotalPages = computed(() => {
  return totalPages.value || Math.ceil(comments.value.length / parentPageSize.value);
});

// 展开/折叠评论
const toggleComment = async (commentId: number) => {
  const comment = comments.value.find(c => c.id === commentId);
  if (comment) {
    if (expandedCommentIds.value.has(commentId)) {
      // 折叠子评论
      expandedCommentIds.value.delete(commentId);
      replyComments.value[commentId] = [];
    } else {
      // 展开子评论，如果没有数据则调用接口获取回复
      if (!replyComments.value[commentId] || replyComments.value[commentId].length === 0) {
        replyLoading.value[commentId] = true;
        try {
          const response = await getReplyComments({
            page: 1,
            pageSize: childPageSize.value,
            articleId: props.articleId,
            commentId: commentId
          });
          if (response.data && response.data.replies) {
            replyComments.value[commentId] = response.data.replies;
          }
        } catch (error: any) {
          console.error('获取回复失败:', error);
          ElMessage.error('获取回复失败，请稍后重试');
        } finally {
          replyLoading.value[commentId] = false;
        }
      }
      expandedCommentIds.value.add(commentId);
    }
    replyState.value.isReplying = false; // 点击展开/折叠时，取消回复状态
  }
};

// 开始回复
const startReply = (commentId: number, replyToCommentId: number, replyToId: number, replyToName: string) => {
  replyState.value = {
    isReplying: true,
    commentId: commentId,
    replyToId: replyToId,
    replyToCommentId: replyToCommentId,
    replyToName: replyToName,
    content: '',
    showEmojiPicker: false
  };
};

// 取消回复
const cancelReply = () => {
  replyState.value = {
    isReplying: false,
    commentId: 0,
    replyToId: 0,
    replyToCommentId: 0,
    replyToName: '',
    content: '',
    showEmojiPicker: false
  };
};

// 提交评论
const submitComment = async () => {
  if (!newComment.value.content.trim()) {
    ElMessage.warning('请输入评论内容');
    return;
  }

  if (!userStore.userId) {
    ElMessage.warning('请先登录');
    return;
  }

  try {
    await createArticleComment({
      articleId: props.articleId,
      userId: parseInt(userStore.userId),
      replyTo: props.authorId,
      content: newComment.value.content,
      imgs: []
    });

    // 创建成功后刷新评论列表
    await fetchComments();

    // 重置评论输入
    newComment.value = {
      content: ''
    };

    ElMessage.success('评论发布成功');
  } catch (error: any) {
    console.error('发布评论失败:', error);
    ElMessage.error(error?.message || '发布评论失败，请稍后重试');
  }
};

// 提交回复
const submitReply = async () => {
  if (!replyState.value.content.trim()) {
    ElMessage.warning('请输入回复内容');
    return;
  }

  if (!userStore.userId) {
    ElMessage.warning('请先登录');
    return;
  }

  try {
    await createArticleComment({
      articleId: props.articleId,
      parentCommentId: replyState.value.commentId,
      replyCommentId: replyState.value.replyToCommentId,
      userId: parseInt(userStore.userId),
      replyTo: replyState.value.replyToId,
      content: replyState.value.content,
      imgs: []
    });

    // 创建成功后重新获取该评论的回复列表
    const commentId = replyState.value.commentId;
    if (commentId) {
      replyLoading.value[commentId] = true;
      try {
        const response = await getReplyComments({
          page: 1,
          pageSize: childPageSize.value,
          articleId: props.articleId,
          commentId: commentId
        });

        const { replies, total } = response.data || {};
        replyComments.value[commentId] = replies;
        // 更新评论的回复数量
        const comment = comments.value.find(c => c.id === commentId);
        if (comment) {
          comment.replyCount = total || 0;
        }
      } catch (error: any) {
        console.error('获取回复列表失败:', error);
      } finally {
        replyLoading.value[commentId] = false;
      }
    }

    ElMessage.success('回复发布成功');
    cancelReply();
  } catch (error: any) {
    console.error('发布回复失败:', error);
    ElMessage.error(error?.message || '发布回复失败，请稍后重试');
  }
};

// 加载更多回复
const loadMoreReplies = async (commentId: number) => {
  // 获取当前已加载的回复数量
  const currentCount = replyComments.value[commentId]?.length || 0;

  // 计算下一页
  const currentPage = Math.floor(currentCount / childPageSize.value) + 1;

  replyLoading.value[commentId] = true;
  try {
    const response = await getReplyComments({
      page: currentPage,
      pageSize: childPageSize.value,
      articleId: props.articleId,
      commentId: commentId
    });
    if (response.data && response.data.replies) {
      const { replies } = response.data;
      // 只有当返回的数据不为空时才合并
      if (replies.length > 0) {
        // 合并新的回复数据
        if (!replyComments.value[commentId]) {
          replyComments.value[commentId] = [];
        }
        replyComments.value[commentId] = [...replyComments.value[commentId], ...replies];
      }
    }
  } catch (error: any) {
    console.error('加载更多回复失败:', error);
    ElMessage.error('加载更多回复失败，请稍后重试');
  } finally {
    replyLoading.value[commentId] = false;
  }
};

// 删除评论
const deleteComment = async (commentId: number) => {
  try {
    await deleteArticleComment({
      articleId: props.articleId,
      commentId
    });
    // 删除成功后刷新评论列表
    await fetchComments();
    ElMessage.success('评论删除成功');
  } catch (error: any) {
    console.error('删除评论失败:', error);
    ElMessage.error(error?.message || '删除评论失败，请稍后重试');
  }
};

// 处理分页变化
const handlePageChange = async (page: number) => {
  currentPage.value = page;
  await fetchComments();
};

// 设置筛选类型
const setFilterType = async (type: 'latest' | 'hot') => {
  filterType.value = type;
  currentPage.value = 1; // 切换筛选类型时重置到第一页
  await fetchComments();
};

// 时间格式化函数
const formatTime = (timestamp: number) => {
  // 将秒级时间戳转换为毫秒级时间戳
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // 如果是今天，显示具体时间
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }

  // 如果是昨天
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }

  // 否则显示完整日期
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
         ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

// 添加表情到光标位置
const insertEmojiAtCursor = (textarea: any, content: string, emoji: string) => {
  if (!textarea) return content;

  // 处理对象形式的 ref（当多个元素使用相同 ref 名称时）
  const actualTextarea = typeof textarea === 'object' && textarea !== null && '0' in textarea
    ? textarea[0]
    : textarea;

  if (!actualTextarea) return content;

  console.log(actualTextarea);
  const start = actualTextarea.selectionStart;
  const end = actualTextarea.selectionEnd;
  console.log(start, end);
  const newValue = content.substring(0, start) + emoji + content.substring(end);

  // 重新设置内容和光标位置
  setTimeout(() => {
    actualTextarea.selectionStart = actualTextarea.selectionEnd = start + emoji.length;
  }, 0);

  return newValue;
};

// 添加表情
const addEmoji = (emoji: string) => {
  newComment.value.content = insertEmojiAtCursor(commentTextarea.value, newComment.value.content, emoji);
  showEmojiPicker.value = false;
};

// 回复时添加表情
const addReplyEmoji = (emoji: string) => {
  replyState.value.content = insertEmojiAtCursor(replyTextarea.value, replyState.value.content, emoji);
  replyState.value.showEmojiPicker = false;
};

// 等待页面布局稳定
const waitForLayoutStable = async () => {
  return new Promise(resolve => {
    let lastHeight = document.body.offsetHeight;
    let stabilityChecks = 0;
    const maxChecks = 5;
    const checkInterval = 100;

    const checkLayout = () => {
      const currentHeight = document.body.offsetHeight;
      if (currentHeight === lastHeight) {
        stabilityChecks++;
        if (stabilityChecks >= maxChecks) {
          resolve(null);
        } else {
          setTimeout(checkLayout, checkInterval);
        }
      } else {
        lastHeight = currentHeight;
        stabilityChecks = 0;
        setTimeout(checkLayout, checkInterval);
      }
    };

    checkLayout();
  });
};

// 滚动到指定评论
const scrollToComment = async (commentId: number) => {
  try {
    // 展开包含该评论的父评论
    const parentComment = comments.value.find(c =>
      // c.id === commentId || c.replies?.some(r => r.id === commentId)
      c.replies?.some(r => r.id === commentId)
    );
    if (parentComment) {
      expandedCommentIds.value.add(parentComment.id);
      // 等待父评论展开后子评论渲染完成
      await nextTick();
      // 额外等待一点时间确保子评论完全渲染
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 等待 DOM 元素渲染完成
    await nextTick();
    // 额外等待一点时间确保所有元素完全渲染
    await new Promise(resolve => setTimeout(resolve, 100));

    // 等待页面布局稳定（确保ArticleMain已渲染完成）
    await waitForLayoutStable();

    // 查找评论元素
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (commentElement) {
      // 滚动到评论位置
      commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 高亮显示评论
      commentElement.classList.add('comment-highlight');
      // 3秒后移除高亮
      setTimeout(() => {
        commentElement.classList.remove('comment-highlight');
      }, 3000);
    } else {
      console.warn(`Comment element with id 'comment-${commentId}' not found`);
      ElMessage.warning('未找到指定评论');
    }
  } catch (error) {
    console.error('滚动到评论失败:', error);
  }
};

// 获取评论数据
const fetchComments = async () => {
  if (!props.articleId) {
    error.value = '文章ID不存在';
    return;
  }

  try {
    loading.value = true;
    error.value = '';

    const response = await getArticleComments({
      page: currentPage.value,
      pageSize: parentPageSize.value,
      articleId: props.articleId,
      targetCommentId: props.targetCommentId,
      tab: filterType.value
    });

    // 更新评论数据
    const { comments: commentList, total, totalPage } = response.data || {};
    comments.value = commentList;
    totalCount.value = total;
    totalPages.value = totalPage;

    // 填充初始回复数据
    if (commentList) {
      commentList.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
          replyComments.value[comment.id] = comment.replies;
        }
      });
    }
  } catch (err: any) {
    ElMessage.error(err?.message || '获取评论失败，请刷新页面重试');
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取评论数据并检查是否需要滚动到指定评论
onMounted(async () => {
  // 先获取评论数据
  await fetchComments();
  // 然后滚动到指定评论
  if (props.targetCommentId) {
    await scrollToComment(props.targetCommentId);
  }
});

// 监听 targetCommentId 变化
watch(() => props.targetCommentId, async (newValue) => {
  if (newValue) {
    await scrollToComment(newValue);
  }
});

// 监听文章ID变化，重新获取评论
watch(() => props.articleId, async (newValue) => {
  if (newValue) {
    await fetchComments();
  }
});
</script>

<style scoped>
.comment-section {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 0 20px;
}

.comment-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.comment-input-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 30px;
  position: relative;
}

.comment-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 1rem;
  font-family: inherit;
  margin-bottom: 10px;
}

.comment-textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
}

.comment-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-button {
  font-size: 18px;
  padding: 0 8px;
}

.submit-button {
  border-radius: 4px;
}

.emoji-picker {
  /* position: absolute; */
  margin-top: 10px;
  /* background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  padding: 10px;
  z-index: 100;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}

.emoji-item {
  font-size: 20px;
  cursor: pointer;
  text-align: center;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f0f0f0;
}

.comment-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.comment-filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.no-comments {
  text-align: center;
  color: #888;
  padding: 40px 0;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #0066cc;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #333;
}

.comment-time {
  font-size: 0.85rem;
  color: #888;
}

.comment-text {
  line-height: 1.6;
  margin-bottom: 10px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 5px;
}

.reply-input-section {
  margin-top: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
  position: relative;
}

.reply-to-info {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 8px;
}

.reply-textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 0.9rem;
  font-family: inherit;
  margin-bottom: 10px;
}

.reply-textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
}

.reply-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 5px;
}

.reply-actions .tool-button {
  margin-right: auto;
}

.reply-list {
  margin-top: 15px;
  padding-left: 20px;
  border-left: 2px solid #f0f0f0;
  contain: layout;
  will-change: height;
  transition: height 0.3s ease;
}

/* 回复列表过渡动画 */
.reply-fade-enter-active,
.reply-fade-leave-active {
  transition: all 0.3s ease;
}

.reply-fade-enter-from,
.reply-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.reply-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-content {
  flex: 1;
}

.reply-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #666;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.reply-author {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

.reply-to {
  font-size: 0.8rem;
  color: #888;
}

.reply-time {
  font-size: 0.8rem;
  color: #888;
  margin-left: auto;
}

.reply-text {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 8px;
}

.reply-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.comment-pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 评论高亮样式 */
.comment-highlight {
  background-color: rgba(0, 102, 204, 0.1);
  border-radius: 8px;
  animation: highlight 3s ease-out;
}

@keyframes highlight {
  0% {
    background-color: rgba(0, 102, 204, 0.3);
  }
  100% {
    background-color: rgba(0, 102, 204, 0);
  }
}

@media (max-width: 768px) {
  .comment-section {
    padding: 0 15px;
  }

  .comment-input-section {
    padding: 15px;
  }

  .comment-list {
    padding: 15px;
  }

  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .reply-list {
    padding-left: 10px;
  }

  .reply-header {
    flex-wrap: wrap;
  }
}
</style>
