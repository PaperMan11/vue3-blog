<template>
  <div class="article-write">
    <div class="write-header">
      <h1>{{ isEditMode ? '修改博客' : '编写博客' }}</h1>
    </div>
    <el-form :model="articleForm" label-width="80px" class="write-form">
      <el-form-item label="标题">
        <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="articleForm.category" placeholder="请输入分类" />
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="articleForm.tags" placeholder="请输入标签，用逗号分隔" />
      </el-form-item>
      <el-form-item label="内容">
        <v-md-editor
          v-model="articleForm.content"
          :include-level="[1, 2, 3, 4]"
          :disabled-menus="[]"
          height="600px"
          @upload-image="handleUploadImage"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';
import { createArticle, updateArticle, getArticleById } from '@/api/article/article';
// 代码行号
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// 代码复制
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// TodoList 任务列表
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';

// 确保插件只注册一次
if (!VMdEditor._todoListPluginRegistered) {
  VMdEditor.Codemirror = Codemirror;
  VMdEditor.use(githubTheme, {
    Hljs: hljs,
  });
  VMdEditor.use(createLineNumbertPlugin());
  VMdEditor.use(createCopyCodePlugin());
  VMdEditor.use(createTodoListPlugin());
  VMdEditor._todoListPluginRegistered = true;
}

const router = useRouter();
const route = useRoute();

// 从路由参数中获取文章ID
const articleId = ref<number | null>(Number(route.params.id) || null);

// 判断是否是编辑模式
const isEditMode = computed(() => {
  return articleId.value !== null && !isNaN(articleId.value);
});

const articleForm = ref({
  id: 0,
  title: '',
  category: '',
  tags: '',
  content: ''
});

// 获取文章详情
const getArticleDetail = async () => {
  if (!articleId.value) return;

  try {
    const response = await getArticleById(articleId.value);
    const article = response.data;
    articleForm.value = {
      id: article.id,
      title: article.title,
      category: article.category,
      tags: article.tags?.join(', ') || '',
      content: article.content
    };
  } catch (error) {
    ElMessage.error('获取文章详情失败');
    console.error('获取文章详情失败:', error);
  }
};

const submitForm = async () => {
  // 表单验证
  if (!articleForm.value.title) {
    ElMessage.error('请输入文章标题');
    return;
  }
  if (!articleForm.value.content) {
    ElMessage.error('请输入文章内容');
    return;
  }

  console.log(articleForm.value);

  try {
    if (isEditMode.value) {
      // 修改文章
      const response = await updateArticle(articleForm.value);
      ElMessage.success('文章修改成功');
      // 跳转到文章详情页
      router.push(`/article/${articleId.value}/detail`);
    } else {
      // 提交文章
      const response = await createArticle(articleForm.value);
      ElMessage.success('文章提交成功');
      // 重置表单
      resetForm();
      // 跳转到首页
      router.push('/home');
    }
  } catch (error) {
    ElMessage.error(isEditMode.value ? '文章修改失败，请稍后重试' : '文章提交失败，请稍后重试');
    console.error('操作失败:', error);
  }
};

const resetForm = () => {
  articleForm.value = {
    id: 0,
    title: '',
    category: '',
    tags: '',
    content: ''
  };
};

// 组件挂载时获取文章详情
onMounted(() => {
  if (isEditMode.value) {
    getArticleDetail();
  }
});

const handleUploadImage = (file: File, callback: (url: string) => void) => {
  // 使用FileReader读取本地图片，生成DataURL用于预览
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageUrl = e.target?.result as string;
    callback(imageUrl);
  };
  reader.readAsDataURL(file);
};
</script>

<style scoped>
.article-write {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.write-header {
  margin-bottom: 30px;
}

.write-header h1 {
  font-size: 24px;
  color: #333;
  text-align: center;
}

.write-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
