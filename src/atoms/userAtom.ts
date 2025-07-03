import { atom } from 'jotai'
import type { LoginData } from '../types/auth'

export const userAtom = atom<LoginData | null>(null)
export const tokenAtom = atom<string | null>(null)
