# Game of life project

This is a simple visual implementation of [John Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).
It's main focus is to learn following concepts during software application lifecycle:

- CI/CD integration using local GitLab server
- Monorepo project structure
- Websocket communication between client and server

## What's inside?

This repository uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `frontend`: a [React](https://pl.reactjs.org/) app create using [CRA](https://create-react-app.dev/)
- `backend`: a [Node.js](https://nodejs.org/en/) app built with [Express](https://expressjs.com/) framework
- `logger`: a logger implementation using [Winston](https://www.npmjs.com/package/winston), used by `backend` applications
- `config`: `eslint` configurations (includes `eslint-config-airbnb` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`'s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Craco](https://github.com/gsoft-inc/craco) for configuring CRA without eject

### CI/CD

This turborepo, apart from being hosted on GitHub, was developed using locally set up GitLab server, in order to make use of its vast CI/CD support for learning purposes.
All services required for CI/CD and monitoring functionality are defined inside `ci-cd/docker-compose.yml` file, which contains:

- GitLab server - for storing repository locally
- GitLab runner - for running CI/CD pipeline and executing jobs specified in `.gitlab-ci.yml` file
- Portainer - for monitoring status of dockerized CI/CD stack
- SonarQube - for performing static code analysis automatically as a pipeline step
- PostgreSQL - for storing SonarQube related data

## Setup

This repository is used in the `npx create-turbo` command, and selected when choosing which package manager you wish to use with your monorepo (Yarn).

### Build

To build all apps and packages, run the following command:

```
cd game-of-life-v2
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd game-of-life-v2
yarn run dev
```

## Useful Links
