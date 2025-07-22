import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAtom, useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { userAtom, tokenAtom } from '@/atoms/userAtom'
import { userService } from '@/services/user'
import { UserResponse } from '@/types/user'
import useCustomNavigate from './useCustomNavigate'

const useAuth = () => {
  const navigate = useCustomNavigate()
  const location = useLocation()
  const [token, setToken] = useAtom(tokenAtom)
  const setUser = useSetAtom(userAtom)

  const {
    data: userInfo,
    isSuccess,
    isError,
  } = useQuery<UserResponse>({
    queryKey: ['userInfo', token],
    queryFn: userService.getUserInfo,
    enabled: !!token,
    retry: false,
  })

  useEffect(() => {
    if (!token) {
      setUser(null)
      setToken(null)
      if (location.pathname !== '/admin/auth/login') {
        navigate('/auth/login', { replace: true })
      }
    }
  }, [token])

  useEffect(() => {
    if (isSuccess && userInfo?.data) {
      setUser(userInfo.data)
      if (location.pathname === '/admin/auth/login') {
        navigate('/dashboard', { replace: true })
      }
    }
    if (isError) {
      setUser(null)
      setToken(null)
      if (location.pathname !== '/admin/auth/login') {
        navigate('/auth/login', { replace: true })
      }
    }
  }, [isSuccess, isError, userInfo])
}

export default useAuth
