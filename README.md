# Happy DOM
A "jsdom" alternative with support for server side rendering of web components.

As shadow roots are scoped, this DOM supports opening them up by providing an option. When the shadow roots are opened up, Happy DOM will scope the HTML and CSS.



# DOM Features

- Custom Elements (Web Components)

- Shadow Root (Shadow DOM)

- Mutation Observer

- Tree Walker

- Fetch
  

  And much more..



# How to Install

```bash
npm install happy-dom
```



# Usage



## Server Side Rendering

Happy DOM provide with a utility for server side rendering. The utility will create a [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options), which is an isolated environment for where the script and DOM can be executed.

Importing dependencies is not supported by the VM script. Therefore scripts with imports has to be bundled with a tool like [Webpack](https://webpack.js.org/) in order to be executed within the virtual machine.

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
const result = await vm.render({
	html,
    script,
    url: 'http://localhost:8080',
    openShadowRoots: true,
    appendCSSToHead: true,
    scopeCSS: true
});

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

An asynchronous DOM is useful when running scripts inside of it. This is usually done within a [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options). See the "Manually Setup a VM Context" section for an example on how to set this up.

*Note: The asynchronous DOM has a dependency to "node-fetch", so it will not work client side.*

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

window.whenAsyncComplete().then(() => {
     const myContainer = document.querySelector('.myContainer');
    
     // Will output the value in "data.test"
     console.log(myContainer.innerHTML);
});
```



## Manually Setup a VM Context

The bellow example will show you how to setup a Node [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options).

```javascript
import { AsyncWindow } from 'happy-dom';
import VM from 'vm';

const context = VM.createContext(new AsyncWindow());
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
const script = new VM.Script(`
    const element = document.createElement('div');
    const myContainer = document.querySelector('.myContainer');
    element.innerHTML = 'Test';
    myContainer.appendChild(element);
`);

window.location.href = 'http://localhost:8080';
window.whenAsyncComplete().then(() => {
    const myContainer = window.document.querySelector('.myContainer div');

    // Will output "Test"
    console.log(myContainer.innerHTML);
});

script.runInContext(context);

document.write(html);
```



# Shadow Root Render Options

As mentioned above, Happy DOM comes with render options for opening the shadow roots for server side rendering.

Opening shadow roots will render them opened when running innerHTML or outerHTML, but they will not be modified in the DOM tree.

By default CSS will be scoped and attached as a child to the head element. The most common use case is to render the entire document by running "document.documentElement.outerHTML", which will include the CSS in the head tag. It is also possible to disable the default behaviour and manually extract the CSS from "cssCache".

## Available Options

The shadow root options are available under "window.shadowRootRenderOptions".

| Name                  | Default value        | Description                                                  |
| --------------------- | -------------------- | ------------------------------------------------------------ |
| openShadowRoots       | false                | Opens the shadow root when rendering elements with innerHTML or outerHTML. |
| appendScopedCSSToHead | true                 | Set to "true" to append extracted and scoped CSS to the head extracted when "openShadowRoots" is enabled.<br /><br />The CSS will still be extracted when set to "false". It will be available in the "cssCache". |
| cssCache              | new ScopedCSSCache() | CSS cache object with the extracted CSS.                     |

## Retrieve Extracted CSS

```javascript
const allScopedCSS = window.shadowRootOptions.cssCache.getAllScopedCSS();

// Outputs all extracted CSS
console.log(allScopedCSS);
```



# Known Limitations

Happy DOM supports the most common functionality of a DOM, but there are some features that are not supported yet. 

If you have a need for a missing feature or if you have found a bug, please let me know, and I will do my best to fix it.



# Release Notes

| Version | Date       | Description      |
| ------- | ---------- | ---------------- |
| 0.6.0   | 2019-10-28 | Thanks to [@mat3e](https://github.com/mat3e) we now have support for hasAttributes(). The "attributes" property has also been changed. It is now returning an object instead of array. (#13).
| 0.5.0   | 2019-10-21 | Adds support for click(), focus() and blur(). (#8) |
| 0.4.4   | 2019-10-20 | Fixes issue with CustomEvent not being defined correctly causing issues with detail property. (#10) |
| 0.4.3   | 2019-10-08 | Fixes issue with cloned nodes referring to the same attributes, which is causing weird issues in lit-html. (#5) |
| 0.4.2   | 2019-10-08 | Fixes issue where query selector not returning correct elements. (#2) |
| 0.4.1   | 2019-10-07 | Fixes issue with self closing elements become parent of next element in HTMLParser. (#1) |
| 0.4.0   | 2019-10-07 | Adds type and eventInit to Event constructor. (#4) |
| 0.3.1   | 2019-10-07 | Fixes bug where global.Error is undefined. (#6) |
| 0.3.0   | 2019-10-06 | Adds support for scrollTop, scrollLeft, scrollTo(), offsetLeft, offsetTop offsetHeight, offsetWidth. |
| 0.2.16  | 2019-10-06 | Major bug fixes with server side rendering. |
| 0.2.0   | 2019-09-20 | Adds support for SVGSVGElement, SVGElement and SVGGraphicsElement. |
| 0.1.0   | 2019-09-19 | Adds support for HTMLInputElement, HTMLTextAreaElement, HTMLFormElement, Range and DOMRect (bounding client rect). |
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

