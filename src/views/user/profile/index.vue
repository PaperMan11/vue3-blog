<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>个人中心</h1>
    </div>
    <div class="profile-content">
      <div class="profile-form">
        <el-form :model="userForm" label-width="100px" class="form">
          <!-- 头像上传 -->
          <el-form-item label="头像">
            <div class="avatar-uploader">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-change="handleAvatarChange"
                :auto-upload="false"
                accept="image/*"
              >
                <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
                <div v-else class="avatar-placeholder">
                  <el-icon class="avatar-placeholder-icon"><UserFilled /></el-icon>
                  <span>点击上传头像</span>
                </div>
              </el-upload>
            </div>
          </el-form-item>

          <el-form-item label="用户名">
            <el-input v-model="userForm.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="userForm.email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item label="昵称">
            <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
          </el-form-item>

          <el-form-item label="个人简介">
            <el-input
              v-model="userForm.bio"
              type="textarea"
              placeholder="请输入个人简介"
              :rows="4"
            />
          </el-form-item>

          <el-form-item label="个人网站">
            <el-input v-model="userForm.website" placeholder="请输入个人网站" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">保存修改</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { UserFilled } from '@element-plus/icons-vue';
import useUserStore from '@/stores/user';

const userStore = useUserStore();

// 用户信息表单
const userForm = reactive({
  username: '',
  email: '',
  nickname: '',
  bio: '',
  website: '',
  avatar: ''
});

// 处理头像上传
const handleAvatarChange = (file: any) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    userForm.avatar = e.target?.result as string;
  };
  reader.readAsDataURL(file.raw);
};

// 提交表单
const handleSubmit = () => {
  // 表单验证
  if (!userForm.username) {
    ElMessage.error('请输入用户名');
    return;
  }

  try {
    // 模拟更新用户信息
    userStore.updateUserInfo(userForm);
    ElMessage.success('个人信息更新成功');
  } catch (error) {
    ElMessage.error('个人信息更新失败，请稍后重试');
    console.error('更新失败:', error);
  }
};

// 重置表单
const resetForm = () => {
  // 重置为原始数据
  initUserForm();
};

// 初始化用户表单数据
const initUserForm = () => {
  // 从用户存储中获取数据
  const userInfo = userStore.userInfo;
  Object.assign(userForm, {
    username: userInfo.username || '',
    email: userInfo.email || '',
    nickname: userInfo.nickname || '',
    bio: userInfo.bio || '',
    website: userInfo.website || '',
    avatar: userInfo.avatar || ''
  });
};

// 组件挂载时初始化数据
onMounted(() => {
  initUserForm();
});
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  margin-bottom: 30px;
}

.profile-header h1 {
  font-size: 24px;
  color: #333;
  text-align: center;
}

.profile-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form {
  width: 100%;
}

/* 头像上传样式 */
.avatar-uploader {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px dashed #d9d9d9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-placeholder:hover {
  border-color: #409eff;
  color: #409eff;
}

.avatar-placeholder-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.avatar-placeholder span {
  font-size: 12px;
}

/* 表单样式 */
.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: 500;
}

.el-button {
  margin-right: 10px;
}
</style>
