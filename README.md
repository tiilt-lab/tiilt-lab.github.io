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

## CMS

The site uses [Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin/` for editing lab members, papers, classes, and blog posts. It authenticates via GitHub OAuth through a self-hosted proxy.

### OAuth Proxy Setup

The OAuth proxy is currently running on **glamdring** (`glamdring-vm-1.cs.northwestern.edu`) as a systemd service.

To set it up from scratch:

1. **Create a GitHub OAuth App** at GitHub > Settings > Developer settings > OAuth Apps:
   - Homepage URL: `https://tiilt.northwestern.edu`
   - Callback URL: `https://videodev.tiilt-blinc.com/oauth/callback`

2. **Deploy the proxy** on glamdring:
   - The server code lives at `~/cms-oauth-proxy/server.js`
   - It runs as a systemd service: `cms-oauth-proxy`
   - It listens on `127.0.0.1:4180` and is proxied through Nginx at `/oauth/`

3. **Set environment variables** in the systemd service file (`/etc/systemd/system/cms-oauth-proxy.service`):
   - `GITHUB_CLIENT_ID` — from the OAuth App
   - `GITHUB_CLIENT_SECRET` — from the OAuth App

4. **Manage the service:**
   ```bash
   sudo systemctl start cms-oauth-proxy    # start
   sudo systemctl stop cms-oauth-proxy     # stop
   sudo systemctl restart cms-oauth-proxy  # restart
   sudo systemctl status cms-oauth-proxy   # check status
   sudo journalctl -u cms-oauth-proxy      # view logs
   ```

5. **Nginx** routes `/oauth/*` to the proxy. The location block is in `/etc/nginx/nginx.conf` on glamdring.

### If glamdring changes or goes down

To migrate the OAuth proxy to a new server:
1. Copy `~/cms-oauth-proxy/server.js` to the new server
2. Install Node.js and run the service with the same env vars
3. Set up Nginx to proxy `/oauth/` to port 4180
4. Update the GitHub OAuth App callback URL
5. Update `base_url` in `admin/config.yml` to point to the new server

## Deployment

The site is hosted via GitHub Pages. Pushing to `main` automatically deploys to [tiilt.northwestern.edu](https://tiilt.northwestern.edu/).
