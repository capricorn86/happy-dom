import HTMLTemplateElement from '../nodes/html-template-element/HTMLTemplateElement';
import HTMLFormElement from '../nodes/html-form-element/HTMLFormElement';
import HTMLInputElement from '../nodes/html-input-element/HTMLInputElement';
import HTMLTextAreaElement from '../nodes/html-text-area-element/HTMLTextAreaElement';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement';
import SVGElement from '../nodes/svg-element/SVGElement';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement';
import HTMLStyleElement from '../nodes/html-style-element/HTMLStyleElement';

export default {
	template: HTMLTemplateElement,
	form: HTMLFormElement,
	input: HTMLInputElement,
	textarea: HTMLTextAreaElement,
	script: HTMLScriptElement,
	img: HTMLImageElement,
	link: HTMLLinkElement,
	style: HTMLStyleElement,
	svg: SVGSVGElement,
	circle: SVGElement,
	ellipse: SVGElement,
	line: SVGElement,
	path: SVGElement,
	polygon: SVGElement,
	polyline: SVGElement,
	rect: SVGElement,
	stop: SVGElement,
	use: SVGElement
};
