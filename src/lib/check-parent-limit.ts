import { getParentLimitForPlan, canAddParent } from './plans'
import type { Payload } from 'payload'

export interface ParentLimitCheckResult {
  canAdd: boolean
  currentCount: number
  limit: number | null
  message?: string
}

/**
 * Check if a school has reached its parent limit based on subscription plan
 * @param schoolId - The ID of the school to check
 * @param payload - Payload instance for database queries
 * @returns Object with limit check results
 */
export async function checkParentLimit(
  schoolId: string,
  payload: Payload
): Promise<ParentLimitCheckResult> {
  try {
    // Fetch the school to get its subscription plan
    const school = await payload.findByID({
      collection: 'schools',
      id: schoolId,
    })

    if (!school) {
      return {
        canAdd: false,
        currentCount: 0,
        limit: null,
        message: 'Scuola non trovata',
      }
    }

    const plan = school.subscription?.plan || 'starter'
    const limit = getParentLimitForPlan(plan)

    // Count current parents for this school
    const parentsResult = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            role: {
              equals: 'parent',
            },
          },
          {
            schools: {
              contains: schoolId,
            },
          },
        ],
      },
      limit: 0, // We only need the count
    })

    const currentCount = parentsResult.totalDocs

    // Check if we can add more parents
    const canAdd = canAddParent(currentCount, plan)

    let message: string | undefined
    if (!canAdd) {
      if (plan === 'starter') {
        message = 'Il piano Starter non supporta l\'area genitori. Effettua l\'upgrade al piano Professional o Enterprise.'
      } else if (limit !== null) {
        message = `Limite di ${limit} famiglie raggiunto per il piano ${plan}. Effettua l'upgrade per aggiungere più famiglie.`
      }
    }

    return {
      canAdd,
      currentCount,
      limit,
      message,
    }
  } catch (error) {
    console.error('Error checking parent limit:', error)
    return {
      canAdd: false,
      currentCount: 0,
      limit: null,
      message: 'Errore durante il controllo del limite',
    }
  }
}
