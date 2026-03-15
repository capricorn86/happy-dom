import Window from '../../src/window/Window';

describe('XPathEvaluator', () => {
	let window;

	beforeEach(() => {
		window = new Window();
	});

	it('Is available on the window.', () => {
		expect(typeof window.XPathEvaluator).toBe('function');
		expect(typeof window.XPathResult).toBe('function');
		expect(typeof window.XPathExpression).toBe('function');
	});

	describe('createExpression()', () => {
		it('Creates an XPathExpression.', () => {
			const evaluator = new window.XPathEvaluator();
			const expr = evaluator.createExpression('//div');
			expect(expr).toBeTruthy();
			expect(typeof expr.evaluate).toBe('function');
		});
	});

	describe('evaluate()', () => {
		it('Evaluates a simple tag selector.', () => {
			window.document.body.innerHTML = '<div><span>A</span><span>B</span></div>';
			const evaluator = new window.XPathEvaluator();
			const result = evaluator.evaluate('//span', window.document);
			const nodes = [];
			let node = result.iterateNext();
			while (node) {
				nodes.push(node);
				node = result.iterateNext();
			}
			expect(nodes.length).toBe(2);
			expect(nodes[0].textContent).toBe('A');
			expect(nodes[1].textContent).toBe('B');
		});
	});
});

describe('XPathExpression', () => {
	let window;

	beforeEach(() => {
		window = new Window();
	});

	describe('evaluate()', () => {
		it('Finds descendant elements.', () => {
			window.document.body.innerHTML = '<div><p>1</p><section><p>2</p></section></div>';
			const evaluator = new window.XPathEvaluator();
			const expr = evaluator.createExpression('//p');
			const result = expr.evaluate(window.document, window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
			expect(result.snapshotLength).toBe(2);
			expect(result.snapshotItem(0).textContent).toBe('1');
			expect(result.snapshotItem(1).textContent).toBe('2');
		});

		it('Finds elements with attribute predicate.', () => {
			window.document.body.innerHTML =
				'<div class="a">1</div><div class="b">2</div><div class="a">3</div>';
			const evaluator = new window.XPathEvaluator();
			const expr = evaluator.createExpression('//div[@class="a"]');
			const result = expr.evaluate(window.document, window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
			expect(result.snapshotLength).toBe(2);
		});

		it('Uses context node to scope search.', () => {
			window.document.body.innerHTML = '<div id="a"><span>inside</span></div><span>outside</span>';
			const container = window.document.getElementById('a');
			const evaluator = new window.XPathEvaluator();
			const expr = evaluator.createExpression('.//*');
			const result = expr.evaluate(container, window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
			expect(result.snapshotLength).toBe(1);
			expect(result.snapshotItem(0).textContent).toBe('inside');
		});

		it('Handles starts-with on attribute names (htmx pattern).', () => {
			window.document.body.innerHTML =
				'<div hx-on:click="foo">A</div><div data-hx-on:load="bar">B</div><div>C</div>';
			const evaluator = new window.XPathEvaluator();
			const expr = evaluator.createExpression(
				'.//*[@*[ starts-with(name(), "hx-on:") or starts-with(name(), "data-hx-on:") ]]'
			);
			const result = expr.evaluate(
				window.document.body,
				window.XPathResult.ORDERED_NODE_ITERATOR_TYPE
			);
			const nodes = [];
			let node = result.iterateNext();
			while (node) {
				nodes.push(node);
				node = result.iterateNext();
			}
			expect(nodes.length).toBe(2);
			expect(nodes[0].textContent).toBe('A');
			expect(nodes[1].textContent).toBe('B');
		});

		it('Returns iterator with iterateNext().', () => {
			window.document.body.innerHTML = '<ul><li>1</li><li>2</li><li>3</li></ul>';
			const evaluator = new window.XPathEvaluator();
			const result = evaluator.evaluate(
				'//li',
				window.document,
				null,
				window.XPathResult.ORDERED_NODE_ITERATOR_TYPE
			);
			const items = [];
			let node = result.iterateNext();
			while (node) {
				items.push(node.textContent);
				node = result.iterateNext();
			}
			expect(items).toEqual(['1', '2', '3']);
		});

		it('Returns singleNodeValue for FIRST_ORDERED_NODE_TYPE.', () => {
			window.document.body.innerHTML = '<div><span>first</span><span>second</span></div>';
			const evaluator = new window.XPathEvaluator();
			const result = evaluator.evaluate(
				'//span',
				window.document,
				null,
				window.XPathResult.FIRST_ORDERED_NODE_TYPE
			);
			expect(result.singleNodeValue).toBeTruthy();
			expect(result.singleNodeValue.textContent).toBe('first');
		});

		it('Returns empty result for non-matching expression.', () => {
			window.document.body.innerHTML = '<div>test</div>';
			const evaluator = new window.XPathEvaluator();
			const result = evaluator.evaluate('//span', window.document);
			expect(result.iterateNext()).toBeNull();
			expect(result.snapshotLength).toBe(0);
		});

		it('Counts elements via snapshot.', () => {
			window.document.body.innerHTML = '<div>A</div><div>B</div><p>C</p>';
			const evaluator = new window.XPathEvaluator();
			const result = evaluator.evaluate(
				'//div',
				window.document,
				null,
				window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
			);
			expect(result.snapshotLength).toBe(2);
		});

		it('Reuses a compiled expression.', () => {
			window.document.body.innerHTML = '<div>1</div><div>2</div><div>3</div>';
			const evaluator = new window.XPathEvaluator();
			const expression = evaluator.createExpression('//div');
			const result1 = expression.evaluate(
				window.document,
				window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
			);
			expect(result1.snapshotLength).toBe(3);

			window.document.body.innerHTML += '<div>4</div>';
			const result2 = expression.evaluate(
				window.document,
				window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
			);
			expect(result2.snapshotLength).toBe(4);
		});

		it('createNSResolver returns the input node.', () => {
			const evaluator = new window.XPathEvaluator();
			const node = window.document.body;
			expect(evaluator.createNSResolver(node)).toBe(node);
		});
	});
});
