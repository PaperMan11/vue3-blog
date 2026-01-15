import { ref } from 'vue'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie';

interface IAppState {
  device: 'desktop' | 'mobile';
  size: 'large' | 'default' | 'small';
  lang: string;
  theme: 'light' | 'dark';
}


export const useAppStore = defineStore('app', () => {
  const device = ref<'desktop' | 'mobile'>('desktop');
  const size = ref<string>(localStorage.getItem('size') || 'default');
  const lang = ref<string>(localStorage.getItem('lang') || 'zh-ch');
  const theme = ref<string>(localStorage.getItem('theme') || 'light');
  function toggleDevice(newDevice: 'desktop' | 'mobile') {
    device.value = newDevice;
  }
  
  function setSize(newSize: 'large' | 'default' | 'small') {
    size.value = newSize;
    // Cookies.set('size', newSize);
    localStorage.setItem('size', newSize);
  }

  function setLang(newLang: string) {
    lang.value = newLang;
    localStorage.setItem('lang', newLang);
  }

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
  }
  
  return {
    device,
    size,
    lang,
    theme,

    toggleDevice,
    setSize,
    setLang,
    setTheme
  };
});

export default useAppStore;