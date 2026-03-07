import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth';

export interface IUserState {
  token: string;
  userId: string,
  username: string;
  nickname: string;
  email: string;
  website: string;
  avatar: string;
  introduction: string;
  roles: string[];
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '');
  const userId = ref<string>('');
  const username = ref<string>('');
  const nickname = ref<string>('');
  const email = ref<string>('');
  const website = ref<string>('');
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
      website: website.value,
      avatar: avatar.value,
      introduction: introduction.value,
      roles: roles.value
    };
  });

  const login = (userInfo) => {
    const { token: userToken, username: userUsername } = userInfo;
    token.value = userToken || 'mock-token';
    username.value = userUsername;
    setToken(token.value);
  }

  const logout = () => {
    token.value = '';
    userId.value = '';
    username.value = '';
    nickname.value = '';
    email.value = '';
    website.value = '';
    avatar.value = '';
    introduction.value = '';
    roles.value = [];
    removeToken();
  }

  const resetToken = () => {
    token.value = '';
    userId.value = '';
    username.value = '';
    nickname.value = '';
    email.value = '';
    website.value = '';
    avatar.value = '';
    introduction.value = '';
    roles.value = [];
    removeToken();
  }

  const getInfo = async ():Promise<Object> => {
    // Placeholder for fetching user info from an API
    // This function should set userId, name, avatar, introduction, and roles based on the response
    return new Promise((resolve) => {
      setTimeout(() => {
        userId.value = '12345';
        username.value = 'user123';
        nickname.value = '用户123';
        email.value = 'user123@example.com';
        website.value = 'https://example.com';
        avatar.value = '';
        introduction.value = 'I am a Vue.js developer.';
        roles.value = ['admin'];
        resolve({
          userId: userId.value,
          username: username.value,
          nickname: nickname.value,
          email: email.value,
          website: website.value,
          avatar: avatar.value,
          introduction: introduction.value,
          roles: roles.value
        });
      }, 1000);
    });
  }

  // 更新用户信息
  const updateUserInfo = (userInfo) => {
    const { username: userUsername, nickname, email, bio, website, avatar } = userInfo;
    if (userUsername) username.value = userUsername;
    if (nickname) nickname.value = nickname;
    if (email) email.value = email;
    if (bio) bio.value = bio;
    if (website) website.value = website;
    if (avatar) avatar.value = avatar;
  }

  return {
    token,
    userId,
    username,
    nickname,
    email,
    website,
    avatar,
    introduction,
    roles,
    userInfo,

    login,
    logout,
    resetToken,
    getInfo,
    updateUserInfo
  };
});

export default useUserStore;
