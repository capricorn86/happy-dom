/**
 * Computed values of properties that nothing sets on an element (their initial values).
 *
 * This file is generated from the computed values that Chromium 158, Firefox 159 and WebKit 27.2 report for elements that do not set the property, and from the CSS specification data of @webref/css 8.7.8.
 *
 * A property is listed when the browsers report the same value, which is its initial value in the specification, on elements in different layouts that do not set it. Colors are not listed. An inherited property is only listed when it is in "CSSComputedStyleInheritedProperties", so that a value of an ancestor is found before this one.
 * The value does not apply when one of the properties in "dependsOn" is set, as it then depends on that declaration: a shorthand that covers the property, a legacy alias, a logical or physical counterpart, or another property that changed its computed value in a browser.
 */
export default <Record<string, { value: string; dependsOn: string[] }>>{
	'align-content': { value: 'normal', dependsOn: ['-webkit-align-content', 'place-content'] },
	'align-items': { value: 'normal', dependsOn: ['-webkit-align-items', 'place-items'] },
	'align-self': { value: 'auto', dependsOn: ['-webkit-align-self', 'place-self'] },
	'anchor-name': { value: 'none', dependsOn: [] },
	'anchor-scope': { value: 'none', dependsOn: [] },
	'animation-composition': { value: 'replace', dependsOn: [] },
	'animation-direction': {
		value: 'normal',
		dependsOn: ['-webkit-animation', '-webkit-animation-direction', 'animation']
	},
	'animation-fill-mode': {
		value: 'none',
		dependsOn: ['-webkit-animation', '-webkit-animation-fill-mode', 'animation']
	},
	'animation-iteration-count': {
		value: '1',
		dependsOn: ['-webkit-animation', '-webkit-animation-iteration-count', 'animation']
	},
	'animation-name': {
		value: 'none',
		dependsOn: ['-webkit-animation', '-webkit-animation-name', 'animation']
	},
	'animation-play-state': {
		value: 'running',
		dependsOn: ['-webkit-animation', '-webkit-animation-play-state', 'animation']
	},
	'animation-range-end': { value: 'normal', dependsOn: ['animation-range'] },
	'animation-range-start': { value: 'normal', dependsOn: ['animation-range'] },
	'animation-timeline': { value: 'auto', dependsOn: ['-webkit-animation', 'animation'] },
	'animation-timing-function': {
		value: 'ease',
		dependsOn: ['-webkit-animation', '-webkit-animation-timing-function', 'animation']
	},
	appearance: { value: 'none', dependsOn: ['-webkit-appearance'] },
	'aspect-ratio': { value: 'auto', dependsOn: [] },
	'backdrop-filter': { value: 'none', dependsOn: [] },
	'backface-visibility': { value: 'visible', dependsOn: ['-webkit-backface-visibility'] },
	'background-attachment': { value: 'scroll', dependsOn: ['background', 'background-image'] },
	'background-blend-mode': { value: 'normal', dependsOn: ['background', 'background-image'] },
	'background-clip': {
		value: 'border-box',
		dependsOn: ['-webkit-background-clip', 'background', 'background-image']
	},
	'background-image': { value: 'none', dependsOn: ['background'] },
	'background-origin': {
		value: 'padding-box',
		dependsOn: ['-webkit-background-origin', 'background', 'background-image']
	},
	'background-repeat': { value: 'repeat', dependsOn: ['background', 'background-image'] },
	'background-size': {
		value: 'auto',
		dependsOn: ['-webkit-background-size', 'background', 'background-image']
	},
	'border-block-end-style': {
		value: 'none',
		dependsOn: [
			'border',
			'border-block',
			'border-block-end',
			'border-block-style',
			'border-bottom',
			'border-bottom-style',
			'border-inline-style',
			'border-left',
			'border-left-style',
			'border-right',
			'border-right-style',
			'border-style',
			'border-top',
			'border-top-style'
		]
	},
	'border-block-start-style': {
		value: 'none',
		dependsOn: [
			'border',
			'border-block',
			'border-block-start',
			'border-block-style',
			'border-bottom',
			'border-bottom-style',
			'border-inline',
			'border-inline-style',
			'border-left',
			'border-left-style',
			'border-right',
			'border-right-style',
			'border-style',
			'border-top',
			'border-top-style'
		]
	},
	'border-bottom-left-radius': {
		value: '0px',
		dependsOn: [
			'-webkit-border-bottom-left-radius',
			'-webkit-border-radius',
			'border-block-end-radius',
			'border-block-start-radius',
			'border-bottom-radius',
			'border-end-end-radius',
			'border-end-start-radius',
			'border-inline-end-radius',
			'border-inline-start-radius',
			'border-left-radius',
			'border-radius',
			'border-start-end-radius',
			'border-start-start-radius',
			'corner',
			'corner-block-end',
			'corner-block-start',
			'corner-bottom',
			'corner-bottom-left',
			'corner-end-end',
			'corner-end-start',
			'corner-inline-end',
			'corner-inline-start',
			'corner-left',
			'corner-start-end',
			'corner-start-start'
		]
	},
	'border-bottom-right-radius': {
		value: '0px',
		dependsOn: [
			'-webkit-border-bottom-right-radius',
			'-webkit-border-radius',
			'border-block-end-radius',
			'border-block-start-radius',
			'border-bottom-radius',
			'border-end-end-radius',
			'border-end-start-radius',
			'border-inline-end-radius',
			'border-inline-start-radius',
			'border-radius',
			'border-right-radius',
			'border-start-end-radius',
			'border-start-start-radius',
			'corner',
			'corner-block-end',
			'corner-block-start',
			'corner-bottom',
			'corner-bottom-right',
			'corner-end-end',
			'corner-end-start',
			'corner-inline-end',
			'corner-inline-start',
			'corner-right',
			'corner-start-end',
			'corner-start-start'
		]
	},
	'border-bottom-style': {
		value: 'none',
		dependsOn: [
			'border',
			'border-block',
			'border-block-end',
			'border-block-end-style',
			'border-block-start',
			'border-block-start-style',
			'border-block-style',
			'border-bottom',
			'border-inline',
			'border-inline-end',
			'border-inline-end-style',
			'border-inline-start',
			'border-inline-start-style',
			'border-inline-style',
			'border-style'
		]
	},
	'border-collapse': { value: 'separate', dependsOn: [] },
	'border-end-end-radius': {
		value: '0px',
		dependsOn: [
			'-webkit-border-bottom-left-radius',
			'-webkit-border-bottom-right-radius',
			'-webkit-border-radius',
			'-webkit-border-top-left-radius',
			'-webkit-border-top-right-radius',
			'border-block-end-radius',
			'border-bottom-left-radius',
			'border-bottom-radius',
			'border-bottom-right-radius',
			'border-inline-end-radius',
			'border-left-radius',
			'border-radius',
			'border-right-radius',
			'border-top-left-radius',
			'border-top-radius',
			'border-top-right-radius',
			'corner',
			'corner-block-end',
			'corner-block-start',
			'corner-bottom',
			'corner-bottom-left',
			'corner-bottom-right',
			'corner-end-end',
			'corner-end-start',
			'corner-inline-end',
			'corner-inline-start',
			'corner-left',
			'corner-right',
			'corner-start-end',
			'corner-start-start',
			'corner-top',
			'corner-top-left',
			'corner-top-right'
		]
	},
	'border-end-start-radius': {
		value: '0px',
		dependsOn: [
			'-webkit-border-bottom-left-radius',
			'-webkit-border-bottom-right-radius',
			'-webkit-border-radius',
			'-webkit-border-top-left-radius',
			'-webkit-border-top-right-radius',
			'border-block-end-radius',
			'border-bottom-left-radius',
			'border-bottom-radius',
			'border-bottom-right-radius',
			'border-inline-start-radius',
			'border-left-radius',
			'border-radius',
			'border-right-radius',
			'border-top-left-radius',
			'border-top-radius',
			'border-top-right-radius',
			'corner',
			'corner-block-end',
			'corner-block-start',
			'corner-bottom',
			'corner-bottom-left',
			'corner-bottom-right',
			'corner-end-end',
			'corner-end-start',
			'corner-inline-end',
			'corner-inline-start',
			'corner-left',
			'corner-right',
			'corner-start-end',
			'corner-start-start',
			'corner-top',
			'corner-top-left',
			'corner-top-right'
		]
	},
	'border-image-outset': { value: '0', dependsOn: ['border-image'] },
	'border-image-repeat': { value: 'stretch', dependsOn: ['border-image'] },
	'border-image-slice': { value: '100%', dependsOn: ['border-image'] },
	'border-image-source': { value: 'none', dependsOn: ['border-image'] },
	'border-image-width': { value: '1', dependsOn: ['border-image'] },
	'border-inline-end-style': {
		value: 'none',
		dependsOn: [
			'border',
			'border-block-style',
			'border-bottom',
			'border-bottom-style',
			'border-inline',
			'border-inline-end',
			'border-inline-style',
			'border-left',
			'border-left-style',
			'border-right',
			'border-right-style',
			'border-style',
			'border-top',
			'border-top-style'
		]
	},
	'border-inline-start-style': {
		value: 'none',
		dependsOn: [
			'border',
			'border-block-style',
			'border-bottom',
			'border-bottom-style',
			'border-inline',
			'border-inline-start',
			'border-inline-style',
			'border-left',
			'border-left-style',
			'border-right',
			'border-right-style',
			'border-style',
			'border-top',
			'border-top-style'
		]
	},
	'border-left-style': {
		value: 'none',
		dependsOn: [
			'border',
			'border-block',
			'border-block-end',
			'border-block-end-style',
			'border-block-start',
			'border-block-start-style',
			'border-block-style',
			'border-inline',
			'border-inline-end',
			'border-inline-end-style',
			'border-inline-start',
			'border-inline-start-style',
			'border-inline-style',
			'border-left',
			'border-style'
		]
	},
	'border-right-style': {
		value: 'none',
		dependsOn: [
			'border',
			'border-block',
			'border-block-end',
			'border-block-end-style',
			'border-block-start',
			'border-block-start-style',
			'border-block-style',
			'border-inline',
			'border-inline-end',
			'border-inline-end-style',
			'border-inline-start',
			'border-inline-start-style',
			'border-inline-style',
			'border-right',
			'border-style'
		]
	},
	'border-start-end-radius': {
		value: '0px',
		dependsOn: [
			'-webkit-border-bottom-left-radius',
			'-webkit-border-bottom-right-radius',
			'-webkit-border-radius',
			'-webkit-border-top-left-radius',
			'-webkit-border-top-right-radius',
			'border-block-start-radius',
			'border-bottom-left-radius',
			'border-bottom-radius',
			'border-bottom-right-radius',
			'border-inline-end-radius',
			'border-left-radius',
			'border-radius',
			'border-right-radius',
			'border-top-left-radius',
			'border-top-radius',
			'border-top-right-radius',
			'corner',
			'corner-block-end',
			'corner-block-start',
			'corner-bottom',
			'corner-bottom-left',
			'corner-bottom-right',
			'corner-end-end',
			'corner-end-start',
			'corner-inline-end',
			'corner-inline-start',
			'corner-left',
			'corner-right',
			'corner-start-end',
			'corner-start-start',
			'corner-top',
			'corner-top-left',
			'corner-top-right'
		]
	},
	'border-start-start-radius': {
		value: '0px',
		dependsOn: [
			'-webkit-border-bottom-left-radius',
			'-webkit-border-bottom-right-radius',
			'-webkit-border-radius',
			'-webkit-border-top-left-radius',
			'-webkit-border-top-right-radius',
			'border-block-start-radius',
			'border-bottom-left-radius',
			'border-bottom-radius',
			'border-bottom-right-radius',
			'border-inline-start-radius',
			'border-left-radius',
			'border-radius',
			'border-right-radius',
			'border-top-left-radius',
			'border-top-radius',
			'border-top-right-radius',
			'corner',
			'corner-block-end',
			'corner-block-start',
			'corner-bottom',
			'corner-bottom-left',
			'corner-bottom-right',
			'corner-end-end',
			'corner-end-start',
			'corner-inline-end',
			'corner-inline-start',
			'corner-left',
			'corner-right',
			'corner-start-end',
			'corner-start-start',
			'corner-top',
			'corner-top-left',
			'corner-top-right'
		]
	},
	'border-top-left-radius': {
		value: '0px',
		dependsOn: [
			'-webkit-border-radius',
			'-webkit-border-top-left-radius',
			'border-block-end-radius',
			'border-block-start-radius',
			'border-end-end-radius',
			'border-end-start-radius',
			'border-inline-end-radius',
			'border-inline-start-radius',
			'border-left-radius',
			'border-radius',
			'border-start-end-radius',
			'border-start-start-radius',
			'border-top-radius',
			'corner',
			'corner-block-end',
			'corner-block-start',
			'corner-bottom',
			'corner-bottom-left',
			'corner-bottom-right',
			'corner-end-end',
			'corner-end-start',
			'corner-inline-end',
			'corner-inline-start',
			'corner-left',
			'corner-right',
			'corner-start-end',
			'corner-start-start',
			'corner-top',
			'corner-top-left',
			'corner-top-right'
		]
	},
	'border-top-right-radius': {
		value: '0px',
		dependsOn: [
			'-webkit-border-radius',
			'-webkit-border-top-right-radius',
			'border-block-end-radius',
			'border-block-start-radius',
			'border-end-end-radius',
			'border-end-start-radius',
			'border-inline-end-radius',
			'border-inline-start-radius',
			'border-radius',
			'border-right-radius',
			'border-start-end-radius',
			'border-start-start-radius',
			'border-top-radius',
			'corner',
			'corner-block-end',
			'corner-block-start',
			'corner-bottom',
			'corner-end-end',
			'corner-end-start',
			'corner-inline-end',
			'corner-inline-start',
			'corner-left',
			'corner-right',
			'corner-start-end',
			'corner-start-start',
			'corner-top',
			'corner-top-right'
		]
	},
	'border-top-style': {
		value: 'none',
		dependsOn: [
			'border',
			'border-block',
			'border-block-end',
			'border-block-end-style',
			'border-block-start',
			'border-block-start-style',
			'border-block-style',
			'border-inline',
			'border-inline-end',
			'border-inline-end-style',
			'border-inline-start',
			'border-inline-start-style',
			'border-inline-style',
			'border-style',
			'border-top'
		]
	},
	'box-shadow': { value: 'none', dependsOn: ['-webkit-box-shadow'] },
	'box-sizing': { value: 'content-box', dependsOn: ['-webkit-box-sizing'] },
	'break-after': { value: 'auto', dependsOn: ['page-break-after'] },
	'break-before': { value: 'auto', dependsOn: ['page-break-before'] },
	'break-inside': { value: 'auto', dependsOn: ['page-break-inside'] },
	'caption-side': { value: 'top', dependsOn: [] },
	clear: { value: 'none', dependsOn: [] },
	clip: { value: 'auto', dependsOn: [] },
	'clip-path': { value: 'none', dependsOn: [] },
	'column-count': { value: 'auto', dependsOn: ['columns'] },
	'column-fill': { value: 'balance', dependsOn: [] },
	'column-gap': { value: 'normal', dependsOn: ['gap', 'grid-column-gap', 'grid-gap'] },
	'column-rule-style': { value: 'none', dependsOn: ['column-rule', 'rule', 'rule-style'] },
	'column-span': { value: 'none', dependsOn: [] },
	contain: { value: 'none', dependsOn: [] },
	'contain-intrinsic-block-size': {
		value: 'none',
		dependsOn: [
			'contain-intrinsic-height',
			'contain-intrinsic-size',
			'contain-intrinsic-width',
			'content-visibility'
		]
	},
	'contain-intrinsic-height': {
		value: 'none',
		dependsOn: [
			'contain-intrinsic-block-size',
			'contain-intrinsic-inline-size',
			'contain-intrinsic-size',
			'content-visibility'
		]
	},
	'contain-intrinsic-inline-size': {
		value: 'none',
		dependsOn: [
			'contain-intrinsic-height',
			'contain-intrinsic-size',
			'contain-intrinsic-width',
			'content-visibility'
		]
	},
	'contain-intrinsic-width': {
		value: 'none',
		dependsOn: [
			'contain-intrinsic-block-size',
			'contain-intrinsic-inline-size',
			'contain-intrinsic-size',
			'content-visibility'
		]
	},
	'container-name': { value: 'none', dependsOn: ['container'] },
	'container-type': { value: 'normal', dependsOn: ['container'] },
	'content-visibility': { value: 'visible', dependsOn: [] },
	'counter-increment': { value: 'none', dependsOn: [] },
	'counter-reset': { value: 'none', dependsOn: [] },
	'counter-set': { value: 'none', dependsOn: [] },
	cursor: { value: 'auto', dependsOn: [] },
	'empty-cells': { value: 'show', dependsOn: [] },
	'field-sizing': { value: 'fixed', dependsOn: [] },
	filter: { value: 'none', dependsOn: ['-webkit-filter'] },
	'flex-basis': { value: 'auto', dependsOn: ['-webkit-flex', '-webkit-flex-basis', 'flex'] },
	'flex-direction': {
		value: 'row',
		dependsOn: ['-webkit-flex-direction', '-webkit-flex-flow', 'flex-flow']
	},
	'flex-grow': { value: '0', dependsOn: ['-webkit-flex', '-webkit-flex-grow', 'flex'] },
	'flex-shrink': { value: '1', dependsOn: ['-webkit-flex', '-webkit-flex-shrink', 'flex'] },
	'flex-wrap': {
		value: 'nowrap',
		dependsOn: ['-webkit-flex-flow', '-webkit-flex-wrap', 'flex-flow']
	},
	float: { value: 'none', dependsOn: ['css-float'] },
	'font-size-adjust': { value: 'none', dependsOn: [] },
	'grid-auto-columns': { value: 'auto', dependsOn: ['grid'] },
	'grid-auto-rows': { value: 'auto', dependsOn: ['grid'] },
	'grid-column-end': { value: 'auto', dependsOn: ['grid-area', 'grid-column'] },
	'grid-column-start': { value: 'auto', dependsOn: ['grid-area', 'grid-column'] },
	'grid-row-end': { value: 'auto', dependsOn: ['grid-area', 'grid-row'] },
	'grid-row-start': { value: 'auto', dependsOn: ['grid-area', 'grid-row'] },
	'grid-template-areas': { value: 'none', dependsOn: ['grid', 'grid-template'] },
	isolation: { value: 'auto', dependsOn: [] },
	'justify-content': { value: 'normal', dependsOn: ['-webkit-justify-content', 'place-content'] },
	'justify-self': { value: 'auto', dependsOn: ['place-self'] },
	'letter-spacing': { value: 'normal', dependsOn: [] },
	'list-style-image': { value: 'none', dependsOn: ['list-style'] },
	'list-style-position': { value: 'outside', dependsOn: ['list-style'] },
	'list-style-type': { value: 'disc', dependsOn: ['list-style'] },
	'margin-block-end': {
		value: '0px',
		dependsOn: [
			'margin',
			'margin-block',
			'margin-bottom',
			'margin-inline',
			'margin-left',
			'margin-right',
			'margin-top'
		]
	},
	'margin-block-start': {
		value: '0px',
		dependsOn: [
			'margin',
			'margin-block',
			'margin-bottom',
			'margin-inline',
			'margin-left',
			'margin-right',
			'margin-top'
		]
	},
	'margin-bottom': {
		value: '0px',
		dependsOn: [
			'margin',
			'margin-block',
			'margin-block-end',
			'margin-block-start',
			'margin-inline',
			'margin-inline-end',
			'margin-inline-start'
		]
	},
	'margin-inline-end': {
		value: '0px',
		dependsOn: [
			'margin',
			'margin-block',
			'margin-bottom',
			'margin-inline',
			'margin-left',
			'margin-right',
			'margin-top'
		]
	},
	'margin-inline-start': {
		value: '0px',
		dependsOn: [
			'margin',
			'margin-block',
			'margin-bottom',
			'margin-inline',
			'margin-left',
			'margin-right',
			'margin-top'
		]
	},
	'margin-left': {
		value: '0px',
		dependsOn: [
			'margin',
			'margin-block',
			'margin-block-end',
			'margin-block-start',
			'margin-inline',
			'margin-inline-end',
			'margin-inline-start'
		]
	},
	'margin-right': {
		value: '0px',
		dependsOn: [
			'margin',
			'margin-block',
			'margin-block-end',
			'margin-block-start',
			'margin-inline',
			'margin-inline-end',
			'margin-inline-start'
		]
	},
	'margin-top': {
		value: '0px',
		dependsOn: [
			'margin',
			'margin-block',
			'margin-block-end',
			'margin-block-start',
			'margin-inline',
			'margin-inline-end',
			'margin-inline-start'
		]
	},
	'mask-clip': {
		value: 'border-box',
		dependsOn: ['-webkit-mask', '-webkit-mask-clip', '-webkit-mask-image', 'mask', 'mask-image']
	},
	'mask-composite': {
		value: 'add',
		dependsOn: [
			'-webkit-mask',
			'-webkit-mask-composite',
			'-webkit-mask-image',
			'mask',
			'mask-image'
		]
	},
	'mask-image': { value: 'none', dependsOn: ['-webkit-mask', '-webkit-mask-image', 'mask'] },
	'mask-mode': {
		value: 'match-source',
		dependsOn: ['-webkit-mask', '-webkit-mask-image', 'mask', 'mask-image']
	},
	'mask-origin': {
		value: 'border-box',
		dependsOn: ['-webkit-mask', '-webkit-mask-image', '-webkit-mask-origin', 'mask', 'mask-image']
	},
	'mask-repeat': {
		value: 'repeat',
		dependsOn: ['-webkit-mask', '-webkit-mask-image', '-webkit-mask-repeat', 'mask', 'mask-image']
	},
	'mask-size': {
		value: 'auto',
		dependsOn: ['-webkit-mask', '-webkit-mask-image', '-webkit-mask-size', 'mask', 'mask-image']
	},
	'max-block-size': { value: 'none', dependsOn: ['max-height', 'max-size', 'max-width'] },
	'max-height': { value: 'none', dependsOn: ['max-block-size', 'max-inline-size', 'max-size'] },
	'max-inline-size': { value: 'none', dependsOn: ['max-height', 'max-size', 'max-width'] },
	'max-width': { value: 'none', dependsOn: ['max-block-size', 'max-inline-size', 'max-size'] },
	'mix-blend-mode': { value: 'normal', dependsOn: [] },
	'object-fit': { value: 'fill', dependsOn: [] },
	'object-position': { value: '50% 50%', dependsOn: [] },
	'offset-anchor': { value: 'auto', dependsOn: ['offset'] },
	'offset-distance': { value: '0px', dependsOn: ['offset'] },
	'offset-path': { value: 'none', dependsOn: ['offset'] },
	'offset-position': { value: 'normal', dependsOn: ['offset'] },
	opacity: { value: '1', dependsOn: [] },
	order: { value: '0', dependsOn: ['-webkit-order'] },
	'outline-offset': { value: '0px', dependsOn: [] },
	'outline-style': { value: 'none', dependsOn: ['outline'] },
	'overflow-anchor': { value: 'auto', dependsOn: [] },
	'overflow-block': {
		value: 'visible',
		dependsOn: ['overflow', 'overflow-inline', 'overflow-x', 'overflow-y']
	},
	'overflow-inline': {
		value: 'visible',
		dependsOn: ['overflow', 'overflow-block', 'overflow-x', 'overflow-y']
	},
	'overflow-x': {
		value: 'visible',
		dependsOn: ['overflow', 'overflow-block', 'overflow-inline', 'overflow-y']
	},
	'overflow-y': {
		value: 'visible',
		dependsOn: ['overflow', 'overflow-block', 'overflow-inline', 'overflow-x']
	},
	'overscroll-behavior-block': {
		value: 'auto',
		dependsOn: ['overscroll-behavior', 'overscroll-behavior-x', 'overscroll-behavior-y']
	},
	'overscroll-behavior-inline': {
		value: 'auto',
		dependsOn: ['overscroll-behavior', 'overscroll-behavior-x', 'overscroll-behavior-y']
	},
	'overscroll-behavior-x': {
		value: 'auto',
		dependsOn: ['overscroll-behavior', 'overscroll-behavior-block', 'overscroll-behavior-inline']
	},
	'overscroll-behavior-y': {
		value: 'auto',
		dependsOn: ['overscroll-behavior', 'overscroll-behavior-block', 'overscroll-behavior-inline']
	},
	'padding-block-end': {
		value: '0px',
		dependsOn: [
			'padding',
			'padding-block',
			'padding-bottom',
			'padding-inline',
			'padding-left',
			'padding-right',
			'padding-top'
		]
	},
	'padding-block-start': {
		value: '0px',
		dependsOn: [
			'padding',
			'padding-block',
			'padding-bottom',
			'padding-inline',
			'padding-left',
			'padding-right',
			'padding-top'
		]
	},
	'padding-bottom': {
		value: '0px',
		dependsOn: [
			'padding',
			'padding-block',
			'padding-block-end',
			'padding-block-start',
			'padding-inline',
			'padding-inline-end',
			'padding-inline-start'
		]
	},
	'padding-inline-end': {
		value: '0px',
		dependsOn: [
			'padding',
			'padding-block',
			'padding-bottom',
			'padding-inline',
			'padding-left',
			'padding-right',
			'padding-top'
		]
	},
	'padding-inline-start': {
		value: '0px',
		dependsOn: [
			'padding',
			'padding-block',
			'padding-bottom',
			'padding-inline',
			'padding-left',
			'padding-right',
			'padding-top'
		]
	},
	'padding-left': {
		value: '0px',
		dependsOn: [
			'padding',
			'padding-block',
			'padding-block-end',
			'padding-block-start',
			'padding-inline',
			'padding-inline-end',
			'padding-inline-start'
		]
	},
	'padding-right': {
		value: '0px',
		dependsOn: [
			'padding',
			'padding-block',
			'padding-block-end',
			'padding-block-start',
			'padding-inline',
			'padding-inline-end',
			'padding-inline-start'
		]
	},
	'padding-top': {
		value: '0px',
		dependsOn: [
			'padding',
			'padding-block',
			'padding-block-end',
			'padding-block-start',
			'padding-inline',
			'padding-inline-end',
			'padding-inline-start'
		]
	},
	perspective: { value: 'none', dependsOn: ['-webkit-perspective'] },
	position: { value: 'static', dependsOn: [] },
	'position-anchor': { value: 'normal', dependsOn: [] },
	'position-area': { value: 'none', dependsOn: [] },
	'position-try-fallbacks': { value: 'none', dependsOn: ['position-try'] },
	'position-try-order': { value: 'normal', dependsOn: ['position-try'] },
	quotes: { value: 'auto', dependsOn: [] },
	resize: { value: 'none', dependsOn: [] },
	rotate: { value: 'none', dependsOn: [] },
	'row-gap': { value: 'normal', dependsOn: ['gap', 'grid-gap', 'grid-row-gap'] },
	scale: { value: 'none', dependsOn: [] },
	'scroll-behavior': { value: 'auto', dependsOn: [] },
	'scroll-margin-block-end': {
		value: '0px',
		dependsOn: [
			'scroll-margin',
			'scroll-margin-block',
			'scroll-margin-bottom',
			'scroll-margin-left',
			'scroll-margin-right',
			'scroll-margin-top'
		]
	},
	'scroll-margin-block-start': {
		value: '0px',
		dependsOn: [
			'scroll-margin',
			'scroll-margin-block',
			'scroll-margin-bottom',
			'scroll-margin-left',
			'scroll-margin-right',
			'scroll-margin-top'
		]
	},
	'scroll-margin-bottom': {
		value: '0px',
		dependsOn: [
			'scroll-margin',
			'scroll-margin-block',
			'scroll-margin-block-end',
			'scroll-margin-block-start',
			'scroll-margin-inline',
			'scroll-margin-inline-end',
			'scroll-margin-inline-start'
		]
	},
	'scroll-margin-inline-end': {
		value: '0px',
		dependsOn: [
			'scroll-margin',
			'scroll-margin-bottom',
			'scroll-margin-inline',
			'scroll-margin-left',
			'scroll-margin-right',
			'scroll-margin-top'
		]
	},
	'scroll-margin-inline-start': {
		value: '0px',
		dependsOn: [
			'scroll-margin',
			'scroll-margin-bottom',
			'scroll-margin-inline',
			'scroll-margin-left',
			'scroll-margin-right',
			'scroll-margin-top'
		]
	},
	'scroll-margin-left': {
		value: '0px',
		dependsOn: [
			'scroll-margin',
			'scroll-margin-block',
			'scroll-margin-block-end',
			'scroll-margin-block-start',
			'scroll-margin-inline',
			'scroll-margin-inline-end',
			'scroll-margin-inline-start'
		]
	},
	'scroll-margin-right': {
		value: '0px',
		dependsOn: [
			'scroll-margin',
			'scroll-margin-block',
			'scroll-margin-block-end',
			'scroll-margin-block-start',
			'scroll-margin-inline',
			'scroll-margin-inline-end',
			'scroll-margin-inline-start'
		]
	},
	'scroll-margin-top': {
		value: '0px',
		dependsOn: [
			'scroll-margin',
			'scroll-margin-block',
			'scroll-margin-block-end',
			'scroll-margin-block-start',
			'scroll-margin-inline',
			'scroll-margin-inline-end',
			'scroll-margin-inline-start'
		]
	},
	'scroll-padding-block-end': {
		value: 'auto',
		dependsOn: [
			'scroll-padding',
			'scroll-padding-block',
			'scroll-padding-bottom',
			'scroll-padding-left',
			'scroll-padding-right',
			'scroll-padding-top'
		]
	},
	'scroll-padding-block-start': {
		value: 'auto',
		dependsOn: [
			'scroll-padding',
			'scroll-padding-block',
			'scroll-padding-bottom',
			'scroll-padding-left',
			'scroll-padding-right',
			'scroll-padding-top'
		]
	},
	'scroll-padding-bottom': {
		value: 'auto',
		dependsOn: [
			'scroll-padding',
			'scroll-padding-block',
			'scroll-padding-block-end',
			'scroll-padding-block-start',
			'scroll-padding-inline',
			'scroll-padding-inline-end',
			'scroll-padding-inline-start'
		]
	},
	'scroll-padding-inline-end': {
		value: 'auto',
		dependsOn: [
			'scroll-padding',
			'scroll-padding-bottom',
			'scroll-padding-inline',
			'scroll-padding-left',
			'scroll-padding-right',
			'scroll-padding-top'
		]
	},
	'scroll-padding-inline-start': {
		value: 'auto',
		dependsOn: [
			'scroll-padding',
			'scroll-padding-bottom',
			'scroll-padding-inline',
			'scroll-padding-left',
			'scroll-padding-right',
			'scroll-padding-top'
		]
	},
	'scroll-padding-left': {
		value: 'auto',
		dependsOn: [
			'scroll-padding',
			'scroll-padding-block',
			'scroll-padding-block-end',
			'scroll-padding-block-start',
			'scroll-padding-inline',
			'scroll-padding-inline-end',
			'scroll-padding-inline-start'
		]
	},
	'scroll-padding-right': {
		value: 'auto',
		dependsOn: [
			'scroll-padding',
			'scroll-padding-block',
			'scroll-padding-block-end',
			'scroll-padding-block-start',
			'scroll-padding-inline',
			'scroll-padding-inline-end',
			'scroll-padding-inline-start'
		]
	},
	'scroll-padding-top': {
		value: 'auto',
		dependsOn: [
			'scroll-padding',
			'scroll-padding-block',
			'scroll-padding-block-end',
			'scroll-padding-block-start',
			'scroll-padding-inline',
			'scroll-padding-inline-end',
			'scroll-padding-inline-start'
		]
	},
	'scroll-snap-align': { value: 'none', dependsOn: [] },
	'scroll-snap-stop': { value: 'normal', dependsOn: [] },
	'scroll-snap-type': { value: 'none', dependsOn: [] },
	'scroll-timeline-axis': { value: 'block', dependsOn: ['scroll-timeline'] },
	'scroll-timeline-name': { value: 'none', dependsOn: ['scroll-timeline'] },
	'scrollbar-gutter': { value: 'auto', dependsOn: [] },
	'shape-image-threshold': { value: '0', dependsOn: [] },
	'shape-margin': { value: '0px', dependsOn: [] },
	'shape-outside': { value: 'none', dependsOn: [] },
	'tab-size': { value: '8', dependsOn: [] },
	'table-layout': { value: 'auto', dependsOn: [] },
	'text-align-last': { value: 'auto', dependsOn: ['text-align'] },
	'text-box-trim': { value: 'none', dependsOn: ['text-box'] },
	'text-decoration-inset': { value: '0px', dependsOn: [] },
	'text-decoration-line': { value: 'none', dependsOn: ['text-decoration'] },
	'text-decoration-style': { value: 'solid', dependsOn: ['text-decoration'] },
	'text-decoration-thickness': { value: 'auto', dependsOn: ['text-decoration'] },
	'text-indent': { value: '0px', dependsOn: [] },
	'text-overflow': { value: 'clip', dependsOn: [] },
	'text-shadow': { value: 'none', dependsOn: [] },
	'text-transform': { value: 'none', dependsOn: [] },
	'timeline-scope': { value: 'none', dependsOn: [] },
	'touch-action': { value: 'auto', dependsOn: [] },
	transform: { value: 'none', dependsOn: ['-webkit-transform', 'offset', 'offset-path'] },
	'transform-box': { value: 'view-box', dependsOn: [] },
	'transform-style': { value: 'flat', dependsOn: ['-webkit-transform-style'] },
	'transition-behavior': { value: 'normal', dependsOn: ['-webkit-transition', 'transition'] },
	'transition-delay': {
		value: '0s',
		dependsOn: ['-webkit-transition', '-webkit-transition-delay', 'transition']
	},
	'transition-duration': {
		value: '0s',
		dependsOn: ['-webkit-transition', '-webkit-transition-duration', 'transition']
	},
	'transition-property': {
		value: 'all',
		dependsOn: ['-webkit-transition', '-webkit-transition-property', 'transition']
	},
	'transition-timing-function': {
		value: 'ease',
		dependsOn: ['-webkit-transition', '-webkit-transition-timing-function', 'transition']
	},
	translate: { value: 'none', dependsOn: [] },
	'view-timeline-axis': { value: 'block', dependsOn: ['view-timeline'] },
	'view-timeline-inset': { value: 'auto', dependsOn: ['view-timeline'] },
	'view-timeline-name': { value: 'none', dependsOn: ['view-timeline'] },
	'view-transition-class': { value: 'none', dependsOn: [] },
	'view-transition-name': { value: 'none', dependsOn: [] },
	visibility: { value: 'visible', dependsOn: [] },
	'will-change': { value: 'auto', dependsOn: [] },
	'word-break': { value: 'normal', dependsOn: [] },
	'z-index': { value: 'auto', dependsOn: [] },
	zoom: { value: '1', dependsOn: [] }
};
