import React from 'react'

interface RichTextRendererProps {
  content: unknown
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) return null

  // Rendering semplificato del rich text - adatta in base al tuo editor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderNode = (node: any): React.ReactNode => {
    if (!node) return null

    if (typeof node === 'string') {
      return node
    }

    if (Array.isArray(node)) {
      return node.map((child, index) => (
        <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
      ))
    }

    if (node.type === 'paragraph' || node.type === 'p') {
      return <p>{renderNode(node.children)}</p>
    }

    if (node.type === 'heading' || node.type === 'h1') {
      return <h1>{renderNode(node.children)}</h1>
    }

    if (node.type === 'h2') {
      return <h2>{renderNode(node.children)}</h2>
    }

    if (node.type === 'h3') {
      return <h3>{renderNode(node.children)}</h3>
    }

    if (node.type === 'ul') {
      return <ul>{renderNode(node.children)}</ul>
    }

    if (node.type === 'ol') {
      return <ol>{renderNode(node.children)}</ol>
    }

    if (node.type === 'li' || node.type === 'listitem') {
      return <li>{renderNode(node.children)}</li>
    }

    if (node.type === 'link') {
      return <a href={node.url}>{renderNode(node.children)}</a>
    }

    if (node.text !== undefined) {
      let text = node.text
      if (node.bold) text = <strong>{text}</strong>
      if (node.italic) text = <em>{text}</em>
      if (node.underline) text = <u>{text}</u>
      return text
    }

    if (node.children) {
      return renderNode(node.children)
    }

    return null
  }

  return (
    <div
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
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {renderNode((content as any).root?.children || content)}
    </div>
  )
}
