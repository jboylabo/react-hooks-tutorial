#!/usr/bin/env bash
set -euo pipefail

dry_run=0
if [[ "${1:-}" == "--dry-run" ]]; then
  dry_run=1
elif [[ -n "${1:-}" ]]; then
  echo "Usage: delete-merged-branches.sh [--dry-run]" >&2
  exit 1
fi

git fetch --prune origin

default_ref="$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || true)"
if [[ -z "$default_ref" ]]; then
  if git show-ref --verify --quiet refs/remotes/origin/main; then
    default_ref="origin/main"
  elif git show-ref --verify --quiet refs/remotes/origin/master; then
    default_ref="origin/master"
  else
    echo "origin のデフォルトブランチを特定できません。" >&2
    exit 1
  fi
fi
default_name="${default_ref#origin/}"
current="$(git branch --show-current || true)"

is_protected() {
  case "$1" in
    "$default_name" | main | master | develop | "$current" | "" | HEAD) return 0 ;;
    *) return 1 ;;
  esac
}

local_branches=()
while IFS= read -r branch; do
  [[ -z "$branch" ]] && continue
  if is_protected "$branch"; then
    continue
  fi
  local_branches+=("$branch")
done < <(git branch --merged "$default_ref" --format='%(refname:short)')

remote_branches=()
while IFS= read -r branch; do
  [[ -z "$branch" ]] && continue
  name="${branch#origin/}"
  if [[ "$name" == "HEAD" || "$branch" == *"HEAD"* ]]; then
    continue
  fi
  if is_protected "$name"; then
    continue
  fi
  remote_branches+=("$name")
done < <(git branch -r --merged "$default_ref" --format='%(refname:short)')

echo "デフォルトブランチ: $default_name"
echo "現在のブランチ: ${current:-detached HEAD}"
echo "ローカル:"
if ((${#local_branches[@]})); then
  printf '  %s\n' "${local_branches[@]}"
else
  echo "  (なし)"
fi
echo "リモート:"
if ((${#remote_branches[@]})); then
  printf '  %s\n' "${remote_branches[@]}"
else
  echo "  (なし)"
fi

if ((dry_run)); then
  echo "確認のみ。削除していません。"
  exit 0
fi

if ((${#local_branches[@]} == 0 && ${#remote_branches[@]} == 0)); then
  echo "削除するマージ済みブランチはありません。"
  exit 0
fi

if ((${#local_branches[@]})); then
  git branch -d "${local_branches[@]}"
fi

if ((${#remote_branches[@]})); then
  git push origin --delete "${remote_branches[@]}"
fi
