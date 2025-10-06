#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not defined"
  exit 1
fi

mkdir -p backups
pg_dump "$DATABASE_URL" > "backups/db-$(date +%Y%m%d).sql"
