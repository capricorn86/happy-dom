import IEventInit from '../IEventInit';

export default interface IAnimationEventInit extends IEventInit {
	animationName?: string;
	elapsedTime?: number;
	pseudoElement?: string;
}
