# Guidelines

Development guidelines are in [CONTRIBUTING.md](./CONTRIBUTING.md). Make sure to read and follow them, especially these chapters:

- [Coding Guidelines](./CONTRIBUTING.md#coding-guidelines), including how to throw exceptions inside a window instance.
- [Tests](./CONTRIBUTING.md#tests), including how to write tests.
- [Pull Request Guidelines](./CONTRIBUTING.md#pull-request-guidelines).
- [AI Contributions](./CONTRIBUTING.md#ai-contributions).

## Tests

Avoid `it.each` in tests if possible, as it tends to degrade readability. Write individual tests with descriptive names instead, and extract shared setup into a helper function if needed.

A `for` loop can still be valuable when testing multiple values that should behave the same way, for example aliased properties such as `anchorNode` and `baseNode`, the values of an enumerated attribute such as `spreadMethod` (`pad`, `reflect` and `repeat`), or a list of ancestors that should all be asserted the same way. The loop can wrap a single test, several tests or a whole `describe`. This differs from `it.each`, which tends to be used to run multiple test scenarios, each with its own combination of inputs and expected results. Those should be written as individual tests.