<template>
  <!-- 搜索组件容器 - 阻止冒泡防止下拉框点击关闭 -->
  <div class="search-container" @click.stop>
    <div class="search-input-box">
      <el-input
        v-model="searchValue"
        placeholder="搜索文章/标签/分类..."
        size="default"
        prefix-icon="Search"
        clearable
        @keyup.enter="handleSearch"
        @focus="showSearchBox = true"
        @clear="handleClearInput"
      />
    </div>
    <!-- 下拉联想/历史/推荐框 - 有内容+显示状态才展示 -->
    <div 
      v-show="showSearchBox && (searchHistoryList.length > 0 || searchRecommendList.length > 0 || searchResultList.length > 0)"
      class="search-option-box"
    >
      <!-- 搜索联想结果 - 输入关键词时展示 -->
      <div v-if="searchValue && searchResultList.length" class="search-result-box">
        <div class="search-item" v-for="item in searchResultList" :key="item" @click="handleItemClick(item)">
          <el-icon class="search-icon"><Search /></el-icon>
          <span>{{ item }}</span>
        </div>
      </div>

      <!-- 搜索历史记录 - 无输入关键词时展示 -->
      <div v-else-if="!searchValue && searchHistoryList.length" class="search-history-box">
        <div class="search-title">
          <span>搜索历史</span>
          <span class="clear-btn" @click="clearAllHistory">清空</span>
        </div>
        <div class="search-item" v-for="item in searchHistoryList" :key="item" @click="handleItemClick(item)">
          <el-icon class="history-icon"><Clock /></el-icon>
          <span>{{ item }}</span>
          <el-icon class="del-icon" @click.stop="delHistoryItem(item)"><Delete /></el-icon>
        </div>
      </div>

      <!-- 热门搜索推荐 - 无输入+无历史时展示 -->
      <div v-else class="search-recommend-box">
        <div class="search-title">热门推荐</div>
        <div class="search-item" v-for="item in hotRecommendList" :key="item" @click="handleItemClick(item)">
          <SvgIcon icon-class="heat" class="hot-icon" />
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue'
import { Search, Clock, Delete } from '@element-plus/icons-vue'

const searchValue = ref('')
// 控制下拉框显隐
const showSearchBox = ref(false)
// 搜索联想结果列表
const searchResultList = ref<string[]>([])
// 本地缓存的搜索历史列表
const searchHistoryList = ref<string[]>(['Vue3', 'TypeScript'])
const searchRecommendList = ref<string[]>(['前端博客', 'Sass用法', 'Pinia'])
// 防抖定时器
let timer: NodeJS.Timeout | null = null

// 标签/分类/高频关键词
const hotRecommendList = [
  'Vue3', 'TypeScript', '前端博客', 'Sass用法', 'Pinia', 'Vite', 'ElementPlus', '前端进阶'
]
// 搜索联想匹配库（可替换成你的文章标题/标签/分类接口数据）
const searchMatchPool = [
  'Vue3组合式API', 'Vue3+TS实战', 'TypeScript语法', 'Sass混合器', 'Pinia状态管理',
  'Vite项目搭建', 'ElementPlus组件', '前端工程化', '博客搭建教程', 'CSS布局技巧'
]

// ========== 获取本地缓存的搜索历史 ==========
onMounted(() => {
  const history = localStorage.getItem('blog_search_history')
  if (history) {
    searchHistoryList.value = JSON.parse(history)
  }
  // 点击页面空白处 关闭下拉框
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  timer && clearTimeout(timer)
})

// ========== 输入关键词实现防抖联想 ==========
watchEffect(() => {
  const keyword = searchValue.value.trim()
  // 清空联想列表
  searchResultList.value = []
  if (!keyword) return

  // 防抖：输入停止300ms再执行联想，避免频繁触发
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    // 模糊匹配联想词
    searchResultList.value = searchMatchPool.filter(item => {
      return item.toLowerCase().includes(keyword.toLowerCase())
    })
  }, 300)
})


const handleDocumentClick = () => {
  showSearchBox.value = false
}

const handleSearch = () => {
  const keyword = searchValue.value.trim()
  if (!keyword) return
  // 1. 添加到搜索历史（去重）
  addToHistory(keyword)
  // 2. 你的搜索业务逻辑：跳转搜索页/调用接口等
  console.log('执行搜索：', keyword)
  // 示例：router.push({ path: '/search', query: { keyword } })
  // 3. 搜索完成后关闭下拉框
  showSearchBox.value = false
}

/** 点击联想/历史/推荐项 快速搜索 */
const handleItemClick = (keyword: string) => {
  searchValue.value = keyword
  handleSearch()
}

/** 清空输入框内容 */
const handleClearInput = () => {
  searchValue.value = ''
  searchResultList.value = []
}

/** 添加关键词到历史记录（去重+最多存储10条） */
const addToHistory = (keyword: string) => {
  const index = searchHistoryList.value.findIndex(item => item === keyword)
  if (index > -1) {
    // 已存在，移到最前面
    searchHistoryList.value.splice(index, 1)
  }
  // 新增到头部
  searchHistoryList.value.unshift(keyword)
  // 最多存储10条历史记录
  if (searchHistoryList.value.length > 10) {
    searchHistoryList.value.pop()
  }
  // 缓存到本地localStorage
  localStorage.setItem('blog_search_history', JSON.stringify(searchHistoryList.value))
}

/** 删除单条历史记录 */
const delHistoryItem = (keyword: string) => {
  const index = searchHistoryList.value.findIndex(item => item === keyword)
  if (index > -1) {
    searchHistoryList.value.splice(index, 1)
    localStorage.setItem('blog_search_history', JSON.stringify(searchHistoryList.value))
  }
}

/** 清空所有历史记录 */
const clearAllHistory = () => {
  searchHistoryList.value = []
  localStorage.removeItem('blog_search_history')
}
</script>

<style scoped lang="scss">
@use "@/styles/mixin.scss";
.search-container {
  position: relative;
  display: inline-block;
}

.search-input-box {
  width: 240px;
  * {
    cursor: text;
  }
  :deep(.el-input) {
    width: 100%;
    .el-input__wrapper {
      padding: 0 16px;
      border: 1px solid #e5e7eb;
      box-shadow: none !important;
      background-color: #f9fafb;
      transition: all 0.25s ease-in-out;
      border-radius: 20px;

      &:hover {
        border-color: #d1d5db;
        background-color: #f3f4f6;
        
      }
      &.is-focus {
        border-color: #409eff;
        background-color: #ffffff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
      }

      .el-input__inner {
        font-size: 14px;
        color: #374151;
        background: transparent;
        border: none;
        padding: 0;
      }

      .el-input__prefix {
        color: #94a3b8;
        font-size: 16px;
      }
    }
  }
}

// ========== 下拉联想/历史/推荐框样式 ==========
.search-option-box {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 999;
  width: 100%;
  padding: 8px 0;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;

  .search-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px 6px;
    font-size: 12px;
    color: #94a3b8;
    border-bottom: 1px solid #f3f4f6;

    .clear-btn {
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }

  .search-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    font-size: 14px;
    color: #374151;
    transition: all 0.2s ease;

    * {
      cursor: pointer;
    }

    &:hover {
      background-color: #f9fafb;
      color: #409eff;
    }

    span {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .search-icon, .history-icon, .hot-icon {
      font-size: 14px;
      color: #94a3b8;
      margin-right: 8px;
    }

    .del-icon {
      font-size: 12px;
      color: #94a3b8;
      margin-left: 8px;
      &:hover {
        color: #f53f3f;
      }
    }
  }
}
</style>
