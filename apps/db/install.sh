#!/bin/bash

# NBA CLI Installation Script

set -e

BINARY_NAME="nba-cli"
INSTALL_PATH="/usr/local/bin"
BUILD_PATH=".build/release"

echo "🏀 NBA CLI Installation Script"
echo "=============================="

# Check if Swift is installed
if ! command -v swift &> /dev/null; then
    echo "❌ Swift is not installed. Please install Swift from https://swift.org/download/"
    exit 1
fi

echo "✅ Swift found: $(swift --version | head -n 1)"

# Build the CLI
echo "🔨 Building $BINARY_NAME..."
swift build -c release

if [ ! -f "$BUILD_PATH/$BINARY_NAME" ]; then
    echo "❌ Build failed. Binary not found at $BUILD_PATH/$BINARY_NAME"
    exit 1
fi

echo "✅ Build successful!"

# Install the binary
echo "📦 Installing $BINARY_NAME to $INSTALL_PATH..."

# Create install directory if it doesn't exist
if [ ! -d "$INSTALL_PATH" ]; then
    echo "📁 Creating $INSTALL_PATH directory..."
    sudo mkdir -p "$INSTALL_PATH"
fi

# Copy and set permissions
sudo cp "$BUILD_PATH/$BINARY_NAME" "$INSTALL_PATH/$BINARY_NAME"
sudo chmod +x "$INSTALL_PATH/$BINARY_NAME"

echo "✅ $BINARY_NAME installed successfully!"
echo ""
echo "🎉 Installation complete!"
echo "   You can now run: $BINARY_NAME --help"
echo ""
echo "📖 Usage examples:"
echo "   $BINARY_NAME --help"
echo "   $BINARY_NAME populate <database> <username> <password>"
echo ""
echo "🗑️  To uninstall, run: sudo rm $INSTALL_PATH/$BINARY_NAME"