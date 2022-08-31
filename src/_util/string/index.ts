// eslint-disable-next-line import/prefer-default-export
export function toFirstWordsUpper(str: string): string {
  // return str.toLowerCase().replace(/( |^)[a-z]/g, (s) => s.toUpperCase())
  return str.replace(/( |^)[a-z]/g, (s) => s.toUpperCase());
}
