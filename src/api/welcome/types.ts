// 用户注册请求
export interface RegisterReq {
  username: string; // 用户名
  password: string; // 密码
  nickname?: string; // 昵称
  email?: string; // 邮箱
  mobile?: string; // 手机号
  gender?: number; // 性别
  avatar?: string; // 头像
  introduction?: string; // 简介
  birthday?: string; // 生日
}

// 用户注册响应
export interface RegisterResp {
  userId: number; // 用户ID
  accessToken: string; // JWT令牌
  refreshToken: string; // 刷新令牌
}

// 用户登录请求
export interface LoginReq {
  username: string; // 用户名
  password: string; // 密码
  captchaId: string; // 验证码ID
  captcha: string; // 验证码
}

// 用户登录响应
export interface LoginResp {
  userId: number; // 用户ID
  accessToken: string; // JWT令牌
  refreshToken: string; // 刷新令牌
}

// 验证码响应
export interface CaptchaResp {
  captcha_id: string; // 验证码ID
  captcha_image: string; // 验证码图片
}
