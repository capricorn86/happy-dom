import DOMException from '../exception/DOMException';
import IElement from '../nodes/element/IElement';
import Element from '../nodes/element/Element';
import IHTMLInputElement from '../nodes/html-input-element/IHTMLInputElement';
import SelectorCombinatorEnum from './MediaQueryDeviceEnum';
import ISelectorAttribute from './ISelectorAttribute';
import ISelectorMatch from './ISelectorMatch';
import ISelectorPseudo from './ISelectorPseudo';
import MediaQueryDeviceEnum from './MediaQueryDeviceEnum';

/**
 * Selector item.
 */
export default interface IMediaQueryItem {
	device: MediaQueryDeviceEnum;
	notDevice: boolean;
	classNames: string[] | null;
	attributes: ISelectorAttribute[] | null;
	pseudos: ISelectorPseudo[] | null;
	combinator: SelectorCombinatorEnum;
}
