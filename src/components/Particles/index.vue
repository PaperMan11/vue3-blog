<template>
  <!-- 粒子特效的外层容器，用于承载动态创建的canvas画布 -->
  <div ref="particlesContainer" class="particles-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const particlesContainer = ref<HTMLElement | null>(null);

/**
 * 动画帧请求ID
 * 接收requestAnimationFrame返回的标识，用于组件销毁时关闭动画循环，防止内存泄漏
 */
let animationFrameId: number | null = null;

interface Particle {
  x: number;         // 粒子x轴坐标
  y: number;         // 粒子y轴坐标
  size: number;      // 粒子的半径大小
  speedX: number;    // 粒子x轴的移动速度（正负值控制移动方向）
  speedY: number;    // 粒子y轴的移动速度（正负值控制移动方向）
  color: string;     // 粒子的颜色值
}
let particles: Particle[] = [];

const colors = ['#f79533', '#f37055', '#ef4e7b', '#a166ab', '#5073b8', '#1098ad', '#07b39b', '#6fba82'];

/** 存储鼠标实时的X/Y轴坐标，鼠标移动时实时更新 */
let mouseX = 0;
let mouseY = 0;

/**
 * 创建粒子画布和所有粒子的核心方法
 * @param count 粒子的总数量，外部调用时传入创建的粒子个数
 */
const createParticles = (count: number) => {
  if (!particlesContainer.value) return;
  
  // 1. 动态创建canvas画布元素，用于绘制所有粒子和连线
  const canvas = document.createElement('canvas');
  // 获取canvas的2D绘图上下文，所有绘制操作的核心对象
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // 获取粒子容器的宽高信息，基于容器尺寸设置画布大小，实现全屏适配
  const rect = particlesContainer.value.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  // 将创建好的canvas画布追加到容器中，作为绘制载体
  particlesContainer.value.appendChild(canvas);
  
  // 2. 循环创建指定数量的粒子对象，并存入粒子数组
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,       // 粒子初始x坐标：画布范围内随机
      y: Math.random() * canvas.height,      // 粒子初始y坐标：画布范围内随机
      size: Math.random() * 3 + 1,           // 粒子大小：随机1~4px，大小不一有层次感
      speedX: Math.random() * 0.5 - 0.25,    // 粒子x轴速度：随机-0.25~0.25，实现随机缓慢移动
      speedY: Math.random() * 0.5 - 0.25,    // 粒子y轴速度：随机-0.25~0.25，实现随机缓慢移动
      color: colors[Math.floor(Math.random() * colors.length)] as string, // 随机选取配色
    });
  }
  
  // 3. 绑定鼠标移动事件，实时更新鼠标的坐标信息
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  

  const animate = () => {
    if (!ctx) return;
    
    // 每次绘制前清空整个画布，防止粒子运动产生重影
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 遍历所有粒子，逐个处理粒子的行为和绘制
    particles.forEach((particle, index) => {
      // 粒子基础运动逻辑：根据自身速度更新坐标，实现自主移动
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // 粒子边缘反弹逻辑：碰到画布边界时，反向运动（速度取反）
      // 左右边界反弹
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      // 上下边界反弹
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }
      
      // 核心交互逻辑：粒子远离鼠标光标（鼠标磁吸排斥效果）
      // 计算鼠标相对于画布的坐标（容器有偏移，需要减去容器的left/top值）
      const mouseCanvasX = mouseX - rect.left;
      const mouseCanvasY = mouseY - rect.top;
      const dx = particle.x - mouseCanvasX;
      const dy = particle.y - mouseCanvasY;
      // 利用勾股定理，计算粒子与鼠标之间的直线距离
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 当粒子与鼠标的距离 < 100px 时，触发排斥效果
      if (distance < 100) {
        // 计算粒子到鼠标的角度，确定排斥方向
        const angle = Math.atan2(dy, dx);
        // 计算排斥力大小：距离越近，排斥力越强
        const force = (300 - distance) / 1500;
        // 根据角度和排斥力，更新粒子的移动速度，实现远离鼠标的效果
        particle.speedX += Math.cos(angle) * force;
        particle.speedY += Math.sin(angle) * force;
      }
      
      // 阻力衰减逻辑：给粒子添加运动阻力，防止粒子无限加速
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;

      // // 当速度小于0.02（肉眼不可见），重新随机生成速度，续命移动
      // if (Math.abs(particle.speedX) < 0.02) {
      //   particle.speedX = Math.random() * 0.5 - 0.25;
      // }
      // if (Math.abs(particle.speedY) < 0.02) {
      //   particle.speedY = Math.random() * 0.5 - 0.25;
      // }
      
      // 绘制单个粒子（圆形）
      ctx.beginPath(); // 开启新的绘制路径，避免路径重叠
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); // 绘制圆形粒子
      ctx.fillStyle = particle.color; // 设置粒子填充色
      ctx.fill(); // 执行填充，完成粒子绘制
      
      // 粒子连线逻辑：连接当前粒子与其他距离相近的粒子，形成网状效果
      // j从index+1开始遍历，避免重复连线（A连B 和 B连A），提升性能
      for (let j = index + 1; j < particles.length; j++) {
        const otherParticle = particles[j]!;
        // 计算当前粒子与其他粒子的x/y轴距离差
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        // 计算两个粒子之间的直线距离
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 当两个粒子距离 < 100px 时，绘制连接线
        if (distance < 100) {
          ctx.beginPath(); // 开启新路径
          ctx.strokeStyle = particle.color; // 连线颜色与粒子一致
          ctx.globalAlpha = 1 - distance / 100; // 连线透明度：距离越远越透明，视觉渐变效果
          ctx.lineWidth = 0.5; // 连线宽度，细线条更美观
          ctx.moveTo(particle.x, particle.y); // 连线起点：当前粒子坐标
          ctx.lineTo(otherParticle.x, otherParticle.y); // 连线终点：其他粒子坐标
          ctx.stroke(); // 执行绘制，完成连线
          ctx.globalAlpha = 1; // 重置全局透明度，不影响其他绘制
        }
      }
    });
    
    // 无限动画循环：请求浏览器下一帧继续执行animate函数
    // 基于浏览器刷新率（60帧/秒）执行，动画丝滑无卡顿，性能最优
    animationFrameId = requestAnimationFrame(animate);
  };
  
  // 启动动画循环，开始粒子的所有交互和绘制逻辑
  animate();
};


onMounted(() => {
  createParticles(50);
});

onUnmounted(() => {
  // 如果动画ID存在，取消动画请求，停止粒子动画循环
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
/* 粒子特效容器样式 */
.particles-container {
  position: fixed;    /* 固定定位：全屏展示，页面滚动不位移，始终在最底层 */
  top: 0;             /* 容器顶部贴合窗口顶部 */
  left: 0;            /* 容器左侧贴合窗口左侧 */
  width: 100%;        /* 容器宽度占满整个窗口 */
  height: 100vh;      /* 容器高度占满整个窗口可视区 */
  /* z-index: -8;        层级为负数：确保粒子背景在页面所有内容的最底层，不遮挡任何元素 */
  pointer-events: none; /* 鼠标穿透：容器可看见但无法点击，不影响页面按钮/菜单/输入框的点击操作 */
  overflow: hidden;   /* 溢出隐藏：防止粒子超出容器范围 */
}
</style>
