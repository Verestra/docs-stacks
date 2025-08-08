---
sidebar_position: 2
title: 2. Panduan Deployment
description: Panduan lengkap deployment smart contracts dari local development ke testnet Stacks - testing, deployment strategies, dan monitoring
keywords: [deployment, testnet deployment, production deployment, smart contract deployment, devops, monitoring]
---

# Deployment Guide: Local Development to Testnet

Panduan lengkap untuk deploy smart contracts dari local development environment ke testnet Stacks. Tutorial ini covers semua steps dari local testing sampai testnet deployment dan monitoring.

## Overview Deployment Process

```
Workshop Deployment Lifecycle:
├── 🧪 Local Development: Clarinet console testing
├── 🔧 Testnet Deployment: Public testing environment  
├── ✅ Testnet Validation: Comprehensive testing
├── 📊 Monitoring: Basic health checks
└── 🎓 Workshop Complete: Take-home projects ready
```

## Prerequisites

### 1. Required Tools

```bash
# Workshop setup checklist:
- [ ] Clarinet installed dan working
- [ ] VS Code dengan Clarity extension
- [ ] Leather wallet setup
- [ ] Testnet STX dalam wallet
- [ ] Project created dengan clarinet new
```

### 2. Project Structure

Ensure your project has proper structure:

```
your-project/
├── Clarinet.toml          # Project configuration
├── contracts/             # Smart contracts directory
│   └── your-contract.clar # Main contract
├── tests/                # Test files directory
├── settings/             # Network settings
│   ├── Devnet.toml       # Local development settings
│   └── Testnet.toml      # Testnet settings
└── deployments/          # Deployment configurations
```

## Local Development & Testing

### Step 1: Interactive Console Testing

```bash
# Start local development environment
clarinet console

# Deploy contract locally
clarinet>> ::deploy_contract your-contract contracts/your-contract.clar

# Test read-only functions
clarinet>> (contract-call? .your-contract get-some-data)

# Test public functions
clarinet>> (contract-call? .your-contract some-public-function u123)

# Test dengan different accounts
clarinet>> ::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
clarinet>> (contract-call? .your-contract some-function)

# Check balances
clarinet>> (stx-get-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

# Exit console
clarinet>> ::quit
```

### Step 2: Contract Validation

```bash
# Check contract syntax
clarinet check

# Expected output:
# ✓ your-contract syntax ok

# If errors, fix them before continuing
```

### Step 3: Local Testing Checklist

```bash
# Manual testing checklist:
- [ ] Contract deploys successfully
- [ ] Read-only functions return expected values
- [ ] Public functions work correctly
- [ ] Error conditions handled properly
- [ ] Access controls working (owner-only functions)
- [ ] Edge cases tested
```

## Testnet Deployment

### Step 1: Wallet Setup

Ensure you have testnet STX:

```bash
# Check your wallet balance di Leather wallet
# Ensure you have at least 1 STX untuk deployment fees

# Faucet links untuk testnet STX:
# - https://explorer.stacks.co/sandbox/faucet
# - Join Stacks Discord untuk faucet access
```

### Step 2: Testnet Configuration

Edit `settings/Testnet.toml` if needed:

```toml
[network]
name = "testnet"
node_rpc_address = "https://stacks-node-api.testnet.stacks.co"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "your testnet mnemonic phrase here"
balance = 100000000000000
derivation = "m/44'/5757'/0'/0/0"
```

### Step 3: Generate Deployment Plan

```bash
# Generate deployment plan untuk testnet
clarinet deployment generate --testnet

# Review the deployment plan
cat deployments/default.testnet-plan.yaml

# Check estimated costs:
# - Contract deployment: ~0.05 STX
# - Network fees: Variable
# - Total recommended: 0.1-0.2 STX minimum
```

### Step 4: Deploy to Testnet

```bash
# Deploy ke testnet
clarinet deployment apply --testnet

# Expected output:
# ✓ Contract deployed successfully
# Contract ID: ST...your-address.your-contract
# Transaction ID: 0x...

# Save deployment information
echo "$(date): Contract deployed to testnet" >> deployment-log.txt
echo "Contract Address: ST...your-address.your-contract" >> deployment-log.txt
```

### Step 5: Verify Testnet Deployment

```bash
# Check contract on testnet explorer
# Visit: https://explorer.stacks.co/?chain=testnet
# Search untuk: ST...your-address.your-contract

# Test contract functions on testnet
curl -X POST "https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/ST...your-address/your-contract/get-some-data" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "arguments": []
  }'
```

## Testnet Integration Testing

### Step 1: Basic Functionality Test

```bash
# Test basic functions via API
node -e "
const fetch = require('node-fetch');

async function testContract() {
  const response = await fetch('https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/YOUR_ADDRESS/your-contract/get-some-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      arguments: []
    })
  });
  
  const result = await response.json();
  console.log('Contract response:', result);
}

testContract();
"
```

### Step 2: Integration dengan Frontend (Optional)

```javascript
// Basic frontend integration test
import { StacksTestnet } from '@stacks/network';
import { callReadOnlyFunction } from '@stacks/transactions';

const network = new StacksTestnet();

const contractAddress = 'ST...your-address';
const contractName = 'your-contract';
const functionName = 'get-some-data';

// Call read-only function
callReadOnlyFunction({
  contractAddress,
  contractName,
  functionName,
  functionArgs: [],
  network,
  senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
})
.then(result => {
  console.log('Contract call result:', result);
})
.catch(error => {
  console.error('Contract call error:', error);
});
```

## Workshop Project Completion

### Workshop Deployment Checklist

```bash
# ✅ Workshop Testing Checklist
# [ ] Local development setup working
# [ ] Contract deployed locally via console
# [ ] Core functions tested interactively
# [ ] Testnet deployment successful
# [ ] Basic functionality verified on testnet
# [ ] Project documented
# [ ] Code ready untuk take-home development
```

### Workshop Security Basics

```bash
# Basic Security Checklist untuk Workshop:
# [ ] No private keys committed to code
# [ ] Input validation implemented
# [ ] Access controls basic (owner-only functions)
# [ ] Error handling untuk edge cases
# [ ] Only testnet addresses used
# [ ] Test data only (no real funds)
```

### Workshop Completion Steps

#### Step 1: Document Your Project

Create `README.md` for your project:

```markdown
# My Stacks Workshop Project

## Project Description
- **Type**: [Tic Tac Toe Game / Token System / NFT Collection / DAO]
- **Workshop Date**: [Date]
- **Status**: Working prototype

## Features Implemented
- [ ] Core contract functions
- [ ] Local testing completed
- [ ] Testnet deployment
- [ ] Basic error handling

## How to Run
1. `clarinet console`
2. `::deploy_contract [contract-name] contracts/[file].clar`
3. Test functions interactively

## Testnet Deployment
- **Contract Address**: [Your testnet address]
- **Explorer Link**: [Testnet explorer link]

## Next Steps
- [ ] Add more features
- [ ] Improve error handling
- [ ] Add frontend interface
- [ ] Learn advanced Clarity concepts
```

#### Step 2: Code Cleanup

```bash
# Clean up your code
# Remove any hardcoded test values
# Add comments untuk important functions
# Organize code structure
# Remove debug code

# Example cleanup:
# Before:
(define-constant test-value u123456) ;; Remove this

# After:
;; Add proper comments
(define-constant default-bet-amount u1000000) ;; 1 STX default bet
```

#### Step 3: Prepare for Take-Home Development

```bash
# Create development plan
echo "## Development Roadmap

### Phase 1: Core Features (Completed in Workshop)
- [x] Basic contract structure
- [x] Core functions implemented
- [x] Local testing
- [x] Testnet deployment

### Phase 2: Enhancements (Post-Workshop)
- [ ] Add more sophisticated error handling
- [ ] Implement additional features
- [ ] Add comprehensive tests
- [ ] Create frontend interface

### Phase 3: Advanced Features (Future)
- [ ] Add advanced game mechanics (for games)
- [ ] Implement governance features (for DAOs)  
- [ ] Add marketplace functionality (for NFTs)
- [ ] Create mobile-friendly interface

### Learning Resources
- Stacks Documentation: https://docs.stacks.co/
- Clarity Language Reference: https://docs.stacks.co/clarity/
- Stacks Discord Community: https://discord.gg/stacks
" > DEVELOPMENT_PLAN.md
```

## Troubleshooting Workshop Deployments

### Common Issues & Solutions

```bash
# Issue 1: Contract deployment fails
# Solution: Check testnet STX balance
# Visit: https://explorer.stacks.co/?chain=testnet
# Search your address untuk balance

# Issue 2: Transaction stuck in mempool
# Solution: Wait 10-15 minutes, or increase fee
clarinet deployment apply --testnet --fee-rate=20

# Issue 3: Contract function errors
# Solution: Test locally first
clarinet console
# Debug the function interactively

# Issue 4: Wallet connection issues
# Solution: Ensure Leather wallet is on testnet mode
# Check network setting dalam wallet

# Issue 5: API call errors
# Solution: Verify contract address dan function names
curl -s "https://stacks-node-api.testnet.stacks.co/v2/contracts/interface/YOUR_ADDRESS/your-contract"
```

### Debug Deployment

```bash
# Check deployment status
clarinet deployment apply --testnet --dry-run

# Verify account nonce
curl -s "https://stacks-node-api.testnet.stacks.co/extended/v1/address/YOUR_ADDRESS/nonces"

# Check recent transactions
curl -s "https://stacks-node-api.testnet.stacks.co/extended/v1/address/YOUR_ADDRESS/transactions"
```

## Next Steps After Workshop

### Immediate Actions (Week 1)
- [ ] Complete documentation
- [ ] Share project dengan community
- [ ] Join Stacks Discord untuk support
- [ ] Plan next features untuk implementation

### Short-term Goals (Month 1)  
- [ ] Add frontend interface
- [ ] Implement additional contract features
- [ ] Learn advanced Clarity concepts
- [ ] Connect dengan other developers

### Long-term Goals (3+ Months)
- [ ] Build production-ready application
- [ ] Learn about Stacks ecosystem tools
- [ ] Contribute to open source projects  
- [ ] Consider hackathon participation

---

**Congratulations! 🎉** 

You have successfully:
- ✅ Built your first Stacks smart contract
- ✅ Deployed to testnet
- ✅ Learned Clarity programming fundamentals
- ✅ Gained hands-on blockchain development experience

**Keep building and welcome to the Stacks developer community!**