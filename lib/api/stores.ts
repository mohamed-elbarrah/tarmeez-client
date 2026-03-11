export async function getStoreBySlug(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  const res = await fetch(`${apiUrl}/stores/${slug}`, { cache: 'no-store' })
  // Log status for debugging
  // eslint-disable-next-line no-console
  console.log(`getStoreBySlug: fetching ${apiUrl}/stores/${slug} -> status ${res.status}`)
  let data: any
  try {
    data = await res.json()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getStoreBySlug: failed to parse json', err)
    return null
  }

  // Debug raw response
  // eslint-disable-next-line no-console
  console.log('getStoreBySlug raw data:', JSON.stringify(data))

  if (!data) return null

  // Support both shapes: { store: {...} } and flat {...}
  const s = data.store ?? data

  if (!s || !s.id) return null

  return {
    id: s.id,
    slug: s.slug ?? slug,
    name: s.name,
    customDomain: s.customDomain ?? null,
    domainStatus: s.domainStatus ?? null,
    themeId: s.themeId ?? null,
    isOnboarded: s.isOnboarded ?? false,
    logo: s.logo ?? null,
    logoWidth: s.logoWidth ?? null,
    logoHeight: s.logoHeight ?? null,
    showStoreName: s.showStoreName ?? true,
    favicon: s.favicon ?? null,
    primaryColor: s.primaryColor ?? null,
    secondaryColor: s.secondaryColor ?? null,
    accentColor: s.accentColor ?? null,
    fontFamily: s.fontFamily ?? null,
    borderRadius: s.borderRadius ?? null,
    merchant: s.merchant ?? null,
    products: s.products ?? [],
  }
}
