import IHTMLCollection from '../element/IHTMLCollection.js';
import RadioNodeList from './RadioNodeList.js';
import THTMLFormControlElement from './THTMLFormControlElement.js';

export default interface IHTMLFormControlsCollection
	extends IHTMLCollection<THTMLFormControlElement, THTMLFormControlElement | RadioNodeList> {}
