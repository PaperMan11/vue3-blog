import request from '@/utils/request';
import type { UserInfo, UpdateUserInfoReq, ChangePasswordReq } from './types';

// 获取用户信息
export function getUserInfo() {
  return request<UserInfo>({
    url: '/blog/user',
    method: 'get'
  });
}

// 更新用户信息
export function updateUserInfo(data: UpdateUserInfoReq) {
  return request<UserInfo>({
    url: '/blog/user',
    method: 'put',
    data
  });
}

// 修改密码
export function changePassword(data: ChangePasswordReq) {
  return request<void>({
    url: '/blog/user/changepassword',
    method: 'post',
    data
  });
}
