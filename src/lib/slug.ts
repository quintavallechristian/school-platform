import slugify from 'slugify'
import type { Payload } from 'payload'

/**
 * Generates a unique slug for a school name
 * Handles special characters, accents, and ensures uniqueness
 */
export async function generateUniqueSlug(name: string, payload: Payload): Promise<string> {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true, // Remove special characters
    locale: 'it', // Italian locale for proper accent handling
  })

  let slug = baseSlug
  let counter = 1

  // Keep trying until we find a unique slug
  while (true) {
    const existing = await payload.find({
      collection: 'schools',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}
