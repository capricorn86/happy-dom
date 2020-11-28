![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)


# About

A [JSDOM](https://github.com/jsdom/jsdom) alternative with support for server side rendering of web components.

[Happy DOM](https://github.com/capricorn86/happy-dom) aim to support the most common functionality of a web browser.


### DOM Features

- Custom Elements (Web Components)

- Shadow Root (Shadow DOM)

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
npm install happy-dom
```



# Usage



## Basic Usage

The example below will show you to Happy DOM can be used for rendering a page.


```javascript
import { Window } from 'happy-dom';

const window = new Window();
const document = window.document;

document.body.innerHTML = '<div class="myContainer"></div>';

const myContainer = document.querySelector('.myContainer');
const button = document.createElement('button');

myContainer.appendChild(button);

// Outputs "<div class="myContainer"><button></button></div>"
console.log(myContainer.outerHTML);
```



## VM Context

The example below will show you how to setup a Node [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options) to render a page in Happy DOM. The [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options) can set the Happy DOM window object to be the [global object](https://nodejs.org/api/globals.html) and allows executing code scoped within the context.

```javascript
import { AsyncWindow } from 'happy-dom';
import VM from 'vm';

const window = VM.createContext(new AsyncWindow());
const document = window.document;
const script = new VM.Script(`
    const element = document.createElement('div');
    const myContainer = document.querySelector('.myContainer');
    element.innerHTML = 'Test';
    myContainer.appendChild(element);
`);

window.location.href = 'http://localhost:8080';
window.whenAsyncComplete().then(() => {
    const myContainer = document.querySelector('.myContainer div');

    // Will output "Test"
    console.log(myContainer.innerHTML);
});

document.write(`
    <html>
        <head>
             <title>Test page</title>
        </head>
        <body>
             <div class="myContainer">
                  <!–– Content will be added here -->
             </div>
        </body>
    </html>
`);

script.runInContext(context);
```



## Window vs AsyncWindow

Happy DOM exports two window objects: "Window" and "AsyncWindow". Read more about the differences between them below.



### Window

Has all the basic functionality of a DOM except for fetch(). This has been excluded to make it possible to use Happy DOM client side without the dependencies to server side Node packages.



### AsyncWindow

AsyncWindow extends Window and adds support for fetch(). It also exposes two methods that are useful when working with asynchrounous code.

**whenAsyncComplete()**

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that is resolved when all async tasks has been completed.

**cancelAsync()**

This method will cancel all running async tasks.


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



# Jest

Happy DOM provide with a package called [@happy-dom/jest-environment](https://github.com/capricorn86/happy-dom/tree/master/packages/jest-environment) that makes it possible to use Happy DOM with [Jest](https://jestjs.io/).



# Server Side Rendering

Happy DOM provide with a package called [@happy-dom/server-rendering](https://github.com/capricorn86/happy-dom/tree/master/packages/server-rendering) that makes the setup of server side rendering easier.