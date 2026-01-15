import Cookie from 'js-cookie';

const TokenKey = 'User-Token';

export function getToken(): string | undefined {
  return Cookie.get(TokenKey);
}

export function setToken(token: string): void {
  Cookie.set(TokenKey, token);
}

export function removeToken(): void {
  Cookie.remove(TokenKey);
}