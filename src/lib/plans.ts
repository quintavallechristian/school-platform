export enum Plans {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export const planDetails = [
  {
    name: 'Starter',
    description: 'Perfetto per scuole piccole che iniziano il loro percorso digitale',
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      'Blog e articoli',
      'Piano Offerta Formativa',
      'Gestione Progetti',
      'Menu settimanale',
      'Calendario scolastico',
      'Chi siamo',
      'Gestione Documenti',
    ],
    highlighted: false,
    trialDays: 30,
    monthlyPriceId: process.env.NEXT_PUBLIC_PRICE_ID_STARTER,
    yearlyPriceId: process.env.NEXT_PUBLIC_PRICE_ID_STARTER_1Y,
  },
  {
    name: 'Professional',
    description: 'La scelta ideale per scuole che vogliono il massimo',
    monthlyPrice: 79,
    yearlyPrice: 790,
    features: [
      'Tutte le funzionalità Starter',
      'Eventi prenotabili',
      'Dettaglio insegnanti',
      'Gestione comunicazioni PUSH',
      'Pagine personalizzate',
      'Area riservata genitori - 100 famiglie',
      // 'Personalizzazione completa',
      // 'Backup giornalieri',
    ],
    highlighted: true,
    trialDays: 30,
    monthlyPriceId: process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL,
    yearlyPriceId: process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL_1Y,
  },
  {
    name: 'Enterprise',
    description: 'Per istituti o centri scolastici con esigenze complesse',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    features: [
      'Tutte le funzionalità Professional',
      'Gestione fino a 3 scuole',
      'Invio comunicazioni via email',
      'Area riservata genitori - 300 famiglie per scuola',
      'Formazione personalizzata',
      // 'API personalizzate',
      // 'Integrazioni su misura',
      // 'Account manager dedicato',
      // 'SLA garantito 99.9%',
      // 'Backup continui',
    ],
    highlighted: false,
    trialDays: 30,
    monthlyPriceId: process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE,
    yearlyPriceId: process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE_1Y,
  },
]

export const priceIdList = [
  process.env.NEXT_PUBLIC_PRICE_ID_STARTER,
  process.env.NEXT_PUBLIC_PRICE_ID_STARTER_1Y,
  process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL,
  process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL_1Y,
  process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE,
  process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE_1Y,
]

export function getPlanFromPrice(priceId: string): 'starter' | 'professional' | 'enterprise' {
  switch (priceId) {
    case process.env.NEXT_PUBLIC_PRICE_ID_STARTER:
    case process.env.NEXT_PUBLIC_PRICE_ID_STARTER_1Y:
      return 'starter'
    case process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL:
    case process.env.NEXT_PUBLIC_PRICE_ID_PROFESSIONAL_1Y:
      return 'professional'
    case process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE:
    case process.env.NEXT_PUBLIC_PRICE_ID_ENTERPRISE_1Y:
      return 'enterprise'
    default:
      return 'starter'
  }
}

// Plan limits configuration
export const PLAN_LIMITS = {
  starter: {
    maxParents: null, // No parent area for starter
  },
  professional: {
    maxParents: 1,
  },
  enterprise: {
    maxParents: null, // Unlimited
  },
} as const

/**
 * Get the parent limit for a specific plan
 * @param plan - The subscription plan
 * @returns The maximum number of parents allowed, or null for unlimited
 */
export function getParentLimitForPlan(plan: string): number | null {
  const planLimits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
  return planLimits?.maxParents ?? null
}

/**
 * Check if a new parent can be added based on the current count and plan
 * @param currentCount - Current number of parents
 * @param plan - The subscription plan
 * @returns True if a parent can be added, false otherwise
 */
export function canAddParent(currentCount: number, plan: string): boolean {
  const limit = getParentLimitForPlan(plan)
  // If limit is null (unlimited or no parent area), allow if it's a plan that supports parents
  if (limit === null) {
    // Only enterprise has unlimited parents, starter doesn't support parent area
    return plan === 'enterprise'
  }
  return currentCount < limit
}
