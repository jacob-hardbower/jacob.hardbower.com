# The Personal Website of Jacob Hardbower

This site showcases my accomplishments, skills, and personality through its rendered contents and underlying codebase.

Due to NDAs and intellectual property rights, I'm unable to openly share the repositories of my most representative work. In lieu of those projects I've built this site with Vue.js to showcase how I might architect and work within a more complex and dynamic web app. I would typically build a content-driven site like this with an SSG like 11ty or Astro.

## Run this site locally

Clone this repository and then install the dependencies.

```sh
npm install
```

Compile and enable hot-reload for development

```sh
npm run dev
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
// for development
npm run test:e2e:dev

// for production
npm run build
npm run test:e2e
```
