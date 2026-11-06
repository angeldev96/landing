This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This project uses [Bun](https://bun.sh) as its package manager (see `packageManager` in `package.json`).

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tooling

| Task | Command | Tool |
| --- | --- | --- |
| Lint | `bun run lint` (`lint:fix` to autofix) | [Oxlint](https://oxc.rs) — Next.js, React/React Compiler, a11y and TS rules in `.oxlintrc.json` |
| Typecheck | `bun run typecheck` | TypeScript 7 (native compiler) |
| Build | `bun run build` | Next.js + Turbopack |
| Everything | `bun run check` | [Turborepo](https://turborepo.com) runs lint, typecheck and build in parallel and caches the results |

On Vercel, `vercel.json` installs with `bun install --frozen-lockfile` and builds with `turbo run build lint`. Vercel enables Turborepo Remote Cache automatically, so a deploy whose inputs did not change (e.g. a redeploy, or a commit that only touches `README.md` or `supabase/`) restores the previous build instead of rebuilding.

If you add a new environment variable that affects the build, add it to `tasks.build.env` in `turbo.json` (variables starting with `NEXT_PUBLIC_` are already covered). Turborepo runs in strict env mode, so undeclared variables are hidden from the build and do not invalidate the cache.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
