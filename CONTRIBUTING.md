# Contributing

## Merge strategy: use "Create a merge commit"

This repo builds features as **stacked PRs**: instead of every branch targeting
`main`, a new feature branch/PR often targets the previous feature's branch, so
each PR's diff stays small and focused (e.g. a `keranjang-pesan-backend` PR
based on the branch behind the "Keranjang & Pesan" frontend PR, instead of
re-showing the whole app).

This only works if the base branch stays a real ancestor of `main` after it
merges. Squash merge (and rebase merge) rewrite the branch into a brand-new
commit with no shared history — any PR still stacked on top of that branch
becomes orphaned from `main` and can't be cleanly retargeted without manual
conflict resolution.

**Rule:** merge PRs with GitHub's **"Create a merge commit"** option, not
"Squash and merge" or "Rebase and merge" — especially for any PR that another
PR might still be (or later be) stacked on. Squash is only safe for a PR that
is the last one in its stack, with nothing branched off it.

If you're unsure whether something is stacked on a given PR, default to a
merge commit — it's always safe, just slightly less tidy in `main`'s history.
