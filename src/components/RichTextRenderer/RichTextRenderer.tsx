import Image from 'next/image'
import React from 'react'

// Type definitions for RichText nodes
type TextNode = {
  type: 'text'
  text: string
  format?: number
  style?: string | Record<string, string>
  color?: string
  backgroundColor?: string
}

type MediaValue = {
  url?: string
  alt?: string
  width?: number
  height?: number
  [key: string]: unknown
}

type ElementNode = {
  type: string
  children?: RichTextNode[]
  tag?: string
  listType?: 'bullet' | 'number'
  style?: string | Record<string, string>
  fields?: {
    url?: string
    newTab?: boolean
    src?: string
    alt?: string
    width?: number
    height?: number
  }
  url?: string
  newTab?: boolean
  src?: string
  alt?: string
  width?: number
  height?: number
  value?: string | MediaValue
}

type LineBreakNode = {
  type: 'linebreak'
}

type RichTextNode = TextNode | ElementNode | LineBreakNode

type _RichTextContent = {
  root?: {
    type: string
    children: RichTextNode[]
    direction?: 'ltr' | 'rtl' | null
    format?: string
    indent?: number
    version?: number
  }
  [key: string]: unknown
}

interface RichTextRendererProps {
  content: unknown
}

function renderImageNode(
  node: ElementNode,
  index: number,
  hasBlockStyle: boolean,
  blockStyle: React.CSSProperties,
): React.ReactNode {
  // Handle Payload CMS upload nodes - value can be a Media object or string ID
  let src = ''
  let alt = ''
  let width: number | undefined
  let height: number | undefined

  // Check if node has a value property (Payload upload format)
  if ('value' in node && node.value) {
    const value = node.value
    if (typeof value === 'object' && value !== null) {
      // It's a populated Media object
      src = value.url || ''
      alt = value.alt || ''
      width = value.width
      height = value.height
    } else if (typeof value === 'string') {
      // It's just an ID - the relation wasn't populated
      // This shouldn't happen with depth: 2, but we handle it gracefully
      console.warn('Upload node value is an unpopulated ID:', value)
      return null
    }
  }

  // Fallback to old format if value wasn't found
  if (!src) {
    src = node.src || node.url || (node.fields && (node.fields.src || node.fields.url)) || ''
    alt = node.alt || (node.fields && node.fields.alt) || ''
    width = node.width || (node.fields && node.fields.width)
    height = node.height || (node.fields && node.fields.height)
  }

  if (!src) return null

  const imgStyle = hasBlockStyle ? blockStyle : undefined

  // If width and height are provided, use them
  if (width && height) {
    return (
      <Image
        key={index}
        src={src}
        alt={alt}
        style={imgStyle}
        width={width}
        height={height}
        loading="lazy"
      />
    )
  }

  // Otherwise, make it responsive with max-w-full
  return (
    <div key={index} className="my-8">
      <Image
        src={src}
        alt={alt}
        style={imgStyle}
        width={width || 800}
        height={height || 600}
        className="rounded-lg max-w-full h-auto"
        loading="lazy"
      />
    </div>
  )
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) return null

  const renderNode = (node: RichTextNode, index: number = 0): React.ReactNode => {
    if (!node) return null

    // Handle text nodes
    if (node.type === 'text' && 'text' in node && typeof node.text === 'string') {
      let text: React.ReactNode = node.text

      const inlineStyle: React.CSSProperties = {}

      if (node.style) {
        if (typeof node.style === 'string') {
          const styleObj = node.style
            .split(';')
            .reduce((acc: Record<string, string>, rule: string) => {
              const [key, value] = rule.split(':').map((s) => s.trim())
              if (key && value) {
                const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
                acc[camelKey] = value
              }
              return acc
            }, {})
          Object.assign(inlineStyle, styleObj)
        } else {
          Object.assign(inlineStyle, node.style)
        }
      }

      if (node.color) {
        inlineStyle.color = node.color
      }
      if (node.backgroundColor) {
        inlineStyle.backgroundColor = node.backgroundColor
      }

      if (typeof node.format === 'number') {
        const format = node.format

        if (format & 16) {
          text = <code key={`code-${index}`}>{text}</code>
        }
        if (format & 4) {
          text = <s key={`strike-${index}`}>{text}</s>
        }
        if (format & 8) {
          text = <u key={`underline-${index}`}>{text}</u>
        }
        if (format & 2) {
          text = <em key={`italic-${index}`}>{text}</em>
        }
        if (format & 1) {
          text = <strong key={`bold-${index}`}>{text}</strong>
        }
      }

      if (Object.keys(inlineStyle).length > 0) {
        text = (
          <span key={`styled-${index}`} style={inlineStyle}>
            {text}
          </span>
        )
      }

      return text
    }

    // Handle linebreak nodes
    if (node.type === 'linebreak') {
      return <br key={index} />
    }
    if (node.type === 'upload' || node.type === 'image' || node.type === 'img') {
      return renderImageNode(node, index, false, {})
    }

    // Handle element nodes with children
    if ('children' in node && Array.isArray(node.children)) {
      const children = node.children.map((child: RichTextNode, i: number) => renderNode(child, i))

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

        case 'heading': {
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

        case 'link': {
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
        }

        case 'upload':
        case 'image':
        case 'img': {
          return renderImageNode(node, index, hasBlockStyle, blockStyle)
        }

        case 'table':
          return (
            <div key={index} className="overflow-x-auto">
              <table
                className="min-w-full border-collapse border border-border rounded-lg overflow-hidden"
                style={{ tableLayout: 'fixed', width: '100%' }}
              >
                <tbody>{children}</tbody>
              </table>
            </div>
          )

        case 'tablerow':
          return <tr key={index}>{children}</tr>

        case 'tablecell':
        case 'tableheadercell': {
          const Tag = node.type === 'tableheadercell' ? 'th' : 'td'
          return (
            <Tag
              key={index}
              className={` px-4 py-2 ${
                node.type === 'tableheadercell' ? 'bg-muted font-semibold' : ''
              }`}
            >
              {children}
            </Tag>
          )
        }

        default:
          return <React.Fragment key={index}>{children}</React.Fragment>
      }
    }

    return null
  }

  const renderContent = () => {
    const contentObj = content as { root?: { children?: unknown[] }; [key: string]: unknown }

    if (contentObj?.root?.children) {
      return contentObj.root.children.map((node, index) => {
        // Type guard to ensure node is a valid RichTextNode
        if (typeof node === 'object' && node !== null && 'type' in node) {
          return renderNode(node as RichTextNode, index as number)
        }
        return null
      })
    }

    if (Array.isArray(contentObj)) {
      return contentObj.map((node, index) => {
        if (typeof node === 'object' && node !== null && 'type' in node) {
          return renderNode(node as RichTextNode, index)
        }
        return null
      })
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
