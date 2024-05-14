import HTMLElementConfigContentModelEnum from './HTMLElementConfigContentModelEnum.js';
import IHTMLElementConfigEntity from './IHTMLElementConfigEntity.js';

/**
 * @see https://html.spec.whatwg.org/multipage/indices.html
 */
export default <{ [key: string]: IHTMLElementConfigEntity }>{
	a: {
		className: 'HTMLAnchorElement',
		localName: 'a',
		tagName: 'A',
		contentModel: HTMLElementConfigContentModelEnum.noSelfDescendants
	},
	abbr: {
		className: 'HTMLElement',
		localName: 'abbr',
		tagName: 'ABBR',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	address: {
		className: 'HTMLElement',
		localName: 'address',
		tagName: 'ADDRESS',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	area: {
		className: 'HTMLElement',
		localName: 'area',
		tagName: 'AREA',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	article: {
		className: 'HTMLElement',
		localName: 'article',
		tagName: 'ARTICLE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	aside: {
		className: 'HTMLElement',
		localName: 'aside',
		tagName: 'ASIDE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	audio: {
		className: 'HTMLAudioElement',
		localName: 'audio',
		tagName: 'AUDIO',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	b: {
		className: 'HTMLElement',
		localName: 'b',
		tagName: 'B',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	base: {
		className: 'HTMLBaseElement',
		localName: 'base',
		tagName: 'BASE',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	bdi: {
		className: 'HTMLElement',
		localName: 'bdi',
		tagName: 'BDI',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	bdo: {
		className: 'HTMLElement',
		localName: 'bdo',
		tagName: 'BDO',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	blockquaote: {
		className: 'HTMLElement',
		localName: 'blockquaote',
		tagName: 'BLOCKQUAOTE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	body: {
		className: 'HTMLElement',
		localName: 'body',
		tagName: 'BODY',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	template: {
		className: 'HTMLTemplateElement',
		localName: 'template',
		tagName: 'TEMPLATE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	form: {
		className: 'HTMLFormElement',
		localName: 'form',
		tagName: 'FORM',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	input: {
		className: 'HTMLInputElement',
		localName: 'input',
		tagName: 'INPUT',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	textarea: {
		className: 'HTMLTextAreaElement',
		localName: 'textarea',
		tagName: 'TEXTAREA',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	script: {
		className: 'HTMLScriptElement',
		localName: 'script',
		tagName: 'SCRIPT',
		contentModel: HTMLElementConfigContentModelEnum.rawText
	},
	img: {
		className: 'HTMLImageElement',
		localName: 'img',
		tagName: 'IMG',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	link: {
		className: 'HTMLLinkElement',
		localName: 'link',
		tagName: 'LINK',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	style: {
		className: 'HTMLStyleElement',
		localName: 'style',
		tagName: 'STYLE',
		contentModel: HTMLElementConfigContentModelEnum.rawText
	},
	label: {
		className: 'HTMLLabelElement',
		localName: 'label',
		tagName: 'LABEL',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	slot: {
		className: 'HTMLSlotElement',
		localName: 'slot',
		tagName: 'SLOT',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	meta: {
		className: 'HTMLMetaElement',
		localName: 'meta',
		tagName: 'META',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	blockquote: {
		className: 'HTMLElement',
		localName: 'blockquote',
		tagName: 'BLOCKQUOTE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	br: {
		className: 'HTMLElement',
		localName: 'br',
		tagName: 'BR',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	button: {
		className: 'HTMLButtonElement',
		localName: 'button',
		tagName: 'BUTTON',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	canvas: {
		className: 'HTMLElement',
		localName: 'canvas',
		tagName: 'CANVAS',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	caption: {
		className: 'HTMLElement',
		localName: 'caption',
		tagName: 'CAPTION',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	cite: {
		className: 'HTMLElement',
		localName: 'cite',
		tagName: 'CITE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	code: {
		className: 'HTMLElement',
		localName: 'code',
		tagName: 'CODE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	col: {
		className: 'HTMLElement',
		localName: 'col',
		tagName: 'COL',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	colgroup: {
		className: 'HTMLElement',
		localName: 'colgroup',
		tagName: 'COLGROUP',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	data: {
		className: 'HTMLElement',
		localName: 'data',
		tagName: 'DATA',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	datalist: {
		className: 'HTMLElement',
		localName: 'datalist',
		tagName: 'DATALIST',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	dd: {
		className: 'HTMLElement',
		localName: 'dd',
		tagName: 'DD',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	del: {
		className: 'HTMLElement',
		localName: 'del',
		tagName: 'DEL',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	details: {
		className: 'HTMLElement',
		localName: 'details',
		tagName: 'DETAILS',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	dfn: {
		className: 'HTMLElement',
		localName: 'dfn',
		tagName: 'DFN',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	dialog: {
		className: 'HTMLDialogElement',
		localName: 'dialog',
		tagName: 'DIALOG',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	div: {
		className: 'HTMLElement',
		localName: 'div',
		tagName: 'DIV',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	dl: {
		className: 'HTMLElement',
		localName: 'dl',
		tagName: 'DL',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	dt: {
		className: 'HTMLElement',
		localName: 'dt',
		tagName: 'DT',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	em: {
		className: 'HTMLElement',
		localName: 'em',
		tagName: 'EM',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	embed: {
		className: 'HTMLElement',
		localName: 'embed',
		tagName: 'EMBED',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	fieldset: {
		className: 'HTMLElement',
		localName: 'fieldset',
		tagName: 'FIELDSET',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	figcaption: {
		className: 'HTMLElement',
		localName: 'figcaption',
		tagName: 'FIGCAPTION',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	figure: {
		className: 'HTMLElement',
		localName: 'figure',
		tagName: 'FIGURE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	footer: {
		className: 'HTMLElement',
		localName: 'footer',
		tagName: 'FOOTER',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	h1: {
		className: 'HTMLElement',
		localName: 'h1',
		tagName: 'H1',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	h2: {
		className: 'HTMLElement',
		localName: 'h2',
		tagName: 'H2',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	h3: {
		className: 'HTMLElement',
		localName: 'h3',
		tagName: 'H3',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	h4: {
		className: 'HTMLElement',
		localName: 'h4',
		tagName: 'H4',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	h5: {
		className: 'HTMLElement',
		localName: 'h5',
		tagName: 'H5',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	h6: {
		className: 'HTMLElement',
		localName: 'h6',
		tagName: 'H6',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	head: {
		className: 'HTMLElement',
		localName: 'head',
		tagName: 'HEAD',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	header: {
		className: 'HTMLElement',
		localName: 'header',
		tagName: 'HEADER',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	hgroup: {
		className: 'HTMLElement',
		localName: 'hgroup',
		tagName: 'HGROUP',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	hr: {
		className: 'HTMLElement',
		localName: 'hr',
		tagName: 'HR',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	html: {
		className: 'HTMLElement',
		localName: 'html',
		tagName: 'HTML',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	i: {
		className: 'HTMLElement',
		localName: 'i',
		tagName: 'I',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	iframe: {
		className: 'HTMLIFrameElement',
		localName: 'iframe',
		tagName: 'IFRAME',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	ins: {
		className: 'HTMLElement',
		localName: 'ins',
		tagName: 'INS',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	kbd: {
		className: 'HTMLElement',
		localName: 'kbd',
		tagName: 'KBD',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	legend: {
		className: 'HTMLElement',
		localName: 'legend',
		tagName: 'LEGEND',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	li: {
		className: 'HTMLElement',
		localName: 'li',
		tagName: 'LI',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	main: {
		className: 'HTMLElement',
		localName: 'main',
		tagName: 'MAIN',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	map: {
		className: 'HTMLElement',
		localName: 'map',
		tagName: 'MAP',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	mark: {
		className: 'HTMLElement',
		localName: 'mark',
		tagName: 'MARK',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	math: {
		className: 'HTMLElement',
		localName: 'math',
		tagName: 'MATH',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	menu: {
		className: 'HTMLElement',
		localName: 'menu',
		tagName: 'MENU',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	menuitem: {
		className: 'HTMLElement',
		localName: 'menuitem',
		tagName: 'MENUITEM',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	meter: {
		className: 'HTMLElement',
		localName: 'meter',
		tagName: 'METER',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	nav: {
		className: 'HTMLElement',
		localName: 'nav',
		tagName: 'NAV',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	noscript: {
		className: 'HTMLElement',
		localName: 'noscript',
		tagName: 'NOSCRIPT',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	object: {
		className: 'HTMLElement',
		localName: 'object',
		tagName: 'OBJECT',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	ol: {
		className: 'HTMLElement',
		localName: 'ol',
		tagName: 'OL',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	optgroup: {
		className: 'HTMLOptGroupElement',
		localName: 'optgroup',
		tagName: 'OPTGROUP',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	option: {
		className: 'HTMLOptionElement',
		localName: 'option',
		tagName: 'OPTION',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	output: {
		className: 'HTMLElement',
		localName: 'output',
		tagName: 'OUTPUT',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	p: {
		className: 'HTMLElement',
		localName: 'p',
		tagName: 'P',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	param: {
		className: 'HTMLElement',
		localName: 'param',
		tagName: 'PARAM',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	picture: {
		className: 'HTMLElement',
		localName: 'picture',
		tagName: 'PICTURE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	pre: {
		className: 'HTMLElement',
		localName: 'pre',
		tagName: 'PRE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	progress: {
		className: 'HTMLElement',
		localName: 'progress',
		tagName: 'PROGRESS',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	q: {
		className: 'HTMLElement',
		localName: 'q',
		tagName: 'Q',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	rb: {
		className: 'HTMLElement',
		localName: 'rb',
		tagName: 'RB',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	rp: {
		className: 'HTMLElement',
		localName: 'rp',
		tagName: 'RP',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	rt: {
		className: 'HTMLElement',
		localName: 'rt',
		tagName: 'RT',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	rtc: {
		className: 'HTMLElement',
		localName: 'rtc',
		tagName: 'RTC',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	ruby: {
		className: 'HTMLElement',
		localName: 'ruby',
		tagName: 'RUBY',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	s: {
		className: 'HTMLElement',
		localName: 's',
		tagName: 'S',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	samp: {
		className: 'HTMLElement',
		localName: 'samp',
		tagName: 'SAMP',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	section: {
		className: 'HTMLElement',
		localName: 'section',
		tagName: 'SECTION',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	select: {
		className: 'HTMLSelectElement',
		localName: 'select',
		tagName: 'SELECT',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	small: {
		className: 'HTMLElement',
		localName: 'small',
		tagName: 'SMALL',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	source: {
		className: 'HTMLElement',
		localName: 'source',
		tagName: 'SOURCE',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	span: {
		className: 'HTMLElement',
		localName: 'span',
		tagName: 'SPAN',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	strong: {
		className: 'HTMLElement',
		localName: 'strong',
		tagName: 'STRONG',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	sub: {
		className: 'HTMLElement',
		localName: 'sub',
		tagName: 'SUB',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	summary: {
		className: 'HTMLElement',
		localName: 'summary',
		tagName: 'SUMMARY',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	sup: {
		className: 'HTMLElement',
		localName: 'sup',
		tagName: 'SUP',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	table: {
		className: 'HTMLElement',
		localName: 'table',
		tagName: 'TABLE',
		contentModel: HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants
	},
	tbody: {
		className: 'HTMLElement',
		localName: 'tbody',
		tagName: 'TBODY',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	td: {
		className: 'HTMLElement',
		localName: 'td',
		tagName: 'TD',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	tfoot: {
		className: 'HTMLElement',
		localName: 'tfoot',
		tagName: 'TFOOT',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	th: {
		className: 'HTMLElement',
		localName: 'th',
		tagName: 'TH',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	thead: {
		className: 'HTMLElement',
		localName: 'thead',
		tagName: 'THEAD',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	time: {
		className: 'HTMLTimeElement',
		localName: 'time',
		tagName: 'TIME',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	title: {
		className: 'HTMLElement',
		localName: 'title',
		tagName: 'TITLE',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	tr: {
		className: 'HTMLElement',
		localName: 'tr',
		tagName: 'TR',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	track: {
		className: 'HTMLElement',
		localName: 'track',
		tagName: 'TRACK',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	},
	u: {
		className: 'HTMLElement',
		localName: 'u',
		tagName: 'U',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	ul: {
		className: 'HTMLElement',
		localName: 'ul',
		tagName: 'UL',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	var: {
		className: 'HTMLElement',
		localName: 'var',
		tagName: 'VAR',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	video: {
		className: 'HTMLVideoElement',
		localName: 'video',
		tagName: 'VIDEO',
		contentModel: HTMLElementConfigContentModelEnum.anyDescendants
	},
	wbr: {
		className: 'HTMLElement',
		localName: 'wbr',
		tagName: 'WBR',
		contentModel: HTMLElementConfigContentModelEnum.noDescendants
	}
};
