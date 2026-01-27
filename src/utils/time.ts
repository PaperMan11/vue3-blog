/**
 * TS 时间戳转格式化日期字符串
 * @param timestamp 时间戳（10位/13位 兼容）
 * @param fmt 格式：YYYY-MM-DD HH:mm:ss / YYYY年MM月DD日 星期X / MM-DD 等
 * @returns 格式化后的日期字符串
 */
export function formatTime(timestamp: number, fmt: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const weekText = ['日', '一', '二', '三', '四', '五', '六'];
  // 兼容10位秒级时间戳
  const useTime = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
  const date = new Date(useTime);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const week = weekText[date.getDay()]; // 星期 日/一/二...

  let result = fmt
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('星期X', `星期${week}`);

  return result;
}