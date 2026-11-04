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
and commit the updated manifest and lockfile.

Cloudflare Workers runs the deployed app; this Node.js version is for local
development and build tools.

## Compressing images

```
magick <in.jpg> -resize 50% -quality 92 <out.jpg>
```
