#!/usr/bin/env bash
# Read-only hardware/runtime inventory for aLandi. Does not print service env or API keys.
set -u

section() { printf '\n\n===== %s =====\n' "$1"; }
run_if_available() {
  local command_name="$1"; shift
  if command -v "$command_name" >/dev/null 2>&1; then
    "$@" 2>&1 || printf '[command exited non-zero: %s]\n' "$command_name"
  else
    printf '[not installed: %s]\n' "$command_name"
  fi
}

printf 'aLandi model runtime diagnostic (read-only)\n'
printf 'UTC timestamp: '; date -u +%Y-%m-%dT%H:%M:%SZ
printf 'This report intentionally excludes environment variables, .env files, API keys and request logs.\n'

section "OS / kernel / architecture"
uname -a
if [[ -r /etc/os-release ]]; then
  sed -n -e 's/^PRETTY_NAME=/PRETTY_NAME=/p' -e 's/^VERSION_ID=/VERSION_ID=/p' /etc/os-release
fi

section "CPU"
run_if_available lscpu lscpu

section "Memory / swap / disk"
run_if_available free free -h
run_if_available swapon swapon --show
run_if_available df df -h / /var/lib

section "GPU inventory"
run_if_available lspci sh -c "lspci -nn 2>/dev/null | grep -Ei 'vga|3d controller|display controller|processing accelerators' || true"
run_if_available nvidia-smi nvidia-smi
run_if_available rocminfo sh -c "rocminfo 2>/dev/null | grep -E 'Name:|Marketing Name:|Uuid:' | head -n 60 || true"
run_if_available vulkaninfo sh -c "vulkaninfo --summary 2>/dev/null | head -n 100 || true"

section "Ollama runtime"
run_if_available ollama ollama --version
run_if_available ollama ollama list
run_if_available ollama ollama ps
if command -v systemctl >/dev/null 2>&1; then
  systemctl show ollama.service -p ActiveState -p SubState -p MainPID --no-pager 2>&1 || true
else
  printf '[systemctl unavailable]\n'
fi

section "Gateway runtime (no environment values)"
if command -v systemctl >/dev/null 2>&1; then
  systemctl show alandi-gateway.service -p ActiveState -p SubState -p MainPID --no-pager 2>&1 || true
else
  printf '[systemctl unavailable]\n'
fi

section "How to interpret"
cat <<'EOF'
1. The ollama ps command is the authoritative quick check for whether a loaded model is CPU, GPU, or mixed placement.
2. A GPU listed by lspci is not proof that the Ollama service can access it; driver/runtime permissions must also work.
3. No GPU hardware means there is no GPU-only inference path to enable on this host. Use compact quantized models and bounded concurrency.
4. Do not attach this report to a public issue without reviewing device identifiers and host details.
EOF
