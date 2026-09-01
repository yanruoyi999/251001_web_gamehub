#!/usr/bin/env bash
set -uo pipefail

readonly IMMUTABLE_SHA='aa0acf80231f202c6529423db1e2dbaa87b3ee16'
readonly HARNESS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly DIAGNOSTIC_CONFIG_NAME='playwright.ci-diagnostic.config.ts'
readonly DIAGNOSTIC_CONFIG_SOURCE="$HARNESS_ROOT/$DIAGNOSTIC_CONFIG_NAME"
readonly CASE_MANIFEST="$HARNESS_ROOT/scripts/ci-e2e-load-boundary-cases.json"
readonly ROUTES=(/api/health /en /en/games /en/guides/google-snake-mods)

usage() {
  echo "usage: $0 --dry-run | --validate-result --result PATH --expected-count N --summary PATH | --validate-evidence --output PATH --arm A|B --port PORT | --workspace PATH --output PATH --arm A|B --port PORT --build-identity PATH" >&2
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

validate_result_file() {
  local result_path="$1" expected_count="$2" summary_path="$3"
  local collected executed skipped passed failed total
  if [[ ! -s "$result_path" ]]; then
    jq -n --argjson expected_count "$expected_count" '{status:"missing-result",expected_count:$expected_count,collected_count:null,executed_count:null,skipped_count:null,passed_count:null,failed_count:null}' > "$summary_path"
    return 1
  fi
  if ! jq -e 'type=="object" and (.stats|type=="object") and ([.stats.expected,.stats.unexpected,.stats.flaky,.stats.skipped]|all(type=="number"))' "$result_path" > /dev/null 2>"$summary_path.error"; then
    jq -n --argjson expected_count "$expected_count" '{status:"invalid-json",expected_count:$expected_count,collected_count:null,executed_count:null,skipped_count:null,passed_count:null,failed_count:null}' > "$summary_path"
    return 1
  fi
  collected="$(jq -er '[..|objects|select(has("projectName") and (.results|type=="array"))]|length' "$result_path")"
  executed="$(jq -er '[..|objects|select(has("projectName") and (.results|type=="array") and (.results|length>0))]|length' "$result_path")"
  passed="$(jq -er '.stats.expected' "$result_path")"
  failed="$(jq -er '.stats.unexpected + .stats.flaky' "$result_path")"
  skipped="$(jq -er '.stats.skipped' "$result_path")"
  total=$((passed + failed + skipped))
  if [[ "$total" -ne "$collected" || $((passed + failed)) -ne "$executed" ]]; then
    jq -n --argjson expected_count "$expected_count" --argjson collected_count "$collected" --argjson executed_count "$executed" --argjson skipped_count "$skipped" --argjson passed_count "$passed" --argjson failed_count "$failed" '{status:"stats-mismatch",expected_count:$expected_count,collected_count:$collected_count,executed_count:$executed_count,skipped_count:$skipped_count,passed_count:$passed_count,failed_count:$failed_count}' > "$summary_path"
    return 1
  fi
  if [[ "$collected" -eq "$expected_count" && "$executed" -eq "$expected_count" && "$skipped" -eq 0 ]]; then
    jq -n --argjson expected_count "$expected_count" --argjson collected_count "$collected" --argjson executed_count "$executed" --argjson skipped_count "$skipped" --argjson passed_count "$passed" --argjson failed_count "$failed" '{status:"pass",expected_count:$expected_count,collected_count:$collected_count,executed_count:$executed_count,skipped_count:$skipped_count,passed_count:$passed_count,failed_count:$failed_count}' > "$summary_path"
    return 0
  fi
  jq -n --argjson expected_count "$expected_count" --argjson collected_count "$collected" --argjson executed_count "$executed" --argjson skipped_count "$skipped" --argjson passed_count "$passed" --argjson failed_count "$failed" '{status:"count-mismatch",expected_count:$expected_count,collected_count:$collected_count,executed_count:$executed_count,skipped_count:$skipped_count,passed_count:$passed_count,failed_count:$failed_count}' > "$summary_path"
  return 1
}

validate_evidence() {
  local output="$1" arm="$2" port="$3" logs="$1/logs" playwright="$1/playwright" expected index pid failed=0 endpoint host
  expected="$(jq -er '.cases|length' "$CASE_MANIFEST")"
  if [[ "$arm" == A ]]; then endpoint="http://localhost:$port"; host=localhost; else endpoint="http://127.0.0.1:$port"; host=127.0.0.1; fi
  for path in "$logs/build-config.sha256" "$logs/build-output-identity.sha256" "$logs/health.json" "$logs/server.pid" "$logs/server-rss.tsv" "$logs/readiness-probes.tsv" "$logs/listener-receipt.json" "$logs/post-arm-isolation.json" "$playwright/cases.json"; do [[ -s "$path" ]] || { echo "missing nonempty evidence: $path" >&2; failed=1; }; done
  for path in "$logs/server.stdout.log" "$logs/server.stderr.log" "$logs/health.err" "$logs/readiness-probes.err"; do [[ -f "$path" ]] || { echo "missing retained receipt: $path" >&2; failed=1; }; done
  [[ ! -s "$logs/health.err" ]] || { echo 'successful health stderr is not empty' >&2; failed=1; }
  [[ ! -s "$logs/readiness-probes.err" ]] || { echo 'readiness stderr is not empty' >&2; failed=1; }
  for route in /api/health /en /en/games /en/guides/google-snake-mods; do awk -F '\t' -v route="$route" '$2==route && $3 ~ /^[23][0-9][0-9]$/ && $4 ~ /^[0-9.]+$/{found=1} END{exit !found}' "$logs/readiness-probes.tsv" 2>/dev/null || { echo "missing successful readiness probe: $route" >&2; failed=1; }; done
  pid="$(tr -d '[:space:]' < "$logs/server.pid" 2>/dev/null || true)"
  [[ "$pid" =~ ^[0-9]+$ ]] && grep -Eq "$(printf '\t')$pid[[:space:]]" "$logs/server-rss.tsv" 2>/dev/null || { echo 'missing server PID/RSS evidence' >&2; failed=1; }
  if ! jq -e --arg arm "$arm" --arg endpoint "$endpoint" --arg host "$host" --arg port "$port" '.arm==$arm and .endpoint==$endpoint and .server_host==$host and .bind_verified==true and (.resolved_addresses|type=="array" and length>0) and (.listener|type=="string" and length>0) and (if $arm=="B" then (.resolved_addresses|index("127.0.0.1")) and (.listener|contains("127.0.0.1:"+$port)) else (.listener|contains(":"+$port)) end)' "$logs/listener-receipt.json" >/dev/null 2>&1; then echo 'invalid resolved/bound listener evidence' >&2; failed=1; fi
  if ! jq -e --argjson port "$port" '.port==$port and .port_listener_absent==true and .server_pid_alive==false and .sampler_pid_alive==false' "$logs/post-arm-isolation.json" >/dev/null 2>&1; then echo 'missing post-arm process/listener isolation receipt' >&2; failed=1; fi
  if ! jq -e --slurpfile manifest "$CASE_MANIFEST" '(. as $actual | $manifest[0].cases as $expected | type=="array" and ($actual|length)==($expected|length) and all(range(0; $expected|length); . as $index | $actual[$index].index == ($index+1) and $actual[$index].spec == $expected[$index].spec and $actual[$index].project == $expected[$index].project and $actual[$index].title == $expected[$index].title))' "$playwright/cases.json" >/dev/null 2>&1; then echo 'actual case selection is not manifest-bound' >&2; failed=1; fi
  for index in $(seq 1 "$expected"); do
    for path in "$playwright/case-$index/result.json" "$playwright/case-$index/summary.json" "$playwright/case-$index/case.json" "$logs/case-$index.log"; do [[ -s "$path" ]] || { echo "missing per-case JSON/log evidence: $index" >&2; failed=1; }; done
    if ! jq -e --argjson index "$index" --slurpfile manifest "$CASE_MANIFEST" --slurpfile aggregate "$playwright/cases.json" '. as $case | $manifest[0].cases[$index-1] as $expected | $aggregate[0][$index-1] as $actual | $case.index==$index and $case.spec==$expected.spec and $case.project==$expected.project and $case.title==$expected.title and $actual.index==$case.index and $actual.spec==$case.spec and $actual.project==$case.project and $actual.title==$case.title' "$playwright/case-$index/case.json" >/dev/null 2>&1; then echo "case binding failed: $index" >&2; failed=1; fi
    if ! jq -e '.expected_count==1 and .collected_count==1 and .executed_count==1 and .skipped_count==0 and ((.passed_count+.failed_count)==1)' "$playwright/case-$index/summary.json" >/dev/null 2>&1 || ! jq -e '(.stats.expected+.stats.unexpected+.stats.flaky+.stats.skipped)==1' "$playwright/case-$index/result.json" >/dev/null 2>&1; then echo "case count binding failed: $index" >&2; failed=1; fi
    trace="$(find "$playwright/case-$index/results" -type f -name '*.zip' -size +0c -print -quit 2>/dev/null)"
    trace_extract="$playwright/case-$index/trace-network.bin"
    trace_entries=''
    trace_extract_exit=0
    if [[ -n "$trace" ]] && unzip -t "$trace" >/dev/null 2>&1; then
      trace_entries="$(unzip -Z1 "$trace" 2>/dev/null | grep -E '(^|/)[0-9]+-trace\.network$')"
      : > "$trace_extract"
      if [[ -z "$trace_entries" ]]; then trace_extract_exit=1; else
        while IFS= read -r trace_entry; do unzip -p "$trace" "$trace_entry" >> "$trace_extract" || trace_extract_exit=1; done <<< "$trace_entries"
      fi
    else
      trace_extract_exit=1
    fi
    [[ "$trace_extract_exit" -eq 0 ]] && grep -aEq '/_next/image|RSC|_rsc' "$trace_extract" || { echo "missing usable network trace: $index" >&2; failed=1; }
    png="$(find "$playwright/case-$index/results" -type f -name '*.png' -size +7c -print -quit 2>/dev/null)"; [[ -n "$png" ]] && [[ "$(xxd -p -l 8 "$png")" == 89504e470d0a1a0a ]] || { echo "invalid PNG evidence: $index" >&2; failed=1; }
    webm="$(find "$playwright/case-$index/results" -type f -name '*.webm' -size +4c -print -quit 2>/dev/null)"; [[ -n "$webm" ]] && [[ "$(xxd -p -l 4 "$webm")" == 1a45dfa3 ]] || { echo "invalid WebM evidence: $index" >&2; failed=1; }
  done
  return "$failed"
}

if [[ "${1:-}" == --dry-run && "$#" -eq 1 ]]; then write_dry_run; exit 0; fi
if [[ "${1:-}" == --validate-result ]]; then
  result_path=''; expected_count=''; result_summary=''; shift
  while [[ "$#" -gt 0 ]]; do case "$1" in --result) result_path="${2:-}"; shift 2 ;; --expected-count) expected_count="${2:-}"; shift 2 ;; --summary) result_summary="${2:-}"; shift 2 ;; *) usage; exit 64 ;; esac; done
  [[ -n "$result_path" && "$expected_count" =~ ^[0-9]+$ && -n "$result_summary" ]] || { usage; exit 64; }
  validate_result_file "$result_path" "$expected_count" "$result_summary"; exit $?
fi
if [[ "${1:-}" == --validate-evidence ]]; then
  output=''; arm=''; port=''; shift
  while [[ "$#" -gt 0 ]]; do case "$1" in --output) output="${2:-}"; shift 2 ;; --arm) arm="${2:-}"; shift 2 ;; --port) port="${2:-}"; shift 2 ;; *) usage; exit 64 ;; esac; done
  [[ -n "$output" && ( "$arm" == A || "$arm" == B ) && "$port" =~ ^[0-9]+$ ]] || { usage; exit 64; }
  validate_evidence "$output" "$arm" "$port"; exit $?
fi

workspace=''; output=''; arm=''; port=''; build_identity_path=''; summary_fixture=''
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --workspace) workspace="${2:-}"; shift 2 ;;
    --output) output="${2:-}"; shift 2 ;;
    --arm) arm="${2:-}"; shift 2 ;;
    --port) port="${2:-}"; shift 2 ;;
    --build-identity) build_identity_path="${2:-}"; shift 2 ;;
    --summary-fixture) summary_fixture=valid; shift ;;
    --summary-fixture-invalid-jq) summary_fixture=invalid-jq; shift ;;
    --summary-fixture-jq-write-failure) summary_fixture=jq-write-failure; shift ;;
    *) usage; exit 64 ;;
  esac
done
[[ -n "$workspace" && -n "$output" && ( "$arm" == A || "$arm" == B ) && "$port" =~ ^[0-9]+$ ]] || { usage; exit 64; }
[[ -n "$summary_fixture" || ( -n "$build_identity_path" && -s "$build_identity_path" ) ]] || { echo 'build identity is required' >&2; exit 64; }
mkdir -p "$output/logs" "$output/playwright"
readonly logs_dir="$output/logs" playwright_dir="$output/playwright" expected_count="$(jq -er '.cases|length' "$CASE_MANIFEST")"
if [[ "$arm" == A ]]; then readonly server_host=localhost base_url="http://localhost:$port"; else readonly server_host=127.0.0.1 base_url="http://127.0.0.1:$port"; fi
readonly diagnostic_config_path="$workspace/$DIAGNOSTIC_CONFIG_NAME"
checkout_exit=1; config_exit=1; server_exit=1; selection_exit=1; execution_exit=1; evidence_exit=1; server_lifecycle_exit=1
case_index=0; server_pid=''; sampler_pid=''; build_identity_sha=''

cleanup() {
  if [[ -n "$sampler_pid" ]] && kill -0 "$sampler_pid" 2>/dev/null; then kill "$sampler_pid" 2>/dev/null || true; wait "$sampler_pid" 2>/dev/null || true; fi
  if [[ -n "$server_pid" ]] && kill -0 "$server_pid" 2>/dev/null; then kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; fi
}

write_summary() {
  local overall=0 results='[]'
  if test -s "$playwright_dir/cases.json" && jq -e 'type=="array"' "$playwright_dir/cases.json" >/dev/null 2>&1; then results="$(cat "$playwright_dir/cases.json")"; else evidence_exit=1; fi
  [[ "$checkout_exit" -eq 0 && "$config_exit" -eq 0 && "$server_exit" -eq 0 && "$selection_exit" -eq 0 && "$execution_exit" -eq 0 && "$evidence_exit" -eq 0 && "$server_lifecycle_exit" -eq 0 ]] || overall=1
  if ! jq -n --arg arm "$arm" --arg endpoint "$base_url" --arg server_host "$server_host" --arg immutable_sha "$IMMUTABLE_SHA" --arg build_identity_path "$build_identity_path" --arg build_identity_sha "$build_identity_sha" --argjson expected "$expected_count" --argjson selected "$case_index" --argjson overall "$overall" --argjson checkout "$checkout_exit" --argjson config "$config_exit" --argjson server "$server_exit" --argjson selection "$selection_exit" --argjson execution "$execution_exit" --argjson evidence "$evidence_exit" --argjson lifecycle "$server_lifecycle_exit" --slurpfile cases "$CASE_MANIFEST" --argjson results "$results" '{arm:$arm,endpoint:$endpoint,server_host:$server_host,immutable_sha:$immutable_sha,build_identity:{source_path:$build_identity_path,content_sha256:$build_identity_sha},expected_count:$expected,cases:$cases[0].cases,results:$results,counts:{selected:$selected,collected:([$results[]|(.result.collected_count//0)]|add//0),executed:([$results[]|(.result.executed_count//0)]|add//0),skipped:([$results[]|(.result.skipped_count//0)]|add//0),passed:([$results[]|(.result.passed_count//0)]|add//0),failed:([$results[]|(.result.failed_count//0)]|add//0)},exits:{checkout:$checkout,config:$config,server:$server,selection:$selection,execution:$execution,evidence:$evidence,server_lifecycle:$lifecycle,overall:$overall}}' > "$output/summary.json"; then
    return 1
  fi
  return "$overall"
}
trap cleanup EXIT
jq -n '[]' > "$playwright_dir/cases.json"
if [[ -n "$summary_fixture" ]]; then
  checkout_exit=0; config_exit=0; server_exit=0; selection_exit=0; execution_exit=0; evidence_exit=0; server_lifecycle_exit=0
  [[ "$summary_fixture" == invalid-jq ]] && printf 'not-json\n' > "$playwright_dir/cases.json"
  [[ "$summary_fixture" == jq-write-failure ]] && mkdir "$output/summary.json"
  write_summary
  exit $?
fi

actual_sha="$(git -C "$workspace" rev-parse HEAD 2>"$logs_dir/checkout.err" || true)"
printf 'expected=%s\nactual=%s\n' "$IMMUTABLE_SHA" "$actual_sha" > "$logs_dir/checkout.txt"
if [[ "$actual_sha" == "$IMMUTABLE_SHA" ]]; then checkout_exit=0; else write_summary; exit $?; fi
if cp "$DIAGNOSTIC_CONFIG_SOURCE" "$diagnostic_config_path" && cmp -s "$DIAGNOSTIC_CONFIG_SOURCE" "$diagnostic_config_path" && shasum -a 256 "$workspace/package.json" "$workspace/pnpm-lock.yaml" "$workspace/playwright.config.ts" "$CASE_MANIFEST" "$DIAGNOSTIC_CONFIG_SOURCE" "$diagnostic_config_path" > "$logs_dir/build-config.sha256"; then config_exit=0; fi
[[ "$config_exit" -eq 0 ]] || { write_summary; exit $?; }
cp "$build_identity_path" "$logs_dir/build-output-identity.receipt" && build_identity_sha="$(shasum -a 256 "$build_identity_path" | awk '{print $1}')" && printf '%s  build-output-receipt\n' "$build_identity_sha" > "$logs_dir/build-output-identity.sha256"
node -e "require('node:dns').lookup('$server_host',{all:true},(e,a)=>{if(e)throw e;process.stdout.write(JSON.stringify(a.map(({address})=>address))+'\\n')})" > "$logs_dir/resolved-addresses.json" 2>"$logs_dir/resolved-addresses.err" || true
{ printf 'arm=%s\nendpoint=%s\nserver_host=%s\n' "$arm" "$base_url" "$server_host"; node --version; pnpm --version; } > "$logs_dir/runtime.txt" 2>&1
(cd "$workspace" && exec env GAME_CATALOG_MODE=local CACHE_MODE=local NEXT_TELEMETRY_DISABLED=1 "$workspace/node_modules/.bin/next" start -H "$server_host" -p "$port") > "$logs_dir/server.stdout.log" 2>"$logs_dir/server.stderr.log" &
server_pid=$!
printf '%s\n' "$server_pid" > "$logs_dir/server.pid"
for _ in $(seq 1 30); do
  if curl --fail --silent --show-error --max-time 5 "$base_url/api/health" > "$logs_dir/health.json" 2>"$logs_dir/health.err"; then server_exit=0; break; fi
  sleep 1
done
lsof -nP -iTCP:"$port" -sTCP:LISTEN > "$logs_dir/server-listen.txt" 2>&1 || true
bind_verified=false
if [[ "$arm" == B ]]; then grep -Eq "127\\.0\\.0\\.1:$port.*LISTEN" "$logs_dir/server-listen.txt" && bind_verified=true; else grep -Eq ":$port.*LISTEN" "$logs_dir/server-listen.txt" && bind_verified=true; fi
jq -n --arg arm "$arm" --arg endpoint "$base_url" --arg server_host "$server_host" --argjson bind_verified "$bind_verified" --slurpfile resolved "$logs_dir/resolved-addresses.json" --rawfile listener "$logs_dir/server-listen.txt" '{arm:$arm,endpoint:$endpoint,server_host:$server_host,resolved_addresses:($resolved[0]//[]),listener:$listener,bind_verified:$bind_verified}' > "$logs_dir/listener-receipt.json" 2>"$logs_dir/listener-receipt.err" || true

sample_once() {
  local timestamp route
  timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  if kill -0 "$server_pid" 2>/dev/null; then ps -o pid=,rss=,command= -p "$server_pid" | sed "s/^/$timestamp\\t/" >> "$logs_dir/server-rss.tsv" || true; fi
  for route in /api/health /en /en/games /en/guides/google-snake-mods; do
    curl --silent --show-error --output /dev/null --connect-timeout 2 --max-time 5 --write-out "$timestamp\\t$route\\t%{http_code}\\t%{time_total}\\n" "$base_url$route" >> "$logs_dir/readiness-probes.tsv" 2>>"$logs_dir/readiness-probes.err" || true
  done
}
if [[ "$server_exit" -eq 0 ]]; then
  sample_once
  while kill -0 "$server_pid" 2>/dev/null; do sleep 1; sample_once; done &
  sampler_pid=$!
  printf '%s\n' "$sampler_pid" > "$logs_dir/sampler.pid"
  while IFS="$(printf '\t')" read -r spec project title; do
    case_index=$((case_index + 1))
    case_dir="$playwright_dir/case-$case_index"
    mkdir -p "$case_dir"
    case_exit=1
    if (cd "$workspace" && PLAYWRIGHT_BASE_URL="$base_url" PLAYWRIGHT_JSON_OUTPUT_FILE="$case_dir/result.json" DEBUG=pw:api,pw:webserver pnpm exec playwright test --config "$diagnostic_config_path" "$spec" --grep "$title$" --project="$project" --workers=1 --retries=0 --trace=on --reporter=line,json --output "$case_dir/results") > "$logs_dir/case-$case_index.log" 2>&1; then case_exit=0; fi
    if validate_result_file "$case_dir/result.json" 1 "$case_dir/summary.json"; then count_exit=0; else count_exit=$?; fi
    jq -n --argjson index "$case_index" --arg spec "$spec" --arg project "$project" --arg title "$title" --argjson command_exit "$case_exit" --argjson count_exit "$count_exit" --slurpfile result "$case_dir/summary.json" '{index:$index,spec:$spec,project:$project,title:$title,command_exit:$command_exit,count_exit:$count_exit,result:$result[0]}' > "$case_dir/case.json"
    jq -s '.[0]+[.[1]]' "$playwright_dir/cases.json" "$case_dir/case.json" > "$playwright_dir/cases.next.json" && mv "$playwright_dir/cases.next.json" "$playwright_dir/cases.json"
  done < <(jq -r '.cases[]|[.spec,.project,.title]|@tsv' "$CASE_MANIFEST")
  [[ "$case_index" -eq "$expected_count" ]] && selection_exit=0
  jq -e --argjson expected "$expected_count" 'length==$expected and all(.[];.command_exit==0 and .count_exit==0 and .result.status=="pass")' "$playwright_dir/cases.json" >/dev/null && execution_exit=0
fi
cleanup
lsof -nP -iTCP:"$port" -sTCP:LISTEN > "$logs_dir/post-arm-listen.txt" 2>&1
listen_exit=$?
server_alive=false; sampler_alive=false
[[ -n "$server_pid" ]] && kill -0 "$server_pid" 2>/dev/null && server_alive=true
[[ -n "$sampler_pid" ]] && kill -0 "$sampler_pid" 2>/dev/null && sampler_alive=true
jq -n --argjson port "$port" --arg server_pid "$server_pid" --arg sampler_pid "$sampler_pid" --argjson port_listener_absent "$([[ "$listen_exit" -ne 0 ]] && echo true || echo false)" --argjson server_pid_alive "$server_alive" --argjson sampler_pid_alive "$sampler_alive" '{port:$port,server_pid:$server_pid,sampler_pid:$sampler_pid,port_listener_absent:$port_listener_absent,server_pid_alive:$server_pid_alive,sampler_pid_alive:$sampler_pid_alive}' > "$logs_dir/post-arm-isolation.json"
if [[ "$listen_exit" -ne 0 && "$server_alive" == false && "$sampler_alive" == false ]]; then server_lifecycle_exit=0; fi
if validate_evidence "$output" "$arm" "$port"; then evidence_exit=0; fi
write_summary
exit $?
