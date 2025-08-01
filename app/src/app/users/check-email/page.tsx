// app/users/check-email/page.tsx
import React, { Suspense } from 'react'
import CheckEmailClient from './CheckEmailClient'

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckEmailClient />
    </Suspense>
  )
}