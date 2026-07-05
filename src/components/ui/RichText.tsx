import React from 'react'

type LexicalNode = {
  type?: string
  text?: string
  tag?: string
  children?: LexicalNode[]
  format?: number
  listType?: string
  url?: string
}

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

function renderNode(node: LexicalNode, key: React.Key): React.ReactNode {
  if (node.text !== undefined) return renderText(node, key)

  switch (node.type) {
    case 'heading': {
      const tag = node.tag === 'h1' || node.tag === 'h3' || node.tag === 'h4' ? node.tag : 'h2'
      return React.createElement(
        tag,
        { className: 'mt-8 text-2xl font-semibold text-foreground', key },
        renderChildren(node.children)
      )
    }
    case 'list':
      return node.listType === 'number' ? (
        <ol className="my-5 list-decimal space-y-2 pl-6" key={key}>
          {renderChildren(node.children)}
        </ol>
      ) : (
        <ul className="my-5 list-disc space-y-2 pl-6" key={key}>
          {renderChildren(node.children)}
        </ul>
      )
    case 'listitem':
      return <li key={key}>{renderChildren(node.children)}</li>
    case 'quote':
      return (
        <blockquote className="my-6 border-l-2 border-primary/60 pl-5 text-muted-foreground" key={key}>
          {renderChildren(node.children)}
        </blockquote>
      )
    case 'link':
      return (
        <a className="text-primary underline-offset-4 hover:underline" href={node.url} key={key}>
          {renderChildren(node.children)}
        </a>
      )
    case 'paragraph':
    default:
      return (
        <p className="my-4 leading-8 text-muted-foreground" key={key}>
          {renderChildren(node.children)}
        </p>
      )
  }
}

export function RichText({ content }: { content?: unknown }) {
  if (!content || typeof content !== 'object') return null

  const root = (content as { root?: { children?: LexicalNode[] } }).root

  return <div className="prose prose-invert max-w-none">{renderChildren(root?.children)}</div>
}
