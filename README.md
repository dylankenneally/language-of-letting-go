# Language of Letting Go

[![Deploy to GitHub Pages](https://github.com/dylankenneally/language-of-letting-go/actions/workflows/deploy-to-ghpages.yml/badge.svg)](https://github.com/dylankenneally/language-of-letting-go/actions/workflows/deploy-to-ghpages.yml)

Daily Meditations on Codependency. A digital companion, providing a clean, accessible web interface for the daily meditations from "The Language of Letting Go" by Melody Beattie.

It is designed to help you spend a few moments each day remembering what you know. It is a book to help you feel good and assist you in the process of self-care and recovery.

This companion has been built with [Eleventy/11ty](https://11ty.dev/). Changes to this repository are automatically deployed to GitHub pages, hosted on [kenneally.dev](https://kenneally.dev/language-of-letting-go/).

## To build and run

### Prerequisites

- [Node.js](https://nodejs.org/en/). Version 24.12.0 has been used during the development of this project.

### Getting the source code

```bash
git clone git@github.com:dylankenneally/language-of-letting-go.git
cd language-of-letting-go
```

### Install dependencies & start a development server

```bash
npm install
npm start
# the site will be available at `http://localhost:8080` (or the next available port).
```

### Available scripts

The following scripts are available once `npm install` has been ran.

| Script | Action |
| - | - |
| `npm start` | **Starts the development server**; open your browser with <http://localhost:8080> and view. |
| `npm run build` | Performs a **production build** of the site/app to `./build/`. |

### Build options/environment variables

The following environment variables can be overridden to control the build process.

| Variable | Purpose | Default |
| - | - | - |
| `SITE_URL` | The base URL where the site will be hosted, used when generating sitemaps & robots.txt. | `https://kenneally.dev` |
| `ELEVENTY_PATH_PREFIX` | The path prefix if hosting in a subdirectory | `/language-of-letting-go` |

Create a `.env` file in the root directory to manage environment-specific variables:

```env
# The base URL where the site will be hosted
SITE_URL=https://your-domain.com

# The path prefix if hosting in a subdirectory (e.g., /meditations/)
PATH_PREFIX=/
```

When building and running locally/on localhost, you should set `ELEVENTY_PATH_PREFIX` to `/`.

## License

This project is licensed under the [MIT License](./LICENSE). Please note that the meditation content itself remains the copyright of the original author, Melody Beattie.
