<template>
  <el-card class="notice-container">
    <div class="notice-header">
      <svg-icon icon-class="announcement" />
      <span>公告</span>
    </div>
    <div class="split-line"></div>
    <div class="notice-content">
      <EllipsisText :text="noticeText || '本站暂无公告信息，敬请期待～'" :show-count="180" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNotice } from '@/api/home/home'
const noticeText = ref('')

onMounted(() => {
  getNotice().then(res => {
    noticeText.value = res.data?.content || '本站暂无公告信息，敬请期待～'
  }).catch(err => {
    ElMessage.error(err.message || 'Error')
  })
})

</script>

<style scoped lang="scss">
.notice-container {
  width: 100%;
  box-sizing: border-box;
}

.notice-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
	font-weight: 600;
  color: #303133;
  padding-bottom: 6px;

  .el-icon-bell {
    color: #409eff;
    font-size: 20px;
  }
}

.split-line {
  width: 40px;
  height: 1px;
  background-color: #e5e7eb;
  margin: 2px auto 12px;
}

.notice-content {
  text-align: justify;
  padding: 4px 12px 8px;
}
</style>
