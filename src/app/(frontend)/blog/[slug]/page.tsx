import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import type { Article, User } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import ArticleHero from '@/components/Hero/ArticleHero'

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
                className="prose prose-lg max-w-none
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 
                [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 
                [&_h4]:text-xl [&_h4]:font-bold [&_h4]:mt-6 [&_h4]:mb-3 
                [&_p]:mb-6 [&_p]:leading-relaxed 
                [&_ul]:mb-6 [&_ul]:pl-8 [&_ul]:list-disc
                [&_ol]:mb-6 [&_ol]:pl-8 [&_ol]:list-decimal
                [&_li]:mb-2
                [&_a]:text-emerald-600 [&_a]:underline hover:[&_a]:text-emerald-700
                [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic 
                [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-8
                [&_hr]:border-0 [&_hr]:border-t-2 [&_hr]:border-gray-200 [&_hr]:my-12"
              >
                <RichText data={article.content} />
              </SpotlightCard>
            )}
          </div>
        </div>

        <footer>
          <div className="max-w-4xl mb-8 mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-4 transition-all"
            >
              ← Torna al Blog
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}
