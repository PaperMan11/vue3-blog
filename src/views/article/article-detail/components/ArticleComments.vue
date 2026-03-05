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
      <div v-if="comments.length === 0" class="no-comments">
        暂无评论，快来抢沙发吧！
      </div>
      <div v-else v-for="comment in paginatedComments" :key="comment.id" class="comment-item">
        <div class="comment-avatar">
          {{ comment.author.charAt(0) }}
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-time">{{ comment.time }}</span>
          </div>
          <div class="comment-text">{{ comment.content }}</div>
          <div class="comment-actions">
            <el-button
              link
              type="primary"
              size="small"
              @click="startReply(comment.id)"
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
              {{ comment.isExpanded ? '收起' : `查看${comment.replyCount}条回复` }}
            </el-button>
          </div>

          <!-- 父评论的回复输入框 -->
          <div v-if="replyState.isReplying && replyState.commentId === comment.id && replyState.replyToCommentId === comment.id" class="reply-input-section">
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
          <div v-if="comment.isExpanded && comment.replies && comment.replies.length > 0" class="reply-list">
            <div v-for="reply in comment.replies.slice(0, replyPageSizes[comment.id] || childPageSize)" :key="reply.id" class="reply-item">
              <div class="reply-avatar">
                {{ reply.author.charAt(0) }}
              </div>
              <div class="reply-content">
                <div class="reply-header">
                  <span class="reply-author">{{ reply.author }}</span>
                  <span class="reply-to">回复 {{ reply.replyTo }}</span>
                  <span class="reply-time">{{ reply.time }}</span>
                </div>
                <div class="reply-text">{{ reply.content }}</div>
                <div class="reply-actions">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="startReply(comment.id, reply.id, reply.author)"
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
            <!-- 回复分页 -->
            <div v-if="comment.replies.length > (replyPageSizes[comment.id] || childPageSize)" class="reply-pagination">
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
      <div v-if="totalPages > 1" class="comment-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="parentPageSize"
          :total="comments.length"
          @current-change="handlePageChange"
          layout="prev, pager, next"
          :pager-count="5"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

// 文本框引用
const commentTextarea = ref<HTMLTextAreaElement | null>(null);
const replyTextarea = ref<HTMLTextAreaElement | null>(null);

// 评论类型
interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
  images: string[];
  replies?: Reply[];
  replyCount?: number;
  isExpanded?: boolean; // 是否展开回复
}

// 回复类型
interface Reply {
  id: number;
  author: string;
  content: string;
  time: string;
  replyTo: string;
}

const props = defineProps<{
  comments: Comment[];
}>();

const emit = defineEmits<{
  (e: 'comment-added', comment: Comment): void;
}>();

// 新评论
const newComment = ref({
  content: ''
});

// 回复相关
const replyState = ref({
  isReplying: false,
  commentId: null as number | null, // 父评论ID
  replyToId: null as number | null, // 子评论ID，用于回复子评论
  replyToCommentId: null as number | null, // 要回复的具体评论ID（父评论或子评论）
  replyToName: '', // 回复的用户名
  content: '',
  showEmojiPicker: false
});

// 表情选择器
const showEmojiPicker = ref(false);
const emojis = [
  '😊', '😂', '❤️', '👍', '🎉', '🔥', '🤔', '😢',
  '😎', '🤣', '😍', '👌', '👏', '🌟', '🤩', '😁'
];

// 分页相关
const parentPageSize = 20;
const childPageSize = 10;
const currentPage = ref(1);
const replyPageSizes = ref<Record<number, number>>({}); // 存储每个评论的回复分页大小

// 计算属性：分页后的父评论
const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * parentPageSize;
  const end = start + parentPageSize;
  return props.comments.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(props.comments.length / parentPageSize);
});

// 展开/折叠评论
const toggleComment = (commentId: number) => {
  const comment = props.comments.find(c => c.id === commentId);
  if (comment) {
    if (comment.isExpanded) {
      // 折叠子评论
      replyPageSizes.value[commentId] = childPageSize;
    }
    comment.isExpanded = !comment.isExpanded;
    replyState.value.isReplying = false; // 点击展开/折叠时，取消回复状态
  }
};

// 开始回复
const startReply = (commentId: number, replyToId: number | null = null, replyToName: string = '') => {
  replyState.value = {
    isReplying: true,
    commentId,
    replyToId,
    replyToCommentId: replyToId || commentId, // 如果是回复子评论，则设置为子评论ID，否则设置为父评论ID
    replyToName: replyToName || props.comments.find(c => c.id === commentId)?.author || '',
    content: '',
    showEmojiPicker: false
  };
};

// 取消回复
const cancelReply = () => {
  replyState.value = {
    isReplying: false,
    commentId: null,
    replyToId: null,
    replyToCommentId: null,
    replyToName: '',
    content: '',
    showEmojiPicker: false
  };
};

// 提交评论
const submitComment = () => {
  if (!newComment.value.content.trim()) {
    ElMessage.warning('请输入评论内容');
    return;
  }

  const comment: Comment = {
    id: Date.now(),
    author: '当前用户', // 实际项目中应该从用户状态中获取
    content: newComment.value.content,
    time: new Date().toLocaleString(),
    images: [],
    replies: [],
    replyCount: 0,
    isExpanded: false
  };

  emit('comment-added', comment);

  // 重置评论输入
  newComment.value = {
    content: ''
  };

  ElMessage.success('评论发布成功');
};

// 提交回复
const submitReply = () => {
  if (!replyState.value.content.trim()) {
    ElMessage.warning('请输入回复内容');
    return;
  }

  const comment = props.comments.find(c => c.id === replyState.value.commentId);
  if (comment) {
    const reply: Reply = {
      id: Date.now(),
      author: '当前用户', // 实际项目中应该从用户状态中获取
      content: replyState.value.content,
      time: new Date().toLocaleString(),
      replyTo: replyState.value.replyToName
    };

    if (!comment.replies) {
      comment.replies = [];
    }
    comment.replies.push(reply);
    comment.replyCount = (comment.replyCount || 0) + 1;
    comment.isExpanded = true;

    ElMessage.success('回复发布成功');
    cancelReply();
  }
};

// 加载更多回复
const loadMoreReplies = (commentId: number) => {
  if (!replyPageSizes.value[commentId]) {
    replyPageSizes.value[commentId] = childPageSize;
  }
  replyPageSizes.value[commentId] += childPageSize;
};

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
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
