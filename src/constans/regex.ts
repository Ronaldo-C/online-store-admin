export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export const USER_NAME_REGEX = /^[A-Za-z0-9_,.]{4,20}$/

export const isValidUrl =
  /^https?:\/\/(([\\da-z.-]+)\.([a-z.]{2,6})|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}))([/\w .-]*)*\/?$/
