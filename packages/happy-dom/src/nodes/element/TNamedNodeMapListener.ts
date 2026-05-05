import type Attr from '../attr/Attr.js';

export type TNamedNodeMapListener = (attribute: Attr, replacedAttribute?: Attr | null) => void;
