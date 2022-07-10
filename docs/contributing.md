# How to Develop

### Install

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Watch

```bash
npm run watch
```


### Debug

1. Go to the package you wish to test in the terminal (e.g. "cd ./packages/happy-dom")
2. Write "debugger;" at the place you want to place a breakpoint in the code.
3. Run the following command in the terminal:
```bash
npm run test:debug
```
4. Open Chrome.
5. Open developer tools.
6. A green ball should appear to the left of the menu bar in developer tools.
7. Click on the green ball.
8. Click continue to jump to your breakpoint.

### Test

##### Run all Tests

```bash
npm test
```

##### Watch Tests

```bash
npm run test:watch
```



# Pull Request

Do your changes on a branch. When you are done with your changes you can create a pull request.

Each pushed commit will trigger a Github Action that will run tests. All tests has to pass before it is possible to merge a pull request.

## Branch Name Convention

task/{taskId}-{taskDescription}

## Commit Convention

The release process in Happy DOM is completely automated. In order to determine which version type a package should be released with and to be able to generate release notes, commits has to follow a certain format.

#### Format

\#{taskId}@{versionType}: {description}.

#### Version Types

| Type    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| trivial | Use this version type if the change doesn't affect the end user. The change will not be displayed in the release notes. |
| patch   | Bug fixes should use this version type.                      |
| minor   | New features that doesn't break anything for the end user should have this version type. |
| major   | Braking changes should use this version type.                |

