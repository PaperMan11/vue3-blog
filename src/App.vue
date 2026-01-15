<template>
  <el-config-provider :size="size" :z-index="zIndex" :locale="locale">
    <MouseTrail/>
    <Particles/>
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import { computed, ref } from 'vue';
import useAppStore from '@/stores/app.ts';

const appStore = useAppStore();

const size = computed(() => {
  return appStore.size as 'large' | 'default' | 'small';
});
const zIndex = ref(3000);
const locale = ref(appStore.lang === 'zh-ch' ? zhCn : en);
</script>

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
