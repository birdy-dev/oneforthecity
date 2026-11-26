# Development

Use the pnpm and Node.js versions pinned in `package.json`.

```sh
pnpm install
pnpm node --version
pnpm dev
```

Run project commands through pnpm so they use the managed Node.js version.
To upgrade Node.js, run `pnpm runtime set node <major>` and update
`.node-version` to match. Commit the manifest, lockfile, and `.node-version`
together.

Cloudflare Workers runs the deployed app; this Node.js version is for local
development and build tools.

## Deployments

- In Cloudflare Workers Builds, enable **Disable builds** and uncheck **Builds
  for non-production branches**.
- In GitHub Actions, set the `CLOUDFLARE_API_TOKEN` secret and
  `CLOUDFLARE_ACCOUNT_ID` variable for both environments.

### Production

- Publish a GitHub release marked **Latest** from `main` using a stable SemVer tag.
- Check **Actions > Deploy production**.

### Preview

- Create the `oneforthecity-preview` D1 database and enable `workers.dev` in
  Cloudflare. The preview token needs Workers deploy and D1 migration access.
- Open **Actions > Deploy preview > Run workflow** and select a branch.
- Find **Open preview** in the run summary. The URL serves the latest preview.
- For Stripe testing, set `PREVIEW_STRIPE_PUBLISHABLE_KEY` in GitHub and
  `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` on the preview Worker. Use Stripe
  test credentials and the `/store/webhook/stripe` endpoint.

## Compressing images

```
magick <in.jpg> -resize 50% -quality 92 <out.jpg>
```
