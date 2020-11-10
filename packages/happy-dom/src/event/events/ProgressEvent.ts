import Event from '../Event';

export default class ProgressEvent extends Event {
	public readonly lengthComputable: boolean = false;
	public readonly loaded: number = 0;
	public readonly total: number = 0;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param customEventInit Custom event init.
	 */
	constructor(
		type: string,
		options?: { lengthComputable: boolean; loaded: number; total: number }
	) {
		super(type);
		this.lengthComputable = options && options.lengthComputable ? true : false;
		this.loaded = options && options.loaded ? options.loaded : 0;
		this.total = options && options.total ? options.total : 0;
	}
}
