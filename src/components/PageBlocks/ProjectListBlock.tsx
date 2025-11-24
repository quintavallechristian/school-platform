import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Project } from '@/payload-types'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { Button } from '@/components/ui/button'

type ProjectListBlockType = Extract<
  NonNullable<Page['blocks']>[number],
  { blockType: 'projectList' }
>

type Props = {
  block: ProjectListBlockType
  schoolId: string | number
  schoolSlug: string
}

export default async function ProjectListBlock({ block, schoolId, schoolSlug }: Props) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Recupera i progetti della scuola
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: {
      school: {
        equals: schoolId,
      },
    },
    limit: block.limit || 6,
    sort: '-createdAt',
  })

  if (projects.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        {block.title && <h2 className="text-3xl font-bold mb-8 text-primary">{block.title}</h2>}
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-xl">📂 Nessun progetto disponibile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {block.title && <h2 className="text-3xl font-bold mb-8 text-primary">{block.title}</h2>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(projects as Project[]).map((project) => {
          return (
            <SpotlightCard key={project.id} className="px-0 py-0">
              <Link href={`/${schoolSlug}/progetti/${project.id}`}>
                {project.cover && typeof project.cover === 'object' && project.cover.url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={project.cover.url}
                      alt={project.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300 rounded-t-2xl"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                  ciao
                  <Button className="w-fit">Vedi progetto</Button>
                </div>
              </Link>
            </SpotlightCard>
          )
        })}
      </div>

      {block.showViewAll && (
        <div className="text-center mt-8">
          <Link href={`/${schoolSlug}/progetti`}>
            <Button variant="outline" size="lg">
              Vedi tutti i progetti →
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
