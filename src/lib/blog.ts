type Node = { children?: Node[]; text?: string; tag?: string; type?: string }

function nodes(content: unknown): Node[] {
  if (!content || typeof content !== 'object') return []
  return ((content as { root?: { children?: Node[] } }).root?.children || [])
}

function text(node: Node): string {
  return node.text || node.children?.map(text).join('') || ''
}

export function getReadingTime(content: unknown) {
  const words = nodes(content).map(text).join(' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

export function getArticleHeadings(content: unknown) {
  const used = new Map<string, number>()
  return nodes(content).flatMap((node) => {
    if (node.type !== 'heading') return []
    const label = text(node).trim()
    if (!label) return []
    const base = label.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || 'section'
    const count = used.get(base) || 0
    used.set(base, count + 1)
    return [{ id: count ? `${base}-${count + 1}` : base, label, level: node.tag || 'h2' }]
  })
}
