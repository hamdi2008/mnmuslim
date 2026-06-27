import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ListYourService() {
  const router = useRouter()
  useEffect(() => { router.replace('/submit') }, [])
  return null
}
