import IEventInit from '../IEventInit';

export default interface IProgressEventInit extends IEventInit {
	lengthComputable?: boolean;
	loaded?: number;
	total?: number;
}
