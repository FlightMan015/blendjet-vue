# BlendJet.com Website

## Getting Started

Read the [Nacelle docs](https://docs.getnacelle.com) to get an overview on the platform as a whole.

## Local Setup

### Note: Use `yarn`!

Use `yarn` commands while working on this project.

If you use `npm`, it _will_ work, but it will also create a `package-lock.json` file. The existence of both the yarn-lock and the package-lock will then result in repeated warnings during the Vercel automated deployment process.

### Node Version

Nacelle requires a Node version at or below the 14.X.X range.

[Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) makes switching between node versions easier. The [.nvmrc](./.nvmrc) file in this repository specifies the version currently being leveraged on the project.

To use the project's current node version, run `nvm use`. It should be run before executing any other console commands (including installing dependencies)

```
nvm use # sets your terminal to the specified node version
```

If the above command results in an error, you may need to run `nvm install` to install the specified Node version:

```
nvm install # installs the specified node verson
nvm use # uses the installed node version
```

### Install Dependencies

To install dependencies, run `yarn` in the terminal.

```
nvm use
yarn
```

### Starting the local dev environment

Running the following will start the local Nuxt environment.

```
nvm use
yarn run dev
```
