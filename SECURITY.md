# Security Policy

## Supported Versions

| Version   | Supported          |
| --------- | ------------------ |
| > 15.10.0 | :white_check_mark: |
| < 15.10.0 | :x:                |

## Reporting a Vulnerability

Use the [Github Vulnaribilty Reporter](https://github.com/capricorn86/happy-dom/security) tool to report your findings.

## JavaScript Evaluation and Trust Boundaries

Happy DOM uses Node.js VM contexts to evaluate JavaScript. These contexts are not a security sandbox. Do not execute untrusted JavaScript in the same process as your application. See the [JavaScript Evaluation Warning](https://github.com/capricorn86/happy-dom/wiki/JavaScript-Evaluation-Warning) and the [Node.js VM security warning](https://nodejs.org/api/vm.html).

JavaScript evaluation is disabled by default since Happy DOM v20. Keep `enableJavaScriptEvaluation` disabled unless you trust the scripts being loaded. Explicit calls to evaluation APIs, such as `page.evaluate()`, still execute the supplied code; this setting is not a security boundary for those calls.

The Node.js flags `--disallow-code-generation-from-strings` and `--frozen-intrinsics` are defense-in-depth measures, not a guarantee against VM escape or remote code execution. They do not isolate host objects or freeze every Node.js-specific prototype. The absence of Happy DOM's JavaScript evaluation warning does not establish that executing untrusted code is safe.

### Custom Consoles

A console supplied through the `console` option is exposed to page scripts by reference, including its properties and prototype chain. Passing Node.js's native console (for example, `console: globalThis.console`) exposes host streams through `_stdout` and `_stderr`. Their prototype chains can expose mutable host objects even when both Node.js flags above are enabled. This can allow attacker-controlled scripts to compromise the host process.

Happy DOM uses `VirtualConsole` by default. Prefer the default console instead of passing Node.js's native console. This avoids the specific native-console exposure, but does not make Happy DOM a security sandbox.

If your application must execute untrusted JavaScript, use a separate, appropriately restricted process or container with limited permissions, credentials, filesystem and network access, and resource limits. Merely moving execution into an unrestricted child process does not protect the host.
