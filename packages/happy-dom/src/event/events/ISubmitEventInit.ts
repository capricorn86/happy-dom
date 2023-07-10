import IHTMLElement from '../../nodes/html-element/IHTMLElement.js';
import IEventInit from '../IEventInit.js';

export default interface ISubmitEventInit extends IEventInit {
	submitter?: IHTMLElement;
}
