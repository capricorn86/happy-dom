export default interface IHTMLElementConfigEntity {
	className: string;
	localName: string;
	tagName: string;
	contentModel: {
		allowChildren: boolean;
		isPlainText: boolean;
		allowSelfAsDirectChild: boolean;
		allowSelfAsChild: boolean;
	};
}
