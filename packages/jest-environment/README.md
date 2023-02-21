![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

# About

[Happy DOM](https://github.com/capricorn86/happy-dom) is a JavaScript implementation of a web browser without its graphical user interface. It includes many web standards from WHATWG [DOM](https://dom.spec.whatwg.org/) and [HTML](https://html.spec.whatwg.org/multipage/).

The goal of [Happy DOM](https://github.com/capricorn86/happy-dom) is to emulate enough of a web browser to be useful for testing, scraping web sites and server-side rendering.

[Happy DOM](https://github.com/capricorn86/happy-dom) focuses heavily on performance and can be used as an alternative to [JSDOM](https://github.com/jsdom/jsdom).

This package makes it possible to use [Happy DOM](https://github.com/capricorn86/happy-dom) with [Jest](https://jestjs.io/).

### DOM Features

- Custom Elements (Web Components)

- Shadow Root (Shadow DOM)

- Declarative Shadow DOM

- Mutation Observer

- Tree Walker

- Fetch

And much more..

### Works With

- [Google LitHTML](https://lit-html.polymer-project.org)

- [Google LitElement](https://lit-element.polymer-project.org)

- [React](https://reactjs.org)

- [Angular](https://angular.io/)

- [Vue](https://vuejs.org/)

# Installation

```bash
npm install @happy-dom/jest-environment --save-dev
```

# Setup

Jest uses `node` as test environment by default. In order to tell Jest to use a different environment we will either have to set a CLI attribute, define it in "package.json" or add a property to your Jest config file.

## CLI

1. Edit your "package.json" file.
2. Add "--env=@happy-dom/jest-environment" as an attribute to your Jest command.

   ```json
   {
   	"scripts": {
   		"test": "jest --env=@happy-dom/jest-environment"
   	}
   }
   ```

3. Save the file.

## In "package.json"

1. Edit your "package.json" file.
2. Add the following to it:

   ```json
   {
   	"jest": {
   		"testEnvironment": "@happy-dom/jest-environment"
   	}
   }
   ```

3. Save the file.

## Configuration File

1. Edit your Jest config file (usually jest.config.js)
2. Add the following to it:

   ```json
   {
   	"testEnvironment": "@happy-dom/jest-environment"
   }
   ```

3. Save the file.

# Additional Features

Happy DOM exposes two functions that may be useful when testing asynchrounous code.

**whenAsyncComplete()**

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that is resolved when all async tasks has been completed.

```javascript
describe('scrollToTop()', () => {
	it('scrolls to top using the built in browser animation', async () => {
		element.scrollToTop();

		// Waits for asynchronous tasks like setTimeout(), requestAnimationFrame() etc. to complete
		await happyDOM.whenAsyncComplete();

		expect(document.documentElement.scrollTop).toBe(0);
	});
});
```

**cancelAsync()**

This method will cancel all running async tasks.

```javascript
describe('runAnimation()', () => {
	it('runs animation', () => {
		element.runAnimation();

		// Cancels all asynchronous tasks like setTimeout(), requestAnimationFrame() etc.
		happyDOM.cancelAsync();

		expect(element.animationCompleted).toBe(true);
	});
});
```

# Performance

| Operation                            | JSDOM   | Happy DOM |
| ------------------------------------ | ------- | --------- |
| Import / Require                     | 333 ms  | 45 ms     |
| Parse HTML                           | 256 ms  | 26 ms     |
| Serialize HTML                       | 65 ms   | 8 ms      |
| Render custom element                | 214 ms  | 19 ms     |
| querySelectorAll('tagname')          | 4.9 ms  | 0.7 ms    |
| querySelectorAll('.class')           | 6.4 ms  | 3.7 ms    |
| querySelectorAll('[attribute]')      | 4.0 ms  | 1.7 ms    |
| querySelectorAll('[class~="name"]')  | 5.5 ms  | 2.9 ms    |
| querySelectorAll(':nth-child(2n+1)') | 10.4 ms | 3.8 ms    |

[See how the test was done here](https://github.com/capricorn86/happy-dom-performance-test)

# Sponsors

[<img alt="RTVision" width="120px" src="https://avatars.githubusercontent.com/u/8292810?s=200&v=4" />](https://rtvision.com)
