<template>
  <div class="captcha-container" @click="refreshCaptcha">
    <canvas ref="captchaCanvas" width="120" height="40" class="captcha-canvas"></canvas>
    <div class="captcha-refresh">
      <svg-icon icon-class="refresh" class="refresh-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const captchaCanvas = ref<HTMLCanvasElement>();
let captchaCode = '';

// 生成随机颜色
const randomColor = (min: number, max: number) => {
  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);
  return `rgb(${r},${g},${b})`;
};

// 生成随机数字
const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// 绘制验证码
const drawCaptcha = () => {
  const canvas = captchaCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制背景
  ctx.fillStyle = randomColor(180, 240);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 生成验证码
  captchaCode = '';
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  for (let i = 0; i < 4; i++) {
    const char = chars[randomNum(0, chars.length)]!;
    captchaCode += char;

    // 绘制字符
    ctx.font = `${randomNum(24, 32)}px Arial`;
    ctx.fillStyle = randomColor(50, 160);
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(20 + i * 25, canvas.height / 2);
    ctx.rotate((randomNum(-30, 30) * Math.PI) / 180);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  // 绘制干扰线
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = randomColor(100, 200);
    ctx.beginPath();
    ctx.moveTo(randomNum(0, canvas.width), randomNum(0, canvas.height));
    ctx.lineTo(randomNum(0, canvas.width), randomNum(0, canvas.height));
    ctx.stroke();
  }

  // 绘制干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = randomColor(150, 200);
    ctx.beginPath();
    ctx.arc(randomNum(0, canvas.width), randomNum(0, canvas.height), 1, 0, 2 * Math.PI);
    ctx.fill();
  }

  // 发出验证码更新事件
  emit('update:modelValue', captchaCode);
};

// 刷新验证码
const refreshCaptcha = () => {
  drawCaptcha();
};

// 监听modelValue变化，当父组件需要重置验证码时
watch(() => props.modelValue, (newVal) => {
  if (newVal === '') {
    refreshCaptcha();
  }
});

onMounted(() => {
  drawCaptcha();
});

// 暴露刷新方法给父组件
defineExpose({
  refreshCaptcha
});
</script>

<style scoped>
.captcha-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.captcha-canvas {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.captcha-container:hover .captcha-canvas {
  border-color: #409eff;
}

.captcha-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #f5f7fa;
  transition: all 0.2s;
}

.captcha-refresh:hover {
  background-color: #e6e8eb;
}

.refresh-icon {
  width: 16px;
  height: 16px;
  color: #909399;
}
</style>
