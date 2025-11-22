export enum Plans {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export const planDetails = [
  {
    name: 'Starter',
    description: 'Perfetto per scuole piccole che iniziano il loro percorso digitale',
    monthlyPrice:49,
    yearlyPrice: 490,
    features: [
      'Blog e articoli',
      'Eventi',
      'Chi siamo',
      'Gestione Documenti',
      'Fino a 100 famiglie',
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
      'Calendario scolastico',
      'Gestione comunicazioni',
      'Gestione Progetti',
      'Menu settimanale',
      'Fino a 300 famiglie',
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
      'Area riservata genitori',
      'Famiglie illimitate',
      // 'API personalizzate',
      // 'Integrazioni su misura',
      // 'Account manager dedicato',
      'Formazione personalizzata',
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
