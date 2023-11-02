import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useCheckUser() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  async function getUser() {
    const token = localStorage.getItem('apart-connect-token')
    if (!token) {
      window.location.href = '/auth/login'
    }

    const response = await fetch('http://localhost:5005/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const { user } = await response.json()

    return user
  }

  useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        localStorage.removeItem('apart-connect-token')
        router.push('/auth/login')
        return
      }
      setUser(user)
    })
  }, [router])

  return user
}
