import { atomWithStorage } from 'jotai/utils'
import type { UserData } from '@/types/user'

export const userAtom = atomWithStorage<UserData | null>('user', null, undefined, {
  getOnInit: true,
})
export const tokenAtom = atomWithStorage<string | null>('token', null, undefined, {
  getOnInit: true,
})
