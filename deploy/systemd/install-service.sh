#!/usr/bin/env bash
# =============================================================================
#  install-service.sh
#  Install and activate the Portfolio Auto-Update systemd service or timer
#
#  Usage:
#    sudo ./deploy/systemd/install-service.sh --daemon  # (Recommended) 24/7 background service
#    sudo ./deploy/systemd/install-service.sh --timer   # 3 times a day systemd timer
# =============================================================================

set -Eeuo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Error: Please run as root (sudo ./deploy/systemd/install-service.sh)" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

CURRENT_USER="${SUDO_USER:-$(id -un 2>/dev/null || echo "root")}"
CURRENT_GROUP="$(id -gn "$CURRENT_USER" 2>/dev/null || echo "$CURRENT_USER")"

MODE="${1:---daemon}"

echo "Installing Portfolio Auto-Update Service..."
echo "  Repository: $REPO_ROOT"
echo "  Run as User: $CURRENT_USER:$CURRENT_GROUP"

# Ensure script is executable and repository permissions are clean
chmod +x "$REPO_ROOT/scripts/auto-update.sh"
chown -R "$CURRENT_USER":"$CURRENT_GROUP" "$REPO_ROOT" 2>/dev/null || true
chmod -R u+rwX "$REPO_ROOT/.git" 2>/dev/null || true
mkdir -p "$REPO_ROOT/logs" 2>/dev/null || true
chmod -R 775 "$REPO_ROOT/logs" 2>/dev/null || true

case "$MODE" in
  --daemon)
    TARGET_FILE="/etc/systemd/system/portfolio-autoupdate.service"
    sed \
      -e "s|^User=.*|User=$CURRENT_USER|g" \
      -e "s|^Group=.*|Group=$CURRENT_GROUP|g" \
      -e "s|^WorkingDirectory=.*|WorkingDirectory=$REPO_ROOT|g" \
      -e "s|^ExecStart=[^ ]*scripts/auto-update.sh|ExecStart=$REPO_ROOT/scripts/auto-update.sh|g" \
      "$SCRIPT_DIR/portfolio-autoupdate.service" > "$TARGET_FILE"

    systemctl daemon-reload
    systemctl enable portfolio-autoupdate.service
    systemctl restart portfolio-autoupdate.service

    echo "✓ 24/7 Daemon service installed and active!"
    echo "  Status check:  sudo systemctl status portfolio-autoupdate.service"
    echo "  Live logs:     sudo journalctl -u portfolio-autoupdate.service -f"
    ;;

  --timer)
    # Stop daemon if running to avoid overlap
    systemctl stop portfolio-autoupdate.service 2>/dev/null || true
    systemctl disable portfolio-autoupdate.service 2>/dev/null || true

    SERVICE_FILE="/etc/systemd/system/portfolio-autoupdate-oneshot.service"
    TIMER_FILE="/etc/systemd/system/portfolio-autoupdate.timer"

    sed \
      -e "s|^User=.*|User=$CURRENT_USER|g" \
      -e "s|^Group=.*|Group=$CURRENT_GROUP|g" \
      -e "s|^WorkingDirectory=.*|WorkingDirectory=$REPO_ROOT|g" \
      -e "s|^ExecStart=[^ ]*scripts/auto-update.sh|ExecStart=$REPO_ROOT/scripts/auto-update.sh|g" \
      "$SCRIPT_DIR/portfolio-autoupdate-oneshot.service" > "$SERVICE_FILE"

    cp "$SCRIPT_DIR/portfolio-autoupdate.timer" "$TIMER_FILE"

    systemctl daemon-reload
    systemctl enable portfolio-autoupdate.timer
    systemctl restart portfolio-autoupdate.timer

    echo "✓ 3-times-a-day systemd timer installed and active!"
    echo "  Timer check:   sudo systemctl list-timers | grep portfolio"
    echo "  Status check:  sudo systemctl status portfolio-autoupdate.timer"
    echo "  Live logs:     sudo journalctl -u portfolio-autoupdate-oneshot.service -f"
    ;;

  *)
    echo "Usage: sudo $0 [--daemon | --timer]"
    exit 1
    ;;
esac
