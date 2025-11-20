/**
 * Converte un contenuto RichText (Lexical) in testo semplice
 */
export function richTextToPlainText(content: unknown): string {
  if (!content) return ''

  // Se è già una stringa, ritornala
  if (typeof content === 'string') return content

  // Se è un oggetto Lexical
  if (typeof content === 'object' && content !== null) {
    const lexicalContent = content as Record<string, unknown>

    // Verifica se ha la struttura root.children
    if (lexicalContent.root && typeof lexicalContent.root === 'object') {
      const root = lexicalContent.root as Record<string, unknown>
      if (Array.isArray(root.children)) {
        return extractTextFromNodes(root.children)
      }
    }

    // Se è un array diretto di nodi
    if (Array.isArray(content)) {
      return extractTextFromNodes(content)
    }
  }

  return ''
}

/**
 * Estrae il testo da un array di nodi Lexical
 */
function extractTextFromNodes(nodes: unknown[]): string {
  const texts: string[] = []

  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue

    const lexicalNode = node as Record<string, unknown>

    // Se il nodo ha testo, aggiungilo
    if (typeof lexicalNode.text === 'string' && lexicalNode.text.trim()) {
      texts.push(lexicalNode.text)
    }

    // Se il nodo ha figli, processa ricorsivamente
    if (Array.isArray(lexicalNode.children)) {
      const childText = extractTextFromNodes(lexicalNode.children)
      if (childText) {
        texts.push(childText)
      }
    }
  }

  return texts.join(' ')
}
