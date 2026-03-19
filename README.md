# TIILT Lab Website

The official website for the **Technological Innovations for Inclusive Learning and Teaching (TIILT) Lab** at Northwestern University.

**Live site:** [tiilt.northwestern.edu](https://tiilt.northwestern.edu/)

## Project Structure

```
├── index.html            # Home page
├── people/               # Lab members and alumni
├── projects/             # Project listings and individual project pages
│   ├── blinc/
│   ├── sportsense/
│   ├── sportsensefordata/
│   ├── minecraft/
│   ├── multicraft/
│   ├── famjam/
│   └── imr/
├── papers/               # Publications
├── classes/              # Course listings
├── blog/                 # Blog posts
├── contact/              # Contact info
├── scss/                 # SCSS source files
│   ├── styles.scss       # Main stylesheet (imports all others)
│   ├── people.scss
│   ├── projects.scss
│   ├── papers.scss
│   ├── classes.scss
│   ├── contact.scss
│   ├── blog.scss
│   └── logo.scss
├── css/                  # Compiled CSS (do not edit directly)
├── assets/               # Images, papers, and other static files
├── script.js             # Site-wide JavaScript
└── bootstrap.min.js      # Bootstrap JS
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/tiilt-lab/tiilt-lab.github.io.git
   cd tiilt-lab.github.io
   ```

2. Install Sass:
   ```bash
   npm install sass
   ```

3. Compile SCSS to CSS:
   ```bash
   npx sass scss/styles.scss css/styles.css
   npx sass scss/projects.scss css/projects.css
   ```

   Or watch for changes during development:
   ```bash
   npx sass --watch scss/styles.scss:css/styles.css
   ```

4. Serve locally (any static file server works):
   ```bash
   python3 -m http.server 8000
   ```
   Then open [http://localhost:8000](http://localhost:8000).

## Development

- **Styles:** Edit files in `scss/`, then compile. `styles.scss` imports all page-specific stylesheets. Never edit `css/` files directly — they are overwritten on compile.
- **Pages:** Each page is a standalone HTML file with its own `index.html`. The navbar is generated dynamically by `script.js`.
- **People:** Lab members are defined directly in `people/index.html`. PhD graduates should be moved to the Alumni section.
- **Projects:** Project cards are in `projects/index.html`. Each project can have its own subpage under `projects/<name>/`.

## Deployment

The site is hosted via GitHub Pages. Pushing to `main` automatically deploys to [tiilt.northwestern.edu](https://tiilt.northwestern.edu/).
