---
sidebar_position: 2
title: 2. Referensi Command Clarinet
description: Referensi lengkap semua command Clarinet untuk development workflow - project management, testing, deployment, dan debugging
keywords: [clarinet commands, cli reference, development commands, testing commands, deployment commands]
---

# Clarinet Commands Reference

Quick reference untuk semua Clarinet commands yang commonly used dalam development.

## Project Management

### Create New Project
```bash
# Create new Clarinet project
clarinet new my-project
cd my-project

# Project structure akan dibuat:
# ├── Clarinet.toml
# ├── contracts/
# ├── tests/ 
# ├── settings/
# └── deployments/
```

### Add New Contract
```bash
# Method 1: Create file manually
touch contracts/my-contract.clar

# Method 2: Using text editor
code contracts/my-contract.clar
# atau
nano contracts/my-contract.clar
```

**Important**: After creating contract file, add it to `Clarinet.toml`:

```toml
[contracts.my-contract]
path = "contracts/my-contract.clar" 
clarity_version = 2
epoch = 2.4
```

### Add New Test File
```bash
# Create test file
touch tests/my-contract.test.ts

# Open dalam editor
code tests/my-contract.test.ts
```

## Available Commands

First, let's check what commands are actually available:

```bash
# Check available commands
clarinet --help
```

### Syntax Checking
```bash
# Check all contracts
clarinet check

# Check specific contract (if supported)
clarinet check my-contract

# Verbose output (if supported)
clarinet check --verbose
```

### Testing (Command may vary by version)
```bash
# Check if test command exists
clarinet --help | grep test

# If test command doesn't exist, use alternative methods:
# 1. Use console for testing
clarinet console

# 2. Use external testing tools
# npm test (if configured)

# 3. Manual testing dalam console
```

### Interactive Console
```bash
# Start REPL
clarinet console

# Common console commands:
clarinet>> ::help                                    # Show help
clarinet>> ::deploy_contract name path               # Deploy contract
clarinet>> ::get_contracts                          # List contracts
clarinet>> ::get_accounts                           # List accounts
clarinet>> (contract-call? .contract function)      # Call function
clarinet>> ::quit                                   # Exit console
```

### Console Examples
```bash
# Start console dan deploy contract
clarinet console

# Deploy contract
clarinet>> ::deploy_contract hello-world contracts/hello-world.clar

# Call read-only function
clarinet>> (contract-call? .hello-world get-greeting)

# Call public function
clarinet>> (contract-call? .hello-world set-greeting "New message")

# Check STX balance
clarinet>> (stx-get-balance tx-sender)

# Switch accounts
clarinet>> ::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5

# Exit
clarinet>> ::quit
```

## Analysis Commands

### Cost Analysis
```bash
# Analyze function costs
clarinet costs analyze

# Specific function cost
clarinet costs my-contract::my-function
```

### Integration
```bash
# Integration tools
clarinet integrate

# Available integrations
clarinet integrate --help
```

## Deployment Commands

### Generate Deployment Plan
```bash
# Generate untuk testnet
clarinet deployment generate --testnet


# Custom output file
clarinet deployment generate --testnet --plan-path my-plan.yaml
```

### Apply Deployment
```bash
# Deploy ke testnet
clarinet deployment apply --testnet


# Deploy dengan specific plan
clarinet deployment apply --testnet --plan-path my-plan.yaml
```

### Check Deployment Status
```bash
# Check deployment status
clarinet deployment status --testnet
```

## Common Workflows

### 1. Create New Contract Workflow
```bash
# Step 1: Create project
clarinet new my-project
cd my-project

# Step 2: Create contract
touch contracts/my-contract.clar

# Step 3: Edit Clarinet.toml
echo '
[contracts.my-contract]
path = "contracts/my-contract.clar"
clarity_version = 2
epoch = 2.4' >> Clarinet.toml

# Step 4: Write contract code
code contracts/my-contract.clar

# Step 5: Check syntax
clarinet check

# Step 6: Create tests
touch tests/my-contract.test.ts
code tests/my-contract.test.ts

# Step 7: Run tests
clarinet test
```

### 2. Development Testing Workflow
```bash
# Development cycle
clarinet check                    # Check syntax
clarinet test                     # Run automated tests
clarinet console                  # Interactive testing
clarinet costs analyze            # Check gas costs
```

### 3. Deployment Workflow
```bash
# Pre-deployment
clarinet check                    # Final syntax check
clarinet test                     # Final test run

# Generate plan
clarinet deployment generate --testnet

# Review plan
cat deployments/default.testnet-plan.yaml

# Deploy
clarinet deployment apply --testnet

# Verify deployment
clarinet deployment status --testnet
```

## Troubleshooting

### Common Issues dan Solutions

#### Contract Not Found
```bash
# Error: Contract not found dalam Clarinet.toml
# Solution: Add contract configuration
[contracts.my-contract]
path = "contracts/my-contract.clar"
clarity_version = 2
epoch = 2.4
```

#### Syntax Errors
```bash
# Use verbose output untuk detailed errors
clarinet check --verbose

# Common syntax issues:
# - Missing parentheses
# - Incorrect function names
# - Wrong data types
# - Undefined variables
```

#### Test Failures
```bash
# Run tests dengan verbose output
clarinet test --verbose

# Check test file imports
# Verify account names dalam tests
# Ensure proper type conversions
```

#### Console Issues
```bash
# If console commands fail:
# 1. Check contract deployment
clarinet>> ::get_contracts

# 2. Verify account addresses
clarinet>> ::get_accounts

# 3. Check function signatures
clarinet>> ::describe my-contract
```

### Performance Tips

#### Faster Development
```bash
# Use watch mode untuk continuous testing
clarinet test --watch

# Check specific contracts only
clarinet check my-contract

# Use shortcuts dalam console
clarinet>> (contract-call? .c get-value)  # Short contract name
```

#### Efficient Testing
```bash
# Run specific test files
clarinet test tests/critical.test.ts

# Use console untuk quick function testing
clarinet console
clarinet>> (contract-call? .contract test-function u123)
```

## Environment Variables

### Useful Environment Variables
```bash
# Set default network
export STACKS_NETWORK=testnet

# Set API endpoint
export STACKS_API_URL=https://stacks-node-api.testnet.stacks.co

# Enable debug logging
export CLARINET_DEBUG=1

# Custom cache directory
export CLARINET_CACHE_DIR=~/.clarinet-custom
```

## Configuration Files

### Clarinet.toml Structure
```toml
[project]
name = "my-project"
description = "My Stacks project"
authors = ["Your Name <email@example.com>"]
telemetry = true
cache_dir = "./.clarinet"
requirements = []

[contracts.contract-name]
path = "contracts/contract-name.clar"
clarity_version = 2
epoch = 2.4

[repl]
costs_version = 2
parser_version = 2
```

### Network Settings (Devnet.toml)
```toml
[network]
name = "devnet"
deployment_fee_rate = 10

[[network.accounts]]
name = "deployer"
address = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
balance = 100000000000000
mnemonic = "twice kind fence tip hidden..."

[[network.accounts]]
name = "wallet_1"
address = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5"
balance = 100000000000000
mnemonic = "sell invite acquire kitten..."
```

## Version Information

```bash
# Check Clarinet version
clarinet --version

# Get help
clarinet --help

# Command-specific help
clarinet test --help
clarinet deployment --help
```

This reference guide provides all the essential Clarinet commands dengan correct syntax untuk efficient Stacks development workflow.