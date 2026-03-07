import { createRouter, createWebHistory } from 'vue-router';
import type { Router, RouteRecordRaw, RouteComponent } from 'vue-router';
import Layout from '@/layout/index.vue';
import path from 'path';

export const constantRoutes:RouteRecordRaw[] = [
  {
    path: '/',
    component:Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'Home',
        meta: { title: 'Home' }
      },
      {
        path: '/welcome/login',
        component: () => import('@/views/welcome/login/index.vue'),
        name: 'Login'
      },
      {
        path: '/welcome/register',
        component: () => import('@/views/welcome/register/index.vue'),
        name: 'Register'
      },
      {
        path: '/article/:id/detail',
        component: () => import('@/views/article/article-detail/index.vue'),
        name: 'ArticleDetail',
      },
      {
        path: '/article/write',
        component: () => import('@/views/article/article-write/index.vue'),
        name: 'ArticleWrite',
        meta: { title: '编写博客' }
      },
      {
        path: '/article/write/:id',
        component: () => import('@/views/article/article-write/index.vue'),
        name: 'ArticleEdit',
        meta: { title: '修改博客' }
      },
      {
        path: '/article/category',
        component: () => import('@/views/article/article-category/category/index.vue'),
        name: 'ArticleCategory',
        meta: { title: '文章分类' }
      },
      {
        path: '/article/category/:id',
        component: () => import('@/views/article/article-category/category-detail/index.vue'),
        name: 'CategoryDetail',
        meta: { title: '分类详情' }
      },
      {
        path: '/user/profile',
        component: () => import('@/views/user/profile/index.vue'),
        name: 'UserProfile',
        meta: { title: '个人中心' }
      },
      {
        path: '/user/timeline',
        component: () => import('@/views/user/timeline/index.vue'),
        name: 'UserTimeline',
        meta: { title: '时间线' }
      },
      {
        path: '/user/unread-comments',
        component: () => import('@/views/user/unread-comments/index.vue'),
        name: 'UserUnreadComments',
        meta: { title: '未读评论' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  // 404 page must be placed at the end !!!
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true }}
]

export const asyncRoutes:RouteRecordRaw[] = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  // 所有路由切换都会自动回到顶部
  scrollBehavior: () => ({ top: 0, left: 0 })
});

export default router;
