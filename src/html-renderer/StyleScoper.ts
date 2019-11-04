import CSSTree from 'css-tree';

/**
 * Utility for scoping CSS inside a shadow root.
 */
export default class StyleScoper {
	/**
	 * Scopes CSS.
	 *
	 * @param {string} css CSS code.
	 * @param {string} id Unique id to use.
	 * @param {string} tagName Tag name.
	 * @return {string} Scoped CSS.
	 */
	public static scope(css: string, id: string, tagName: string): string {
		const ast = CSSTree.parse(css);
		const walked = [];

		CSSTree.walk(ast, (node, item, list) => {
			if (!walked.includes(item)) {
				if (node.type === 'PseudoClassSelector' && node.name === 'host') {
					const newItem = list.createItem({
						type: 'TypeSelector',
						name: tagName.toLowerCase()
					});

					node.type = 'ClassSelector';
					node.name = id;

					list.insert(newItem, item);
					walked.push(item);

					if (node.children && node.children.head.data.type === 'Raw') {
						if (node.children.head.data.value.includes('(')) {
							const value = node.children.head.data.value
								.replace(':', '')
								.replace(')', '')
								.split('(');
							const newAttributeSelector = list.createItem({
								flags: null,
								loc: null,
								type: 'AttributeSelector',
								name: {
									loc: null,
									type: 'Identifier',
									name: value[0]
								},
								matcher: '=',
								value: {
									loc: null,
									type: 'String',
									value: '"' + value[1] + '"'
								}
							});
							const whiteSpaceItem = list.createItem({
								type: 'WhiteSpace',
								value: ' '
							});
							list.prepend(whiteSpaceItem);
							list.prepend(newAttributeSelector);
						}
					}
				} else if (node.type === 'TypeSelector' && node.name === '*') {
					node.type = 'ClassSelector';
					node.name = id;
				} else if (node.type === 'AttributeSelector') {
					const newItem = list.createItem({
						type: 'ClassSelector',
						name: id
					});
					list.insert(newItem, item);

					walked.push(item);
				} else if (node.type === 'ClassSelector' || node.type === 'TypeSelector') {
					const newItem = list.createItem({
						type: 'ClassSelector',
						name: id
					});

					if (item.next) {
						list.insert(newItem, item.next);
					} else {
						list.append(newItem);
					}

					walked.push(newItem);
				}
			}
		});

		return CSSTree.generate(ast);
	}
}
