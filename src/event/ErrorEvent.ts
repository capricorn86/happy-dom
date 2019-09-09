import Event from './Event';

export default class ErrorEvent extends Event {
	public error: Error = null;
}
