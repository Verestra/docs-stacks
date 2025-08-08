---
sidebar_position: 3
title: 3. Kompatibilitas Versi
description: Panduan kompatibilitas versi tools Stacks development - Clarinet, Stacks node, Clarity version, dan dependencies
keywords: [version compatibility, clarinet version, stacks version, clarity version, dependency management]
---

# Clarinet Version Compatibility Guide

Different versions of Clarinet have different available commands. This guide helps you work with any version.

## Check Your Clarinet Version

```bash
# Check version
clarinet --version

# Check available commands
clarinet --help
```

## Common Commands Across Versions

These commands should work dalam most Clarinet versions:

### ✅ Universal Commands
```bash
clarinet --help              # Show help
clarinet --version           # Show version
clarinet new <project>       # Create new project
clarinet check              # Check contract syntax
clarinet console            # Interactive REPL
```

### ⚠️ Version-Dependent Commands

#### Testing Commands
```bash
# May be available:
clarinet test               # Run tests (newer versions)

# Alternative if not available:
clarinet console            # Use console untuk interactive testing
```

#### Generation Commands
```bash
# May be available:
clarinet generate contract <name>    # Generate contract (some versions)
clarinet generate test <name>        # Generate test (some versions)

# Alternative (always works):
touch contracts/<name>.clar          # Create contract file
touch tests/<name>.test.ts           # Create test file
```

#### Deployment Commands
```bash
# May be available:
clarinet deployment generate --testnet
clarinet deployment apply --testnet

# Alternative check:
clarinet integrate --help    # See if deployment tools available
```

## Version-Agnostic Workflows

### Workflow 1: Basic Development
```bash
# Step 1: Create project (universal)
clarinet new my-project
cd my-project

# Step 2: Create contract (manual method)
touch contracts/my-contract.clar

# Step 3: Edit Clarinet.toml
echo '
[contracts.my-contract]
path = "contracts/my-contract.clar"
clarity_version = 2
epoch = 2.4' >> Clarinet.toml

# Step 4: Write contract code
code contracts/my-contract.clar

# Step 5: Check syntax (universal)
clarinet check

# Step 6: Test dengan console (universal)
clarinet console
```

### Workflow 2: Testing Strategy

#### If `clarinet test` Available:
```bash
# Check if test command exists
clarinet --help | grep test

# If available:
clarinet test
clarinet test --verbose
clarinet test tests/specific.test.ts
```

#### If `clarinet test` NOT Available:
```bash
# Use console untuk comprehensive testing
clarinet console

# Systematic testing dalam console:
clarinet>> ::deploy_contract my-contract contracts/my-contract.clar
clarinet>> (contract-call? .my-contract test-function u123)
clarinet>> (contract-call? .my-contract get-value)

# Document results manually dalam test-log.md
```

### Workflow 3: Deployment Strategy

#### If Deployment Commands Available:
```bash
# Modern deployment approach
clarinet deployment generate --testnet
clarinet deployment apply --testnet
```

#### If Deployment Commands NOT Available:
```bash
# Manual deployment approach
# 1. Use external tools
npm install @stacks/transactions @stacks/network

# 2. Create deployment script
node deploy-script.js

# 3. Use Stacks CLI (if available)
stx deploy_contract my-contract contracts/my-contract.clar
```

## Troubleshooting by Version

### Common Version Issues

#### Issue 1: Command Not Found
```bash
# Error: unrecognized subcommand 'test'
# Solution: Use console testing instead

clarinet console
# Test interactively
```

#### Issue 2: Different Syntax
```bash
# Some versions may use different syntax
# Check help untuk exact syntax:
clarinet <command> --help
```

#### Issue 3: Missing Features
```bash
# If feature missing dalam your version:
# 1. Check if alternative exists
clarinet --help

# 2. Use manual methods
# 3. Consider upgrading Clarinet
# Download latest binary from GitHub releases
wget https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz
```

## Universal Testing Template

Create `manual-testing.md` untuk consistent testing across versions:

```markdown
# Manual Testing Protocol

## Contract: my-contract

### Pre-Test Setup
- [ ] Contract syntax checked: `clarinet check`
- [ ] Console started: `clarinet console`
- [ ] Contract deployed: `::deploy_contract my-contract contracts/my-contract.clar`

### Test Cases

#### Test 1: Basic Function
- **Command**: `(contract-call? .my-contract basic-function u123)`
- **Expected**: `(ok u123)`
- **Actual**: 
- **Status**: ✅ Pass / ❌ Fail

#### Test 2: Error Handling
- **Command**: `(contract-call? .my-contract basic-function u0)`
- **Expected**: `(err u400)`
- **Actual**: 
- **Status**: ✅ Pass / ❌ Fail

#### Test 3: State Changes
- **Command**: `(contract-call? .my-contract set-value u456)`
- **Expected**: `(ok u456)`
- **Actual**: 
- **Status**: ✅ Pass / ❌ Fail

#### Test 4: Read State
- **Command**: `(contract-call? .my-contract get-value)`
- **Expected**: `u456`
- **Actual**: 
- **Status**: ✅ Pass / ❌ Fail
```

## Version Upgrade Guide

### Upgrade Clarinet
```bash
# Update to latest version via binary
wget https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz
tar -xzf clarinet-linux-x64.tar.gz
sudo mv clarinet /usr/local/bin/

# Verify new version
clarinet --version

# Check new commands
clarinet --help
```

### Migration Checklist
When upgrading Clarinet versions:

- [ ] Backup existing projects
- [ ] Test basic commands (`clarinet check`)
- [ ] Verify console functionality (`clarinet console`)
- [ ] Check if new testing features available
- [ ] Update documentation untuk new commands
- [ ] Test deployment commands (if applicable)

## Alternative Tools

If Clarinet limitations become blocking:

### External Testing Tools
```bash
# Deno-based testing
deno test tests/

# Node.js-based testing  
npm test

# Custom testing scripts
node test-runner.js
```

### Deployment Alternatives
```bash
# Stacks CLI
npm install -g @stacks/cli
stx deploy_contract

# Direct API calls
curl -X POST "https://stacks-node-api.testnet.stacks.co/v2/transactions"

# Custom deployment scripts
node deploy.js
```

## Best Practices Across Versions

### 1. Always Check Available Commands
```bash
# Before following any tutorial:
clarinet --help
clarinet <command> --help
```

### 2. Use Universal Commands First
```bash
# Stick to commands available dalam most versions:
clarinet new
clarinet check  
clarinet console
```

### 3. Document Your Version
```bash
# In your project README:
echo "# Clarinet Version Used" >> README.md
echo "$(clarinet --version)" >> README.md
echo "$(clarinet --help)" >> README.md
```

### 4. Fallback Strategies
Always have fallback methods:
- Console testing instead of automated tests
- Manual file creation instead of generate commands  
- External tools untuk deployment
- Manual verification instead of automated checks

## Workshop Compatibility

Untuk workshop participants dengan different Clarinet versions:

### Pre-Workshop Check
```bash
# Participants run this before workshop:
echo "Clarinet Version Check" > version-check.txt
clarinet --version >> version-check.txt
clarinet --help >> version-check.txt
```

### Universal Workshop Commands
Focus on commands that work across versions:
```bash
clarinet new workshop-project     # Universal
clarinet check                   # Universal  
clarinet console                 # Universal
touch contracts/game.clar        # Universal
code contracts/game.clar         # Universal (if VS Code installed)
```

### Backup Plans
- Screen sharing untuk participants dengan issues
- Pre-prepared project templates
- Alternative testing approaches
- Manual deployment guides

This approach ensures workshop success regardless of Clarinet version differences.