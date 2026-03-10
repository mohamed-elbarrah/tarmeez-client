export async function getStoreBySlug(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  const res = await fetch(`${apiUrl}/stores/${slug}`, { next: { revalidate: 3600 } })
  if (!res.ok) return null
  return res.json()
}
