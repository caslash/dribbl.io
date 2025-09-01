# NBA CLI

A Swift command-line tool for managing NBA player data and database operations.

## Prerequisites

- Swift 5.9 or later
- macOS 10.15 or later
- PostgreSQL database access

## Installation

### Option 1: Using the install script (Recommended)

```bash
./install.sh
```

### Option 2: Using Make

```bash
make install
```

### Option 3: Manual installation

```bash
# Build the CLI
swift build -c release

# Copy to system PATH
sudo cp .build/release/nba-cli /usr/local/bin/nba-cli
sudo chmod +x /usr/local/bin/nba-cli
```

## Usage

Once installed, you can use the CLI from anywhere:

```bash
# Show help
nba-cli --help

# Populate database with NBA player data
nba-cli populate <database_name> <username> <password>
```

### Example

```bash
nba-cli populate nba_db postgres mypassword
```

## Development

### Building for development

```bash
# Debug build
swift build

# Release build
swift build -c release

# Or use Make
make dev-build
```

### Running tests

```bash
swift test
# Or
make test
```

### Cleaning build artifacts

```bash
swift package clean
# Or
make clean
```

## Uninstallation

### Using Make
```bash
make uninstall
```

### Manual uninstallation
```bash
sudo rm /usr/local/bin/nba-cli
```

## Architecture

The CLI is built using:
- **Swift ArgumentParser** for command-line interface
- **NBAKit** framework for NBA data processing
- **PostgresKit** for database operations
- **Swift Concurrency** for async operations

## Commands

### `populate`

Populates the database with NBA player data.

**Arguments:**
- `database` - Database name
- `username` - Database username  
- `password` - Database password

**Features:**
- Concurrent data processing
- Progress tracking
- Retry logic for failed requests
- Proxy pool for API requests