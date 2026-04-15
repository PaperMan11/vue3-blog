<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">用户登录</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            :show-password="true"
            size="large"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <!-- 图形验证码 -->
        <el-form-item prop="captcha">
          <div class="captcha-wrapper">
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              prefix-icon="Key"
              size="large"
              autocomplete="off"
              clearable
              maxlength="4"
            />
            <div class="captcha-img-box" @click="refreshCaptcha">
              <img v-if="captchaImage" :src="captchaImage" alt="验证码" class="captcha-img" title="点击刷新">
              <div v-else class="captcha-loading">加载中...</div>
            </div>
          </div>
        </el-form-item>
        <!-- 记住我+忘记密码-->
        <el-form-item prop="remember">
          <div class="login-option">
            <el-checkbox v-model="loginForm.remember" label="记住我" size="default" />
            <el-link underline="never" @click="$router.push('/reset')" class="forget-pwd">忘记密码</el-link>
          </div>
        </el-form-item>
        <el-form-item class="login-btn-group">
          <!-- 增加登录loading防重复点击 -->
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="handleLogin"
            :loading="loginLoading"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-link">
        还没有账号？<span @click="$router.push('/welcome/register')" class="register-link">立即注册</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import useUserStore from '@/stores/user'
import { getCaptcha } from '@/api/welcome/welcome'


const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 表单实例
const loginFormRef = ref<any>()
// 登录按钮loading状态，防止重复点击提交
const loginLoading = ref<boolean>(false)
// 登录成功后跳转路径，默认为首页
const redirect = ref<string>('')
// 验证码图片
const captchaImage = ref<string>('')

// 1. 表单数据双向绑定
const loginForm = reactive({
  username: '', // 用户名/手机号
  password: '', // 密码
  captcha: '', // 验证码
  captchaId: '', // 验证码id
  remember: false // 是否记住密码
})

// 2. 表单校验规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在3-20个字符之间', trigger: 'blur' },
    // 可选：手机号正则校验，注释打开即可生效
    // { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    // {
    //   validator: (rule: any, value: string, callback: any) => {
    //     if (value.toLowerCase() !== captchaCode.value.toLowerCase()) {
    //       callback(new Error('验证码错误'));
    //     } else {
    //       callback();
    //     }
    //   },
    //   trigger: 'blur'
    // }
  ],
  remember: [] // 复选框无校验，只占位让表单校验通过
})

// 3. loading防重 + 记住密码持久化 + redirect跳转
const handleLogin = async () => {
  // 先执行表单校验
  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return

  loginLoading.value = true // 开启加载状态
  try {
    // 调用登录API
    await userStore.login({
      username: loginForm.username,
      password: loginForm.password,
      captchaId: loginForm.captchaId,
      captcha: loginForm.captcha
    })

    // 勾选则存账号密码，不勾选则清空
    if (loginForm.remember) {
      localStorage.setItem('loginInfo', JSON.stringify({
        username: loginForm.username,
        password: loginForm.password
      }))
    } else {
      localStorage.removeItem('loginInfo')
    }

    ElMessage.success('登录成功，正在为您跳转...')
    setTimeout(() => {
      router.push(redirect.value || '/') // 跳转到redirect或首页
      loginLoading.value = false
      // 登录成功后清空验证码
      loginForm.captcha = ''
    }, 800)
  } catch (err: any) {
    ElMessage.error(err?.message || '登录失败，请稍后重试！')
    loginLoading.value = false
    // 登录失败时刷新验证码
    refreshCaptcha()
    loginForm.captcha = ''
  }
}

const refreshCaptcha = async () => {
  try {
    // 清空原有验证码输入
    loginForm.captchaId = ''
    loginForm.captcha = ''
    captchaImage.value = ''

    const response = await getCaptcha()
    // 存储验证码ID和Base64图片
    loginForm.captchaId = response.data.captcha_id
    captchaImage.value = response.data.captcha_image
  } catch (error: any) {
    ElMessage({
      message: error?.message || '获取验证码失败，请稍后重试',
      type: 'error',
      duration: 3000
    })
  }
}

// 监听路由变化，获取redirect参数
watch(
  () => route, // 监听当前路由对象
  (newRoute) => {
    // console.log('路由变化，新的redirect参数：', newRoute.query.redirect)
    // 获取路由上的redirect参数，赋值给变量
    redirect.value = newRoute.query.redirect as string || ''
  },
  { immediate: true } // 立即执行一次，初始化redirect值
)

// 页面挂载时自动填充【记住的账号密码】
onMounted(() => {
  const loginInfo = localStorage.getItem('loginInfo')
  if (loginInfo) {
    const { username, password } = JSON.parse(loginInfo)
    loginForm.username = username
    loginForm.password = password
    loginForm.remember = true
  }
  // 页面加载时获取验证码
  refreshCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%; // 保证全屏铺满，小屏幕不塌陷
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  .login-box {
    width: 100%;
    max-width: 420px; // 固定最大宽度，大屏不拉伸，小屏自适应
    height: auto;
    padding: 36px 30px 20px 30px;
    background: var(--blog-card-box-bg-color);
    border-radius: 16px;
    box-shadow: var(--blog-card-box-shadow);
    box-sizing: border-box;
    .login-title {
      text-align: center;
      margin-bottom: 30px;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    // 记住我+忘记密码 布局样式
    .login-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .forget-pwd {
        font-size: 14px;
        cursor: pointer;
      }
    }
    // 验证码包装器样式
    .captcha-wrapper {
      display: flex;
      gap: 12px;
      width: 100%;
      align-items: center;
      .el-input {
        flex: 1;
      }
    }
    // 验证码图片样式
    .captcha-img-box {
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
      height: 40px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      overflow: hidden;
      transition: border-color 0.2s;
      &:hover {
        border-color: #409eff;
      }
    }
    .captcha-img {
      object-fit: contain;
    }
    .captcha-loading {
      font-size: 12px;
      color: #909399;
    }
    .login-btn-group {
      margin-top: 10px;
      .login-btn {
        width: 100%;
        border: none;
        font-size: 16px;
        font-weight: 600;
        border-radius: 8px;
        transition: all 0.2s ease;
      }
    }
    .login-link {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      line-height: 1.5;
      .register-link {
        width: 100%;
        cursor: pointer;
        margin-left: 5px;
        color: var(--primary-color);
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
