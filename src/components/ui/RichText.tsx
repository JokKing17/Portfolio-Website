import React from 'react'

type LexicalNode = {
  type?: string
  text?: string
  tag?: string
  children?: LexicalNode[]
  format?: number
  listType?: string
  url?: string
  fields?: { url?: string }
  code?: string
}

type Heading = { id: string; label: string; level: string }

function renderChildren(nodes?: LexicalNode[]) {
  return nodes?.map((node, index) => renderNode(node, index)) || null
}

function renderText(node: LexicalNode, key: React.Key) {
  let content: React.ReactNode = node.text || ''

  if (node.format && node.format & 1) content = <strong>{content}</strong>
  if (node.format && node.format & 2) content = <em>{content}</em>
  if (node.format && node.format & 8) content = <u>{content}</u>

  return <React.Fragment key={key}>{content}</React.Fragment>
}

function plainText(node: LexicalNode): string { return node.text || node.children?.map(plainText).join('') || '' }

function renderNode(node: LexicalNode, key: React.Key, headings: Heading[] = []): React.ReactNode {
  if (node.text !== undefined) return renderText(node, key)

  switch (node.type) {
    case 'heading': {
      const tag = node.tag === 'h1' || node.tag === 'h3' || node.tag === 'h4' ? node.tag : 'h2'
      return React.createElement(
        tag,
        { id: headings.find((heading) => heading.label === plainText(node).trim() && heading.level === tag)?.id, className: tag === 'h1' ? 'mb-6 mt-14 scroll-mt-28 text-4xl font-bold leading-tight text-foreground' : tag === 'h2' ? 'article-h2 mb-5 mt-14 scroll-mt-28 text-3xl font-semibold leading-tight text-foreground' : 'mb-4 mt-10 scroll-mt-28 text-2xl font-semibold text-foreground', key },
        renderChildren(node.children)
      )
    }
    case 'list':
      return node.listType === 'number' ? (
        <ol className="my-8 list-decimal space-y-3.5 pl-7 leading-8 text-muted-foreground marker:font-semibold marker:text-primary" key={key}>
          {renderChildren(node.children)}
        </ol>
      ) : (
        <ul className="my-8 list-disc space-y-3.5 pl-7 leading-8 text-muted-foreground marker:text-primary" key={key}>
          {renderChildren(node.children)}
        </ul>
      )
    case 'listitem':
      return <li key={key}>{renderChildren(node.children)}</li>
    case 'quote':
      return (
        <blockquote className="my-10 rounded-r-xl border-l-4 border-primary bg-white/[.045] px-6 py-6 italic leading-8 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.04)]" key={key}>
          {renderChildren(node.children)}
        </blockquote>
      )
    case 'code':
      return <pre key={key}><code>{node.code || plainText(node)}</code></pre>
    case 'table':
      return <table key={key}><tbody>{renderChildren(node.children)}</tbody></table>
    case 'tablerow':
      return <tr key={key}>{renderChildren(node.children)}</tr>
    case 'tablecell':
      return <td key={key}>{renderChildren(node.children)}</td>
    case 'link':
      return (
        <a className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary" href={node.url || node.fields?.url} key={key}>
          {renderChildren(node.children)}
        </a>
      )
    case 'paragraph':
    default:
      return (
        <p className="my-7 text-[1.04rem] leading-8 text-muted-foreground sm:text-[1.08rem] sm:leading-9" key={key}>
          {renderChildren(node.children)}
        </p>
      )
  }
}

export function RichText({ content, headings = [] }: { content?: unknown; headings?: Heading[] }) {
  if (!content || typeof content !== 'object') return null

  const root = (content as { root?: { children?: LexicalNode[] } }).root

  return <div className="article-content max-w-none">{root?.children?.map((node, index) => renderNode(node, index, headings))}</div>
}
