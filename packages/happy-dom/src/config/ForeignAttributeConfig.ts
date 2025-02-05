import NamespaceURI from './NamespaceURI.js';

/**
 * Forgeign attribute config.
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html#adjust-foreign-attributes
 */
export default <{ [key: string]: string }>{
	'xlink:actuate': NamespaceURI.xlink,
	'xlink:arcrole': NamespaceURI.xlink,
	'xlink:href': NamespaceURI.xlink,
	'xlink:role': NamespaceURI.xlink,
	'xlink:show': NamespaceURI.xlink,
	'xlink:title': NamespaceURI.xlink,
	'xlink:type': NamespaceURI.xlink,
	'xml:lang': NamespaceURI.xml,
	'xml:space': NamespaceURI.xml,
	xmlns: NamespaceURI.xmlns,
	'xmlns:xlink': NamespaceURI.xmlns
};
