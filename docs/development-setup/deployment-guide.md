# Deployment Guide: Testnet & Mainnet

Panduan lengkap untuk deploy smart contracts dari development environment ke testnet dan mainnet Stacks. Tutorial ini covers semua steps dari preparation sampai production monitoring.

## Overview Deployment Process

```
Deployment Lifecycle:
├── 🧪 Local Development: Clarinet console testing
├── 🔧 Testnet Deployment: Public testing environment  
├── ✅ Testnet Validation: Comprehensive testing
├── 🚀 Mainnet Deployment: Production deployment
├── 📊 Monitoring: Health checks dan analytics
└── 🔄 Updates: Version management dan upgrades
```

## Prerequisites

### 1. Required Tools

```bash
# Verify installations
clarinet --version        # Should be 2.4.0+
node --version           # Should be 18.0.0+
npm --version           # Should be 8.0.0+

# Install additional tools
npm install -g @stacks/cli
npm install -g @stacks/transactions
```

### 2. Network Accounts Setup

#### Testnet Account
```bash
# Generate new account atau use existing
stx make_keychain -t

# Output example:
# {
#   "mnemonic": "abandon abandon abandon...",
#   "keyInfo": {
#     "privateKey": "edf9aee84d9b7abc145504dde6726c64f369d37ee34ded868fabd876c26570bc01",
#     "address": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
#     "btcAddress": "mqVnk6NPRdhntvfM4hh9vvjiRkFDUuSYsH",
#     "index": 0
#   }
# }
```

#### Mainnet Account
```bash
# Generate mainnet account
stx make_keychain

# SECURITY WARNING: Store private key securely!
# Never commit private keys to version control
# Use hardware wallets untuk large deployments
```

### 3. Get Testnet STX

```bash
# Method 1: Faucet Website
# Visit: https://explorer.stacks.co/sandbox/faucet
# Enter your testnet address
# Request STX (usually 500-1000 STX per request)

# Method 2: CLI Faucet (jika available)
stx faucet ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# Verify balance
stx balance ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM -t
```

## Testnet Deployment

### Step 1: Prepare Project

```bash
# Navigate ke project directory
cd ~/stacks-projects/tic-tac-toe-game

# Ensure contracts are tested
clarinet test

# Check contract syntax
clarinet check

# Verify all tests pass
clarinet test --verbose
```

### Step 2: Configure Testnet Settings

Edit `settings/Testnet.toml`:

```toml
[network]
name = "testnet"
node_rpc_address = "https://stacks-node-api.testnet.stacks.co"
deployment_fee_rate = 10
chain_id = 2147483648

[accounts.deployer]
mnemonic = "your testnet mnemonic phrase here"
balance = 100000000000000 # 100,000 STX
derivation = "m/44'/5757'/0'/0/0"

# Additional accounts untuk testing
[accounts.alice]
mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
balance = 100000000000000
derivation = "m/44'/5757'/0'/0/1"

[accounts.bob]  
mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
balance = 100000000000000
derivation = "m/44'/5757'/0'/0/2"
```

### Step 3: Generate Deployment Plan

```bash
# Generate deployment plan untuk testnet
clarinet deployment generate --testnet

# Review generated plan
cat deployments/default.testnet-plan.yaml
```

Expected plan structure:
```yaml
---
id: 0
name: Default deployment plan for testnet
network: testnet
stacks-node: "https://stacks-node-api.testnet.stacks.co"
bitcoin-node: "https://blockstream.info/testnet/api"
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: tic-tac-toe
            expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 46400
            path: contracts/tic-tac-toe.clar
```

### Step 4: Execute Testnet Deployment

```bash
# Deploy ke testnet
clarinet deployment apply --testnet

# Monitor deployment progress
# Output will show transaction IDs dan status
```

Expected output:
```
✓ Applying deployment plan
✓ Contract tic-tac-toe will be published by ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
✓ Transaction 0x8f4e... broadcasted successfully
✓ Deployment successful
Contract address: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tic-tac-toe
Explorer: https://explorer.stacks.co/txid/0x8f4e...?chain=testnet
```

### Step 5: Verify Testnet Deployment

```bash
# Check contract status
curl -s "https://stacks-node-api.testnet.stacks.co/v2/contracts/interface/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/tic-tac-toe" \
  | jq '.abi.functions[] | select(.name == "create-game")'

# Test contract interaction
curl -X POST "https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/tic-tac-toe/get-latest-game-id" \
  -H "Content-Type: application/json" \
  -d '{"sender":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM","arguments":[]}'
```

## Environment Configuration

### Environment Variables Setup

Create `.env` file:

```bash
# Network Configuration
STACKS_NETWORK=testnet
STACKS_API_URL=https://stacks-node-api.testnet.stacks.co

# Contract Information
CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
CONTRACT_NAME=tic-tac-toe

# Deployment Keys (NEVER commit to git)
TESTNET_PRIVATE_KEY=your_testnet_private_key_here
MAINNET_PRIVATE_KEY=your_mainnet_private_key_here

# API Keys
HIRO_API_KEY=your_hiro_api_key_here
```

Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### Multi-Environment Configuration

Create `config/networks.js`:

```javascript
const networks = {
  testnet: {
    coreApiUrl: 'https://stacks-node-api.testnet.stacks.co',
    broadcastEndpoint: '/v2/transactions',
    transferFee: 180,
    deployFee: 46400,
    chainId: 2147483648,
    magic: 'id'
  },
  mainnet: {
    coreApiUrl: 'https://stacks-node-api.mainnet.stacks.co',
    broadcastEndpoint: '/v2/transactions',
    transferFee: 180,
    deployFee: 46400,
    chainId: 1,
    magic: 'main'
  },
  devnet: {
    coreApiUrl: 'http://localhost:3999',
    broadcastEndpoint: '/v2/transactions',
    transferFee: 180,
    deployFee: 46400,
    chainId: 2147483648,
    magic: 'id'
  }
};

module.exports = networks;
```

## Comprehensive Testing on Testnet

### Automated Testing Script

Create `scripts/testnet-integration.js`:

```javascript
const { StacksTestnet } = require('@stacks/network');
const { 
  makeContractCall, 
  broadcastTransaction,
  callReadOnlyFunction 
} = require('@stacks/transactions');

const network = new StacksTestnet();
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractName = process.env.CONTRACT_NAME;
const senderKey = process.env.TESTNET_PRIVATE_KEY;

async function runIntegrationTests() {
  console.log('🚀 Starting testnet integration tests...');
  
  try {
    // Test 1: Check contract is deployed
    console.log('📋 Test 1: Verifying contract deployment...');
    const contractInfo = await fetch(
      `${network.coreApiUrl}/v2/contracts/interface/${contractAddress}/${contractName}`
    );
    
    if (contractInfo.ok) {
      console.log('✅ Contract successfully deployed');
    } else {
      throw new Error('Contract not found on testnet');
    }
    
    // Test 2: Read-only function call
    console.log('📋 Test 2: Testing read-only functions...');
    const latestGameId = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName: 'get-latest-game-id',
      functionArgs: [],
      senderAddress: contractAddress
    });
    
    console.log('✅ Latest game ID:', latestGameId);
    
    // Test 3: Create game transaction
    console.log('📋 Test 3: Creating test game...');
    const createGameTx = await makeContractCall({
      network,
      contractAddress,
      contractName,
      functionName: 'create-game',
      functionArgs: [
        uintCV(1000000), // 1 STX bet
        uintCV(4),       // center position
        uintCV(1)        // X move
      ],
      senderKey,
      validateWithAbi: true
    });
    
    const txResult = await broadcastTransaction(createGameTx, network);
    console.log('✅ Game creation tx:', txResult.txid);
    
    // Wait untuk confirmation
    await waitForTransactionConfirmation(txResult.txid);
    
    console.log('🎉 All integration tests passed!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    process.exit(1);
  }
}

async function waitForTransactionConfirmation(txId, maxWait = 300000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    try {
      const response = await fetch(
        `${network.coreApiUrl}/extended/v1/tx/${txId}`
      );
      
      const txData = await response.json();
      
      if (txData.tx_status === 'success') {
        console.log('✅ Transaction confirmed');
        return txData;
      } else if (txData.tx_status === 'abort_by_response' || txData.tx_status === 'abort_by_post_condition') {
        throw new Error(`Transaction failed: ${txData.tx_status}`);
      }
      
      // Wait 10 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 10000));
      
    } catch (error) {
      console.log('⏳ Waiting untuk transaction confirmation...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  throw new Error('Transaction confirmation timeout');
}

// Run tests
runIntegrationTests();
```

### Run Integration Tests

```bash
# Set environment variables
export CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
export CONTRACT_NAME=tic-tac-toe
export TESTNET_PRIVATE_KEY=your_private_key_here

# Install dependencies
npm install @stacks/network @stacks/transactions

# Run integration tests
node scripts/testnet-integration.js
```

## Mainnet Deployment

### Pre-Deployment Checklist

```bash
# ✅ Comprehensive Testing Checklist
# [ ] All unit tests pass
# [ ] Integration tests pass on testnet
# [ ] Security audit completed
# [ ] Gas costs optimized
# [ ] Error handling tested
# [ ] Edge cases covered
# [ ] Documentation updated
# [ ] Frontend tested with testnet
# [ ] User acceptance testing completed
# [ ] Backup dan recovery plan ready
```

### Security Considerations

```bash
# Security Audit Checklist:
# [ ] No private key exposure
# [ ] Input validation comprehensive
# [ ] Access controls implemented
# [ ] Reentrancy protection
# [ ] Integer overflow protection
# [ ] Economic attack vectors analyzed
# [ ] Contract upgrade strategy
# [ ] Emergency pause mechanism
```

### Step 1: Mainnet Environment Setup

Edit `settings/Mainnet.toml`:

```toml
[network]
name = "mainnet"
node_rpc_address = "https://stacks-node-api.mainnet.stacks.co"
deployment_fee_rate = 10
chain_id = 1

[accounts.deployer]
mnemonic = "your SECURE mainnet mnemonic phrase here"
balance = 100000000000000 # Ensure sufficient STX
derivation = "m/44'/5757'/0'/0/0"

# Use hardware wallet untuk added security
[accounts.deployer.hardware]
type = "ledger"
account_index = 0
```

### Step 2: Mainnet Cost Estimation

```bash
# Estimate deployment costs
clarinet deployment generate --mainnet

# Review costs dalam plan
cat deployments/default.mainnet-plan.yaml

# Calculate total cost:
# - Contract deployment: ~46,400 microSTX (0.0464 STX)
# - Network fee: Variable based pada congestion
# - Buffer untuk multiple attempts: 2-3x estimate
# - Recommended minimum: 1 STX untuk deployment
```

### Step 3: Final Security Review

```bash
# Contract security checklist
clarinet check
clarinet test

# Review contract code line by line
# Check untuk:
# - Hardcoded values
# - Test addresses
# - Debug code
# - Overly permissive access controls
```

### Step 4: Mainnet Deployment

```bash
# IMPORTANT: Backup everything before deploying
cp -r . ../backup/$(date +%Y%m%d-%H%M%S)

# Double-check network configuration
grep -r "testnet" . --exclude-dir=node_modules
grep -r "devnet" . --exclude-dir=node_modules

# Deploy ke mainnet
clarinet deployment apply --mainnet

# Save deployment information
echo "Deployed $(date): Contract Address" >> deployment-log.txt
```

### Step 5: Post-Deployment Verification

```bash
# Verify mainnet deployment
curl -s "https://stacks-node-api.mainnet.stacks.co/v2/contracts/interface/SP.../tic-tac-toe" \
  | jq '.abi.functions[] | .name'

# Test basic functionality
curl -X POST "https://stacks-node-api.mainnet.stacks.co/v2/contracts/call-read/SP.../tic-tac-toe/get-latest-game-id" \
  -H "Content-Type: application/json" \
  -d '{"sender":"SP...","arguments":[]}'

# Update frontend configuration untuk mainnet
# Update documentation dengan mainnet addresses
```

## Advanced Deployment Strategies

### Multi-Stage Deployment

```bash
# Stage 1: Core contracts
clarinet deployment apply --mainnet --stage=core

# Stage 2: Peripheral contracts
clarinet deployment apply --mainnet --stage=peripherals

# Stage 3: Configuration updates
clarinet deployment apply --mainnet --stage=config
```

### Blue-Green Deployment

```javascript
// Deploy new version alongside old version
const deployNewVersion = async () => {
  // Deploy v2 contract
  const newContract = await deployContract('tic-tac-toe-v2');
  
  // Test new version
  await runIntegrationTests(newContract);
  
  // Gradually migrate traffic
  await migrateTraffic(oldContract, newContract);
  
  // Decommission old version
  await decommissionContract(oldContract);
};
```

### Rollback Strategy

```bash
# Prepare rollback plan
# 1. Keep old contract functional
# 2. Implement circuit breaker
# 3. Data migration scripts ready
# 4. Communication plan

# Circuit breaker implementation
(define-data-var emergency-stop bool false)

(define-public (emergency-pause)
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR_UNAUTHORIZED)
    (var-set emergency-stop true)
    (ok true)
  )
)
```

## Monitoring dan Maintenance

### Health Monitoring Setup

Create `monitoring/health-check.js`:

```javascript
const healthChecks = {
  async contractStatus() {
    const response = await fetch(
      `${API_URL}/v2/contracts/interface/${CONTRACT_ADDRESS}/${CONTRACT_NAME}`
    );
    return response.ok;
  },
  
  async transactionThroughput() {
    // Monitor transaction success rate
    const recentTxs = await getRecentTransactions();
    const successRate = recentTxs.filter(tx => tx.status === 'success').length / recentTxs.length;
    return successRate > 0.95; // 95% success rate threshold
  },
  
  async gasUsage() {
    // Monitor gas usage trends
    const recentGasUsage = await getRecentGasUsage();
    return recentGasUsage < GAS_THRESHOLD;
  }
};

// Run health checks every 5 minutes
setInterval(async () => {
  const checks = await Promise.all(Object.entries(healthChecks).map(
    async ([name, check]) => ({ name, status: await check() })
  ));
  
  console.log('Health check results:', checks);
  
  // Alert jika any check fails
  const failedChecks = checks.filter(check => !check.status);
  if (failedChecks.length > 0) {
    await sendAlert(failedChecks);
  }
}, 5 * 60 * 1000);
```

### Analytics Setup

```javascript
// Track contract usage
const analytics = {
  trackGameCreation(gameId, betAmount) {
    console.log(`Game created: ${gameId}, Bet: ${betAmount}`);
    // Send ke analytics service
  },
  
  trackGameCompletion(gameId, winner, duration) {
    console.log(`Game completed: ${gameId}, Winner: ${winner}, Duration: ${duration}ms`);
    // Send ke analytics service
  },
  
  trackError(error, context) {
    console.error('Contract error:', error, context);
    // Send ke error tracking service
  }
};
```

### Automated Updates

```bash
# Automated dependency updates
npm install -g npm-check-updates
ncu -u
npm install

# Automated security updates
npm audit fix

# Automated testing
#!/bin/bash
# scripts/automated-testing.sh
set -e

echo "Running automated tests..."
clarinet test

echo "Running security checks..."
npm audit

echo "Running integration tests..."
node scripts/integration-tests.js

echo "All checks passed ✅"
```

## Production Best Practices

### Performance Optimization

```lisp
;; Optimize contract untuk gas efficiency
(define-private (batch-operations (ops (list 10 uint)))
  (fold process-operation ops (ok u0))
)

;; Use efficient data structures
(define-map optimized-storage 
  uint  ;; Simple key
  {     ;; Minimal data structure
    data: uint,
    timestamp: uint
  }
)

;; Minimize storage writes
(define-private (update-if-changed (key uint) (new-value uint))
  (let ((current-value (get-value key)))
    (if (not (is-eq current-value new-value))
      (map-set storage key new-value)
      false
    )
  )
)
```

### Security Hardening

```lisp
;; Implement rate limiting
(define-map rate-limits principal uint)
(define-constant RATE_LIMIT_WINDOW u144) ;; ~24 hours dalam blocks

(define-private (check-rate-limit (user principal))
  (let ((last-action (default-to u0 (map-get? rate-limits user))))
    (asserts! (>= (- block-height last-action) RATE_LIMIT_WINDOW) ERR_RATE_LIMITED)
    (map-set rate-limits user block-height)
    (ok true)
  )
)

;; Add circuit breakers
(define-data-var contract-paused bool false)

(define-private (assert-not-paused)
  (asserts! (not (var-get contract-paused)) ERR_CONTRACT_PAUSED)
)
```

## Troubleshooting Deployment Issues

### Common Deployment Errors

```bash
# Error: Insufficient funds
# Solution: Add more STX untuk deployment fees
stx balance YOUR_ADDRESS -t
# Ensure balance > deployment cost

# Error: Contract already exists
# Solution: Use different contract name atau upgrade mechanism
clarinet deployment generate --testnet --contract-name=tic-tac-toe-v2

# Error: Invalid transaction
# Solution: Check nonce dan fee settings
stx get_account_info YOUR_ADDRESS -t

# Error: Network timeout
# Solution: Retry deployment dengan higher fee
clarinet deployment apply --testnet --fee-rate=20
```

### Debug Deployment Issues

```bash
# Enable verbose logging
clarinet deployment apply --testnet --verbose

# Check transaction status
curl -s "https://stacks-node-api.testnet.stacks.co/extended/v1/tx/TX_ID" | jq

# Monitor mempool
curl -s "https://stacks-node-api.testnet.stacks.co/extended/v1/tx/mempool" | jq

# Check account nonce
curl -s "https://stacks-node-api.testnet.stacks.co/extended/v1/address/YOUR_ADDRESS/nonces" | jq
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass locally
- [ ] Contract audited untuk security issues
- [ ] Gas costs analyzed dan optimized
- [ ] Testnet deployment successful
- [ ] Integration tests pass on testnet
- [ ] Frontend tested dengan testnet deployment
- [ ] Documentation updated
- [ ] Deployment keys secured
- [ ] Backup strategy implemented
- [ ] Rollback plan prepared

### Deployment Day

- [ ] Team notified
- [ ] Monitoring systems ready
- [ ] Support team on standby
- [ ] Deployment executed
- [ ] Health checks passing
- [ ] Frontend updated untuk mainnet
- [ ] User communication sent
- [ ] Analytics tracking confirmed

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify user adoption
- [ ] Update documentation
- [ ] Plan next iteration
- [ ] Security monitoring active
- [ ] Backup verification
- [ ] Team retrospective

## Kesimpulan

Successful deployment requires careful planning, thorough testing, dan comprehensive monitoring:

**Key Takeaways:**
✅ **Test Extensively**: Multiple environments dan scenarios  
✅ **Security First**: Audit code dan secure private keys  
✅ **Monitor Continuously**: Health checks dan error tracking  
✅ **Plan Rollbacks**: Always have exit strategy  
✅ **Document Everything**: For team dan future maintenance  

**Production Ready:**
- Contracts deployed dengan confidence
- Monitoring systems active
- Team prepared untuk support
- Users able untuk interact safely
- Business objectives achieved

Dengan mengikuti guide ini, Anda dapat deploy smart contracts dengan confidence dari development sampai production scale.

---

**Selanjutnya**: Explore advanced topics seperti contract upgrades, cross-chain integration, dan scaling strategies.

👉 **[Lanjut ke Advanced Topics →](../advanced-topics/)**