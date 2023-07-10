import IProcessingInstruction from './IProcessingInstruction.js';
import CharacterData from '../character-data/CharacterData.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

/**
 * Processing instruction node interface.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/ProcessingInstruction.
 */
export default class ProcessingInstruction extends CharacterData implements IProcessingInstruction {
	public readonly nodeType = NodeTypeEnum.processingInstructionNode;
	public target: string;
}
