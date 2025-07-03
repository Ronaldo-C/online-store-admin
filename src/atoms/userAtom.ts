import { atomWithStorage } from 'jotai/utils'
import type { LoginData } from '../types/auth'

export const userAtom = atomWithStorage<LoginData | null>('user', null, undefined, {
  getOnInit: true,
})
export const tokenAtom = atomWithStorage<string | null>('token', null, undefined, {
  getOnInit: true,
})
