import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth';
import { login as ApiLogin, logoff as ApiLogoff } from '@/api/welcome/welcome';
import { getUserInfo as ApiGetUserInfo, updateUserInfo as ApiUpdateUserInfo } from '@/api/user/user';
import type { LoginReq } from '@/api/welcome/types';
import type { UpdateUserInfoReq } from '@/api/user/types';
import { ElMessage } from 'element-plus';


export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '');
  const userId = ref<string>('');
  const username = ref<string>('');
  const nickname = ref<string>('');
  const email = ref<string>('');
  const avatar = ref<string>('');
  const introduction = ref<string>('');
  const roles = ref<string[]>([]);

  // 计算属性：用户信息
  const userInfo = computed(() => {
    return {
      userId: userId.value,
      username: username.value,
      nickname: nickname.value,
      email: email.value,
      avatar: avatar.value,
      introduction: introduction.value,
      roles: roles.value
    };
  });

  const login = async (loginReq: LoginReq) => {
    try {
      const loginResp = await ApiLogin(loginReq);
      const { userId, accessToken, refreshToken } = loginResp.data;
      // userId.value = userId?.toString() || '';
      setLoginToken(accessToken || '', refreshToken || '');
    } catch (error) {
      // ElMessage.error('登录失败');
      throw error;
    }
  }

  const logout = async () => {
    try {
      await ApiLogoff();
      resetToken();
    } catch (error) {
      // ElMessage.error('登出失败');
      throw error;
    }
  }

  const resetToken = () => {
    token.value = '';
    userId.value = '';
    username.value = '';
    nickname.value = '';
    email.value = '';
    avatar.value = '';
    introduction.value = '';
    roles.value = [];
    removeToken();
    // 清除refreshToken
    localStorage.removeItem('refreshToken');
  }

  const setLoginToken = (accessToken: string, refreshToken: string) => {
    token.value = accessToken;
    setToken(accessToken);
    // 存储refreshToken到localStorage
    localStorage.setItem('refreshToken', refreshToken);
  }

  const getInfo = async () => {
    try {
      const response = await ApiGetUserInfo();
      const userInfo = response.data;

      userId.value = userInfo.id?.toString() || '';
      username.value = userInfo.username || '';
      nickname.value = userInfo.nickname || '';
      email.value = userInfo.email || '';
      avatar.value = userInfo.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif';
      introduction.value = userInfo.introduction || '';

      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  // 更新用户信息
  const updateUserInfo = async (userInfo: UpdateUserInfoReq) => {
    try {
      const response = await ApiUpdateUserInfo(userInfo);
      const updatedInfo = response.data;

      if (updatedInfo.nickname) nickname.value = updatedInfo.nickname;
      if (updatedInfo.avatar) avatar.value = updatedInfo.avatar;
      if (updatedInfo.introduction) introduction.value = updatedInfo.introduction;
      if (updatedInfo.email) email.value = updatedInfo.email;

      ElMessage.success('更新用户信息成功');
      return updatedInfo;
    } catch (error) {
      ElMessage.error('更新用户信息失败');
      throw error;
    }
  }

  return {
    token,
    userId,
    username,
    nickname,
    email,
    avatar,
    introduction,
    roles,
    userInfo,

    login,
    logout,
    resetToken,
    setLoginToken,
    getInfo,
    updateUserInfo
  };
});

export default useUserStore;
