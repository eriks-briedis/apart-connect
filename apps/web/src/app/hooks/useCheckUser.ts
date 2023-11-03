import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GET, getAuthToken } from "../utils";

export function useCheckUser() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  const getUser = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    const { user } = await GET('/auth/me')

    return user
  }, [router])

  useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        localStorage.removeItem('apart-connect-token')
        router.push('/auth/login')
        return
      }
      setUser(user)
    })
  }, [router, getUser])

  return user
}
