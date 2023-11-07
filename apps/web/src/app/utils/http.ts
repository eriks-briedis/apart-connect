import { getAuthToken } from './token'

async function makeRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' = 'GET',
  body?: Record<string, string | number | boolean>,
) {
  const baseUrl = process.env.API_URL
  const authToken = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }


  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new HttpResponseError(response)
    }

    return await response.json()
  } catch (e) {
    if (e instanceof HttpResponseError) {
      return {
        success: false,
        error: e.message,
        status: e.response.status,
        statusText: e.response.statusText,
      }
    }

    throw e
  }
}

export async function GET(endpoint: string, queryParams?: Record<string, string>) {
  const params = !!queryParams ? `?${new URLSearchParams(queryParams)}` : ``

  return await makeRequest(`${endpoint}${params}`, 'GET')
}

export async function POST(endpoint: string, body: Record<string, string | number | boolean>) {
  return await makeRequest(endpoint, 'POST', body)
}

export async function PATCH(endpoint: string, body: Record<string, string | number>) {
  return await makeRequest(endpoint, 'PATCH', body)
}

export async function PUT(endpoint: string, body: Record<string, string | number>) {
  return await makeRequest(endpoint, 'PUT', body)
}

export class HttpResponseError extends Error {
  constructor(public response: Response) {
    super(`HTTP Error: ${response.status}`)
  }
}
