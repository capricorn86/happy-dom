import IHTMLElement from '../../nodes/html-element/IHTMLElement';
import IEventInit from '../IEventInit';

export default interface ISubmitEventInit extends IEventInit {
	submitter?: IHTMLElement;
}
