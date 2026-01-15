<template>
  <div class="header-container">
    <el-menu
      :default-active="activeIndex"
      class="header-menu"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item index="/home">
        <el-icon><HomeFilled/></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Files/></el-icon>
          <span>归档</span>
        </template>
        <el-menu-item index="2-1">
          <el-icon><Clock/></el-icon>
          <span>时间轴</span>
        </el-menu-item>
        <el-menu-item index="2-2">
          <el-icon><Folder/></el-icon>
          <span>分类</span>
        </el-menu-item>
        <el-menu-item index="2-3">
          <el-icon><CollectionTag /></el-icon>
          <span>标签</span>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><IceCreamRound/></el-icon>
          <span>其他</span>
        </template>
        <el-menu-item index="3-1">
          <el-icon><Fries/></el-icon>
          <span>树洞</span>
        </el-menu-item>
        <el-menu-item index="3-2">
          <el-icon><Postcard/></el-icon>
          <span>留言板</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
    <!-- 右侧 搜索栏 + 用户栏 容器 -->
    <div class="header-right-box">
      <!-- 日夜主题切换组件 -->
      <ThemeToggle />
      <!-- 搜索框 -->
      <Search />
      <div v-if="!isLoggedIn" style="cursor: pointer;">
        <el-avatar @click="toPage('/welcome/login')">登录</el-avatar>
      </div>
      <!-- 用户信息栏 -->
      <div v-else class="user-info-box">
        <el-dropdown trigger="hover">
          <div class="user-avatar">
            <el-avatar :src="avatarUrl"/>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon><UserFilled /></el-icon>
                <span>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon><EditPen /></el-icon>
                <span>写文章</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useUserStore from '@/stores/user'
import Search from './search.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 菜单默认高亮项
const activeIndex = ref('/home')
// 搜索框绑定值
const searchValue = ref('')

// 头像地址
const avatarUrl = ref(userStore.avatar)
// 是否登录状态
const isLoggedIn = ref(userStore.userId.length > 0)

// 菜单选择事件 - 所有导航菜单点击跳转路由
const handleSelect = (key: string) => {
  // console.log(key, keyPath)
  router.push(key)
}

// 公共跳转方法 - 用户下拉项通用
const toPage = (path: string) => {
  router.push(path)
}


const handleLogout = () => {
  // 清空pinia中的用户信息
  userStore.logout()
  // 跳转到登录页
  setTimeout(() => {
    router.push('/welcome/login')
  }, 500)
}

// ✅ 搜索方法
const handleSearch = () => {
  console.log('搜索内容：', searchValue.value)
  // if(searchValue.value) {
  //   // 搜索跳转，可自定义路由地址
  //   router.push(`/search?keyword=${searchValue.value}`)
  // }
}

// 监听路由变化 - 页面刷新/跳转后，菜单高亮当前页面
watch(() => route.path, (newPath) => {
  // console.log('当前路由变化：', newPath)
  activeIndex.value = newPath
}, { immediate: true })

// 监听用户登录状态变化
watch(() => userStore.userId, (newVal) => {
  isLoggedIn.value = newVal.length > 0
  avatarUrl.value = userStore.avatar
}, { immediate: true })

</script>

<style scoped lang="scss">

:deep(.el-avatar) {
  --el-avatar-size: 35px
}
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .header-menu {
    line-height: 60px;
    border-bottom: none;
    background-color: var(--blog-backgroud-color);
  }
  // 覆盖el-menu的默认高度
  .el-menu--horizontal {
    --el-menu-horizontal-height: 50px;
  }
  
  .header-right-box {
    display: flex;
    align-items: center;
    gap: 10px; // 搜索框和用户栏间距
    height: 100%;
    margin-right: 10px;

    // 用户信息栏样式优化
    .user-info-box {
      .user-avatar {
        display: flex;
        align-items: center;
        gap: 6px;
        // padding: 0 12px;
        height: 36px;
        line-height: 36px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        color: #333;
        transition: all 0.25s ease;
        .dropdown-icon {
          font-size: 12px;
          margin-top: 2px;
        }
      }
      // 用户下拉菜单样式统一
      :deep(.el-dropdown-menu) {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
    }
  }
}
</style>