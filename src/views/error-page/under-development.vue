<template>
  <div class="under-development">
    <div class="container">
      <div class="image-container">
        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20friendly%20illustration%20of%20a%20construction%20site%20with%20developers%20working%20on%20a%20website%2C%20colorful%2C%20cartoon%20style%2C%20clean%20design&image_size=landscape_16_9" alt="功能开发中" class="illustration">
      </div>
      <div class="content">
        <h1 class="title">功能开发中</h1>
        <p class="description">抱歉，该功能正在紧张开发中，敬请期待！</p>
        <div class="links">
          <el-button type="primary" @click="goHome">返回首页</el-button>
          <el-button @click="goBack">返回上一页</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.under-development {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 20px;
}

.container {
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
}

.image-container {
  max-width: 400px;
  width: 100%;
}

.illustration {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.content {
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  animation: fadeInDown 0.6s ease-out;
}

.description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.links {
  display: flex;
  gap: 20px;
  justify-content: center;
  animation: fadeIn 0.6s ease-out 0.4s both;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
  }

  .links {
    flex-direction: column;
    align-items: center;
  }

  .links el-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>
