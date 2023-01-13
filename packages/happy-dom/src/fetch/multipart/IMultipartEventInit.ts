import IEventInit from '../../event/IEventInit';

export default interface IMultipartEventInit extends IEventInit {
	data?: Uint8Array;
}
