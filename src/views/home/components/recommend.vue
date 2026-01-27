<template>
  <el-card class="recommend-container">
    <div class="recommend-header">
      <svg-icon icon-class="recommend" />
      <span>推荐文章</span>
    </div>
    <div class="split-line"></div>
    <div class="recommend-content">
      <!-- 循环推荐列表 + 序号 -->
      <div class="recommend-item" v-for="(value, index) in recommends" :key="value.id">
        <!-- 封面图 + 无封面兜底图标 -->
        <div class="cover-box">
          <img v-if="value.cover.length > 0" :src="value.cover" alt="封面图" class="cover-img">
          <svg-icon v-else icon-class="image" class="default-icon" />
        </div>
        <!-- 标题+时间 文本区域 -->
        <div class="info-box">
          <div class="article-title">{{ value.title }}</div>
          <div class="article-time">{{ formatTime(value.createdAt, 'YYYY-MM-DD') }}</div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils/time';

interface RecommendItem {
  id: number;
  title: string;
  cover: string;
  createdAt: number;
  updatedAt: number;
}

const recommends = [
  { id: 1, title: 'Vue 3 新特性介绍', cover: '', createdAt: 1768792281, updatedAt: 1768792281 },
  { id: 2, title: '如何使用 TypeScript 提升代码质量', cover: '', createdAt: 1768782281, updatedAt: 1768782281 },
  { id: 3, title: '前端性能优化最佳实践', cover: '', createdAt: 1768772281, updatedAt: 1768772281 },
  { id: 4, title: '响应式编程入门指南', cover: '', createdAt: 1768762281, updatedAt: 1768762281 },
  { id: 5, title: '构建高可用的前端应用', cover: '', createdAt: 1768752281, updatedAt: 1768752281 },
]
</script>

<style scoped lang="scss">
  .recommend-container {
    width: 100%;          // 宽度自适应父容器（侧边栏）
    box-sizing: border-box;// 盒模型：内边距/边框计入宽度，防止撑大容器
  }
  
  .recommend-header {
    display: flex;        // flex弹性布局，实现图标+文字横向排列
    align-items: center;  // 垂直居中对齐
    justify-content: center; // 水平居中对齐
    gap: 8px;             // 图标与文字之间的间距
    font-size: 18px;      // 标题字号
    font-weight: 600;     // 标题加粗
    color: #303133;       // 标题主文字色
    padding-bottom: 6px;  // 底部内边距，与分割线拉开距离
  }
  
  // 分割线样式 - 全站统一的短横线分割，与用户卡/公告栏/时钟栏完全一致
  .split-line {
    width: 40px;          // 短横线宽度，精致不突兀
    height: 1px;          // 分割线高度
    background-color: #e5e7eb; // 分割线浅灰色，柔和不刺眼
    margin: 2px auto 16px;// 上下外边距+水平居中，与上下内容合理间距
  }
  
  // 推荐文章列表内容区 样式
  .recommend-content {
    width: 100%;          // 宽度铺满卡片
    padding: 0 8px 12px;  // 左右内边距8px，底部内边距12px，顶部无间距
    box-sizing: border-box;// 盒模型规范，防止padding撑宽
  }
  
  // 单个推荐文章项
  .recommend-item {
    display: flex;        // flex布局，实现封面图+文字区左右排列
    align-items: center;  // 垂直居中对齐，封面与文字居中匹配
    gap: 12px;            // 封面图与文字区的间距
    padding: 10px 12px;   // 项的内边距，点击热区适中
    margin-bottom: 8px;   // 项与项之间的下边距，拉开列表间距
    border-radius: 8px;   // 圆角，与全站卡片圆角风格统一
    * {
      cursor: pointer;    // 所有元素鼠标悬浮均显示手型
    }
    transition: all 0.22s ease-in-out; // 悬浮过渡动画，丝滑无卡顿，全站统一动画时长
    box-sizing: border-box;// 盒模型规范
    width: 100%;          // 宽度铺满内容区
  
    // 鼠标悬浮高亮效果 - 全站统一配色规则，无任何改动
    &:hover {
      background-color: #f9fafb; // 悬浮浅蓝背景色
      color: #409eff;            // 悬浮主题蓝文字色
    }
  
    // 文章封面图容器样式
    .cover-box {
      width: 58px;        // 自定义调整的封面宽度
      height: 48px;       // 自定义调整的封面高度
      flex-shrink: 0;     // 固定宽高，不会被文字区挤压变形
      border-radius: 6px; // 封面圆角，比外层项圆角小一点更精致
      background-color: #f5f7fa; // 无封面时的兜底浅灰背景色
      display: flex;      // flex布局，实现图片/默认图标居中显示
      align-items: center;
      justify-content: center;
      overflow: hidden;   // 超出容器部分隐藏，防止封面图变形
    }
  
    // 封面图片的样式
    .cover-img {
      width: 100%;        // 图片宽度铺满容器
      height: 100%;       // 图片高度铺满容器
      object-fit: cover;  // 图片等比例裁剪，保持宽高比，不拉伸变形
    }
  
    // 无封面时的默认图标样式
    .default-icon {
      font-size: 24px;    // 默认图标尺寸
      color: #c0c4cc;     // 默认图标浅灰色，弱化显示不抢视觉焦点
    }
  
    // 文章标题+时间 文字内容区域样式
    .info-box {
      flex: 1;            // 占满剩余宽度，自适应布局
      display: flex;
      flex-direction: column; // 垂直排列，标题在上时间在下
      gap: 4px;           // 标题与时间的间距
      overflow: hidden;   // 超出部分隐藏，配合标题省略使用
    }
  
    // 文章标题样式
    .article-title {
      font-size: 14px;    // 标题字号
      font-weight: 500;   // 标题中等加粗，突出显示
      line-height: 1.5;   // 行高，提升可读性
      white-space: nowrap;// 强制单行显示
      overflow: hidden;   // 超出部分隐藏
      text-overflow: ellipsis; // 超长标题显示省略号...，防止撑爆布局
  
      // 鼠标悬浮推荐项时，标题同步变色为主题蓝
      .recommend-item:hover & {
        color: #409eff;
      }
    }
  
    // 文章更新时间样式
    .article-time {
      font-size: 12px;    // 时间字号更小，弱化展示
      color: #909399;     // 时间浅灰色，不抢标题视觉焦点
      line-height: 1.4;   // 行高适配字号
    }
  }
  
  // 最后一个推荐项 移除底部外边距，避免列表底部多余留白，优化视觉细节
  .recommend-item:last-child {
    margin-bottom: 0;
  }
  </style>