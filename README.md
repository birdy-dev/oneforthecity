# Development

Use pnpm 12.16.1. pnpm manages the project's Node.js runtime, pinned to 26.13.0
in `package.json` and verified by checksums in `pnpm-lock.yaml`.

```sh
pnpm install
pnpm node --version
pnpm dev
```

Run project commands through pnpm so they use the managed Node.js version.
To upgrade to the newest Node.js 26 release, run `pnpm runtime set node 26`
and update `.node-version` to the resolved version. Commit the updated manifest,
lockfile, and `.node-version` together.

Cloudflare Workers runs the deployed app; this Node.js version is for local
development and build tools.

## Production releases

Production deploys through `.github/workflows/deploy-prod.yml` when a stable GitHub
release is published and marked **Latest**. Tags use `MAJOR.MINOR.PATCH` or
`vMAJOR.MINOR.PATCH`, for example `v1.2.3`, without leading zeroes. Drafts,
prereleases, ordinary pushes, and tag pushes alone do not deploy.

Merge the workflow into `main` before publishing the first release. Then:

1. Merge the changes you want to release into `main`.
2. Open GitHub **Releases > Draft a new release**.
3. Create a new semver tag targeting `main`, select **Set as latest release**,
   and leave **Set as a pre-release** unchecked.
4. Publish the release and monitor **Actions > Deploy production**.

The workflow checks out that tag, installs the pnpm and Node.js versions declared
in `package.json`, runs tests, builds, and deploys with `pnpm exec wrangler deploy`.
The lockfile must match the manifest. Deployments are serialized, and the workflow
checks that the release is still Latest immediately before deploying. Changing
an existing release to Latest does not trigger deployment; publish a new release
or rerun its existing workflow.

Pushes and pull requests to `main` run `.github/workflows/ci.yml` for tests and
builds only. Cloudflare Workers Builds must have **Disable builds** enabled so
its Git integration cannot independently deploy pushes. Keep Worker domains,
bindings, and compatibility settings in `wrangler.jsonc`.

For GitHub Actions, make the `CLOUDFLARE_API_TOKEN` Actions secret and
`CLOUDFLARE_ACCOUNT_ID` Actions variable available to this repository or its
`production` environment. The token needs permission to deploy the
`oneforthecity` Worker in the Birdy account. Existing runtime secrets remain
configured on the Worker and are not stored in GitHub or copied from local env
files. The production environment records deployment history.

To roll back, publish a new semver release pointing to a known good commit that
contains this workflow and mark it Latest. Do not move existing release tags.

`.node-version` is retained for tools that select Node.js before pnpm runs.
GitHub Actions reads the runtime directly from `package.json`; no dashboard
`NODE_VERSION` or `PNPM_VERSION` overrides are required.

## Compressing images

```
magick <in.jpg> -resize 50% -quality 92 <out.jpg>
```
