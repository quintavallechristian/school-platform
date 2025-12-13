type SchoolInput =
  | string
  | {
      id?: string
      school?: string
    }
  | null
  | undefined

export const normalizeSchoolId = (school: SchoolInput): string | null => {
  if (typeof school === 'string') return school
  if (typeof school === 'object' && school !== null) {
    return school.school || school.id || null
  }

  return null
}

export const buildTenantAccess = (schools: SchoolInput[] = []) =>
  schools
    .map((school) => {
      const id = normalizeSchoolId(school)
      return id ? { school: id } : null
    })
    .filter(Boolean)
