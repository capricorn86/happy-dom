import IProcessingInstruction from './IProcessingInstruction';
import CharacterData from '../character-data/CharacterData';
import Node from '../node/Node';

/**
 * Processing instruction node interface.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/ProcessingInstruction.
 */
export default class ProcessingInstruction extends CharacterData implements IProcessingInstruction {
	public readonly nodeType = Node.PROCESSING_INSTRUCTION_NODE;

	public target: string;
}
