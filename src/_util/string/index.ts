// eslint-disable-next-line import/prefer-default-export

// 首字符大写
export function toFirstWordsUpper(str: string): string {
  return str.replace(/( |^)[a-z]/g, (s) => s.toUpperCase());
}
// 只有首字符大写
export function toFirstWordsUpperOnly(str: string): string {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (s) => s.toUpperCase());
}
