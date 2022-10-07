import IProcessingInstruction from './IProcessingInstruction';
import CharacterData from '../character-data/CharacterData';
import NodeTypeEnum from '../node/NodeTypeEnum';

/**
 * Processing instruction node interface.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/ProcessingInstruction.
 */
export default class ProcessingInstruction extends CharacterData implements IProcessingInstruction {
	public readonly nodeType = NodeTypeEnum.processingInstructionNode;
	public target: string;
}
