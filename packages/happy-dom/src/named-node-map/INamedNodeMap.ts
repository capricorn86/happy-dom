import IAttr from '../nodes/attr/IAttr';

export type INamedNodeMapProps = {
	readonly length: number;
	item: (index: number) => IAttr;
	getNamedItem: (qualifiedName: string) => IAttr;
	getNamedItemNS: (namespace: string, localName: string) => IAttr;
	setNamedItem: (attr: IAttr) => IAttr;
	setNamedItemNS: (attr: IAttr) => IAttr;
	removeNamedItem: (qualifiedName: string) => IAttr;
	removeNamedItemNS: (namespace: string, localName: string) => IAttr;
	[Symbol.toStringTag]: string;
} & Iterable<IAttr>;
type INamedNodeMapProperties = keyof INamedNodeMapProps;

type INamedNodeMap = INamedNodeMapProps & {
	[k in Exclude<string | number, INamedNodeMapProperties>]: IAttr;
};

/**
 * NamedNodeMap interface.
 */
export default INamedNodeMap;
