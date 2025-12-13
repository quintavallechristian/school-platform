/**
 * Migration Script: Convert embedded school subscriptions to standalone Subscriptions collection
 *
 * This script:
 * 1. Finds all schools with embedded subscription data
 * 2. For each school, finds the first school-admin user
 * 3. Creates a Subscription document linked to that user
 * 4. Updates the school to reference the new Subscription
 *
 * Run with: npx tsx src/migrations/migrate-subscriptions.ts
 */

import { getPayload } from 'payload'
import config from '@payload-config'

interface LegacySubscriptionData {
  plan?: string
  isTrial?: boolean
  expiresAt?: string
  renewsAt?: string
  stripeCustomerId?: string
  selectedPriceId?: string
}

interface LegacySchool {
  id: string
  name: string
  subscription?: LegacySubscriptionData
}

async function migrateSubscriptions() {
  const payload = await getPayload({ config })

  console.log('Starting subscription migration...')

  try {
    // Find all schools (we need to check for embedded subscription data)
    const schoolsResult = await payload.find({
      collection: 'schools',
      limit: 1000, // Increase if you have more schools
      depth: 0,
    })

    console.log(`Found ${schoolsResult.docs.length} schools to check`)

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const school of schoolsResult.docs) {
      const legacySchool = school as unknown as LegacySchool

      // Skip if school already has a subscription relationship (string ID)
      if (typeof school.subscription === 'string') {
        console.log(`Skipping ${school.name} - already has subscription relationship`)
        skippedCount++
        continue
      }

      // Skip if no embedded subscription data
      if (
        !legacySchool.subscription ||
        typeof legacySchool.subscription !== 'object' ||
        !legacySchool.subscription.plan
      ) {
        console.log(`Skipping ${school.name} - no embedded subscription data`)
        skippedCount++
        continue
      }

      const embeddedSub = legacySchool.subscription

      try {
        // Find the first school-admin user for this school
        const usersResult = await payload.find({
          collection: 'users',
          where: {
            and: [
              {
                schools: {
                  contains: school.id,
                },
              },
              {
                role: {
                  equals: 'school-admin',
                },
              },
            ],
          },
          limit: 1,
        })

        if (usersResult.docs.length === 0) {
          console.error(`No school-admin found for ${school.name} - skipping`)
          errorCount++
          continue
        }

        const owner = usersResult.docs[0]

        // Determine subscription status and dates
        let status: 'trial' | 'active' | 'cancelled' | 'expired' = 'trial'
        let trialEndsAt: string | null = null
        let expiresAt: string | null = null
        let renewsAt: string | null = null

        if (embeddedSub.isTrial) {
          status = 'trial'
          trialEndsAt = embeddedSub.expiresAt || null
        } else if (embeddedSub.renewsAt) {
          status = 'active'
          renewsAt = embeddedSub.renewsAt
        } else if (embeddedSub.expiresAt) {
          const expDate = new Date(embeddedSub.expiresAt)
          if (expDate < new Date()) {
            status = 'expired'
          } else {
            status = 'cancelled'
          }
          expiresAt = embeddedSub.expiresAt
        }

        // Determine maxSchools based on plan
        const planLimits: Record<string, number> = {
          starter: 1,
          professional: 1,
          enterprise: 2,
        }
        const maxSchools = planLimits[embeddedSub.plan || 'starter'] || 1

        // Create the subscription
        const newSubscription = await payload.create({
          collection: 'subscriptions',
          data: {
            owner: owner.id,
            plan: (embeddedSub.plan || 'starter') as 'starter' | 'professional' | 'enterprise',
            status: status,
            trialEndsAt: trialEndsAt,
            expiresAt: expiresAt,
            renewsAt: renewsAt,
            maxSchools: maxSchools,
            stripeCustomerId: embeddedSub.stripeCustomerId || null,
            selectedPriceId: embeddedSub.selectedPriceId || null,
          },
        })

        console.log(`Created subscription ${newSubscription.id} for ${school.name}`)

        // Update the school to reference the new subscription
        // We use updateByID with overrideAccess to bypass any access control
        await payload.update({
          collection: 'schools',
          id: school.id,
          data: {
            subscription: newSubscription.id,
          },
        })

        console.log(`Updated ${school.name} to reference subscription ${newSubscription.id}`)
        migratedCount++
      } catch (error) {
        console.error(`Error migrating ${school.name}:`, error)
        errorCount++
      }
    }

    console.log('\n=== Migration Complete ===')
    console.log(`Migrated: ${migratedCount}`)
    console.log(`Skipped: ${skippedCount}`)
    console.log(`Errors: ${errorCount}`)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

migrateSubscriptions()
