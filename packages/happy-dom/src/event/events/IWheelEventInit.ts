import IUIEventInit from '../IUIEventInit';

export default interface IWheelEventInit extends IUIEventInit {
	deltaX?: number;
	deltaY?: number;
	deltaZ?: number;
	deltaMode?: number;
}
