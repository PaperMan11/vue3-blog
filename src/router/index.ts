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
