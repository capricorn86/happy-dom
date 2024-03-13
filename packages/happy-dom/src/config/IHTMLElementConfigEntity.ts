import HTMLElementConfigContentModelEnum from './HTMLElementConfigContentModelEnum.js';

export default interface IHTMLElementConfigEntity {
	className: string;
	localName: string;
	tagName: string;
	contentModel: HTMLElementConfigContentModelEnum;
}
