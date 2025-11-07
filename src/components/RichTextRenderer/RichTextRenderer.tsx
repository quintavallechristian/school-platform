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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <div>{renderNode((content as any).root?.children || content)}</div>
}
