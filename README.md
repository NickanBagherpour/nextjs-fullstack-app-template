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