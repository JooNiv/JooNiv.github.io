/** Rehype plugin that inserts a post's header teaser image after its first paragraph, when that paragraph starts with italic text. */
const findFirstParagraph = node => {
  for (const [index, child] of (node.children || []).entries()) {
    if (child.type === 'element' && child.tagName === 'p') return { parent: node, index, paragraph: child }
    const found = findFirstParagraph(child)
    if (found) return found
  }
  return null
}

export default function rehypeTeaser() {
  return (tree, file) => {
    const frontmatter = file.data?.astro?.frontmatter || {}
    const teaser = frontmatter.header?.teaser
    if (!teaser) return

    const found = findFirstParagraph(tree)
    const firstChild = found?.paragraph.children?.[0]
    if (!(firstChild?.type === 'element' && firstChild.tagName === 'em')) return

    found.parent.children.splice(found.index + 1, 0, {
      type: 'element',
      tagName: 'img',
      properties: { src: teaser, alt: frontmatter.title || '', className: ['w-full', 'h-auto', 'my-8'], itemProp: 'image' },
      children: [],
    })
  }
}
