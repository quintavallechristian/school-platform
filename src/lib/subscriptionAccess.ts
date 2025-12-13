import type { CollectionBeforeChangeHook, PayloadRequest } from 'payload'
import type { School } from '@/payload-types'
import { normalizeSchoolId } from './tenantAccess'

const PLAN_HIERARCHY = {
  starter: 0,
  professional: 1,
  enterprise: 2,
} as const

const PLAN_LABELS: Record<keyof typeof PLAN_HIERARCHY, string> = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
}

type RequiredPlan = keyof typeof PLAN_HIERARCHY
type FeatureFlag = keyof NonNullable<School['featureVisibility']>

interface PlanCheckOptions {
  req: PayloadRequest
  schoolId?: string | null
  requiredPlan: RequiredPlan
  featureFlag?: FeatureFlag
  featureName?: string
}

const resolvePlan = async (req: PayloadRequest, school: School | null): Promise<RequiredPlan> => {
  if (!school) {
    return 'starter'
  }

  const { subscription } = school

  if (subscription && typeof subscription === 'object') {
    return (subscription.plan as RequiredPlan) || 'starter'
  }

  if (typeof subscription === 'string') {
    try {
      const subscriptionDoc = await req.payload.findByID({
        collection: 'subscriptions',
        id: subscription,
      })
      return (subscriptionDoc.plan as RequiredPlan) || 'starter'
    } catch (_error) {
      req.payload.logger.warn(
        `Impossibile recuperare l'abbonamento ${subscription} per la scuola ${school.id}`,
      )
      return 'starter'
    }
  }

  return 'starter'
}

export const ensurePlanAndFeatureAccess = async ({
  req,
  schoolId,
  requiredPlan,
  featureFlag,
  featureName,
}: PlanCheckOptions) => {
  if (!schoolId) {
    throw new Error('Impossibile determinare la scuola selezionata. Riprova più tardi.')
  }

  const school = await req.payload.findByID({
    collection: 'schools',
    id: schoolId,
    depth: 1,
  })

  const currentPlan = await resolvePlan(req, school)
  const currentLevel = PLAN_HIERARCHY[currentPlan] ?? 0
  const requiredLevel = PLAN_HIERARCHY[requiredPlan]

  if (currentLevel < requiredLevel) {
    const friendlyFeature = featureName ? ` ${featureName}` : ''
    throw new Error(
      `Il piano ${PLAN_LABELS[currentPlan]} non include la funzionalità${friendlyFeature}. ` +
        `Aggiorna al piano ${PLAN_LABELS[requiredPlan]} per continuare.`,
    )
  }

  if (featureFlag) {
    const isEnabled = school?.featureVisibility?.[featureFlag]

    if (isEnabled === false) {
      throw new Error(
        'Questa funzionalità è disabilitata nelle impostazioni della scuola. ' +
          'Abilitala per poter aggiungere nuovi contenuti.',
      )
    }
  }
}

export const createPlanGuardHook = ({
  requiredPlan,
  featureFlag,
  featureName,
}: Omit<PlanCheckOptions, 'req' | 'schoolId'>): CollectionBeforeChangeHook => {
  return async (args) => {
    const { data, operation, req } = args

    if (operation !== 'create') {
      return data
    }

    if (req.user?.role === 'super-admin') {
      return data
    }

    const schoolId = normalizeSchoolId(data?.school)

    await ensurePlanAndFeatureAccess({
      req,
      schoolId,
      requiredPlan,
      featureFlag,
      featureName,
    })

    return data
  }
}
