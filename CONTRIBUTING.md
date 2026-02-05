<p align="center">
  <img width="400" src="https://github.com/user-attachments/assets/a6b393d8-4dcf-4a80-8dac-8f3e147ed5e2" alt="Alpha's Logo">
</p>

# Contributing to Alpha

Thank you for taking the time to contribute to the project! 👋

All kinds of contributions, including bug reports, features, documentation, and translations are welcome.

---

## Getting started

### Requirements

Before you begin, make sure you have the following tools installed:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) (v24.x)
  - If you need multiple Node versions, use [nvm](https://github.com/coreybutler/nvm-windows) to install and switch between them easily
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (included with Node.js)

> **Note:** To avoid build issues, install ``Tools for Native Modules`` during Node.js installation or the ``Desktop development with C++`` workload in Visual Studio Build Tools.

### Fork & clone

1. Fork the repository

2. Clone your fork locally:

```sh
git clone https://github.com/arthurdevv/alpha.git
cd alpha
```

## Development

1. Install the dependencies:

```sh
npm install
```

2. Run the code in development mode:

```sh
npm run dev
```

3. After finishing your changes, you can generate the executable:

```sh
npm run clean
npm run build
npm run package
```

> **Note:** The executable will be generated in the `release/` folder.

4. Before submitting your changes, ensure everything works as expected:

```sh
npx playwright test --debug
```

> **Note:** Please also perform basic manual testing to ensure the change works as expected.

## Branchs & commits

1. Create your feature branch:

```sh
git checkout -b feat/my-new-feature
```

> **Note:** Always create a branch for your changes.

2. Commit your changes

```sh
git commit -am "Add some feature"
```

3. Push your branch to your fork:

```sh
git push origin feat/my-new-feature
```

## Pull Request

Once all steps are completed, it is time to create a [pull request](https://github.com/arthurdevv/alpha/pulls).

In the PR description, explain:
- What was changed
- Why the change is needed
- Any related issue (e.g. Closes #123)

> **Note:** For more details, see [Creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request?platform=windows).

## Translations

Translations are managed via **Crowdin** platform.

To contribute translations, please join the [project here](https://crowdin.com/project/alpha-app/invite?h=3e25a4b059ebde29fd48d7fb03260ede2511626).

> **Note:** No need to edit files manually in the `locales/` folder — all translations updates are managed through the Crowdin.

---

That's it! Thank you so much for contributing to Alpha 🤝
