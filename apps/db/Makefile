# NBA CLI Makefile

BINARY_NAME=nba-cli
INSTALL_PATH=/usr/local/bin
BUILD_PATH=.build/release

.PHONY: build install uninstall clean test help

# Default target
help:
	@echo "NBA CLI Build and Installation"
	@echo ""
	@echo "Available targets:"
	@echo "  build     - Build the CLI in release mode"
	@echo "  install   - Install the CLI to $(INSTALL_PATH)"
	@echo "  uninstall - Remove the CLI from $(INSTALL_PATH)"
	@echo "  clean     - Clean build artifacts"
	@echo "  test      - Run tests"
	@echo "  help      - Show this help message"

# Build the CLI in release mode
build:
	@echo "Building $(BINARY_NAME)..."
	swift build -c release

# Install the CLI to the system PATH
install: build
	@echo "Installing $(BINARY_NAME) to $(INSTALL_PATH)..."
	@if [ ! -d "$(INSTALL_PATH)" ]; then \
		echo "Creating $(INSTALL_PATH) directory..."; \
		sudo mkdir -p $(INSTALL_PATH); \
	fi
	sudo cp $(BUILD_PATH)/$(BINARY_NAME) $(INSTALL_PATH)/$(BINARY_NAME)
	sudo chmod +x $(INSTALL_PATH)/$(BINARY_NAME)
	@echo "$(BINARY_NAME) installed successfully!"
	@echo "You can now run: $(BINARY_NAME) --help"

# Uninstall the CLI
uninstall:
	@echo "Uninstalling $(BINARY_NAME)..."
	@if [ -f "$(INSTALL_PATH)/$(BINARY_NAME)" ]; then \
		sudo rm $(INSTALL_PATH)/$(BINARY_NAME); \
		echo "$(BINARY_NAME) uninstalled successfully!"; \
	else \
		echo "$(BINARY_NAME) is not installed at $(INSTALL_PATH)"; \
	fi

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	swift package clean
	rm -rf .build

# Run tests
test:
	@echo "Running tests..."
	swift test

# Development build (debug mode)
dev-build:
	@echo "Building $(BINARY_NAME) in debug mode..."
	swift build