import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Browse() {
  const router = useRouter()
  useEffect(() => { router.replace('/services') }, [])
  return null
}
