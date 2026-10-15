# Know & Grow

A warm, journal-style publication for know-how, poems, recipes, learning and everyday inspiration.

## Run locally

```bash
npm install
npm run dev
```

## Publish with GitHub Pages

1. Create a new GitHub repository and push this folder to its `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The included workflow builds and publishes after every push to `main`.
4. In **Settings → Pages → Custom domain**, enter `knowandgrow.in`.
5. At GoDaddy, add the records below.

### GoDaddy DNS

Add four `A` records for host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.

Add a `CNAME` record for host `www` pointing to `<your-github-username>.github.io`. Remove conflicting records for `@` and `www`. After GitHub verifies the domain, enable **Enforce HTTPS**.

## Content editing

The Writer's Desk is a browser prototype. Drafts and images stay in that browser through `localStorage`; they are not shared between devices. Connect a Git-based CMS or hosted content platform before inviting multiple authors.

## Monetization path

The layout supports newsletter growth, sponsorships and later affiliate links. Add analytics, consent handling and the chosen newsletter provider before launch.
