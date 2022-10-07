import ICharacterData from '../character-data/ICharacterData';

export default interface IProcessingInstruction extends ICharacterData {
	target: string;
}
