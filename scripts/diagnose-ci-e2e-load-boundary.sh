#!/usr/bin/env bash

set -uo pipefail

readonly IMMUTABLE_SHA='aa0acf80231f202c6529423db1e2dbaa87b3ee16'
readonly HARNESS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly DIAGNOSTIC_CONFIG_NAME='playwright.ci-diagnostic.config.ts'
readonly DIAGNOSTIC_CONFIG_SOURCE="$HARNESS_ROOT/$DIAGNOSTIC_CONFIG_NAME"
readonly CASE_MANIFEST="$HARNESS_ROOT/scripts/ci-e2e-load-boundary-cases.json"
readonly ROUTES=(/api/health /en /en/games /en/guides/google-snake-mods)

usage() {
  echo "usage: $0 --dry-run | --validate-result --result PATH --expected-count N --summary PATH | [--summary-fixture|--summary-fixture-invalid-jq] --workspace PATH --output PATH --arm A|B --port PORT" >&2
}

write_dry_run() {
  jq -n --arg immutable_sha "$IMMUTABLE_SHA" --slurpfile cases "$CASE_MANIFEST" '{
    immutable_sha: $immutable_sha,
    expected_cases_per_arm: ($cases[0].cases | length),
    arms: [
      {name: "A", endpoint: "http://localhost:3217", server_host: "localhost"},
      {name: "B", endpoint: "http://127.0.0.1:3217", server_host: "127.0.0.1"}
    ],
    cases: $cases[0].cases
  }'
}

if [[ "${1:-}" == '--dry-run' && "$#" -eq 1 ]]; then
  write_dry_run
  exit 0
fi

validate_result_file() {
  local result_path="$1" expected_count="$2" summary_path="$3"
  local collected_count executed_count skipped_count passed_count failed_count stats_total
  if [[ ! -s "$result_path" ]]; then
    jq -n --argjson expected_count "$expected_count" '{status: "missing-result", expected_count: $expected_count, collected_count: null, executed_count: null, skipped_count: null, passed_count: null, failed_count: null}' > "$summary_path"
    return 1
  fi
  if ! jq -e 'type == "object" and (.stats | type == "object") and ((.stats.expected | type) == "number") and ((.stats.unexpected | type) == "number") and ((.stats.flaky | type) == "number") and ((.stats.skipped | type) == "number")' "$result_path" > /dev/null 2>"$summary_path.error"; then
    jq -n --argjson expected_count "$expected_count" '{status: "invalid-json", expected_count: $expected_count, collected_count: null, executed_count: null, skipped_count: null, passed_count: null, failed_count: null}' > "$summary_path"
    return 1
  fi
  collected_count="$(jq -er '[.. | objects | select(has("projectName") and (.results | type == "array"))] | length' "$result_path")"
  executed_count="$(jq -er '[.. | objects | select(has("projectName") and (.results | type == "array") and (.results | length > 0))] | length' "$result_path")"
  passed_count="$(jq -er '.stats.expected' "$result_path")"
  failed_count="$(jq -er '.stats.unexpected + .stats.flaky' "$result_path")"
  skipped_count="$(jq -er '.stats.skipped' "$result_path")"
  stats_total=$((passed_count + failed_count + skipped_count))
  if [[ "$stats_total" -ne "$collected_count" || $((passed_count + failed_count)) -ne "$executed_count" ]]; then
    jq -n --argjson expected_count "$expected_count" --argjson collected_count "$collected_count" --argjson executed_count "$executed_count" --argjson skipped_count "$skipped_count" --argjson passed_count "$passed_count" --argjson failed_count "$failed_count" --argjson stats_total "$stats_total" '{status: "stats-mismatch", expected_count: $expected_count, collected_count: $collected_count, executed_count: $executed_count, skipped_count: $skipped_count, passed_count: $passed_count, failed_count: $failed_count, stats_total_count: $stats_total}' > "$summary_path"
    return 1
  fi
  if [[ "$collected_count" -eq "$expected_count" && "$executed_count" -eq "$expected_count" && "$skipped_count" -eq 0 ]]; then
    jq -n --argjson expected_count "$expected_count" --argjson collected_count "$collected_count" --argjson executed_count "$executed_count" --argjson skipped_count "$skipped_count" --argjson passed_count "$passed_count" --argjson failed_count "$failed_count" '{status: "pass", expected_count: $expected_count, collected_count: $collected_count, executed_count: $executed_count, skipped_count: $skipped_count, passed_count: $passed_count, failed_count: $failed_count}' > "$summary_path"
    return 0
  fi
  jq -n --argjson expected_count "$expected_count" --argjson collected_count "$collected_count" --argjson executed_count "$executed_count" --argjson skipped_count "$skipped_count" --argjson passed_count "$passed_count" --argjson failed_count "$failed_count" '{status: "count-mismatch", expected_count: $expected_count, collected_count: $collected_count, executed_count: $executed_count, skipped_count: $skipped_count, passed_count: $passed_count, failed_count: $failed_count}' > "$summary_path"
  return 1
}

if [[ "${1:-}" == '--validate-result' ]]; then
  result_path=''; expected_count=''; result_summary=''; shift
  while [[ "$#" -gt 0 ]]; do
    case "$1" in
      --result) result_path="${2:-}"; shift 2 ;;
      --expected-count) expected_count="${2:-}"; shift 2 ;;
      --summary) result_summary="${2:-}"; shift 2 ;;
      *) usage; exit 64 ;;
    esac
  done
  if [[ -z "$result_path" || ! "$expected_count" =~ ^[0-9]+$ || -z "$result_summary" ]]; then usage; exit 64; fi
  validate_result_file "$result_path" "$expected_count" "$result_summary"
  exit $?
fi

workspace=''; output=''; arm=''; port=''; summary_fixture=''
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --workspace) workspace="${2:-}"; shift 2 ;;
    --output) output="${2:-}"; shift 2 ;;
    --arm) arm="${2:-}"; shift 2 ;;
    --port) port="${2:-}"; shift 2 ;;
    --summary-fixture) summary_fixture='valid'; shift ;;
    --summary-fixture-invalid-jq) summary_fixture='invalid-jq'; shift ;;
    *) usage; exit 64 ;;
  esac
done
if [[ -z "$workspace" || -z "$output" || -z "$arm" || ! "$port" =~ ^[0-9]+$ ]]; then usage; exit 64; fi
if [[ "$arm" != 'A' && "$arm" != 'B' ]]; then echo 'arm must be A or B' >&2; exit 64; fi

mkdir -p "$output/logs" "$output/playwright"
readonly logs_dir="$output/logs"
readonly playwright_dir="$output/playwright"
readonly expected_count="$(jq -er '.cases | length' "$CASE_MANIFEST")"
if [[ "$arm" == 'A' ]]; then
  readonly server_host='localhost'; readonly base_url="http://localhost:$port"
else
  readonly server_host='127.0.0.1'; readonly base_url="http://127.0.0.1:$port"
fi
readonly diagnostic_config_path="$workspace/$DIAGNOSTIC_CONFIG_NAME"
checkout_exit=1; config_exit=1; server_exit=1; selection_exit=1; execution_exit=1; evidence_exit=1; server_lifecycle_exit=1
server_pid=''; sampler_pid=''

cleanup() {
  if [[ -n "$sampler_pid" ]] && kill -0 "$sampler_pid" 2>/dev/null; then kill "$sampler_pid" 2>/dev/null || true; wait "$sampler_pid" 2>/dev/null || true; fi
  if [[ -n "$server_pid" ]] && kill -0 "$server_pid" 2>/dev/null; then kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; fi
}

write_summary() {
  local overall_exit=0 results_json='[]'
  if test -s "$playwright_dir/cases.json" && jq -e 'type == "array"' "$playwright_dir/cases.json" > /dev/null 2>&1; then
    results_json="$(cat "$playwright_dir/cases.json")"
  else
    evidence_exit=1
  fi
  if [[ "$checkout_exit" -ne 0 || "$config_exit" -ne 0 || "$server_exit" -ne 0 || "$selection_exit" -ne 0 || "$execution_exit" -ne 0 || "$evidence_exit" -ne 0 || "$server_lifecycle_exit" -ne 0 ]]; then overall_exit=1; fi
  jq -n --arg arm "$arm" --arg endpoint "$base_url" --arg server_host "$server_host" --arg immutable_sha "$IMMUTABLE_SHA" --arg workspace "$workspace" --argjson expected_count "$expected_count" --argjson checkout_exit "$checkout_exit" --argjson config_exit "$config_exit" --argjson server_exit "$server_exit" --argjson selection_exit "$selection_exit" --argjson execution_exit "$execution_exit" --argjson evidence_exit "$evidence_exit" --argjson server_lifecycle_exit "$server_lifecycle_exit" --argjson overall_exit "$overall_exit" --slurpfile cases "$CASE_MANIFEST" --argjson results "$results_json" '{arm: $arm, endpoint: $endpoint, server_host: $server_host, immutable_sha: $immutable_sha, workspace: $workspace, expected_count: $expected_count, cases: $cases[0].cases, results: $results, counts: {selected: $expected_count, collected: ([$results[] | (.result.collected_count // 0)] | add // 0), executed: ([$results[] | (.result.executed_count // 0)] | add // 0), skipped: ([$results[] | (.result.skipped_count // 0)] | add // 0), passed: ([$results[] | (.result.passed_count // 0)] | add // 0), failed: ([$results[] | (.result.failed_count // 0)] | add // 0)}, exits: {checkout: $checkout_exit, config: $config_exit, server: $server_exit, selection: $selection_exit, execution: $execution_exit, evidence: $evidence_exit, server_lifecycle: $server_lifecycle_exit, overall: $overall_exit}}' > "$output/summary.json"
  return "$overall_exit"
}
trap cleanup EXIT
jq -n '[]' > "$playwright_dir/cases.json"

if [[ "$summary_fixture" != '' ]]; then
  checkout_exit=0; config_exit=0; server_exit=0; selection_exit=0; execution_exit=0; evidence_exit=0; server_lifecycle_exit=0
  if [[ "$summary_fixture" == 'invalid-jq' ]]; then printf 'not-json\n' > "$playwright_dir/cases.json"; fi
  write_summary; exit $?
fi

actual_sha="$(git -C "$workspace" rev-parse HEAD 2>"$logs_dir/checkout.err" || true)"
printf 'expected=%s\nactual=%s\n' "$IMMUTABLE_SHA" "$actual_sha" > "$logs_dir/checkout.txt"
if [[ "$actual_sha" == "$IMMUTABLE_SHA" ]]; then checkout_exit=0; else write_summary; exit $?; fi
if cp "$DIAGNOSTIC_CONFIG_SOURCE" "$diagnostic_config_path" && cmp -s "$DIAGNOSTIC_CONFIG_SOURCE" "$diagnostic_config_path" && shasum -a 256 "$workspace/package.json" "$workspace/pnpm-lock.yaml" "$workspace/playwright.config.ts" "$CASE_MANIFEST" "$DIAGNOSTIC_CONFIG_SOURCE" "$diagnostic_config_path" > "$logs_dir/build-config.sha256"; then config_exit=0; fi
if [[ "$config_exit" -ne 0 ]]; then write_summary; exit $?; fi

{ printf 'arm=%s\nendpoint=%s\nserver_host=%s\n' "$arm" "$base_url" "$server_host"; node --version; pnpm --version; node -e "require('node:dns').lookup('$server_host', { all: true }, (error, addresses) => { if (error) throw error; process.stdout.write(JSON.stringify(addresses) + '\\n'); })"; } > "$logs_dir/runtime-and-address.txt" 2>&1
(
  cd "$workspace"
  exec env GAME_CATALOG_MODE=local CACHE_MODE=local NEXT_TELEMETRY_DISABLED=1 "$workspace/node_modules/.bin/next" start -H "$server_host" -p "$port"
) > "$logs_dir/server.stdout.log" 2> "$logs_dir/server.stderr.log" &
server_pid=$!; printf '%s\n' "$server_pid" > "$logs_dir/server.pid"
for _ in $(seq 1 30); do
  if curl --fail --silent --show-error --max-time 5 "$base_url/api/health" > "$logs_dir/health.json" 2>"$logs_dir/health.err"; then server_exit=0; break; fi
  sleep 1
done
lsof -nP -iTCP:"$port" -sTCP:LISTEN > "$logs_dir/server-listen.txt" 2>&1 || true
if [[ "$server_exit" -ne 0 ]]; then cleanup; if ! kill -0 "$server_pid" 2>/dev/null; then server_lifecycle_exit=0; fi; write_summary; exit $?; fi

sample_once() {
  local timestamp route curl_exit
  timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  if kill -0 "$server_pid" 2>/dev/null; then ps -o pid=,rss=,command= -p "$server_pid" | sed "s/^/$timestamp\\t/" >> "$logs_dir/server-rss.tsv" || true; else printf '%s\tserver-not-running\n' "$timestamp" >> "$logs_dir/server-rss.tsv"; fi
  for route in "${ROUTES[@]}"; do
    curl --silent --show-error --output /dev/null --connect-timeout 2 --max-time 5 --write-out "$timestamp\\t$route\\t%{http_code}\\t%{time_total}\\n" "$base_url$route" >> "$logs_dir/readiness-probes.tsv" 2>> "$logs_dir/readiness-probes.err"
    curl_exit=$?
    if [[ "$curl_exit" -ne 0 ]]; then printf '%s\t%s\tcurl-exit=%s\n' "$timestamp" "$route" "$curl_exit" >> "$logs_dir/readiness-probes.tsv"; fi
  done
}
sample_once
while kill -0 "$server_pid" 2>/dev/null; do sleep 1; sample_once; done &
sampler_pid=$!

case_index=0
while IFS=$'\t' read -r spec project title; do
  case_index=$((case_index + 1)); case_dir="$playwright_dir/case-$case_index"; mkdir -p "$case_dir"; case_exit=1
  if (cd "$workspace" && PLAYWRIGHT_BASE_URL="$base_url" PLAYWRIGHT_JSON_OUTPUT_FILE="$case_dir/result.json" DEBUG=pw:api,pw:webserver pnpm exec playwright test --config "$diagnostic_config_path" "$spec" --grep "$title$" --project="$project" --workers=1 --retries=0 --trace=on --reporter=line,json --output "$case_dir/results") > "$logs_dir/case-$case_index.log" 2>&1; then case_exit=0; fi
  if validate_result_file "$case_dir/result.json" 1 "$case_dir/summary.json"; then count_exit=0; else count_exit=$?; fi
  jq -n --argjson index "$case_index" --arg spec "$spec" --arg project "$project" --arg title "$title" --argjson command_exit "$case_exit" --argjson count_exit "$count_exit" --slurpfile result "$case_dir/summary.json" '{index: $index, spec: $spec, project: $project, title: $title, command_exit: $command_exit, count_exit: $count_exit, result: $result[0]}' > "$case_dir/case.json"
  jq -s '.[0] + [.[1]]' "$playwright_dir/cases.json" "$case_dir/case.json" > "$playwright_dir/cases.next.json" && mv "$playwright_dir/cases.next.json" "$playwright_dir/cases.json"
done < <(jq -r '.cases[] | [.spec, .project, .title] | @tsv' "$CASE_MANIFEST")

if [[ "$case_index" -eq "$expected_count" ]]; then selection_exit=0; fi
if jq -e --argjson expected_count "$expected_count" 'length == $expected_count and all(.[]; .command_exit == 0 and .count_exit == 0 and .result.status == "pass" and .result.collected_count == 1 and .result.executed_count == 1 and .result.skipped_count == 0)' "$playwright_dir/cases.json" > /dev/null; then execution_exit=0; fi
if test -f "$logs_dir/server.stdout.log" && test -f "$logs_dir/server.stderr.log" && test -s "$logs_dir/build-config.sha256" && test -s "$logs_dir/readiness-probes.tsv" && find "$playwright_dir" -type f -name 'result.json' | grep -q .; then evidence_exit=0; fi
cleanup
if ! kill -0 "$server_pid" 2>/dev/null; then server_lifecycle_exit=0; fi
write_summary
exit $?
