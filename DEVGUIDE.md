Developer Git & Codespace setup
================================

This repository includes helper scripts and configuration to simplify Git authentication and local development.

Quick start (Codespaces / Devcontainer):

1. Open the repository in Codespaces or run the devcontainer.
2. The devcontainer runs `./scripts/setup-git-auth.sh` and `npm install` after creation.

Local setup:

```bash
./scripts/setup-git-auth.sh
# then provide credentials via env vars for the helper:
export GIT_AUTH_USERNAME=your-username
export GIT_AUTH_PASSWORD=your-pat
```

Applying patches:

```bash
./scripts/apply-patches.sh
```

Storybook:

```bash
npm run storybook
npm run build-storybook
```

Committing and pushing changes from Codespaces or locally:

```bash
# create a commit and push to the current branch
./scripts/commit-and-push.sh "my changes"

# For non-interactive pushes (CI or automation), set PAT_TOKEN env var
export PAT_TOKEN=ghp_xxx
./scripts/commit-and-push.sh "my changes"
```

CI / Storybook:

 - The repository includes a workflow at `.github/workflows/build-storybook.yml` that builds Storybook and uploads `storybook-static` as an artifact on push to `main`/`master` or when manually triggered.

Applying patches (example):

```bash
./scripts/apply-patches.sh
git add -A && git commit -m "apply patches" && git push
```

