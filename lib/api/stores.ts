export async function getStoreBySlug(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  const res = await fetch(`${apiUrl}/stores/${slug}`, { cache: 'no-store' })
  if (!res.ok) return null
  const payload = await res.json()
  const s = payload?.store
  if (!s) return null
  return {
    id: s.id,
    slug: s.slug,
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
