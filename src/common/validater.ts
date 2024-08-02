// 正则表达式：匹配合法的变量名
const validNamePattern = /^[a-zA-Z_$][a-zA-Z0-9_.$]*$/;

export const isValidName = (name: string) => validNamePattern.test(name);
