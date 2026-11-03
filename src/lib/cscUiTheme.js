/** Appends the FiQCI theme (Inter, square corners) to every csc-ui shadow root; import it before anything that loads csc-ui. */
const themeOverrides = `
:host { --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif; --radius-xs: 0; --radius-sm: 0; --radius-md: 0; --radius-lg: 0; --radius-xl: 0; --radius-2xl: 0; --radius-3xl: 0; --radius-4xl: 0; }
.rounded, .rounded-xs, .rounded-sm, .rounded-md, .rounded-lg, [class*="rounded-csc-"] { border-radius: 0; }
`

if (typeof ShadowRoot !== 'undefined' && typeof CSSStyleSheet !== 'undefined') {
    const descriptor = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, 'adoptedStyleSheets')
    if (descriptor?.set) {
        const sheet = new CSSStyleSheet()
        sheet.replaceSync(themeOverrides)
        Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
            ...descriptor,
            set(sheets) {
                const isCscUi = this.host?.localName.startsWith('c-')
                descriptor.set.call(this, isCscUi ? [...sheets.filter(s => s !== sheet), sheet] : sheets)
            },
        })
    }
}
