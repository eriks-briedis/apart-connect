// regex for password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
