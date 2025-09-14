const { JSDOM } = require('jsdom');
const { Window } = require('happy-dom');
const { suite, benny } = require('./lib');

const TODO_APP_HTML = `
  <h1>Todo List</h1>
  <input type="text" id="new-todo" />
  <button id="add-todo">Add</button>
  <ul id="todo-list">
    <li>Todo 1<button>Remove</button></li>
    <li>Todo 2<button>Remove</button></li>
    <li>Todo 3<button>Remove</button></li>
    <li>Todo 4<button>Remove</button></li>
    <li>Todo 5<button>Remove</button></li>
    <li>Todo 6<button>Remove</button></li>
    <li>Todo 7<button>Remove</button></li>
    <li>Todo 8<button>Remove</button></li>
  </ul>
`;

function setupTodoList(document) {
	const newTodoInput = document.getElementById('new-todo');
	const addTodoButton = document.getElementById('add-todo');
	const todoList = document.getElementById('todo-list');

	addTodoButton.addEventListener('click', () => {
		const newTodoText = newTodoInput.value;
		if (newTodoText) {
			const newTodoItem = document.createElement('li');
			newTodoItem.textContent = newTodoText;
			const removeButton = document.createElement('button');
			removeButton.textContent = 'Remove';
			removeButton.addEventListener('click', () => {
				todoList.removeChild(newTodoItem);
			});
			newTodoItem.appendChild(removeButton);
			todoList.appendChild(newTodoItem);
			newTodoInput.value = '';
		}
	});
}

function runBenchmark(window) {
	const document = window.document;
	setupTodoList(document);

	const newTodoInput = document.getElementById('new-todo');
	const addTodoButton = document.getElementById('add-todo');

	newTodoInput.value = 'New Todo';
	addTodoButton.dispatchEvent(new window.MouseEvent('click'));

	const removeButtons = document.querySelectorAll('li button');
	for (const removeButton of removeButtons) {
		removeButton.dispatchEvent(new window.MouseEvent('click'));
	}
}

suite(
	'Todo List',
	benny.add('JSDOM', () => {
		const dom = new JSDOM(TODO_APP_HTML);
		runBenchmark(dom.window);
	}),
	benny.add('Happy DOM', () => {
		const window = new Window();
		window.document.body.innerHTML = TODO_APP_HTML;
		runBenchmark(window);
	})
);
