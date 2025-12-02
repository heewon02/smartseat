// components/Sign/checkRegex.ts
export const isValidName = (name: string) => /^[가-힣a-zA-Z]+$/.test(name);

export const isValidPassword = (password: string) =>
  /^[A-Za-z0-9!@#$%^&*()_+=-]+$/.test(password);

export const isValidNickname = (nickname: string) =>
  /^[가-힣a-zA-Z0-9]+$/.test(nickname);
