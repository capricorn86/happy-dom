# Happy DOM
A "jsdom" alternative with support for server side rendering of web components.

As shadow roots are closed, this DOM supports opening them up by providing an option. When the shadow roots are opened up, Happy DOM will scope the HTML and CSS.



# How to Install

```bash
npm install happy-dom
```



# DOM Features

- Custom Elements (Web Components)

- Shadow Root (Shadow DOM)

- Mutation Observer

- Tree Walker

- Fetch
  

  And much more..



# Usage



## Server Side Rendering

Happy DOM provide with a utility for server side rendering. The utility will create a [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options), which is an isolated environment for where the script and DOM can be executed.

Importing dependencies is not supported by the VM script. Therefore scripts with imports has to be bundled with a tool like Webpack in order to be executed within the virtual machine.

### Example

```javascript
import { VMContext } from 'happy-dom';
import { Script } from 'vm';

const vm = new VMContext();
const html = `
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
`;
const script = new Script(`
    const element = document.createElement('div');
    const myContainer = document.querySelector('.myContainer');
    element.innerHTML = 'Test';
    myContainer.appendChild(element);
`);
const url = 'http://localhost:8080';
const openShadowRoots = true;
const result = vm.render({ html, script, url, openShadowRoots });

// Will output HTML with a div element inside the "myContainer" element
console.log(result);
```



## Create a Synchronous DOM

This section will explain how to create a synchronous DOM for parsing HTML and much more.

*Note: You might have to import the Window class as a single import if you wish to use it client side. Path: "happy-dom/lib/Window" .*

```javascript
import { Window } from 'happy-dom';

const window = new Window();
const document = window.document;

document.body.innerHTML = `
     <div class="myContainer">Test</div>
`;

const myContainer = document.querySelector('.myContainer');

// Will output "Test"
console.log(myContainer.innerHTML);
```



## Create an Asynchronous DOM

The asynchronous DOM will add features like "fetch", "setTimeout", "setInterval" etc. on top of the synchronous DOM.

An asynchronous DOM is useful when running scripts inside of it. This is usually done within a [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options). See the "Manually Setup a VM Context" to see how to setup this.

*Note: The asynchronous DOM a dependency to "node-fetch", so it will not be supported client side.*

```javascript
import { AsyncWindow } from 'happy-dom';

const window = new AsyncWindow();
const document = window.document;

document.body.innerHTML = `
     <div class="myContainer">Test</div>
`;

window.fetch('http://localhost:8080/json').then(response => {
     response.json().then(data => {
          const myContainer = document.querySelector('.myContainer');
          myContainer.innerHTML = data.test;
     })
});

window.whenAsynComplete().then(() => {
     const myContainer = document.querySelector('.myContainer');
    
     // Will output the value in "data.test"
     console.log(myContainer.innerHTML);
});
```

## Manually Setup a VM Context

The bellow example will show you how to setup a Node [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options).

```javascript
import { AsyncWindow } from 'happy-dom';
import { Script, createContext } from 'vm';

const asyncWindow = new AsyncWindow();
const global = Object.assign({}, asyncWindow, { window: asyncWindow });
const context = createContext(global);
const window = context.window;
const html = `
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
`;
const script = new Script(`
    const element = document.createElement('div');
    const myContainer = document.querySelector('.myContainer');
    element.innerHTML = 'Test';
    myContainer.appendChild(element);
`);

window.location.href = 'http://localhost:8080';
window.shadowRootRenderOptions.openShadowRoots = true;
window.whenAsyncComplete().then(() => {
    const myContainer = window.document.querySelector('.myContainer div');

    // Will output "Test"
    console.log(myContainer.innerHTML);
});

document.write(html);

script.runInContext(context);
```



# Known Limitations

Happy DOM supports the most common functionality of a DOM, but there are many features that are not supported yet. 

If you have a need for a missing feature or if you have found a bug, please let me know, and I will do my best to fix it.



# Release Notes



| Version | Date       | Description      |
| ------- | ---------- | ---------------- |
| 0.0.1   | 2019-09-13 | Initial release. |



# How to Develop



## Installation

```bash
npm install
```



## Compilation

```bash
npm run compile
```



## Run Watcher

```bash
npm run watch
```

