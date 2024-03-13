import IHTMLElementConfigEntity from './IHTMLElementConfigEntity.js';

/**
 * @see https://html.spec.whatwg.org/multipage/indices.html
 */
export default <{ [key: string]: IHTMLElementConfigEntity }>{
	a: {
		className: 'HTMLAnchorElement',
		localName: 'a',
		tagName: 'A',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: false
		}
	},
	abbr: {
		className: 'HTMLElement',
		localName: 'abbr',
		tagName: 'ABBR',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	address: {
		className: 'HTMLElement',
		localName: 'address',
		tagName: 'ADDRESS',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	area: {
		className: 'HTMLElement',
		localName: 'area',
		tagName: 'AREA',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	article: {
		className: 'HTMLElement',
		localName: 'article',
		tagName: 'ARTICLE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	aside: {
		className: 'HTMLElement',
		localName: 'aside',
		tagName: 'ASIDE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	audio: {
		className: 'HTMLAudioElement',
		localName: 'audio',
		tagName: 'AUDIO',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	b: {
		className: 'HTMLElement',
		localName: 'b',
		tagName: 'B',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	base: {
		className: 'HTMLBaseElement',
		localName: 'base',
		tagName: 'BASE',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	bdi: {
		className: 'HTMLElement',
		localName: 'bdi',
		tagName: 'BDI',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	bdo: {
		className: 'HTMLElement',
		localName: 'bdo',
		tagName: 'BDO',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	blockquaote: {
		className: 'HTMLElement',
		localName: 'blockquaote',
		tagName: 'BLOCKQUAOTE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	body: {
		className: 'HTMLElement',
		localName: 'body',
		tagName: 'BODY',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	template: {
		className: 'HTMLTemplateElement',
		localName: 'template',
		tagName: 'TEMPLATE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	form: {
		className: 'HTMLFormElement',
		localName: 'form',
		tagName: 'FORM',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	input: {
		className: 'HTMLInputElement',
		localName: 'input',
		tagName: 'INPUT',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	textarea: {
		className: 'HTMLTextAreaElement',
		localName: 'textarea',
		tagName: 'TEXTAREA',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	script: {
		className: 'HTMLScriptElement',
		localName: 'script',
		tagName: 'SCRIPT',
		contentModel: {
			allowChildren: false,
			isPlainText: true,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: false
		}
	},
	img: {
		className: 'HTMLImageElement',
		localName: 'img',
		tagName: 'IMG',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	link: {
		className: 'HTMLLinkElement',
		localName: 'link',
		tagName: 'LINK',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	style: {
		className: 'HTMLStyleElement',
		localName: 'style',
		tagName: 'STYLE',
		contentModel: {
			allowChildren: false,
			isPlainText: true,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: false
		}
	},
	label: {
		className: 'HTMLLabelElement',
		localName: 'label',
		tagName: 'LABEL',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	slot: {
		className: 'HTMLSlotElement',
		localName: 'slot',
		tagName: 'SLOT',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	meta: {
		className: 'HTMLMetaElement',
		localName: 'meta',
		tagName: 'META',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	blockquote: {
		className: 'HTMLElement',
		localName: 'blockquote',
		tagName: 'BLOCKQUOTE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	br: {
		className: 'HTMLElement',
		localName: 'br',
		tagName: 'BR',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	button: {
		className: 'HTMLButtonElement',
		localName: 'button',
		tagName: 'BUTTON',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	canvas: {
		className: 'HTMLElement',
		localName: 'canvas',
		tagName: 'CANVAS',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	caption: {
		className: 'HTMLElement',
		localName: 'caption',
		tagName: 'CAPTION',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	cite: {
		className: 'HTMLElement',
		localName: 'cite',
		tagName: 'CITE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	code: {
		className: 'HTMLElement',
		localName: 'code',
		tagName: 'CODE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	col: {
		className: 'HTMLElement',
		localName: 'col',
		tagName: 'COL',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	colgroup: {
		className: 'HTMLElement',
		localName: 'colgroup',
		tagName: 'COLGROUP',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	data: {
		className: 'HTMLElement',
		localName: 'data',
		tagName: 'DATA',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	datalist: {
		className: 'HTMLElement',
		localName: 'datalist',
		tagName: 'DATALIST',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	dd: {
		className: 'HTMLElement',
		localName: 'dd',
		tagName: 'DD',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	del: {
		className: 'HTMLElement',
		localName: 'del',
		tagName: 'DEL',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	details: {
		className: 'HTMLElement',
		localName: 'details',
		tagName: 'DETAILS',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	dfn: {
		className: 'HTMLElement',
		localName: 'dfn',
		tagName: 'DFN',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	dialog: {
		className: 'HTMLDialogElement',
		localName: 'dialog',
		tagName: 'DIALOG',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	div: {
		className: 'HTMLElement',
		localName: 'div',
		tagName: 'DIV',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	dl: {
		className: 'HTMLElement',
		localName: 'dl',
		tagName: 'DL',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	dt: {
		className: 'HTMLElement',
		localName: 'dt',
		tagName: 'DT',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	em: {
		className: 'HTMLElement',
		localName: 'em',
		tagName: 'EM',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	embed: {
		className: 'HTMLElement',
		localName: 'embed',
		tagName: 'EMBED',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	fieldset: {
		className: 'HTMLElement',
		localName: 'fieldset',
		tagName: 'FIELDSET',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	figcaption: {
		className: 'HTMLElement',
		localName: 'figcaption',
		tagName: 'FIGCAPTION',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	figure: {
		className: 'HTMLElement',
		localName: 'figure',
		tagName: 'FIGURE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	footer: {
		className: 'HTMLElement',
		localName: 'footer',
		tagName: 'FOOTER',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	h1: {
		className: 'HTMLElement',
		localName: 'h1',
		tagName: 'H1',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	h2: {
		className: 'HTMLElement',
		localName: 'h2',
		tagName: 'H2',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	h3: {
		className: 'HTMLElement',
		localName: 'h3',
		tagName: 'H3',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	h4: {
		className: 'HTMLElement',
		localName: 'h4',
		tagName: 'H4',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	h5: {
		className: 'HTMLElement',
		localName: 'h5',
		tagName: 'H5',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	h6: {
		className: 'HTMLElement',
		localName: 'h6',
		tagName: 'H6',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	head: {
		className: 'HTMLElement',
		localName: 'head',
		tagName: 'HEAD',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	header: {
		className: 'HTMLElement',
		localName: 'header',
		tagName: 'HEADER',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	hgroup: {
		className: 'HTMLElement',
		localName: 'hgroup',
		tagName: 'HGROUP',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	hr: {
		className: 'HTMLElement',
		localName: 'hr',
		tagName: 'HR',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	html: {
		className: 'HTMLElement',
		localName: 'html',
		tagName: 'HTML',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	i: {
		className: 'HTMLElement',
		localName: 'i',
		tagName: 'I',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	iframe: {
		className: 'HTMLIFrameElement',
		localName: 'iframe',
		tagName: 'IFRAME',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	ins: {
		className: 'HTMLElement',
		localName: 'ins',
		tagName: 'INS',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	kbd: {
		className: 'HTMLElement',
		localName: 'kbd',
		tagName: 'KBD',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	legend: {
		className: 'HTMLElement',
		localName: 'legend',
		tagName: 'LEGEND',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	li: {
		className: 'HTMLElement',
		localName: 'li',
		tagName: 'LI',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	main: {
		className: 'HTMLElement',
		localName: 'main',
		tagName: 'MAIN',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	map: {
		className: 'HTMLElement',
		localName: 'map',
		tagName: 'MAP',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	mark: {
		className: 'HTMLElement',
		localName: 'mark',
		tagName: 'MARK',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	math: {
		className: 'HTMLElement',
		localName: 'math',
		tagName: 'MATH',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	menu: {
		className: 'HTMLElement',
		localName: 'menu',
		tagName: 'MENU',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	menuitem: {
		className: 'HTMLElement',
		localName: 'menuitem',
		tagName: 'MENUITEM',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	meter: {
		className: 'HTMLElement',
		localName: 'meter',
		tagName: 'METER',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	nav: {
		className: 'HTMLElement',
		localName: 'nav',
		tagName: 'NAV',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	noscript: {
		className: 'HTMLElement',
		localName: 'noscript',
		tagName: 'NOSCRIPT',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	object: {
		className: 'HTMLElement',
		localName: 'object',
		tagName: 'OBJECT',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	ol: {
		className: 'HTMLElement',
		localName: 'ol',
		tagName: 'OL',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	optgroup: {
		className: 'HTMLOptGroupElement',
		localName: 'optgroup',
		tagName: 'OPTGROUP',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	option: {
		className: 'HTMLOptionElement',
		localName: 'option',
		tagName: 'OPTION',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	output: {
		className: 'HTMLElement',
		localName: 'output',
		tagName: 'OUTPUT',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	p: {
		className: 'HTMLElement',
		localName: 'p',
		tagName: 'P',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	param: {
		className: 'HTMLElement',
		localName: 'param',
		tagName: 'PARAM',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	picture: {
		className: 'HTMLElement',
		localName: 'picture',
		tagName: 'PICTURE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	pre: {
		className: 'HTMLElement',
		localName: 'pre',
		tagName: 'PRE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	progress: {
		className: 'HTMLElement',
		localName: 'progress',
		tagName: 'PROGRESS',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	q: {
		className: 'HTMLElement',
		localName: 'q',
		tagName: 'Q',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	rb: {
		className: 'HTMLElement',
		localName: 'rb',
		tagName: 'RB',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	rp: {
		className: 'HTMLElement',
		localName: 'rp',
		tagName: 'RP',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	rt: {
		className: 'HTMLElement',
		localName: 'rt',
		tagName: 'RT',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	rtc: {
		className: 'HTMLElement',
		localName: 'rtc',
		tagName: 'RTC',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	ruby: {
		className: 'HTMLElement',
		localName: 'ruby',
		tagName: 'RUBY',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	s: {
		className: 'HTMLElement',
		localName: 's',
		tagName: 'S',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	samp: {
		className: 'HTMLElement',
		localName: 'samp',
		tagName: 'SAMP',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	section: {
		className: 'HTMLElement',
		localName: 'section',
		tagName: 'SECTION',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	select: {
		className: 'HTMLSelectElement',
		localName: 'select',
		tagName: 'SELECT',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	small: {
		className: 'HTMLElement',
		localName: 'small',
		tagName: 'SMALL',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	source: {
		className: 'HTMLElement',
		localName: 'source',
		tagName: 'SOURCE',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	span: {
		className: 'HTMLElement',
		localName: 'span',
		tagName: 'SPAN',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	strong: {
		className: 'HTMLElement',
		localName: 'strong',
		tagName: 'STRONG',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	sub: {
		className: 'HTMLElement',
		localName: 'sub',
		tagName: 'SUB',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	summary: {
		className: 'HTMLElement',
		localName: 'summary',
		tagName: 'SUMMARY',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	sup: {
		className: 'HTMLElement',
		localName: 'sup',
		tagName: 'SUP',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	table: {
		className: 'HTMLElement',
		localName: 'table',
		tagName: 'TABLE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: false,
			allowSelfAsChild: true
		}
	},
	tbody: {
		className: 'HTMLElement',
		localName: 'tbody',
		tagName: 'TBODY',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	td: {
		className: 'HTMLElement',
		localName: 'td',
		tagName: 'TD',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	tfoot: {
		className: 'HTMLElement',
		localName: 'tfoot',
		tagName: 'TFOOT',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	th: {
		className: 'HTMLElement',
		localName: 'th',
		tagName: 'TH',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	thead: {
		className: 'HTMLElement',
		localName: 'thead',
		tagName: 'THEAD',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	time: {
		className: 'HTMLElement',
		localName: 'time',
		tagName: 'TIME',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	title: {
		className: 'HTMLElement',
		localName: 'title',
		tagName: 'TITLE',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	tr: {
		className: 'HTMLElement',
		localName: 'tr',
		tagName: 'TR',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	track: {
		className: 'HTMLElement',
		localName: 'track',
		tagName: 'TRACK',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	u: {
		className: 'HTMLElement',
		localName: 'u',
		tagName: 'U',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	ul: {
		className: 'HTMLElement',
		localName: 'ul',
		tagName: 'UL',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	var: {
		className: 'HTMLElement',
		localName: 'var',
		tagName: 'VAR',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	video: {
		className: 'HTMLVideoElement',
		localName: 'video',
		tagName: 'VIDEO',
		contentModel: {
			allowChildren: true,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	},
	wbr: {
		className: 'HTMLElement',
		localName: 'wbr',
		tagName: 'WBR',
		contentModel: {
			allowChildren: false,
			isPlainText: false,
			allowSelfAsDirectChild: true,
			allowSelfAsChild: true
		}
	}
};
