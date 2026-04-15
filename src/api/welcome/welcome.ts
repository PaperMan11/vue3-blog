import request from '@/utils/request';
import type{ RegisterReq, RegisterResp, LoginReq, LoginResp, CaptchaResp } from './types';

// 用户注册
export function register(data: RegisterReq) {
  return request<RegisterResp>({
    url: '/blog/welcome/register',
    method: 'post',
    data
  });
}

// 用户登录
export function login(data: LoginReq) {
  return request<LoginResp>({
    url: '/blog/welcome/login',
    method: 'post',
    data
  });
}

// 获取验证码
export function getCaptcha() {
  return request<CaptchaResp>({
    url: '/blog/welcome/captcha',
    method: 'get'
  });
}

// 用户登出
export function logoff() {
  return request<void>({
    url: '/blog/welcome/logoff',
    method: 'post'
  });
}

// 用户注销账号
export function deregistration() {
  return request<void>({
    url: '/blog/welcome/deregistration',
    method: 'post'
  });
}
