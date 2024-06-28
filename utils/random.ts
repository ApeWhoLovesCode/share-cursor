/** 生成 #000000-#ffffff 的随机颜色 */
export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

/** 生成随机字符串 */
export function randomString(sliceNum = 4) {
  return Math.random().toString(36).slice(2, 2 + sliceNum)
}