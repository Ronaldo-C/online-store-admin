import dayjs from 'dayjs'

export const formatToLocalTime = (utcString: string) => {
  if (!utcString) return ''
  return dayjs(utcString).format('YYYY-MM-DD HH:mm:ss')
}
