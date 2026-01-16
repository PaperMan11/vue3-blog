import axios from 'axios';

// 获取一言
export function getHitokoto() {
  return axios.get('https://v1.hitokoto.cn/?encode=json').then(response => {
    console.log('Hitokoto response:', response.data);
    return response.data;
  });
}