'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'

export const runtime = 'edge'

export default function LogoutPage() {
  const [error, setError] = useState(null)
  const router = useRouter()

  useMemo(() => {
    fetch(`/api/auth/logout`, {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          throw response
        }
        return response.json() // we only get here if there is no error
      })
      .then(() => {
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'Logged out',
          level: 'info',
        })
        router.push('/')
      })
      .catch((err) => {
        setError(err)
      })
  }, [router])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return null
}
