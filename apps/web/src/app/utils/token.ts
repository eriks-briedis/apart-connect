export const AUTH_TOKEN_NAME = 'apart-connect-token'

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_NAME)
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
