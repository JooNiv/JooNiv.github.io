const squareCorners = `
:host { --radius-xs: 0; --radius-sm: 0; --radius-md: 0; --radius-lg: 0; --radius-xl: 0; --radius-2xl: 0; --radius-3xl: 0; --radius-4xl: 0; }
.rounded, .rounded-xs, .rounded-sm, .rounded-md, .rounded-lg { border-radius: 0; }
`

// The FiQCI theme uses square corners; append an override to every csc-ui shadow root.
if (typeof ShadowRoot !== 'undefined' && typeof CSSStyleSheet !== 'undefined') {
    const descriptor = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, 'adoptedStyleSheets')
    if (descriptor?.set) {
        const sheet = new CSSStyleSheet()
        sheet.replaceSync(squareCorners)
        Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
            ...descriptor,
            set(sheets) {
                const isCscUi = this.host?.localName.startsWith('c-')
                descriptor.set.call(this, isCscUi ? [...sheets.filter(s => s !== sheet), sheet] : sheets)
            },
        })
    }
}
