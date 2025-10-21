#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST="$APP_DIR/dist"
APPIMAGE="$DIST/entraineur-rythme-electron-0.1.0.AppImage"
DESKTOP_SRC="$APP_DIR/entraineur-rythme.desktop"
ICON_SRC="$APP_DIR/build/icons/256x256.png"

echo "Installing Entraîneur de Rythme to user applications..."
mkdir -p "$HOME/.local/share/applications"
mkdir -p "$HOME/.local/share/icons/hicolor/256x256/apps"

cp "$DESKTOP_SRC" "$HOME/.local/share/applications/"
cp "$ICON_SRC" "$HOME/.local/share/icons/hicolor/256x256/apps/entraineur-rythme.png"
chmod +x "$APPIMAGE" || true

# Update desktop database (best effort, may print warnings)
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
  gtk-update-icon-cache -f "$HOME/.local/share/icons/hicolor" || true
fi
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$HOME/.local/share/applications" || true
fi

cat <<EOF
Done.
To run the app now:
  $APPIMAGE --no-sandbox

For a secure, production-ready install you should set the chrome-sandbox SUID bit in the unpacked bundle or inside the AppImage. If you are comfortable running sudo now, you can extract the AppImage and run these commands:

  mkdir -p /tmp/entra-extract && (cd /tmp/entra-extract && "$APPIMAGE" --appimage-extract)
  sudo chown root:root /tmp/entra-extract/squashfs-root/chrome-sandbox
  sudo chmod 4755 /tmp/entra-extract/squashfs-root/chrome-sandbox
  echo "Then run: /tmp/entra-extract/squashfs-root/AppRun"

Alternatively, set the SUID bit on the unpacked linux-unpacked build:

  sudo chown root:root "$DIST/linux-unpacked/chrome-sandbox"
  sudo chmod 4755 "$DIST/linux-unpacked/chrome-sandbox"

EOF
