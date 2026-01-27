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
const noticeText = '本站站所有文章均为原创内容，2026年全新改版上线，优化了阅读体验和移动端适配，感谢各位朋友的关注与支持，博客会持续更新优质内容！站所有文章均为原创内容，2026年全新改版上线，优化了阅读体验和移动端适配，感谢各位朋友的关注与支持，博客会持续更新优质内容！所有文章均为原创内容，2026年全新改版上线，优化了阅读体验和移动端适配，感谢各位朋友的关注与支持，博客会持续更新优质内容！2026年全新改版上线，优化了阅读体验和移动端适配，感谢各位朋友的关注与支持，博客会持续更新优质内容2026年全新改版上线，优化了阅读体验和移动端适配，感谢各位朋友的关注与支持，博客会持续更新优质内容'
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
  text-align: center;
  padding: 4px 12px 8px;
}
</style>