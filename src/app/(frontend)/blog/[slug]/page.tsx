import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import type { Article, User } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import ArticleHero from '@/components/Hero/ArticleHero'
import GalleryView from '@/components/GalleryView/GalleryView'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const articles = await payload.find({
    collection: 'articles',
    limit: 1000,
  })

  return articles.docs.map((article) => ({
    slug: article.slug,
  }))
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const articles = await payload.find({
    collection: 'articles',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!articles.docs || articles.docs.length === 0) {
    notFound()
  }

  const article: Article = articles.docs[0]
  const author = typeof article.author === 'object' ? (article.author as User) : null
  const gallery = article.gallery && typeof article.gallery === 'object' ? article.gallery : null

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <article className="max-w-full">
        <header>
          <ArticleHero
            title={article.title}
            author={author ? author.email : ''}
            date={article.publishedAt}
            cover={
              article.cover ? (typeof article.cover === 'object' ? article.cover.url : '') : ''
            }
            big={false}
          />
        </header>

        <div className="py-8 px-8">
          <div className="max-w-4xl mx-auto">
            {article.content && (
              <SpotlightCard
                bgClassName="bg-card"
                className="prose prose-lg dark:prose-invert max-w-none
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 
                [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 
                [&_h4]:text-xl [&_h4]:font-bold [&_h4]:mt-6 [&_h4]:mb-3 
                [&_p]:mb-6 [&_p]:leading-relaxed 
                [&_ul]:mb-6 [&_ul]:pl-8 [&_ul]:list-disc
                [&_ol]:mb-6 [&_ol]:pl-8 [&_ol]:list-decimal
                [&_li]:mb-2
                [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80
                [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic 
                [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-8
                [&_hr]:border-0 [&_hr]:border-t-2 [&_hr]:border-border [&_hr]:my-12"
              >
                <RichText data={article.content} />
              </SpotlightCard>
            )}
          </div>
        </div>

        {gallery && (
          <div className="py-8 px-8">
            <div className="max-w-4xl mx-auto">
              <GalleryView gallery={gallery} />
            </div>
          </div>
        )}

        <footer className="px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                Torna al Blog
              </Button>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}
