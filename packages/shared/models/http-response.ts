export interface HTTPResponse<T> {
  success: boolean
  data: T | undefined
}

export interface HTTPAcceptResponse {
  success: boolean
  message: string
}
