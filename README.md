# Pomodoro 2: Tokyo Drift

<div align="center">
<img width="300px" src="https://raw.githubusercontent.com/understanding-cats/tokyo-drift/main/src/images/tomato_tran.png" />
</div>

Have you ever wanted to use a Pomodoro timer, but thought "Sheesh, I don't want
to have to buy a physical timer?"

Did you look at all 2.7 million search results for `pomodoro timer` on Google
and think "All of these seem too popular. I want to use something that was
developed in ten weeks for a graduate class?"

Do you just, like, _really_ like tomatoes?

Then we have the application for you! Introducing **Pomodoro 2: Tokyo Drift**,
coming at you hot, ready, and decently well-tested from the sandy beaches of
UC San Diego.

## Developer Documentation

### Installation

You need Node.js installed on your machine.

```
npm install
```

### Package dependencies

See the repository's `package.json` file.

### Start development

You can start the app with:

```
npm start
```

The app has hot-reloading for any JS or HTML change. For any change to the electron code, just type `rs` in the electron console.

For debugging, you can add the following statement to your electron window:

```
win.webContents.openDevTools()
```

### Linting and stylechecking

We do linting using [ESLint](https://eslint.org/) (with Airbnb defaults,
mostly), and autoformatting using [Prettier](https://prettier.io/). The
following commands will verify that your code looks good (these are run on our
CI build):

```
npm run lint
npm run stylecheck
```

You can auto-format your code using Prettier by running the following command,
also:

```
npm run style
```

### Run tests

All the tests are located in the `test/` directory.

```
# Runs all tests
npm run test:all
# Runs just the unit tests
npm run test:unit
```

### Generate the documentation

```
npm run doc
```

All the documentation should be available after that in the `docs/` directory in the HTML file format.

### Build the application

**NOTE: This is currently not working. We're hoping to fix this soon.**

For the moment, this is only available for Linux distributions.

You can either make a package containing all the files of the app:

```
npm run package
```

Or you can gather everything into an executable:

```
npm run make
```

All the result will be available in the `out/` directory.
