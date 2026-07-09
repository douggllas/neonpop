import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImage } from '@/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const isConfigured = /^[a-z0-9-]+$/.test(projectId ?? '')

export const client = createClient({
  projectId: isConfigured ? projectId! : 'neonpop-placeholder',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlParaImagem(source: SanityImage) {
  return builder.image(source)
}

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  if (!isConfigured) return [] as unknown as T
  try {
    return await client.fetch<T>(query, params ?? {})
  } catch (err) {
    console.error('[sanityFetch] query failed:', err)
    return [] as unknown as T
  }
}
