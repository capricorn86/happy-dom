import IEventInit from '../IEventInit';

export default interface IMediaQueryListInit extends IEventInit {
	matches?: boolean;
	media?: string;
}
