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

### Start the application

You can start the app with:

```
npm start
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

```bash
# Runs all tests
npm run test:all
# Runs just the unit tests
npm run test:unit
```

### Generate the documentation

Documentation can be auto-generated using
[documentation.js](https://documentation.js.org/), a lovely library that does
this with aplomb.

The following command will generate pretty, easy-to-navigate documentation for
all of the various functions/classes included within the codebase:

```
npm run doc
```

All the documentation should be available after that in the `docs/` directory
in the HTML file format.

We note that it's currently the job of the individual developer to generate
documentation on their own system; in the future, it should be totally possible
to do something like generate the documentation in the CI pipeline and publish
it to a GitHub pages site.

### Build the application

We do this using [Electron Forge](https://www.electronforge.io/).

For the moment, this is only supported for Linux distributions, but (since
Electron Forge is pretty comprehensive) this should be extendable relatively
easily to work with other operating systems.

There are two main "build" commands we have set up right now:

#### Option 1: Build a package containing all the files of the app

```
npm run package
```

#### Option 2: Gather everything into an executable

```
npm run make
```

#### Accessing the output of building

All the results will be available in the `out/` directory.

#### Troubleshooting building

If you get an error from `electron-forge` in the above steps (something along
the lines of "Cannot make for rpm, the following external binaries need to be
installed"), then you need to make sure that certain packages are installed on
your system.

For one of the developers using Ubuntu, installing `rpm` using
`sudo apt install rpm` fixed this problem
([shoutouts to Stack Overflow](https://stackoverflow.com/a/59571436)).
