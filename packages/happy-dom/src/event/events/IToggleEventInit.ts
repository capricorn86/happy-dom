import type Element from '../../nodes/element/Element.js';
import type IEventInit from '../IEventInit.js';

export default interface IToggleEventInit extends IEventInit {
	oldState?: string;
	newState?: string;
	source?: Element | null;
}
