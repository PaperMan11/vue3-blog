import axios from 'axios'
import EasyTyper from "easy-typer-js"

const YIYAN_API = 'https://v1.hitokoto.cn/?c=a&encode=json'


// 获取一言
export function getHitokoto() {
  return axios.get(YIYAN_API).then(response => {
    return response.data;
  }).catch(error => {
    console.error('获取一言失败:', error);
    throw error;
  })
}


// 打字机效果：循环请求一言接口并实现文字逐字打印
export const getHitokotoTypewriter = async (el: any, delayTime: number = 3000) => {
  try {
    const res = await getHitokoto();
    const hitokotoText = res?.hitokoto || '心有所期，全力以赴，定有所成。';
    new EasyTyper(
      el,
      hitokotoText,
      // 打字完成后的回调：延迟指定时间后，递归调用自身实现「循环打字」
      () => {
        setTimeout(() => {
          getHitokotoTypewriter(el, delayTime);
        }, delayTime);
      },
      // 打字过程中的回调（暂无逻辑，留空占位）
      () => {}
    );
  } catch (error) {
    setTimeout(() => {
      getHitokotoTypewriter(el, delayTime);
    }, delayTime);
  }
}
