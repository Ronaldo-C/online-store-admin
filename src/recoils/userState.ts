import { atom } from 'recoil';
import type { AtomEffect } from 'recoil';
import type { LoginData } from '../types/auth';

function localStorageEffect<T>(key: string): AtomEffect<T> {
  return ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      try {
        setSelf(JSON.parse(savedValue));
      } catch {
        setSelf(savedValue as T);
      }
    }
    onSet((newValue, _, isReset) => {
      if (isReset || newValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, typeof newValue === 'string' ? newValue : JSON.stringify(newValue));
      }
    });
  };
}

export const userState = atom<LoginData | null>({
  key: 'userState',
  default: null,
  effects: [localStorageEffect<LoginData | null>('user')],
});

export const tokenState = atom<string | null>({
  key: 'tokenState',
  default: null,
  effects: [localStorageEffect<string | null>('token')],
}); 