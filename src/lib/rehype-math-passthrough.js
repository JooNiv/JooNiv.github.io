/** Rehype plugin that turns remark-math nodes back into \(…\) and \[…\] text for MathJax to render in the browser. */
const classes = node => node.properties?.className || []
const textOf = node => (node.children || []).map(c => c.value ?? textOf(c)).join('')

const transform = node => {
  if (!node.children) return
  node.children = node.children.map(child => {
    if (child.type !== 'element') return child
    const code = child.tagName === 'pre' ? child.children?.find(c => c.tagName === 'code') : child
    if (code?.tagName === 'code' && classes(code).includes('math-display')) {
      return { type: 'text', value: `\\[${textOf(code)}\\]` }
    }
    if (child.tagName === 'code' && classes(child).includes('math-inline')) {
      return { type: 'text', value: `\\(${textOf(child)}\\)` }
    }
    transform(child)
    return child
  })
}

export default function rehypeMathPassthrough() {
  return tree => transform(tree)
}
