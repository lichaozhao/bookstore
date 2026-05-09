#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_PID=""
FRONTEND_PID=""
E2E_LOG_FILE="${E2E_LOG_FILE:-$ROOT_DIR/logs/e2e-test.log}"

if [[ "${E2E_LOG_ACTIVE:-0}" != "1" ]]; then
	mkdir -p "$(dirname "$E2E_LOG_FILE")"
	: > "$E2E_LOG_FILE"
	export E2E_LOG_ACTIVE=1
	exec > >(tee -a "$E2E_LOG_FILE") 2>&1
	echo "E2E test started at $(date -Iseconds)"
	echo "Writing E2E log to $E2E_LOG_FILE"
fi

stop_process_tree() {
	local pid="$1"
	local child_pid

	if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
		while read -r child_pid; do
			stop_process_tree "$child_pid"
		done < <(pgrep -P "$pid" 2>/dev/null || true)

		kill "$pid" 2>/dev/null || true
	fi
}

finish() {
	local status="$?"

	stop_process_tree "$FRONTEND_PID"
	stop_process_tree "$BACKEND_PID"
	echo "E2E test finished with exit code $status at $(date -Iseconds)"
	exit "$status"
}

wait_for_url() {
	local url="$1"
	local timeout_ms="${WAIT_TIMEOUT_MS:-60000}"

	node -e '
const url = process.argv[1];
const timeoutMs = Number(process.argv[2]);
const startedAt = Date.now();

async function waitForUrl() {
	while (Date.now() - startedAt < timeoutMs) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				process.exit(0);
			}
		} catch (error) {
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	console.error(`Timed out waiting for ${url}`);
	process.exit(1);
}

waitForUrl();
' "$url" "$timeout_ms"
}

trap finish EXIT

if [[ "${E2E_USE_EXTERNAL_SERVICES:-0}" != "1" ]]; then
	export TEST_MODE="${TEST_MODE:-1}"
	(
		cd "$ROOT_DIR"
		npm run start:backend
	) &
	BACKEND_PID=$!

	(
		cd "$ROOT_DIR/frontend"
		npm run dev -- --host 0.0.0.0 --port "${FRONTEND_PORT:-5173}" --strictPort
	) &
	FRONTEND_PID=$!
fi

wait_for_url "${BACKEND_HEALTH_URL:-http://localhost:4000/api/books}"
wait_for_url "${PLAYWRIGHT_BASE_URL:-http://localhost:5173}"

cd "$ROOT_DIR/frontend"
npx playwright test
