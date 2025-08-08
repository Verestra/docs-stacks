---
sidebar_position: 8
title: 8. Setup Clarinet
description: Instalasi dan konfigurasi Clarinet development environment untuk membangun, test, dan deploy smart contracts Stacks di berbagai platform
keywords: [clarinet, development environment, smart contract development, testing, deployment, cross-platform]
---

# Setup Environment Development dengan Clarinet

Clarinet adalah local development environment yang powerful dan developer-friendly untuk building dan testing Clarity smart contracts. Tutorial ini akan memandu Anda through complete setup process dan first project creation.

## Step 1: Instalasi Prerequisites

### System Requirements

```
Supported Operating Systems:
├── macOS: 10.15+ (Catalina atau newer)
├── Linux: Ubuntu 18.04+, CentOS 7+, Debian 10+
├── Windows: Windows 10+ (dengan WSL2 recommended)
└── Memory: Minimum 4GB RAM, 8GB+ recommended
```


### Install Node.js (Optional tapi Recommended)

Untuk frontend development dan testing:

```bash
# Using Node Version Manager (nvm) - recommended
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then install latest LTS Node.js
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

## Step 2: Install Clarinet

### Method 1: Download Binary (Recommended)

#### **Windows:**
```powershell
# Download latest Windows release
Invoke-WebRequest -Uri "https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-windows-x64.zip" -OutFile "clarinet.zip"
Expand-Archive -Path "clarinet.zip" -DestinationPath "C:\Tools\clarinet"
# Add C:\Tools\clarinet to your PATH environment variable
# Or copy clarinet.exe to a directory already in PATH

# Verify installation
clarinet --version
```

#### **macOS:**
```bash
# macOS (Intel)
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-macos-x64.tar.gz -o clarinet.tar.gz
tar -xzf clarinet.tar.gz
sudo mv clarinet /usr/local/bin/

# macOS (Apple Silicon/M1/M2)
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-macos-arm64.tar.gz -o clarinet.tar.gz
tar -xzf clarinet.tar.gz
sudo mv clarinet /usr/local/bin/

# Verify installation
clarinet --version
```

#### **Linux:**
```bash
# Ubuntu/Debian/CentOS
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz -o clarinet.tar.gz
tar -xzf clarinet.tar.gz
sudo mv clarinet /usr/local/bin/

# Alternative: Install to user directory (no sudo required)
mkdir -p ~/.local/bin
mv clarinet ~/.local/bin/
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
clarinet --version
```

### Method 2: Using Package Managers

#### **Windows:**
```powershell
# Using Chocolatey (if installed)
choco install clarinet

# Using Winget (Windows 10+)
winget install clarinet

# Using Scoop (if installed)
scoop install clarinet
```

#### **macOS:**
```bash
# Using Homebrew (recommended)
brew install clarinet

# Using MacPorts
sudo port install clarinet
```

#### **Linux:**
```bash
# Ubuntu/Debian via apt (if available)
sudo apt update
sudo apt install clarinet

# Arch Linux via AUR
yay -S clarinet

# Fedora/RHEL via dnf (if available)
sudo dnf install clarinet

# Universal: Using Homebrew on Linux
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install clarinet
```

## Step 3: Install VS Code Extension

Untuk development experience yang optimal:

1. **Install VS Code**: Download dari https://code.visualstudio.com/
2. **Install Clarity Extension**:
   - Open VS Code
   - Go ke Extensions (Ctrl+Shift+X atau Cmd+Shift+X)
   - Search "Clarity"
   - Install "Clarity" extension by Hiro Systems

### Extension Features
```
Clarity VS Code Extension provides:
├── Syntax Highlighting: Color coding untuk Clarity code
├── IntelliSense: Auto-completion dan suggestions
├── Error Detection: Real-time error highlighting
├── Code Formatting: Auto-format Clarity code
├── Snippets: Pre-built code templates
└── Debugging: Integration dengan Clarinet debugger
```

## Step 4: Verify Installation

Mari test semua installations:

```bash
# All Platforms - Check installations

# Check Clarinet
clarinet --version

# Check VS Code (optional)
code --version

# Check Node.js (jika installed)
node --version

# Test Clarinet commands
clarinet help
```

### **Platform-Specific Verification:**

#### **Windows (PowerShell):**
```powershell
# Check PATH contains Clarinet
where.exe clarinet

# Test VS Code integration
code --list-extensions | Select-String "clarity"
```

#### **macOS/Linux (Terminal):**
```bash
# Check PATH contains Clarinet
which clarinet

# Test VS Code integration
code --list-extensions | grep clarity
```

Expected help output:
```
clarinet 2.4.0
Clarinet is a clarity runtime packaged as a command line tool, designed to facilitate smart contract understanding, development, testing and deployment.

USAGE:
    clarinet <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    new             Create a new project
    generate        Generate files
    check           Check contracts syntax
    test            Execute test suite
    console         Load contracts in a REPL for interactive testing
    integrate       Integrate with external services
    deployment      Manage contracts deployments on Testnet
    help            Print this message or the help of the given subcommand(s)
```

## Step 5: Create First Project

Mari create project baru untuk test setup:

```bash
# Create project directory
mkdir stacks-projects
cd stacks-projects

# Create new Clarinet project
clarinet new hello-stacks
cd hello-stacks

# Explore project structure
ls -la
```

Expected project structure:
```
hello-stacks/
├── Clarinet.toml          # Project configuration
├── contracts/             # Smart contracts directory
├── tests/                # Test files directory
├── settings/             # Network settings
│   ├── Devnet.toml       # Local development settings
│   ├── Testnet.toml      # Testnet settings
└── deployments/          # Deployment configurations
```

### Understand Project Configuration

```toml
# Clarinet.toml - Project configuration
[project]
name = "hello-stacks"
description = "A simple Clarity project"
authors = ["Your Name <your.email@example.com>"]
telemetry = true
cache_dir = "./.clarinet"
requirements = []

[contracts.hello-world]
path = "contracts/hello-world.clar"
clarity_version = 2
epoch = 2.4

[repl]
costs_version = 2
parser_version = 2
```

After creating the contract file, you need to add it to the `Clarinet.toml` configuration. Edit `Clarinet.toml` and add the contract section:

```bash
# Open Clarinet.toml in editor
code Clarinet.toml  # or nano Clarinet.toml
```

## Step 6: Create First Contract

Mari create simple contract untuk test:

```bash
# Create contract file manually
touch contracts/hello-world.clar
```

Edit file `contracts/hello-world.clar` dengan VS Code atau text editor:

```lisp
;; hello-world.clar
;; Simple Hello World contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-already-exists (err u101))

;; Data variables
(define-data-var greeting (string-ascii 50) "Hello, World!")

;; Data maps
(define-map user-greetings principal (string-ascii 100))

;; Read-only functions
(define-read-only (get-greeting)
  (var-get greeting)
)

(define-read-only (get-user-greeting (user principal))
  (default-to "No greeting set" (map-get? user-greetings user))
)

;; Public functions
(define-public (set-greeting (new-greeting (string-ascii 50)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set greeting new-greeting)
    (ok new-greeting)
  )
)

(define-public (set-user-greeting (user-greeting (string-ascii 100)))
  (begin
    (map-set user-greetings tx-sender user-greeting)
    (ok user-greeting)
  )
)

;; Get contract info
(define-read-only (get-contract-info)
  (ok {
    owner: contract-owner,
    greeting: (var-get greeting),
    your-greeting: (get-user-greeting tx-sender)
  })
)
```

## Step 7: Check Available Commands & Syntax

First, let's see what commands are available dalam your Clarinet version:

```bash
# Check available commands
clarinet --help
```

Expected output will show available subcommands. Common commands include:
- `new` - Create new project
- `check` - Check contract syntax  
- `console` - Interactive REPL
- `devnet` - Local development network
- `integrate` - Integration tools

```bash
# Check contract syntax
clarinet check

# Expected output jika successful:
# ✓ hello-world syntax ok
```

Jika ada errors, fix them sebelum continue:

```bash
# Example error output:
# ✗ hello-world:3:10: use of unresolved type 'string-ascii-50'

# Common fixes:
# - Check typos dalam function names
# - Verify correct syntax untuk data types
# - Ensure proper parentheses balancing
```

## Step 8: Testing Approach

Since testing commands may vary by Clarinet version, we'll use the console for interactive testing first. 

### Method 1: Interactive Console Testing

```bash
# Start interactive console
clarinet console
```

In the console, test your contract interactively:

```bash
# Deploy contract dalam console
clarinet>> ::deploy_contract hello-world contracts/hello-world.clar

# Test read-only function
clarinet>> (contract-call? .hello-world get-greeting)
# Expected: "Hello, World!"

# Test public function (owner only)
clarinet>> (contract-call? .hello-world set-greeting "Hello, Stacks!")
# Expected: (ok "Hello, Stacks!")

# Verify change
clarinet>> (contract-call? .hello-world get-greeting)
# Expected: "Hello, Stacks!"

# Test user greeting
clarinet>> (contract-call? .hello-world set-user-greeting "My personal greeting")
# Expected: (ok "My personal greeting")

# Check contract info
clarinet>> (contract-call? .hello-world get-contract-info)

# Exit console
clarinet>> ::quit
```

### Method 2: External Testing (if test command not available)

If your Clarinet version doesn't have built-in test command, create test file manually:

```typescript
Clarinet.test({
    name: "Get default greeting",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let result = chain.callReadOnlyFn(
            'hello-world',
            'get-greeting',
            [],
            deployer.address
        );
        
        assertEquals(result.result, '"Hello, World!"');
    },
});

Clarinet.test({
    name: "Owner can set greeting",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'hello-world',
                'set-greeting',
                [types.ascii("Hello, Stacks!")],
                deployer.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok "Hello, Stacks!")');
        
        // Verify greeting was updated
        let result = chain.callReadOnlyFn(
            'hello-world',
            'get-greeting',
            [],
            deployer.address
        );
        
        assertEquals(result.result, '"Hello, Stacks!"');
    },
});

Clarinet.test({
    name: "Non-owner cannot set greeting",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'hello-world',
                'set-greeting',
                [types.ascii("Hacked!")],
                wallet1.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(err u100)');
    },
});

Clarinet.test({
    name: "Users can set personal greetings",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'hello-world',
                'set-user-greeting',
                [types.ascii("Hello from Wallet 1!")],
                wallet1.address
            ),
            Tx.contractCall(
                'hello-world',
                'set-user-greeting',
                [types.ascii("Greetings from Wallet 2!")],
                wallet2.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok "Hello from Wallet 1!")');
        assertEquals(block.receipts[1].result, '(ok "Greetings from Wallet 2!")');
        
        // Verify individual greetings
        let result1 = chain.callReadOnlyFn(
            'hello-world',
            'get-user-greeting',
            [types.principal(wallet1.address)],
            wallet1.address
        );
        
        let result2 = chain.callReadOnlyFn(
            'hello-world',
            'get-user-greeting',
            [types.principal(wallet2.address)],
            wallet2.address
        );
        
        assertEquals(result1.result, '"Hello from Wallet 1!"');
        assertEquals(result2.result, '"Greetings from Wallet 2!"');
    },
});
```

## Step 9: Alternative Testing Methods

Since your Clarinet version may not have the `test` command, here are alternative approaches:

### Option A: Console Testing (Recommended)
```bash
# Use interactive console untuk comprehensive testing
clarinet console

# Test all functions systematically:
clarinet>> ::deploy_contract hello-world contracts/hello-world.clar
clarinet>> (contract-call? .hello-world get-greeting)
clarinet>> (contract-call? .hello-world set-greeting "Test message")
clarinet>> (contract-call? .hello-world get-contract-info)
```

### Option B: Create Manual Test Script
Create `test-script.md` to document your testing:

```markdown
# Manual Testing Checklist

## Test 1: Default Greeting
- Command: `(contract-call? .hello-world get-greeting)`
- Expected: `"Hello, World!"`
- Result: ✅ Pass

## Test 2: Set Greeting (Owner)  
- Command: `(contract-call? .hello-world set-greeting "New message")`
- Expected: `(ok "New message")`
- Result: ✅ Pass

## Test 3: Verify Greeting Updated
- Command: `(contract-call? .hello-world get-greeting)`
- Expected: `"New message"`
- Result: ✅ Pass
```

## Step 10: Interactive Console Testing

Clarinet provides REPL untuk interactive testing:

```bash
# Start interactive console
clarinet console

# In the console, you can:
# 1. Deploy contracts
clarinet>> ::deploy_contract hello-world contracts/hello-world.clar

# 2. Call contract functions
clarinet>> (contract-call? .hello-world get-greeting)

# 3. Set variables
clarinet>> (contract-call? .hello-world set-user-greeting "Hello from console!")

# 4. Check balances
clarinet>> (stx-get-balance tx-sender)

# 5. Exit console
clarinet>> ::quit
```

## Step 11: Advanced Configuration

### Configure Development Settings

Edit `settings/Devnet.toml`:

```toml
[network]
name = "devnet"
deployment_fee_rate = 10

[[network.accounts]]
name = "deployer"
address = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
balance = 100000000000000
mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw"

[[network.accounts]]
name = "wallet_1"
address = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5"
balance = 100000000000000
mnemonic = "sell invite acquire kitten bamboo drastic jelly vivid peace spawn twice guilt pave pen trash pretty park cube fragile unaware remain midnight betray rebuild"

# Add more accounts as needed
[[network.accounts]]
name = "wallet_2"
address = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
balance = 100000000000000
mnemonic = "hold excess usual excess ring elephant install account glad dry fragile donkey gaze humble truck breeze nation gasp vacuum limb head keep delay hospital"
```

### Setup VS Code Workspace

Create `.vscode/settings.json`:

```json
{
    "files.associations": {
        "*.clar": "lisp"
    },
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
    "clarity.lspLocation": "clarinet-lsp"
}
```

Create `.vscode/extensions.json`:

```json
{
    "recommendations": [
        "hirosystems.clarity-lsp",
        "ms-vscode.vscode-typescript-next"
    ]
}
```

## Step 12: Git Setup

```bash
# Initialize git repository
git init

# Create .gitignore
cat > .gitignore << EOF
# Clarinet
.clarinet/
settings/dev-accounts.json

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Environment variables
.env
.env.local
EOF

# Initial commit
git add .
git commit -m "Initial Clarinet project setup"
```

## Step 13: Common Commands Reference

```bash
# Project Management
clarinet new <project-name>           # Create new project
touch contracts/<name>.clar           # Create new contract file
touch tests/<name>.test.ts            # Create new test file

# Development
clarinet check                        # Check all contracts syntax
clarinet check <contract-name>        # Check specific contract
clarinet test                         # Run all tests
clarinet test <test-file>            # Run specific test
clarinet console                      # Interactive REPL

# Analysis
clarinet costs <function-name>        # Analyze function costs  
clarinet integrate                   # Integration tools

# Deployment (akan dibahas dalam section deployment)
clarinet deployment generate         # Generate deployment plan
clarinet deployment apply           # Deploy contracts
```

## Troubleshooting Common Issues

### **1. Installation Issues**

#### **Windows:**
```powershell
# Clarinet not found in PATH
$env:PATH += ";C:\Tools\clarinet"
# Or permanently add via System Properties > Environment Variables

# PowerShell execution policy issues
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Permission issues
# Run PowerShell as Administrator if needed
```

#### **macOS:**
```bash
# PATH issues
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Permission denied
sudo chmod +x /usr/local/bin/clarinet

# Apple Silicon compatibility
# Ensure you downloaded arm64 version for M1/M2 Macs

# Gatekeeper issues (untuk downloaded binaries)
sudo spctl --add /usr/local/bin/clarinet
```

#### **Linux:**
```bash
# PATH issues
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Permission denied
sudo chmod +x /usr/local/bin/clarinet

# Library dependencies (Ubuntu/Debian)
sudo apt update
sudo apt install libc6-dev

# SELinux issues (CentOS/RHEL)
sudo setsebool -P use_nfs_home_dirs 1
```

### **2. Contract Syntax Errors (All Platforms)**

```bash
# Common syntax fixes:
# 1. Missing parentheses - check balance
# 2. Incorrect data types - verify type names
# 3. Undefined variables - check variable names
# 4. Wrong function signatures - verify parameters

# Debug with verbose output
clarinet check --verbose
```

### **3. Test Failures (All Platforms)**

```bash
# Check test imports
# Verify account names dalam test
# Ensure proper type conversions
# Use console untuk debug contract calls

clarinet console
# Test functions interactively
```

### **4. VS Code Extension Issues**

#### **All Platforms:**
```bash
# Restart VS Code Language Server
# Cmd/Ctrl + Shift + P → "Developer: Reload Window"

# Verify extension installation
code --list-extensions | grep clarity

# Check .vscode/settings.json configuration
# Ensure Clarity extension is enabled
```

#### **Platform-Specific Solutions:**

**Windows:**
- Check Windows Defender isn't blocking VS Code extensions
- Run VS Code as Administrator if extension won't install

**macOS:**
- Check Gatekeeper settings for VS Code
- Ensure VS Code has proper permissions

**Linux:**
- Check snap/flatpak VS Code versions have extension access
- Consider using native .deb/.rpm package for better integration

## Next Steps

Dengan development environment yang sudah setup, Anda siap untuk:

1. **Build complex contracts** - Smart contracts yang lebih sophisticated
2. **Learn testing patterns** - Advanced testing strategies
3. **Deploy contracts** - Deploy ke testnet
4. **Build frontend** - Integrate contracts dengan web applications
5. **Explore DeFi** - Build financial applications

Sekarang mari create project Tic Tac Toe yang lebih complex untuk practice skills Anda!

---

**Selanjutnya**: Sebelum mulai coding, mari pelajari dasar-dasar bahasa pemrograman Clarity.

👉 **[Lanjut ke Dasar-dasar Clarity →](./clarity-basics.md)**