import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth';

export interface IUserState {
  token: string;
  userId: string,
  name: string;
  avatar: string;
  introduction: string;
  roles: string[];
}

const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '');
  const userId = ref<string>('');
  const name = ref<string>('');
  const avatar = ref<string>('');
  const introduction = ref<string>('');
  const roles = ref<string[]>([]);

  const login = (userInfo) => {
    const { token: userToken } = userInfo;
    token.value = userToken;
    setToken(userToken);
  }

  const logout = () => {
    token.value = '';
    roles.value = [];
    removeToken();
  }

  const resetToken = () => {
    token.value = '';
    roles.value = [];
    removeToken();
  }

  const getInfo = async ():Promise<Object> => {
    // Placeholder for fetching user info from an API
    // This function should set userId, name, avatar, introduction, and roles based on the response
    return new Promise((resolve) => {
      setTimeout(() => {
        userId.value = '12345';
        name.value = 'John Doe';
        avatar.value = 'https://example.com/avatar.jpg';
        introduction.value = 'I am a Vue.js developer.';
        roles.value = ['admin'];
        resolve({
          userId: userId.value,
          name: name.value,
          avatar: avatar.value,
          introduction: introduction.value,
          roles: roles.value
        });
      }, 1000);
    });
  }

  return {
    token,
    userId,
    name,
    avatar,
    introduction,
    roles,

    login,
    logout,
    resetToken,
    getInfo
  };
});

export default useUserStore;