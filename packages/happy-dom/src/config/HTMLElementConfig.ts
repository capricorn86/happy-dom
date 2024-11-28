import HTMLElementConfigContentModelEnum from './HTMLElementConfigContentModelEnum.js';
import HTMLElementConfigContextConstraintEnum from './HTMLElementConfigContextConstraintEnum.js';

/**
 * @see https://html.spec.whatwg.org/multipage/indices.html
 */
export default <
	{
		[key: string]: {
			className: string;
			contentModel: HTMLElementConfigContentModelEnum;
			contextConstraint: HTMLElementConfigContextConstraintEnum;
		};
	}
>{
	a: {
		className: 'HTMLAnchorElement',
		contentModel: HTMLElementConfigContentModelEnum.noSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	abbr: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	address: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	area: {
		className: 'HTMLAreaElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	article: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	aside: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	audio: {
		className: 'HTMLAudioElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	b: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	base: {
		className: 'HTMLBaseElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	bdi: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	bdo: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	body: {
		className: 'HTMLBodyElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.secondElementOfHTMLHtmlElement
	},
	template: {
		className: 'HTMLTemplateElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	form: {
		className: 'HTMLFormElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	input: {
		className: 'HTMLInputElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	textarea: {
		className: 'HTMLTextAreaElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	script: {
		className: 'HTMLScriptElement',
		contentModel: HTMLElementConfigContentModelEnum.rawText,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	img: {
		className: 'HTMLImageElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	link: {
		className: 'HTMLLinkElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	style: {
		className: 'HTMLStyleElement',
		contentModel: HTMLElementConfigContentModelEnum.rawText,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	label: {
		className: 'HTMLLabelElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	slot: {
		className: 'HTMLSlotElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	meta: {
		className: 'HTMLMetaElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	blockquote: {
		className: 'HTMLQuoteElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	br: {
		className: 'HTMLBRElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	button: {
		className: 'HTMLButtonElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	canvas: {
		className: 'HTMLCanvasElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	caption: {
		className: 'HTMLTableCaptionElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	cite: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	code: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	col: {
		className: 'HTMLTableColElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	colgroup: {
		className: 'HTMLTableColElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	data: {
		className: 'HTMLDataElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	datalist: {
		className: 'HTMLDataListElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	dd: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	del: {
		className: 'HTMLModElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	details: {
		className: 'HTMLDetailsElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	dfn: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	dialog: {
		className: 'HTMLDialogElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	div: {
		className: 'HTMLDivElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	dl: {
		className: 'HTMLDListElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	dt: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	em: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	embed: {
		className: 'HTMLEmbedElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	fieldset: {
		className: 'HTMLFieldSetElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	figcaption: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	figure: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	footer: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	h1: {
		className: 'HTMLHeadingElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	h2: {
		className: 'HTMLHeadingElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	h3: {
		className: 'HTMLHeadingElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	h4: {
		className: 'HTMLHeadingElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	h5: {
		className: 'HTMLHeadingElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	h6: {
		className: 'HTMLHeadingElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	head: {
		className: 'HTMLHeadElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.firstElementOfHTMLHtmlElement
	},
	header: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	hgroup: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	hr: {
		className: 'HTMLHRElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	html: {
		className: 'HTMLHtmlElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.firstElementOfDocument
	},
	i: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	iframe: {
		className: 'HTMLIFrameElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	ins: {
		className: 'HTMLModElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	kbd: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	legend: {
		className: 'HTMLLegendElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	li: {
		className: 'HTMLLIElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	main: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	map: {
		className: 'HTMLMapElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	mark: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	menu: {
		className: 'HTMLMenuElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	meter: {
		className: 'HTMLMeterElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	nav: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	noscript: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	object: {
		className: 'HTMLObjectElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	ol: {
		className: 'HTMLOListElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	optgroup: {
		className: 'HTMLOptGroupElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	option: {
		className: 'HTMLOptionElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	output: {
		className: 'HTMLOutputElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	p: {
		className: 'HTMLParagraphElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	param: {
		className: 'HTMLParamElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	picture: {
		className: 'HTMLPictureElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	pre: {
		className: 'HTMLPreElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	progress: {
		className: 'HTMLProgressElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	q: {
		className: 'HTMLQuoteElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	rb: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	rp: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	rt: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	rtc: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	ruby: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	s: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	samp: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	section: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	select: {
		className: 'HTMLSelectElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	small: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	source: {
		className: 'HTMLSourceElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	span: {
		className: 'HTMLSpanElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	strong: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	sub: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	summary: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	sup: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	table: {
		className: 'HTMLTableElement',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	tbody: {
		className: 'HTMLTableSectionElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	td: {
		className: 'HTMLTableCellElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	tfoot: {
		className: 'HTMLTableSectionElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	th: {
		className: 'HTMLTableCellElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	thead: {
		className: 'HTMLTableSectionElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	time: {
		className: 'HTMLTimeElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	title: {
		className: 'HTMLTitleElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	tr: {
		className: 'HTMLTableRowElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	track: {
		className: 'HTMLTrackElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	u: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	ul: {
		className: 'HTMLUListElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	var: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	video: {
		className: 'HTMLVideoElement',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	},
	wbr: {
		className: 'HTMLElement',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants,
		contextConstraint: HTMLElementConfigContextConstraintEnum.none
	}
};
