---
title: Why static sites still win
date: 2026-08-05
description: Fast, cheap, and nothing to patch on a Sunday night.
---

Static HTML is the most boring technology on the web, which is exactly why
it's great:

- **Fast** — files served from a CDN edge, no server rendering per request.
- **Cheap** — most hosts serve static sites for free.
- **Secure** — there is no server to compromise.
- **Durable** — a `dist/` folder from five years ago still deploys today.

The catch used to be tooling: rebuilding meant wiring up templating engines
and asset pipelines. A modern static site generator handles routing, data
loading, and bundling — you just write pages.
