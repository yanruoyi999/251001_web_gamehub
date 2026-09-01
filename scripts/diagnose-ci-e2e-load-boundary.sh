#!/usr/bin/env bash

set -uo pipefail

readonly BASE_SHA='fdd7ba59e3e9125582d92f1000842de02dfcbd14'
readonly CANDIDATE_REF='refs/pull/32/merge'
readonly LOAD_TITLE_PATTERN='keeps guide play intent actionable before hydration|英文游戏目录的首方图片资源不返回 4xx'
readonly PONG_TITLE='classic pong accepts both player key sets during the same interval'
readonly ROUTES=(/api/health /en /en/games /en/guides/google-snake-mods)

usage() {
  echo "usage: $0 --dry-run | --workspace PATH --output PATH --revision control|candidate --port PORT" >&2
}

write_dry_run() {
  jq -n \
    --arg base_sha "$BASE_SHA" \
    --arg candidate_ref "$CANDIDATE_REF" \
    --arg load_title_pattern "$LOAD_TITLE_PATTERN" \
    --arg pong_title "$PONG_TITLE" \
    '{
      base_sha: $base_sha,
      candidate_ref: $candidate_ref,
      expected_cases_per_revision: 7,
      routes: ["/api/health", "/en", "/en/games", "/en/guides/google-snake-mods"],
      test_runs: [
        {
          expected_cases: 6,
          projects: ["chromium", "firefox", "webkit"],
          title_pattern: $load_title_pattern
        },
        {
          expected_cases: 1,
          projects: ["webkit"],
          title_pattern: $pong_title
        }
      ]
    }'
}

if [[ "${1:-}" == '--dry-run' && "$#" -eq 1 ]]; then
  write_dry_run
  exit 0
fi

workspace=''
output=''
revision=''
port=''

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --workspace)
      workspace="${2:-}"
      shift 2
      ;;
    --output)
      output="${2:-}"
      shift 2
      ;;
    --revision)
      revision="${2:-}"
      shift 2
      ;;
    --port)
      port="${2:-}"
      shift 2
      ;;
    *)
      usage
      exit 64
      ;;
  esac
done

if [[ -z "$workspace" || -z "$output" || -z "$revision" || -z "$port" ]]; then
  usage
  exit 64
fi

if [[ "$revision" != 'control' && "$revision" != 'candidate' ]]; then
  echo "revision must be control or candidate" >&2
  exit 64
fi

mkdir -p "$output/logs" "$output/playwright"

readonly logs_dir="$output/logs"
readonly playwright_dir="$output/playwright"
readonly base_url="http://127.0.0.1:$port"

install_exit=1
build_exit=1
server_exit=1
load_boundary_exit=1
webkit_pong_exit=1
server_pid=''
sampler_pid=''

cleanup() {
  if [[ -n "$sampler_pid" ]] && kill -0 "$sampler_pid" 2>/dev/null; then
    kill "$sampler_pid" 2>/dev/null || true
    wait "$sampler_pid" 2>/dev/null || true
  fi

  if [[ -n "$server_pid" ]] && kill -0 "$server_pid" 2>/dev/null; then
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
}

write_summary() {
  local overall_exit=0
  if [[ "$install_exit" -ne 0 || "$build_exit" -ne 0 || "$server_exit" -ne 0 || "$load_boundary_exit" -ne 0 || "$webkit_pong_exit" -ne 0 ]]; then
    overall_exit=1
  fi

  jq -n \
    --arg revision "$revision" \
    --arg workspace "$workspace" \
    --arg base_sha "$BASE_SHA" \
    --arg candidate_ref "$CANDIDATE_REF" \
    --arg base_url "$base_url" \
    --arg node_version "$(node --version 2>/dev/null || true)" \
    --arg pnpm_version "$(pnpm --version 2>/dev/null || true)" \
    --argjson install_exit "$install_exit" \
    --argjson build_exit "$build_exit" \
    --argjson server_exit "$server_exit" \
    --argjson load_boundary_exit "$load_boundary_exit" \
    --argjson webkit_pong_exit "$webkit_pong_exit" \
    --argjson overall_exit "$overall_exit" \
    '{
      revision: $revision,
      workspace: $workspace,
      base_sha: $base_sha,
      candidate_ref: $candidate_ref,
      base_url: $base_url,
      node_version: $node_version,
      pnpm_version: $pnpm_version,
      expected_cases: 7,
      exits: {
        install: $install_exit,
        build: $build_exit,
        server: $server_exit,
        load_boundary: $load_boundary_exit,
        webkit_pong: $webkit_pong_exit,
        overall: $overall_exit
      }
    }' > "$output/summary.json"

  return "$overall_exit"
}

trap cleanup EXIT

{
  echo "revision=$revision"
  echo "workspace=$workspace"
  node --version
  pnpm --version
} > "$logs_dir/runtime.txt" 2>&1

if (cd "$workspace" && pnpm install --frozen-lockfile) > "$logs_dir/install.log" 2>&1; then
  install_exit=0
else
  install_exit=$?
  write_summary
  exit "$install_exit"
fi

if (cd "$workspace" && GAME_CATALOG_MODE=local CACHE_MODE=local NEXT_TELEMETRY_DISABLED=1 pnpm build) > "$logs_dir/build.log" 2>&1; then
  build_exit=0
else
  build_exit=$?
  write_summary
  exit "$build_exit"
fi

(
  cd "$workspace"
  exec env GAME_CATALOG_MODE=local CACHE_MODE=local NEXT_TELEMETRY_DISABLED=1 \
    "$workspace/node_modules/.bin/next" start -p "$port"
) > "$logs_dir/next-start.log" 2>&1 &
server_pid=$!
echo "$server_pid" > "$logs_dir/next-start.pid"

for _ in $(seq 1 30); do
  if curl --fail --silent --show-error --max-time 5 "$base_url/api/health" > "$logs_dir/health.json" 2>"$logs_dir/health.err"; then
    server_exit=0
    break
  fi
  sleep 1
done

if [[ "$server_exit" -ne 0 ]]; then
  write_summary
  exit "$server_exit"
fi

sample_once() {
  local timestamp route curl_exit
  timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  if kill -0 "$server_pid" 2>/dev/null; then
    ps -o pid=,rss=,command= -p "$server_pid" | sed "s/^/$timestamp\\t/" >> "$logs_dir/server-rss.tsv" || true
  else
    printf '%s\tserver-not-running\n' "$timestamp" >> "$logs_dir/server-rss.tsv"
  fi

  for route in "${ROUTES[@]}"; do
    curl --silent --show-error --output /dev/null --connect-timeout 2 --max-time 5 \
      --write-out "$timestamp\\t$route\\t%{http_code}\\t%{time_total}\\n" \
      "$base_url$route" >> "$logs_dir/curl.tsv" 2>> "$logs_dir/curl.err"
    curl_exit=$?
    if [[ "$curl_exit" -ne 0 ]]; then
      printf '%s\t%s\tcurl-exit=%s\n' "$timestamp" "$route" "$curl_exit" >> "$logs_dir/curl.tsv"
    fi
  done
}

sample_once
while kill -0 "$server_pid" 2>/dev/null; do
  sleep 1
  sample_once
done &
sampler_pid=$!

if (
  cd "$workspace"
  PLAYWRIGHT_BASE_URL="$base_url" DEBUG=pw:webserver pnpm exec playwright test \
    tests/e2e/mobile-disclosure.spec.ts tests/e2e/game-browsing.spec.ts \
    --grep "$LOAD_TITLE_PATTERN" \
    --project=chromium --project=firefox --project=webkit \
    --workers=1 --retries=0 --trace=on --video=on --screenshot=on \
    --output "$playwright_dir/load-boundary-results"
) > "$logs_dir/load-boundary.log" 2>&1; then
  load_boundary_exit=0
else
  load_boundary_exit=$?
fi

if (
  cd "$workspace"
  PLAYWRIGHT_BASE_URL="$base_url" DEBUG=pw:webserver pnpm exec playwright test \
    tests/e2e/two-player-unblocked.spec.ts \
    --grep "$PONG_TITLE" \
    --project=webkit \
    --workers=1 --retries=0 --trace=on --video=on --screenshot=on \
    --output "$playwright_dir/webkit-pong-results"
) > "$logs_dir/webkit-pong.log" 2>&1; then
  webkit_pong_exit=0
else
  webkit_pong_exit=$?
fi

write_summary
exit $?
