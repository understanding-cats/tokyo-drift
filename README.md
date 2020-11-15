# Tokyo-drift

## Installation

You need nodeJS installed on your machine.

```
npm install
```

## Start development

You can start the app with:
```
npm start
```

The app has hot-reloading for any JS or HTML change. For any change to the electron code, just type `rs` in the electron console.

For debugging, you can add the following statement to your electron window:
```
win.webContents.openDevTools()
```

## Verify linting

```
npm run lint
```

## Run tests

```
npm run test
```

All the test should be in the `/test` directory.

## Generate the documentation

```
npm run doc
```

All the documentation should be available after that in the `/docs` directory in the HTML file format.

## Build the application

For the moment, this is only available for Linux distributions.

You can either make a package containing all the files of the app:
```
npm run package
```

Or you can gather everything into an executable:
```
npm run make
```

All the result will be available in the `/out` directory.