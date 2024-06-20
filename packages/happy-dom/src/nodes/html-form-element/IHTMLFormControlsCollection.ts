import IHTMLCollection from '../element/IHTMLCollection.js';
import IRadioNodeList from './IRadioNodeList.js';
import THTMLFormControlElement from './THTMLFormControlElement.js';

export default interface IHTMLFormControlsCollection
	extends IHTMLCollection<THTMLFormControlElement, THTMLFormControlElement | IRadioNodeList> {}
