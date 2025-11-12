import React from 'react'

interface RichTextRendererProps {
  content: unknown
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderNode = (node: any, index: number = 0): React.ReactNode => {
    if (!node) return null

    // Text node with Lexical formatting
    if (node.type === 'text' && typeof node.text === 'string') {
      let text: React.ReactNode = node.text

      // Prepare inline styles for color and background
      const inlineStyle: React.CSSProperties = {}

      if (node.style) {
        // Parse style string if it's a string
        if (typeof node.style === 'string') {
          const styleObj = node.style
            .split(';')
            .reduce((acc: Record<string, string>, rule: string) => {
              const [key, value] = rule.split(':').map((s) => s.trim())
              if (key && value) {
                // Convert CSS property names to camelCase
                const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
                acc[camelKey] = value
              }
              return acc
            }, {})
          Object.assign(inlineStyle, styleObj)
        } else {
          // If it's already an object
          Object.assign(inlineStyle, node.style)
        }
      }

      // Support direct color and background properties
      if (node.color) {
        inlineStyle.color = node.color
      }
      if (node.backgroundColor) {
        inlineStyle.backgroundColor = node.backgroundColor
      }

      // Lexical uses bitwise format flags
      if (typeof node.format === 'number') {
        const format = node.format

        // Apply formatting in nested order (code, strikethrough, underline, italic, bold)
        if (format & 16) {
          // code
          text = <code key={`code-${index}`}>{text}</code>
        }
        if (format & 4) {
          // strikethrough
          text = <s key={`strike-${index}`}>{text}</s>
        }
        if (format & 8) {
          // underline
          text = <u key={`underline-${index}`}>{text}</u>
        }
        if (format & 2) {
          // italic
          text = <em key={`italic-${index}`}>{text}</em>
        }
        if (format & 1) {
          // bold
          text = <strong key={`bold-${index}`}>{text}</strong>
        }
      }

      // Wrap in span with inline styles if any color/background is set
      if (Object.keys(inlineStyle).length > 0) {
        text = (
          <span key={`styled-${index}`} style={inlineStyle}>
            {text}
          </span>
        )
      }

      return text
    }

    // Handle nodes with children
    if (Array.isArray(node.children)) {
      const children = node.children.map((child: unknown, i: number) => renderNode(child, i))

      // Extract inline styles for block elements
      const blockStyle: React.CSSProperties = {}
      if (node.style) {
        if (typeof node.style === 'string') {
          const styleObj = node.style
            .split(';')
            .reduce((acc: Record<string, string>, rule: string) => {
              const [key, value] = rule.split(':').map((s: string) => s.trim())
              if (key && value) {
                const camelKey = key.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())
                acc[camelKey] = value
              }
              return acc
            }, {})
          Object.assign(blockStyle, styleObj)
        } else {
          Object.assign(blockStyle, node.style)
        }
      }

      const hasBlockStyle = Object.keys(blockStyle).length > 0

      switch (node.type) {
        case 'paragraph':
          return (
            <p key={index} style={hasBlockStyle ? blockStyle : undefined}>
              {children}
            </p>
          )

        case 'heading':
          const tag = node.tag || 'h1'
          const styleProps = hasBlockStyle ? { style: blockStyle } : {}
          switch (tag) {
            case 'h1':
              return (
                <h1 key={index} {...styleProps}>
                  {children}
                </h1>
              )
            case 'h2':
              return (
                <h2 key={index} {...styleProps}>
                  {children}
                </h2>
              )
            case 'h3':
              return (
                <h3 key={index} {...styleProps}>
                  {children}
                </h3>
              )
            case 'h4':
              return (
                <h4 key={index} {...styleProps}>
                  {children}
                </h4>
              )
            case 'h5':
              return (
                <h5 key={index} {...styleProps}>
                  {children}
                </h5>
              )
            case 'h6':
              return (
                <h6 key={index} {...styleProps}>
                  {children}
                </h6>
              )
            default:
              return (
                <h1 key={index} {...styleProps}>
                  {children}
                </h1>
              )
          }

        case 'list':
          if (node.listType === 'bullet') {
            return <ul key={index}>{children}</ul>
          } else if (node.listType === 'number') {
            return <ol key={index}>{children}</ol>
          }
          return <ul key={index}>{children}</ul>

        case 'listitem':
          return <li key={index}>{children}</li>

        case 'quote':
          return <blockquote key={index}>{children}</blockquote>

        case 'link':
          const url = node.fields?.url || node.url || '#'
          const newTab = node.fields?.newTab || node.newTab || false
          return (
            <a
              key={index}
              href={url}
              target={newTab ? '_blank' : undefined}
              rel={newTab ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          )

        default:
          return <React.Fragment key={index}>{children}</React.Fragment>
      }
    }

    // Handle linebreak
    if (node.type === 'linebreak') {
      return <br key={index} />
    }

    return null
  }

  const renderContent = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contentObj = content as any

    if (contentObj?.root?.children) {
      return contentObj.root.children.map((node: unknown, index: number) => renderNode(node, index))
    }

    // Fallback for different structures
    if (Array.isArray(contentObj)) {
      return contentObj.map((node, index) => renderNode(node, index))
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
      {renderContent()}
    </div>
  )
}
