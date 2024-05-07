<p align="center">
  <img src="https://user-images.githubusercontent.com/77799470/221330080-6dfda7f6-ccd4-4f25-b4ef-943b153354e5.png" alt="Alpha">
</p>

# Contributing to Alpha

Thank you for taking the time to contribute to the project! 👋

## Getting started

First, install the necessary tools:

- [Git](https://git-scm.com/downloads)
- [pnpm](https://pnpm.io/installation)
- [Node.js](https://nodejs.org/en/download/releases/) (16.x)
- [rustup](https://rustup.rs/) (choose the minimal profile)

> **Note: Consider installing the ``Tools for Native Modules`` during Node.js installation.**

Now, clone this repository to your local machine:

```sh
git clone https://github.com/arthurdevv/alpha.git
```

## Development

1. Install the dependencies:

```sh
pnpm install
```

2. Run the code in development mode:

```sh
pnpm run dev
```

> **Note: If you get `node-pty` issues, run:**

```sh
pnpm run rebuild-pty
```

3. After finishing the application, you can generate the executable:

```sh
pnpm run package
```

> **Note: It will generate the executable in the `release` folder.**

4. To make sure that your bundles works, run:

```sh
npx playwright test
```

## Pull Request

Once finished the changes, it's time to create a [pull request](https://github.com/arthurdevv/alpha/pulls).

> **Note: For more information, see [Create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request?platform=windows).**

That's it! Thank you so much for contributing to Alpha 👍