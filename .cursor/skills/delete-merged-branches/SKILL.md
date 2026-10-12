---
name: delete-merged-branches
description: Deletes local and remote Git branches already merged into the default branch, while keeping main, master, develop, and the current branch. Use when the user asks to delete merged branches, clean up merged branches, prune stale branches, or マージ済みブランチを削除する.
---

# マージ済みブランチの削除

リポジトリのルートで [scripts/delete-merged-branches.sh](scripts/delete-merged-branches.sh) を実行する。手動で `git branch` や `git push --delete` を組み立てない。

## 実行

削除を求められたとき:

```bash
./.cursor/skills/delete-merged-branches/scripts/delete-merged-branches.sh
```

一覧だけ求められたとき:

```bash
./.cursor/skills/delete-merged-branches/scripts/delete-merged-branches.sh --dry-run
```

`git fetch` と `git push` があるので、ネットワークが使える状態で実行する。

## 守ること

- 未マージのブランチは消さない。`-D` や `--force` は使わない。
- スクリプトが保護するのは、現在のブランチ、リモートのデフォルトブランチ、`main`、`master`、`develop`。
- squash merge されたブランチは `--merged` に出ないので削除しない。
- スクリプトの標準出力を、削除したブランチが分かるようにそのまま伝える。
