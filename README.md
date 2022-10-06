## Project Setup

We'll begin by creating a default NextJs application with a Typescript template.

```bash
npx create-next-app --ts nextjs-fullstack-app-template

cd nextjs-fullstack-app-template
```

We use `npm` for this example, but If you want to use `yarn`, run below scripts.

```
yarn install
```

We will test to make sure the app is working.

```
npm run dev
```
or 
```
yarn dev
```

You should see the demo app available on [http://localhost:3000](http://localhost:3000)

## Engine Locking

We would like for all developers working on this project to use the same Node engine and package manager we are using. TO do that we create two new files:

- `.nvmrc` -- Will tell other uses of the project which version of Node is used
- `.npmrc` - Will tell other users of the project which package manager is used

We are using `Node v14 Fermium` for this project so we set those values like so:

`.nvmrc`

```.nvmrc
lts/fermium 
```

`.npmrc`

```
engine-strict=true
```

You can check your version of Node with `node --version` and make sure you are setting the correct one. A list of Node version codenames can be found [here](https://github.com/nodejs/Release/blob/main/CODENAMES.md)


Note that the use of `engine-strict` didn't specifically say anything about `yarn`, we do that in `package.json`:
(if we want to strict user to use yarn for this project)

`package.json` 


```
  "name": "nextjs-fullstack-app-template",
  ...
  "engines": {
    "node": ">=14.0.0",
    "yarn": ">=1.22.0",
    "npm": "please-use-yarn"
  },
  ...
```

Note that from this point on we will be using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) standard and specifically the Angular convention [described here](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type)


## Code Formatting and Quality Tools

In order to set a standard that will be used by all contributors to the project to keep the code style consistent and basic best practices followed we will be implementing two tools:

- [eslint](https://eslint.org/) - For best practices on coding standards
- [prettier](https://prettier.io/) - For automatic formatting of code files

### ESLint

We'll begin with ESLint, which is easy because it automatically comes installed and pre-configured with NextJs projects.

We are just going to add a little of extra configuration and make it a bit stricter than it is by default. If you disagree with any of the rules it sets, no need to worry, it's very easy to disable any of them manually. We configure everything in `.eslintrc.json` which should already exist in your root directory:

`.eslintrc.json`

```json
{
  "extends": ["next", "next/core-web-vitals", "eslint:recommended"],
  "globals": {
    "React": "readonly"
  },
  "rules": {
    "no-unused-vars": [1, { "args": "after-used", "argsIgnorePattern": "^_" }]
  }
}
```

In the above small code example we have added a few additional defaults, we have said that `React` will always be defined even if we don't specifically import it, and I have added a personal custom rule that I like which allows you to prefix variables with an underscore \_ if you have declared them but not used them in the code.

I find that scenario comes up often when you are working on a feature and want to prepare variables for use later, but have not yet reached the point of implementing them.

You can test out your config by running:

```
npm run lint
```
or 
```
yarn lint
```

If you get any errors then ESLint is quite good at explaining clearly what they are. If you encounter a rule you don't like you can disable it in "rules" by simply setting it to 1 (warning) or 0 (ignore) like so:

```
  "rules": {
    "no-unused-vars": 0, // As example: Will never bug you about unused variables again
  }
```

### Prettier

Prettier will take care of automatically formatting our files for us. Let's add it to the project now.

It's only needed during development, so I'll add it as a `devDependency` with `-D`

```
npm i -D prettier
``` 
or
 ```
 yarn add -D prettier
 ```

I also recommend you get the [Prettier VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) so that VS Code can handle the formatting of the files for you and you don't need to rely on the command line tool. Having it installed and configured in your project means that VSCode will use your project's settings, so it's still necessary to add it here.

We'll create two files in the root:

`.prettierrc`
```.prettierrc
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true
}
```

Those values are entirely at your discretion as to what is best for your team and project.

`.prettierignore`
```
.yarn
.vscode
.next
dist
node_modules
*.md
```

In that file I've placed a list of directories that I don't want Prettier to waste any resources working on.  You can also use patterns like *.html to ignore groups of types of files if you choose.

Now we add a new script to `package.json` so we can run Prettier:

`package.json`
```
  ...
  "scripts: {
    ...
    "prettier": "prettier --write ."
  }
```

You can now run

```
npm run prettier
```   
or   
```
yarn prettier
```

to automatically format, fix and save all files in your project you haven't ignored.  By default my formatter updated about 5 files.  You can see them in your list of changed files in the source control tab on the left of VS Code.

## Git Hooks

One more section on configuration before we start getting into component development.  Remember you're going to want this project to be as rock solid as possible if you're going to be building on it in the long term, particularly with a team of other developers.  It's worth the time to get it right at the start.

We are going to implement a tool called [Husky](https://typicode.github.io/husky/#/)

Husky is a tool for running scripts at different stages of the git process, for example add, commit, push, etc.  We would like to be able to set certain conditions, and only allow things like commit and push to succeed if our code meets those conditions, presuming that it indicates our project is of acceptable quality.

To install Husky run

```
npm i -D husky    # yarn add -D husky

npx husky install
```

The second command will create a `.husky` directory in your project.  This is where your hooks will live.  Make sure this directory is included in your code repo as it's intended for other developers as well, not just yourself.

Add the following script to your `package.json` file:

`package.json`
```
  ...
  "scripts: {
    ...
    "prepare": "husky install"
  }
```

This will ensure Husky gets installed automatically when other developers run the project.  

To create a hook run

```
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-push "npm run build"
```

The above ensures that we are not allowed to push to the remote repository unless our code can successfully build.  That seems like a pretty reasonable condition doesn't it?  Feel free to test it by committing this change and trying to push.

---

Lastly we are going to add one more tool.  We have been following a standard convention for all our commit messages so far, let's ensure that everyone on the team is following them as well (including ourselves!).  We can add a linter for our commit messages:

```
yarn add -D @commitlint/config-conventional @commitlint/cli
```

To configure it we will be using a set of standard defaults, but I like to include that list explicitly in a `commitlint.config.js` file since I sometimes forget what prefixes are available:

`commitlint.config.js`
```js
// build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
// ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
// docs: Documentation only changes
// feat: A new feature
// fix: A bug fix
// perf: A code change that improves performance
// refactor: A code change that neither fixes a bug nor adds a feature
// style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
// test: Adding missing tests or correcting existing tests

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'translation',
        'security',
        'changeset',
      ],
    ],
  },
};
```

Then add `commit-msg` hook like below

```
npx husky add .husky/commit-msg  "npx --no -- commitlint --edit ${1}"
```

Feel free to try some commits that *don't* follow the rules and see how they are not accepted, and you receive feedback that is designed to help you correct them. more info about commitlint click [here](https://commitlint.js.org/#/)

### Debugging

[This documentation](https://nextjs.org/docs/advanced-features/debugging) explains how you can debug your Next.js frontend and backend code with full source maps support using either the VS Code debugger, the debugger in Jetbrains WebStorm
 or Chrome DevTools.


## Adding Storybook

One of the great modern tools available to us if you aren't already familiar with it is called [Storybook](https://storybook.js.org/).

Storybook gives us an environment to show off and test the React components we are building outside of the application we are using them in.  It's  great tool to connect developers with designers and be able to verify components we have developed look and function as per design requirements in an isolated environment without the overhead of the rest of the app.

Note that Storybook is meant as a visual testing tool, we will be implementing other tools later for functional unit testing and end-to-end testing.

The best way to learn how to use Storybook is installing it and trying it out!

```
npx sb init --builder webpack5
```

We'll be using the webpack5 version to stay up to date with the latest version of webpack (I'm unsure why it is still not yet the default.  Maybe it will be by the time you are using this tutorial).

When Storybook installs it automatically detects a lot of things about your project, like how it is a React app, and other tools you are using.  It should take care fo all that configuration itself.

If you get a prompt about the eslintPlugin, you can say "yes".  We are going to configure it manually though, so no worries if you get a message saying it didn't auto-configure.

Open up `.eslintrc.json` and update it to the following:

`.eslintrc.json`
```
{
  "extends": [
    "plugin:storybook/recommended", // New
    "next",
    "next/core-web-vitals",
    "eslint:recommended"
  ],
  "globals": {
    "React": "readonly",
  },
  // New
  "overrides": [
    {
      "files": ["*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
      "rules": {
        // example of overriding a rule
        "storybook/hierarchy-separator": "error"
      }
    }
  ],
  "rules": {
    "no-unused-vars": [1, { "args": "after-used", "argsIgnorePattern": "^_" }]
  }
}
```

I have added `// New` to mark the two new sections and lines that are Storybook specific.

You'll notice that Storybook has also added as `/stories` directory to the root of your project with a number of examples in.  If you are new to Storybook I highly recommend you look through them and leave them there until you are comfortable creating your own without the templates.


Before we run it we need to make sure we are using webpack5.  Add the following to your `package.json` file:

`package.json`
```
{
  ...
  "resolutions": {
    "webpack": "^5"
  }
}
```

Then run

```
 npm i     # yarn install
```

To ensure webpack5 is installed, and finally to run Storybook we run:

```
npm run storybook   # yarn storybook
```

## Tailwind CSS (with PostCSS , Autoprefixer)

Tailwind CSS works by scanning all of your HTML files, JavaScript components, and any other templates for class names, generating the corresponding styles and then writing them to a static CSS file.

Installing Tailwind CSS as a PostCSS plugin is the most seamless way to integrate it with build tools like webpack, Rollup, Vite, and Parcel.

[Get started with Tailwind CSS](https://tailwindcss.com/docs/installation/using-postcss)
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Last command will generate your `tailwind.config.js` and `postcss.config.js` files.

## Storybook Support for Tailwind

Start by adding the PostCSS addon for Storybook:

```
npm install -D @storybook/addon-postcss
```

OPTIONAL: If you want to keep using CSS modules as well:

```
npm install -D storybook-css-modules-preset
```

Then update your `.storybook/main.js` file to:

```js
module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  /** Expose public folder to storybook as static */
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-css-modules-preset',
    {
      /**
       * Fix Storybook issue with PostCSS@8
       * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
       */
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
```