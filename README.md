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

`npm run dev` or `yarn dev`

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