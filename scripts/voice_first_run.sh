#!/usr/bin/env bash
# Install the local voice adapters for the existing aLandi gateway.
# Intended for the documented Ubuntu 24.04 x86_64 VPS. Run as root.
set -Eeuo pipefail
umask 077

ENV_FILE="/etc/alandi-gateway.env"
SERVICE="alandi-gateway"
SERVICE_USER="alandi"
VENV_PY="/opt/alandi/venv/bin/python"
SOURCE_ROOT="/opt/alandi/src"
WHISPER_DIR="${SOURCE_ROOT}/whisper.cpp"
WHISPER_MODEL_DIR="/var/lib/alandi-models/whisper"
PIPER_MODEL_DIR="/var/lib/alandi-models/piper"
WHISPER_TAG="v1.9.5"
WHISPER_MODEL_URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin"
WHISPER_MODEL_SHA256="1be3a9b2063867b937e64e2ec7483364a79917e157fa98c5d94b5c1fffea987b"
WHISPER_MODEL="${WHISPER_MODEL_DIR}/ggml-small.bin"
BACKUP_FILE="${ENV_FILE}.backup-$(date +%Y%m%d-%H%M%S)"

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
info() { printf '\n==> %s\n' "$*"; }

[[ $EUID -eq 0 ]] || die "Run with sudo: sudo bash scripts/voice_first_run.sh"
[[ -f "$ENV_FILE" ]] || die "Missing $ENV_FILE. Complete the base gateway setup first."
[[ -x "$VENV_PY" ]] || die "Missing $VENV_PY. Update VENV_PY in this script only if the deployed service uses a different virtualenv."
id "$SERVICE_USER" >/dev/null 2>&1 || die "Missing service user '$SERVICE_USER'. Check the installed systemd unit."
systemctl cat "$SERVICE" >/dev/null 2>&1 || die "Missing systemd service '$SERVICE'. Complete the base gateway setup first."
[[ "$(uname -m)" == "x86_64" ]] || die "This installer is currently pinned to x86_64; inspect upstream/build instructions for this architecture."
grep -qE '^VERSION_ID="24\.04"$' /etc/os-release || die "This installer is documented for Ubuntu 24.04. Do not run blindly on another OS."
df -Pk /var/lib | awk 'NR==2 { if ($4 < 2500000) exit 1 }' || die "At least ~2.5 GB free on /var/lib is required for the ASR model/build; free space and retry."

VOICE_ID="${1:-}"
if [[ -z "$VOICE_ID" ]]; then
  printf 'Enter the exact Piper voice ID from the official catalogue (e.g. a reviewed ru_RU voice): '
  read -r VOICE_ID
fi
[[ "$VOICE_ID" =~ ^[A-Za-z0-9._-]+$ ]] || die "Unsafe voice ID."
printf '\nBefore continuing, review this voice\'s MODEL_CARD/license at the official Piper voice repository.\n'
printf 'Voice selected: %s\nContinue only if the voice license is acceptable for your intended use. [y/N] ' "$VOICE_ID"
read -r LICENSE_OK
[[ "$LICENSE_OK" == "y" || "$LICENSE_OK" == "Y" ]] || die "Stopped before downloading the voice."

info "Backup gateway environment"
cp -a "$ENV_FILE" "$BACKUP_FILE"
chmod 600 "$BACKUP_FILE"
printf 'Backup saved at %s\n' "$BACKUP_FILE"

info "Install system dependencies"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends build-essential cmake git curl ca-certificates ffmpeg
command -v ffmpeg >/dev/null || die "ffmpeg installation failed."
command -v ffprobe >/dev/null || die "ffprobe installation failed."

info "Build official whisper.cpp $WHISPER_TAG"
install -d -o "$SERVICE_USER" -g "$SERVICE_USER" "$SOURCE_ROOT" "$WHISPER_MODEL_DIR" "$PIPER_MODEL_DIR"
if [[ -d "$WHISPER_DIR/.git" ]]; then
  git -C "$WHISPER_DIR" fetch --tags --force
else
  git clone https://github.com/ggml-org/whisper.cpp.git "$WHISPER_DIR"
fi
git -C "$WHISPER_DIR" checkout --detach "$WHISPER_TAG"
cmake -S "$WHISPER_DIR" -B "$WHISPER_DIR/build" -DCMAKE_BUILD_TYPE=Release
cmake --build "$WHISPER_DIR/build" --config Release -j2
WHISPER_CLI="$(find "$WHISPER_DIR/build" -type f -name whisper-cli -perm -111 -print -quit)"
[[ -n "$WHISPER_CLI" ]] || die "whisper-cli binary not found after build."
install -m 0755 "$WHISPER_CLI" /usr/local/bin/whisper-cli
/usr/local/bin/whisper-cli --help >/dev/null 2>&1 || die "whisper-cli smoke check failed."

info "Download and verify the multilingual ASR model"
if [[ ! -f "$WHISPER_MODEL" ]] || ! echo "$WHISPER_MODEL_SHA256  $WHISPER_MODEL" | sha256sum -c - >/dev/null 2>&1; then
  curl --fail --location --retry 3 "$WHISPER_MODEL_URL" -o "$WHISPER_MODEL"
fi
echo "$WHISPER_MODEL_SHA256  $WHISPER_MODEL" | sha256sum -c - || die "ASR model checksum mismatch."
chown "$SERVICE_USER:$SERVICE_USER" "$WHISPER_MODEL"
chmod 0640 "$WHISPER_MODEL"

info "Install Piper in the gateway virtualenv and download the selected voice"
runuser -u "$SERVICE_USER" -- "$VENV_PY" -m pip install 'piper-tts==1.8.0'
runuser -u "$SERVICE_USER" -- "$VENV_PY" -m piper.download_voices "$VOICE_ID" --data-dir "$PIPER_MODEL_DIR"
[[ -s "${PIPER_MODEL_DIR}/${VOICE_ID}.onnx" ]] || die "Piper model file is missing."
[[ -s "${PIPER_MODEL_DIR}/${VOICE_ID}.onnx.json" ]] || die "Piper model config is missing."
chown -R "$SERVICE_USER:$SERVICE_USER" "$PIPER_MODEL_DIR"
find "$PIPER_MODEL_DIR" -type d -exec chmod 0750 {} +
find "$PIPER_MODEL_DIR" -type f -exec chmod 0640 {} +

info "Record local artifact hashes (review and retain with your license inventory)"
{
  printf 'generated_utc=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf 'whisper_cpp_tag=%s\n' "$WHISPER_TAG"
  printf 'whisper_model_url=%s\n' "$WHISPER_MODEL_URL"
  printf 'whisper_model_sha256=%s\n' "$WHISPER_MODEL_SHA256"
  printf 'piper_package=piper-tts==1.8.0\n'
  printf 'piper_voice_id=%s\n' "$VOICE_ID"
  sha256sum "${PIPER_MODEL_DIR}/${VOICE_ID}.onnx" "${PIPER_MODEL_DIR}/${VOICE_ID}.onnx.json"
  printf 'NOTE=voice license was operator-reviewed; hashes record downloaded artifacts but do not independently authenticate upstream publisher\n'
} > /var/lib/alandi-models/VOICE_ARTIFACTS.txt
chmod 0640 /var/lib/alandi-models/VOICE_ARTIFACTS.txt
chown root:"$SERVICE_USER" /var/lib/alandi-models/VOICE_ARTIFACTS.txt

info "Enable voice capabilities in the existing environment"
set_env() {
  local key="$1" value="$2" tmp
  tmp="$(mktemp)"
  if grep -q "^\${key}=" "$ENV_FILE"; then
    awk -v key="$key" -v value="$value" 'BEGIN { FS=OFS="=" } $1 == key { $0=key "=" value; found=1 } { print } END { if (!found) print key "=" value }' "$ENV_FILE" > "$tmp"
  else
    cat "$ENV_FILE" > "$tmp"
    printf '%s=%s\n' "$key" "$value" >> "$tmp"
  fi
  cat "$tmp" > "$ENV_FILE"
  rm -f "$tmp"
}
set_env ALANDI_AUDIO_TRANSCRIPTION_ENABLED true
set_env ALANDI_AUDIO_TRANSCRIPTION_BINARY /usr/local/bin/whisper-cli
set_env ALANDI_AUDIO_TRANSCRIPTION_MODEL "$WHISPER_MODEL"
set_env ALANDI_AUDIO_TRANSCRIPTION_FFPROBE_BINARY /usr/bin/ffprobe
set_env ALANDI_AUDIO_TRANSCRIPTION_FFMPEG_BINARY /usr/bin/ffmpeg
set_env ALANDI_AUDIO_SPEECH_ENABLED true
set_env ALANDI_AUDIO_SPEECH_BINARY "$VENV_PY"
set_env ALANDI_AUDIO_SPEECH_MODEL "$VOICE_ID"
set_env ALANDI_AUDIO_SPEECH_VOICES "${VOICE_ID}=Default"
set_env ALANDI_AUDIO_SPEECH_DATA_DIR "$PIPER_MODEL_DIR"
chmod 600 "$ENV_FILE"

info "Restart gateway and check service"
if ! systemctl restart "$SERVICE"; then
  cp -a "$BACKUP_FILE" "$ENV_FILE"
  systemctl restart "$SERVICE" || true
  die "Gateway restart failed; previous environment restored. Inspect journalctl -u $SERVICE."
fi
systemctl is-active --quiet "$SERVICE" || {
  cp -a "$BACKUP_FILE" "$ENV_FILE"
  systemctl restart "$SERVICE" || true
  die "Gateway is not active; previous environment restored. Inspect journalctl -u $SERVICE."
}

info "Verify health and authenticated voice capabilities"
API_KEY="$(sed -n 's/^ALANDI_API_KEY=//p' "$ENV_FILE" | tail -n1)"
[[ "$API_KEY" =~ ^[A-Fa-f0-9]{64}$ ]] || die "ALANDI_API_KEY must be a plain 64-character hex value for this check; verify the env format manually."
HEALTH_CODE="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' http://127.0.0.1:8000/healthz)"
[[ "$HEALTH_CODE" == "200" ]] || die "/healthz returned HTTP $HEALTH_CODE."
CAPS_FILE="$(mktemp)"
trap 'rm -f "$CAPS_FILE"' EXIT
CAPS_CODE="$(curl --silent --show-error --output "$CAPS_FILE" --write-out '%{http_code}' \
  -H "Authorization: Bearer $API_KEY" http://127.0.0.1:8000/v1/capabilities)"
if [[ "$CAPS_CODE" != "200" ]]; then
  rm -f "$CAPS_FILE"
  cp -a "$BACKUP_FILE" "$ENV_FILE"
  systemctl restart "$SERVICE" || true
  die "Authenticated /v1/capabilities returned HTTP $CAPS_CODE; previous environment restored."
fi
"$VENV_PY" - "$CAPS_FILE" "$VOICE_ID" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as f:
    payload = json.load(f)
audio = payload.get("audio", {})
voice_ids = {v.get("id") for v in audio.get("speech_voices", []) if isinstance(v, dict)}
if audio.get("transcription") is not True:
    raise SystemExit("FAIL: transcription capability is not true")
if audio.get("speech") is not True:
    raise SystemExit("FAIL: speech capability is not true")
if sys.argv[2] not in voice_ids:
    raise SystemExit("FAIL: selected Piper voice is not listed in capabilities")
print("PASS: authenticated capabilities report ASR, TTS, and selected voice.")
PY
rm -f "$CAPS_FILE"
unset API_KEY

info "Voice setup finished"
printf 'Next: open the published HTTPS site on your phone and complete docs/VOICE_FIRST_RUN_RU.md §5 (real microphone → editable transcript → explicit send → audible TTS → Stop).\n'
printf 'This script does not prove recognition quality, mobile playback, low latency, or realtime VAD/AEC/barge-in.\n'
