import { Children, cloneElement, isValidElement } from 'react'
import './ScrollFloat.css'

// Adapted from the supplied React Bits Float effect; timelines live in useAtelierMotion.
function split(nodes) {
  return Children.map(nodes, node => {
    if (typeof node === 'string' || typeof node === 'number') {
      return Array.from(String(node)).map((char, index) => (
        <span className="nf-float-slot" key={index}><span className="nf-float-char">{char === ' ' ? '\u00a0' : char}</span></span>
      ))
    }
    if (!isValidElement(node) || node.type === 'br') return node
    return cloneElement(node, { className: 'nf-float-accent' }, split(node.props.children))
  })
}

function plain(nodes) {
  return Children.toArray(nodes).map(node => typeof node === 'string' || typeof node === 'number' ? node : isValidElement(node) ? node.type === 'br' ? ' ' : plain(node.props.children) : '').join('')
}

export function FloatText({ children }) { return split(children) }

export default function ScrollFloat({ children }) {
  return <h2 className="nf-scroll-float" aria-label={plain(children)}><span className="nf-float-content" aria-hidden="true">{split(children)}</span></h2>
}
