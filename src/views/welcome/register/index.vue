<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">用户注册</h2>
      <el-form 
        ref="registerFormRef" 
        :model="registerForm" 
        :rules="registerRules" 
        label-width="0px"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            :show-password="true"
            size="large"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="registerForm.repassword"
            placeholder="请确认密码"
            prefix-icon="Lock"
            :show-password="true"
            size="large"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <!-- 注册协议勾选 -->
        <!-- <el-form-item prop="agree">
          <div class="login-option">
            <el-checkbox v-model="registerForm.agree" label="同意用户协议和隐私政策" size="default" />
          </div>
        </el-form-item> -->
        <el-form-item class="login-btn-group">
          <el-button 
            type="primary" 
            size="large" 
            class="login-btn" 
            @click="handleRegister"
            :loading="registerLoading"
          >
            注 册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-link">
        已有账号？<span @click="$router.push('/welcome/login')" class="register-link">立即登录</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import useUserStore from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

// 表单实例
const registerFormRef = ref<any>()
// 注册按钮loading防重复点击提交
const registerLoading = ref<boolean>(false)

// 表单数据双向绑定
const registerForm = reactive({
  username: '',    // 用户名/手机号
  password: '',    // 密码
  repassword: ''  // 确认密码
})

// 表单校验规则 (和登录页一致的校验标准 + 密码一致性校验 + 必填协议)
const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在3-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        // 两次密码一致性校验
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 注册核心方法 - 同登录页逻辑一致：loading防重 + try/catch异常捕获
const handleRegister = async () => {
  // 表单校验
  const valid = await registerFormRef.value.validate().catch(() => false)
  if (!valid) return

  registerLoading.value = true
  try {
    if (registerForm.username && registerForm.password) {
      // 存储用户信息到pinia + localStorage
      userStore.login({ username: registerForm.username })
      // 注册成功提示并跳转登录页
      ElMessage.success('注册成功，即将为您跳转到登录页...')
      setTimeout(() => {
        router.push('/welcome/login')
        registerLoading.value = false
      }, 1200)
    } else {
      ElMessage.error('请完善注册信息！')
      registerLoading.value = false
    }
  } catch (err) {
    ElMessage.error('注册失败，请稍后重试！')
    registerLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
// 样式和登录页完全一致、变量完全复用，无任何新增修改，保证视觉统一
.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  .login-box {
    width: 100%;
    max-width: 420px;
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
    .login-option {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      font-size: 14px;
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