import IEventInit from '../IEventInit';

export default interface ICustomEventInit extends IEventInit {
	detail?: object;
}
