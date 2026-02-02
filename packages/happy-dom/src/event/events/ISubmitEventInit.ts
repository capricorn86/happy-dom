import type HTMLElement from '../../nodes/html-element/HTMLElement.js';
import type IEventInit from '../IEventInit.js';

export default interface ISubmitEventInit extends IEventInit {
	submitter?: HTMLElement;
}
