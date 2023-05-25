import ICharacterData from '../character-data/ICharacterData.js';

export default interface IProcessingInstruction extends ICharacterData {
	target: string;
}
