# TIILT Lab Website

The official website for the **Technological Innovations for Inclusive Learning and Teaching (TIILT) Lab** at Northwestern University.

**Live site:** [tiilt.northwestern.edu](https://tiilt.northwestern.edu/)

## Project Structure

```
├── index.html            # Home page
├── _config.yml           # Jekyll configuration
├── _data/                # CMS-managed data
│   ├── people.yml        # Lab members and alumni
│   ├── papers.yml        # Publications
│   └── classes.yml       # Courses
├── _posts/               # Blog posts (Markdown)
├── admin/                # Sveltia CMS admin panel
│   ├── config.yml        # CMS field/collection definitions
│   └── index.html        # CMS entry point
├── people/               # People page
├── projects/             # Project pages
│   ├── blinc/
│   ├── sportsense/
│   ├── sportsensefordata/
│   ├── sportsanalytics/
│   ├── minecraft/
│   ├── multicraft/
│   ├── famjam/
│   └── imr/
├── papers/               # Publications page
├── classes/              # Course listings page
├── blog/                 # Blog page
├── contact/              # Contact page
├── scss/                 # SCSS source files (compile to css/)
├── css/                  # Compiled CSS (do not edit directly)
├── assets/               # Images, papers, and other static files
├── script.js             # Site-wide JavaScript
└── bootstrap.min.js      # Bootstrap JS
```

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

To develop locally, clone the repo and serve with any static file server (e.g. `python3 -m http.server 8000`). Styles are in `scss/` — compile with `npx sass scss/styles.scss css/styles.css` (install Sass first with `npm install sass`).
