import { NavigateFunction, useNavigate, To, NavigateOptions } from 'react-router-dom'

export default function useCustomNavigate() {
  const navigate = useNavigate()

  const customNavigate: NavigateFunction = (to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'string' && !to.startsWith('/admin')) {
      const prefixedPath = `/admin/${to.startsWith('/') ? to.slice(1) : to}`
      navigate(prefixedPath, options)
    } else {
      navigate(to as any, options)
    }
  }

  return customNavigate
}
