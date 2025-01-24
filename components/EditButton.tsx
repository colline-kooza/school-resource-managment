import Link from 'next/link'
import React from 'react'

export default function EditButton({endPoint}:{endPoint:any}) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <Link href={`${baseUrl}/dashboard/${endPoint}`}>Edit</Link>
  )
}
