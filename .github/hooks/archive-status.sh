#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
status_file="$repo_root/docs/status.md"
archive_dir="$repo_root/docs/archive"

if [[ ! -f "$status_file" ]]; then
  exit 0
fi

mkdir -p "$archive_dir"

timestamp="$(date +"%Y%m%d-%H%M%S")"
archive_file="$archive_dir/status-$timestamp.md"

cp "$status_file" "$archive_file"
: > "$status_file"