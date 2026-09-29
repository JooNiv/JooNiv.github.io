import './cscUiSquare.js'
import * as csc from '@cscfi/csc-ui-react'

const toTag = name => name.replace(/[A-Z]/g, (c, i) => (i ? '-' : '') + c.toLowerCase())

const definePropAccessors = elementClass => {
    const props = elementClass.def?.props
    if (!props) return
    for (const key of Array.isArray(props) ? props : Object.keys(props)) {
        if (key in elementClass.prototype) continue
        Object.defineProperty(elementClass.prototype, key, {
            configurable: true,
            get() { return undefined },
            set(value) { Object.defineProperty(this, key, { value, writable: true, configurable: true, enumerable: true }) },
        })
    }
}

// csc-ui v4 elements only define their props once connected, so @lit/react would set objects as attributes.
if (typeof customElements !== 'undefined') {
    for (const name of Object.keys(csc).filter(name => /^C[A-Z]/.test(name))) {
        const elementClass = customElements.get(toTag(name))
        if (elementClass) definePropAccessors(elementClass)
    }
}

export * from '@cscfi/csc-ui-react'
