<template>
  <!-- 鼠标轨迹特效容器 -->
  <div class="mouse-trail-container">
    <!-- canvas画布：用于绘制鼠标跟随的粒子轨迹 -->
    <canvas ref="trailCanvas" class="trail-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const trailCanvas = ref<HTMLCanvasElement | null>(null);

/**
 * 动画帧请求ID
 * 用于接收requestAnimationFrame返回的标识，后续通过这个ID关闭动画，防止内存泄漏
 * 初始值为null：组件初始化时还未开启动画
 */
let animationFrameId: number | null = null;

/**
 * canvas的2D绘图上下文对象
 * 所有的绘制操作（画圆、上色、清画布）都需要通过这个上下文对象实现
 * CanvasRenderingContext2D | null：获取不到上下文时为null
 */
let ctx: CanvasRenderingContext2D | null = null;

/**
 * 存储所有粒子点的数组
 * 每个粒子的对象结构约束：
 * x: 粒子的X轴坐标
 * y: 粒子的Y轴坐标
 * size: 粒子的初始大小
 * color: 粒子的颜色
 * age: 粒子的存活帧数（年龄），用于实现粒子渐隐、缩小、销毁逻辑
 */
let points: { x: number; y: number; size: number; color: string; age: number }[] = [];

/** 鼠标实时的X/Y轴坐标，鼠标移动时会实时更新 */
let mouseX = 0;
let mouseY = 0;

/**
 * 粒子的配色数组 - 渐变色板
 * 暖色调到冷色调的渐变，随机取色，视觉效果协调美观
 */
const colors = ['#f79533', '#f37055', '#ef4e7b', '#a166ab', '#5073b8', '#1098ad', '#07b39b', '#6fba82'];

/**
 * 初始化画布的核心函数
 * 作用：设置画布尺寸、获取绘图上下文、绑定事件监听、启动动画循环
 */
const initCanvas = () => {
  // 容错处理：如果canvas元素获取失败，直接终止执行
  if (!trailCanvas.value) return;
  
  // 设置canvas画布的宽高 = 浏览器可视窗口的宽高，实现全屏画布
  trailCanvas.value.width = window.innerWidth;
  trailCanvas.value.height = window.innerHeight;
  
  ctx = trailCanvas.value.getContext('2d');
  if (!ctx) {
    console.error('无法获取 Canvas 2D 上下文，画布绘制失败');
    return;
  }
  
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', handleResize);
  
  // 启动核心动画循环，开始绘制粒子轨迹
  animate();
};

/**
 * 鼠标移动事件的处理函数
 * @param e MouseEvent - 鼠标事件对象，包含鼠标坐标信息
 * 作用：实时更新鼠标坐标，并调用添加粒子的方法生成新粒子
 */
const handleMouseMove = (e: MouseEvent) => {
  // 更新鼠标的实时坐标（基于浏览器可视窗口）
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // 调用方法，在当前鼠标坐标生成一个新的粒子
  addPoint(mouseX, mouseY);
};

/**
 * 添加单个粒子的方法
 * @param x number - 粒子的X轴坐标
 * @param y number - 粒子的Y轴坐标
 * 作用：创建一个随机样式的粒子对象，并添加到粒子数组中
 */
const addPoint = (x: number, y: number) => {
  // 从配色数组中随机选取一个颜色，保证粒子颜色多样化
  const color = colors[Math.floor(Math.random() * colors.length)] as string;
  // 向粒子数组中推入新的粒子对象
  points.push({
    x,          // 粒子x坐标 = 鼠标x坐标
    y,          // 粒子y坐标 = 鼠标y坐标
    size: Math.random() * 10 + 1, // 粒子初始大小：随机1~9px，大小不一更有层次感
    color,      // 粒子随机颜色
    age: 0      // 粒子初始年龄：0帧，每执行一次animate年龄+1
  });
};

/**
 * 窗口尺寸变化的处理函数
 * 作用：窗口缩放/最大化/最小化时，重新设置画布宽高，适配最新窗口尺寸
 */
const handleResize = () => {
  if (!trailCanvas.value) return;
  // 重新赋值画布宽高 = 最新的窗口宽高
  trailCanvas.value.width = window.innerWidth;
  trailCanvas.value.height = window.innerHeight;
};

/**
 * 核心动画绘制函数（无限循环执行）
 * 作用：清空画布 → 遍历更新所有粒子状态 → 绘制粒子 → 销毁过期粒子 → 循环请求下一帧
 * 整个鼠标轨迹的动画逻辑都在这里实现，是组件的核心
 */
const animate = () => {
  // 容错处理：上下文/画布不存在时，终止绘制
  if (!ctx || !trailCanvas.value) return;
  
  // 清空整个画布：每次绘制前清空，防止粒子残留重影
  // 参数：x起点, y起点, 清空宽度, 清空高度
  ctx.clearRect(0, 0, trailCanvas.value.width, trailCanvas.value.height);
  
  // 遍历所有粒子，逐个更新状态并绘制
  for (let i = 0; i < points.length; i++) {
    const point = points[i]!;
    
    // 粒子年龄+1：每执行一帧动画，粒子就"长大"一岁
    point.age += 1;
    
    // 粒子过期销毁逻辑：当粒子年龄超过50帧时，从数组中移除
    // 防止粒子数组无限增长，造成内存占用过高、页面卡顿
    if (point.age > 50) {
      points.splice(i, 1); // 删除当前过期的粒子
      i--; // 删除元素后，数组下标回退一位，防止遍历跳过下一个粒子
      continue; // 跳过后续绘制逻辑，处理下一个粒子
    }
    
    // 根据粒子年龄计算当前显示大小：年龄越大，粒子越小，实现"缩小"动画
    // 公式：初始大小 * (1 - 年龄/50) → 年龄从0→50，大小从初始值→0
    const size = point.size * (1 - point.age / 50);
    
    // 开始绘制单个粒子（圆形）
    ctx.beginPath(); // 开启新的绘制路径，防止和其他粒子的路径重叠
    // 绘制圆形：参数(x坐标, y坐标, 半径, 开始弧度, 结束弧度)
    // Math.PI * 2 表示绘制一个完整的圆形（0~360度）
    ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
    ctx.fillStyle = point.color; // 设置粒子的填充颜色
    ctx.globalAlpha = 1 - point.age / 50; // 设置粒子透明度：年龄越大越透明，实现"渐隐"动画
    ctx.fill(); // 执行填充，完成圆形绘制
    ctx.globalAlpha = 1; // 重置全局透明度为默认值1，不影响后续绘制
    
  }
  
  /**
   * 核心：循环请求下一帧动画
   * requestAnimationFrame：浏览器原生高性能动画API，和浏览器屏幕刷新率同步（60帧/秒）
   * 执行后返回一个动画ID，赋值给变量用于后续关闭动画
   * 把animate自身传入，实现无限循环调用 → 形成连续的动画效果
   */
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  initCanvas();
});

onUnmounted(() => {
  // 移除鼠标移动事件监听，解绑全局事件
  window.removeEventListener('mousemove', handleMouseMove);
  // 移除窗口尺寸变化事件监听，解绑全局事件
  window.removeEventListener('resize', handleResize);
  
  // 如果动画ID存在，就取消动画请求，停止无限循环的绘制逻辑
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
/* 鼠标轨迹画布的外层容器样式 */
.mouse-trail-container {
  position: fixed;    /* 固定定位：跟随窗口，页面滚动时不位移，全屏展示 */
  top: 0;             /* 容器顶部贴窗口顶部 */
  left: 0;            /* 容器左侧贴窗口左侧 */
  width: 100%;        /* 容器宽度100%窗口宽度 */
  height: 100%;       /* 容器高度100%窗口高度 */
  z-index: 9999;      /* 最高层级：确保轨迹显示在页面所有内容的最上层，不被遮挡 */
  pointer-events: none; /* 核心属性：鼠标穿透，画布可以看见但无法点击，不影响页面按钮/输入框/菜单的点击操作 */
}

/* canvas画布本身的样式 */
.trail-canvas {
  position: absolute; /* 绝对定位：基于外层容器铺满整个容器 */
  top: 0;
  left: 0;
}
</style>
