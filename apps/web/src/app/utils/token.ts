export const AUTH_TOKEN_NAME = 'apart-connect-token'

export function getAuthToken() {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_NAME)
    if (!token) {
      return null
    }
    return token
  } catch (e) {
    return null
  }
}

export function setAuthToken(token: string) {
  try {
    localStorage.setItem(AUTH_TOKEN_NAME, token)
  } catch (e) {
    console.error(e)
  }
}

export function removeAuthToken() {
  try {
    localStorage.removeItem(AUTH_TOKEN_NAME)
  } catch (e) {
    console.error(e)
  }
}
