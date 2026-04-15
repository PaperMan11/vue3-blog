// 用户信息
export interface UserInfo {
  id: number; // 用户ID
  username: string; // 用户名
  nickname: string; // 昵称
  avatar: string; // 头像
  gender: number; // 性别
  introduction: string; // 简介
  birthday: string; // 生日
  mobile: string; // 手机号
  email: string; // 邮箱
}

// 更新用户信息请求
export interface UpdateUserInfoReq {
  nickname?: string; // 昵称
  avatar?: string; // 头像
  introduction?: string; // 简介
  birthday?: string; // 生日
  mobile?: string; // 手机号
  email?: string; // 邮箱
}

// 修改密码请求
export interface ChangePasswordReq {
  oldPassword: string; // 旧密码
  newPassword: string; // 新密码
}
