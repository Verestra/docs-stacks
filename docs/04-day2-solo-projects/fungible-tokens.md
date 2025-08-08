---
sidebar_position: 3
title: 3. Deep Dive Fungible Tokens
description: Pemahaman mendalam tentang SIP-010 fungible token standard - implementasi, best practices, dan use cases dalam ecosystem Stacks
keywords: [sip-010, fungible token, token standard, token development, erc-20 equivalent, stacks tokens]
---

# Fungible Token (SIP-010 Token Standard)

Membuat fungible tokens di Stacks menggunakan SIP-010 standard, yang mirip dengan ERC-20 di Ethereum. Standard ini memastikan kompatibilitas dengan wallets, exchanges, dan aplikasi lain dalam ekosistem Stacks.

## Pengenalan SIP-010 Standard

SIP-010 (Stacks Improvement Proposal 010) adalah standard untuk fungible tokens di Stacks blockchain. Standard ini mendefinisikan interface yang harus diimplementasikan oleh semua fungible token contracts.

### Mengapa Standard Diperlukan?

```
Keuntungan SIP-010 Standard:
├── Interoperability: Semua tokens bekerja dengan wallets yang sama
├── Composability: DeFi protocols dapat support semua SIP-010 tokens
├── User Experience: Consistent interface across applications
├── Developer Experience: Predictable APIs untuk integration
├── Ecosystem Growth: Network effects dari shared standards
└── Security: Battle-tested interface reduces bugs
```

### SIP-010 vs ERC-20 Comparison

```
┌─────────────────┬─────────────────┬─────────────────┐
│ Feature         │ SIP-010         │ ERC-20          │
├─────────────────┼─────────────────┼─────────────────┤
│ Language        │ Clarity         │ Solidity        │
│ Execution       │ Interpreted     │ Compiled        │
│ Error Handling  │ Response Types  │ Exceptions      │
│ Overflow        │ Built-in Safety │ Manual Checks   │
│ Reentrancy      │ Not Possible    │ Manual Guards   │
│ Gas Model       │ Predictable     │ Variable        │
│ Bitcoin Access  │ Native          │ Bridge Required │
└─────────────────┴─────────────────┴─────────────────┘
```

## SIP-010 Interface Requirements

Setiap SIP-010 token contract harus mengimplementasikan fungsi-fungsi berikut:

### Required Functions

```lisp
;; 1. Transfer function
(define-public (transfer 
  (amount uint) 
  (sender principal) 
  (recipient principal) 
  (memo (optional (buff 34))))
  ;; Implementation required
)

;; 2. Get name
(define-read-only (get-name)
  ;; Return token name
)

;; 3. Get symbol  
(define-read-only (get-symbol)
  ;; Return token symbol
)

;; 4. Get decimals
(define-read-only (get-decimals)
  ;; Return decimal places
)

;; 5. Get balance
(define-read-only (get-balance (who principal))
  ;; Return balance untuk specified principal
)

;; 6. Get total supply
(define-read-only (get-total-supply)
  ;; Return total token supply
)

;; 7. Get token URI
(define-read-only (get-token-uri)
  ;; Return metadata URI
)
```

## Complete SIP-010 Token Implementation

Mari implement complete fungible token called "Clarity Coin" yang mengikuti SIP-010 standard:

### Basic Token Contract

```lisp
;; Clarity Coin - Complete SIP-010 Implementation
;; contracts/clarity-coin.clar

;; Implement SIP-010 trait untuk ensure compatibility
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Define the fungible token
(define-fungible-token clarity-coin)

;; Constants untuk error handling
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101)) 
(define-constant ERR_INSUFFICIENT_BALANCE (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))
(define-constant ERR_UNAUTHORIZED (err u104))

;; Contract configuration
(define-constant CONTRACT_OWNER tx-sender)
(define-constant TOKEN_URI u"https://clarity-coin.com/metadata.json")
(define-constant TOKEN_NAME "Clarity Coin")
(define-constant TOKEN_SYMBOL "CC")
(define-constant TOKEN_DECIMALS u6)

;; Total supply tracking
(define-data-var total-minted uint u0)

;; SIP-010 Required Functions

;; Get token name
(define-read-only (get-name)
  (ok TOKEN_NAME)
)

;; Get token symbol
(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL)
)

;; Get decimal places
(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS)
)

;; Get balance untuk specific account
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance clarity-coin who))
)

;; Get total supply of tokens
(define-read-only (get-total-supply)
  (ok (ft-get-supply clarity-coin))
)

;; Get token metadata URI
(define-read-only (get-token-uri)
  (ok (some TOKEN_URI))
)

;; Transfer tokens between accounts
(define-public (transfer
  (amount uint)
  (sender principal)
  (recipient principal)
  (memo (optional (buff 34))))
  (begin
    ;; Validate sender authorization
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_TOKEN_OWNER)
    
    ;; Validate amount
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    
    ;; Perform transfer
    (try! (ft-transfer? clarity-coin amount sender recipient))
    
    ;; Print memo jika provided
    (match memo to-print (print to-print) 0x)
    
    ;; Return success
    (ok true)
  )
)

;; Administrative Functions

;; Mint new tokens (owner only)
(define-public (mint (amount uint) (recipient principal))
  (begin
    ;; Only contract owner dapat mint
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    
    ;; Validate amount
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    
    ;; Mint tokens
    (try! (ft-mint? clarity-coin amount recipient))
    
    ;; Update total minted tracking
    (var-set total-minted (+ (var-get total-minted) amount))
    
    ;; Return success
    (ok amount)
  )
)

;; Burn tokens dari caller's balance
(define-public (burn (amount uint))
  (begin
    ;; Validate amount
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    
    ;; Burn tokens
    (try! (ft-burn? clarity-coin amount tx-sender))
    
    ;; Return success
    (ok amount)
  )
)

;; Helper Functions

;; Get total minted tokens (including burned)
(define-read-only (get-total-minted)
  (ok (var-get total-minted))
)

;; Check jika account has sufficient balance
(define-read-only (has-sufficient-balance (account principal) (amount uint))
  (>= (ft-get-balance clarity-coin account) amount)
)

;; Get contract owner
(define-read-only (get-contract-owner)
  (ok CONTRACT_OWNER)
)
```

### Advanced Token Features

Mari tambahkan features advanced untuk token kita:

```lisp
;; Advanced Clarity Coin Contract
;; contracts/advanced-clarity-coin.clar

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token clarity-coin)

;; Enhanced Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant TOKEN_NAME "Advanced Clarity Coin")
(define-constant TOKEN_SYMBOL "ACC")
(define-constant TOKEN_DECIMALS u6)
(define-constant MAX_SUPPLY u1000000000000) ;; 1 million tokens dengan 6 decimals

;; Error codes
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_INSUFFICIENT_BALANCE (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))
(define-constant ERR_UNAUTHORIZED (err u104))
(define-constant ERR_CONTRACT_PAUSED (err u105))
(define-constant ERR_MAX_SUPPLY_REACHED (err u106))
(define-constant ERR_INVALID_RECIPIENT (err u107))
(define-constant ERR_BURN_AMOUNT_TOO_HIGH (err u108))

;; State variables
(define-data-var contract-paused bool false)
(define-data-var mint-enabled bool true)
(define-data-var burn-enabled bool true)
(define-data-var total-minted uint u0)
(define-data-var total-burned uint u0)

;; Access control - additional authorized minters
(define-map authorized-minters principal bool)

;; Transfer restrictions - blacklist
(define-map blacklisted-accounts principal bool)

;; SIP-010 Interface Implementation

(define-read-only (get-name)
  (ok TOKEN_NAME)
)

(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL)
)

(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance clarity-coin who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply clarity-coin))
)

(define-read-only (get-token-uri)
  (ok (some u"https://advanced-clarity-coin.com/metadata.json"))
)

(define-public (transfer
  (amount uint)
  (sender principal)
  (recipient principal)
  (memo (optional (buff 34))))
  (begin
    ;; Check jika contract paused
    (asserts! (not (var-get contract-paused)) ERR_CONTRACT_PAUSED)
    
    ;; Check authorization
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_TOKEN_OWNER)
    
    ;; Validate amount dan recipient
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (asserts! (not (is-eq sender recipient)) ERR_INVALID_RECIPIENT)
    
    ;; Check blacklist status
    (asserts! (not (is-blacklisted sender)) ERR_UNAUTHORIZED)
    (asserts! (not (is-blacklisted recipient)) ERR_UNAUTHORIZED)
    
    ;; Perform transfer
    (try! (ft-transfer? clarity-coin amount sender recipient))
    
    ;; Print memo
    (match memo
      to-print (print {action: "transfer", amount: amount, memo: to-print})
      (print {action: "transfer", amount: amount})
    )
    
    (ok true)
  )
)

;; Enhanced Administrative Functions

;; Mint dengan supply cap
(define-public (mint (amount uint) (recipient principal))
  (begin
    ;; Check authorization
    (asserts! (or (is-eq tx-sender CONTRACT_OWNER) (is-authorized-minter tx-sender)) ERR_UNAUTHORIZED)
    
    ;; Check jika contract paused dan minting enabled
    (asserts! (not (var-get contract-paused)) ERR_CONTRACT_PAUSED)
    (asserts! (var-get mint-enabled) ERR_UNAUTHORIZED)
    
    ;; Validate inputs
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (asserts! (not (is-blacklisted recipient)) ERR_UNAUTHORIZED)
    
    ;; Check supply cap
    (asserts! (<= (+ (ft-get-supply clarity-coin) amount) MAX_SUPPLY) ERR_MAX_SUPPLY_REACHED)
    
    ;; Mint tokens
    (try! (ft-mint? clarity-coin amount recipient))
    
    ;; Update tracking
    (var-set total-minted (+ (var-get total-minted) amount))
    
    ;; Log mint event
    (print {action: "mint", amount: amount, recipient: recipient})
    
    (ok amount)
  )
)

;; Enhanced burn dengan tracking
(define-public (burn (amount uint))
  (begin
    ;; Check jika contract paused dan burning enabled
    (asserts! (not (var-get contract-paused)) ERR_CONTRACT_PAUSED)
    (asserts! (var-get burn-enabled) ERR_UNAUTHORIZED)
    
    ;; Validate amount
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    
    ;; Check sufficient balance
    (asserts! (>= (ft-get-balance clarity-coin tx-sender) amount) ERR_INSUFFICIENT_BALANCE)
    
    ;; Burn tokens
    (try! (ft-burn? clarity-coin amount tx-sender))
    
    ;; Update tracking
    (var-set total-burned (+ (var-get total-burned) amount))
    
    ;; Log burn event
    (print {action: "burn", amount: amount, burner: tx-sender})
    
    (ok amount)
  )
)

;; Governance Functions

;; Pause/unpause contract
(define-public (set-contract-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (var-set contract-paused paused)
    (print {action: "pause-status-changed", paused: paused})
    (ok paused)
  )
)

;; Enable/disable minting
(define-public (set-mint-enabled (enabled bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (var-set mint-enabled enabled)
    (print {action: "mint-status-changed", enabled: enabled})
    (ok enabled)
  )
)

;; Enable/disable burning
(define-public (set-burn-enabled (enabled bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (var-set burn-enabled enabled)
    (print {action: "burn-status-changed", enabled: enabled})
    (ok enabled)
  )
)

;; Access Control Functions

;; Add authorized minter
(define-public (add-authorized-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (map-set authorized-minters minter true)
    (print {action: "minter-added", minter: minter})
    (ok true)
  )
)

;; Remove authorized minter
(define-public (remove-authorized-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (map-delete authorized-minters minter)
    (print {action: "minter-removed", minter: minter})
    (ok true)
  )
)

;; Add account to blacklist
(define-public (add-to-blacklist (account principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (map-set blacklisted-accounts account true)
    (print {action: "blacklisted", account: account})
    (ok true)
  )
)

;; Remove account dari blacklist
(define-public (remove-from-blacklist (account principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (map-delete blacklisted-accounts account)
    (print {action: "removed-from-blacklist", account: account})
    (ok true)
  )
)

;; Helper Functions

;; Check jika account is authorized minter
(define-read-only (is-authorized-minter (account principal))
  (default-to false (map-get? authorized-minters account))
)

;; Check jika account is blacklisted
(define-read-only (is-blacklisted (account principal))
  (default-to false (map-get? blacklisted-accounts account))
)

;; Get contract status
(define-read-only (get-contract-status)
  (ok {
    paused: (var-get contract-paused),
    mint-enabled: (var-get mint-enabled),
    burn-enabled: (var-get burn-enabled),
    total-supply: (ft-get-supply clarity-coin),
    max-supply: MAX_SUPPLY,
    total-minted: (var-get total-minted),
    total-burned: (var-get total-burned)
  })
)

;; Get account info
(define-read-only (get-account-info (account principal))
  (ok {
    balance: (ft-get-balance clarity-coin account),
    is-blacklisted: (is-blacklisted account),
    is-authorized-minter: (is-authorized-minter account)
  })
)
```

## SIP-010 Token Vault

Mari buat vault contract yang bisa hold dan release any SIP-010 compliant tokens:

```lisp
;; SIP-010 Token Vault Contract
;; contracts/token-vault.clar

;; Import SIP-010 trait untuk interact dengan tokens
(use-trait ft-token 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))
(define-constant ERR_TRANSFER_FAILED (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))

;; State tracking untuk each token
(define-map token-balances {token: principal, account: principal} uint)
(define-map supported-tokens principal bool)

;; Get vault balance untuk specific token
(define-public (get-balance (token <ft-token>))
  (contract-call? token get-balance (as-contract tx-sender))
)

;; Get user's deposited balance untuk specific token
(define-read-only (get-user-balance (token principal) (user principal))
  (default-to u0 (map-get? token-balances {token: token, account: user}))
)

;; Add token untuk supported list (owner only)
(define-public (add-supported-token (token principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR_OWNER_ONLY)
    (map-set supported-tokens token true)
    (ok true)
  )
)

;; Check jika token is supported
(define-read-only (is-supported-token (token principal))
  (default-to false (map-get? supported-tokens token))
)

;; Deposit tokens to vault
(define-public (deposit (token <ft-token>) (amount uint))
  (let ((token-principal (contract-of token)))
    (begin
      ;; Validate inputs
      (asserts! (> amount u0) ERR_INVALID_AMOUNT)
      (asserts! (is-supported-token token-principal) ERR_TRANSFER_FAILED)
      
      ;; Transfer tokens dari user ke vault
      (try! (contract-call? token transfer amount tx-sender (as-contract tx-sender) none))
      
      ;; Update user balance tracking
      (let ((current-balance (get-user-balance token-principal tx-sender)))
        (map-set token-balances 
          {token: token-principal, account: tx-sender}
          (+ current-balance amount)
        )
      )
      
      ;; Log deposit
      (print {action: "deposit", token: token-principal, user: tx-sender, amount: amount})
      
      (ok amount)
    )
  )
)

;; Withdraw tokens dari vault
(define-public (withdraw (token <ft-token>) (amount uint))
  (let ((token-principal (contract-of token))
        (user-balance (get-user-balance (contract-of token) tx-sender)))
    (begin
      ;; Validate inputs
      (asserts! (> amount u0) ERR_INVALID_AMOUNT)
      (asserts! (>= user-balance amount) ERR_INSUFFICIENT_BALANCE)
      
      ;; Transfer tokens dari vault ke user
      (try! (as-contract (contract-call? token transfer amount tx-sender tx-sender none)))
      
      ;; Update user balance tracking
      (map-set token-balances 
        {token: token-principal, account: tx-sender}
        (- user-balance amount)
      )
      
      ;; Log withdrawal
      (print {action: "withdraw", token: token-principal, user: tx-sender, amount: amount})
      
      (ok amount)
    )
  )
)

;; Emergency function untuk owner untuk release any tokens
(define-public (emergency-release (token <ft-token>) (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR_OWNER_ONLY)
    (try! (as-contract (contract-call? token transfer amount tx-sender recipient none)))
    (print {action: "emergency-release", token: (contract-of token), recipient: recipient, amount: amount})
    (ok amount)
  )
)

;; Get total deposits untuk all users untuk specific token
(define-read-only (get-total-deposits (token principal))
  ;; This would require iterating through all users, which is expensive
  ;; Better to track this dengan a separate data variable in production
  u0
)
```

## Traits dalam Clarity

Mari understand traits lebih dalam, karena SIP-010 menggunakan trait system:

### Apa itu Traits?

Traits dalam Clarity adalah templates atau interfaces untuk smart contracts, mirip dengan interfaces di Solidity atau traits di Rust. Mereka mendefinisikan set functions yang harus diimplementasikan contract untuk compliant dengan standard tertentu.

```lisp
;; SIP-010 Trait Definition (simplified)
(define-trait sip-010-trait
  (
    ;; Transfer function signature
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    
    ;; Getter function signatures
    (get-name () (response (string-ascii 32) uint))
    (get-symbol () (response (string-ascii 32) uint))
    (get-decimals () (response uint uint))
    (get-balance (principal) (response uint uint))
    (get-total-supply () (response uint uint))
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)
```

### Implementing Traits

```lisp
;; Contract must implement trait untuk be considered SIP-010 compliant
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Now contract MUST implement ALL required functions dengan exact signatures
```

### Using Traits dalam Other Contracts

```lisp
;; Import trait untuk use dalam contract
(use-trait ft-token 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Function yang accepts any SIP-010 token
(define-public (generic-transfer (token <ft-token>) (amount uint) (recipient principal))
  (contract-call? token transfer amount tx-sender recipient none)
)
```

## Testing Token Contract

Mari create comprehensive tests untuk token contract kita:

```typescript
// tests/clarity-coin.test.ts
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Token has correct metadata",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        // Test get-name
        let result = chain.callReadOnlyFn(
            'clarity-coin',
            'get-name',
            [],
            deployer.address
        );
        assertEquals(result.result, '(ok "Clarity Coin")');
        
        // Test get-symbol
        result = chain.callReadOnlyFn(
            'clarity-coin',
            'get-symbol',
            [],
            deployer.address
        );
        assertEquals(result.result, '(ok "CC")');
        
        // Test get-decimals
        result = chain.callReadOnlyFn(
            'clarity-coin',
            'get-decimals',
            [],
            deployer.address
        );
        assertEquals(result.result, '(ok u6)');
    },
});

Clarinet.test({
    name: "Owner can mint tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'clarity-coin',
                'mint',
                [types.uint(1000000), types.principal(wallet1.address)],
                deployer.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok u1000000)');
        
        // Check balance
        let result = chain.callReadOnlyFn(
            'clarity-coin',
            'get-balance',
            [types.principal(wallet1.address)],
            deployer.address
        );
        assertEquals(result.result, '(ok u1000000)');
    },
});

Clarinet.test({
    name: "Non-owner cannot mint tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'clarity-coin',
                'mint',
                [types.uint(1000000), types.principal(wallet2.address)],
                wallet1.address  // Non-owner trying to mint
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(err u100)'); // ERR_OWNER_ONLY
    },
});

Clarinet.test({
    name: "Users can transfer tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        // First mint some tokens
        let block = chain.mineBlock([
            Tx.contractCall(
                'clarity-coin',
                'mint',
                [types.uint(1000000), types.principal(wallet1.address)],
                deployer.address
            )
        ]);
        
        // Then transfer some tokens
        block = chain.mineBlock([
            Tx.contractCall(
                'clarity-coin',
                'transfer',
                [
                    types.uint(500000),
                    types.principal(wallet1.address),
                    types.principal(wallet2.address),
                    types.none()
                ],
                wallet1.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok true)');
        
        // Check balances
        let result = chain.callReadOnlyFn(
            'clarity-coin',
            'get-balance',
            [types.principal(wallet1.address)],
            deployer.address
        );
        assertEquals(result.result, '(ok u500000)');
        
        result = chain.callReadOnlyFn(
            'clarity-coin',
            'get-balance',
            [types.principal(wallet2.address)],
            deployer.address
        );
        assertEquals(result.result, '(ok u500000)');
    },
});

Clarinet.test({
    name: "Cannot transfer more than balance",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        // Mint small amount
        let block = chain.mineBlock([
            Tx.contractCall(
                'clarity-coin',
                'mint',
                [types.uint(100), types.principal(wallet1.address)],
                deployer.address
            )
        ]);
        
        // Try to transfer more than balance
        block = chain.mineBlock([
            Tx.contractCall(
                'clarity-coin',
                'transfer',
                [
                    types.uint(1000), // More than balance
                    types.principal(wallet1.address),
                    types.principal(wallet2.address),
                    types.none()
                ],
                wallet1.address
            )
        ]);
        
        // Should fail dengan insufficient balance error
        block.receipts[0].result.expectErr();
    },
});
```

## Deployment dan Integration

### Deployment Script

```typescript
// scripts/deploy-token.ts
import { StacksTestnet } from '@stacks/network';
import { 
    makeContractDeploy,
    broadcastTransaction,
    makeSTXTokenTransfer,
    AnchorMode
} from '@stacks/transactions';
import { readFileSync } from 'fs';

async function deployToken() {
    const network = new StacksTestnet(); // Workshop uses testnet
    
    // Read contract code
    const contractCode = readFileSync('./contracts/clarity-coin.clar', 'utf8');
    
    // Create deployment transaction
    const txOptions = {
        contractName: 'clarity-coin',
        codeBody: contractCode,
        senderKey: process.env.PRIVATE_KEY!, // Your private key
        network,
        anchorMode: AnchorMode.Any,
    };
    
    const transaction = await makeContractDeploy(txOptions);
    
    // Broadcast transaction
    const result = await broadcastTransaction(transaction, network);
    console.log('Deployment transaction:', result.txid);
}

deployToken().catch(console.error);
```

### Frontend Integration

```typescript
// Frontend integration example
import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { 
    uintCV,
    principalCV,
    noneCV,
    stringAsciiCV
} from '@stacks/transactions';

// Transfer tokens
async function transferTokens(amount: number, recipient: string) {
    const functionArgs = [
        uintCV(amount),
        principalCV(recipient),
        noneCV()
    ];
    
    await openContractCall({
        network: new StacksTestnet(),
        contractAddress: 'ST1234...', // Your contract address
        contractName: 'clarity-coin',
        functionName: 'transfer',
        functionArgs,
        onFinish: (data) => {
            console.log('Transaction ID:', data.txId);
        },
    });
}

// Get token balance
async function getBalance(address: string): Promise<number> {
    const response = await fetch(
        `https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/ST1234.../clarity-coin/get-balance`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: address,
                arguments: [principalCV(address).serialize().toString('hex')]
            })
        }
    );
    
    const result = await response.json();
    return parseInt(result.result.replace('(ok u', '').replace(')', ''));
}
```

## Best Practices

### 1. Security Considerations

```lisp
;; Always validate inputs
(define-public (secure-transfer (amount uint) (recipient principal))
  (begin
    ;; Input validation
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (asserts! (not (is-eq tx-sender recipient)) ERR_INVALID_RECIPIENT)
    (asserts! (is-standard recipient) ERR_INVALID_RECIPIENT)
    
    ;; Check sufficient balance before transfer
    (asserts! (>= (ft-get-balance token tx-sender) amount) ERR_INSUFFICIENT_BALANCE)
    
    ;; Perform transfer
    (ft-transfer? token amount tx-sender recipient)
  )
)

;; Use access control untuk administrative functions
(define-public (admin-mint (amount uint) (recipient principal))
  (begin
    ;; Only authorized users dapat mint
    (asserts! (or 
      (is-eq tx-sender CONTRACT_OWNER)
      (is-authorized-minter tx-sender)
    ) ERR_UNAUTHORIZED)
    
    ;; Mint dengan validation
    (ft-mint? token amount recipient)
  )
)
```

### 2. Gas Optimization

```lisp
;; Batch operations untuk efficiency
(define-public (batch-transfer (transfers (list 100 {recipient: principal, amount: uint})))
  (fold batch-transfer-fold transfers (ok u0))
)

(define-private (batch-transfer-fold 
  (transfer {recipient: principal, amount: uint})
  (previous-result (response uint uint)))
  (match previous-result
    success (transfer-tokens (get amount transfer) (get recipient transfer))
    error (err error)
  )
)
```

### 3. Event Logging

```lisp
;; Comprehensive event logging
(define-public (transfer-with-event 
  (amount uint) 
  (recipient principal)
  (memo (optional (string-utf8 256))))
  (begin
    (try! (ft-transfer? token amount tx-sender recipient))
    
    ;; Log detailed transfer event
    (print {
      action: "transfer",
      from: tx-sender,
      to: recipient,
      amount: amount,
      memo: memo,
      block-height: block-height,
      timestamp: (unwrap! (get-block-info? time block-height) (err u999))
    })
    
    (ok true)
  )
)
```

## Common Use Cases

### 1. Governance Token

```lisp
;; Governance token dengan voting power
(define-map voting-power principal uint)

(define-public (delegate-voting-power (delegate principal) (amount uint))
  (begin
    ;; Validate delegation
    (asserts! (>= (ft-get-balance gov-token tx-sender) amount) ERR_INSUFFICIENT_BALANCE)
    
    ;; Update voting power
    (map-set voting-power delegate 
      (+ (get-voting-power delegate) amount))
    
    ;; Lock tokens untuk delegation period
    (map-set locked-tokens tx-sender 
      (+ (get-locked-amount tx-sender) amount))
    
    (ok amount)
  )
)
```

### 2. Reward Token

```lisp
;; Reward distribution system
(define-map reward-rates principal uint)
(define-map last-claim-time principal uint)

(define-public (claim-rewards)
  (let ((user-rate (get-reward-rate tx-sender))
        (last-claim (get-last-claim-time tx-sender))
        (time-elapsed (- block-height last-claim))
        (reward-amount (* user-rate time-elapsed)))
    (begin
      ;; Mint reward tokens
      (try! (ft-mint? reward-token reward-amount tx-sender))
      
      ;; Update claim time
      (map-set last-claim-time tx-sender block-height)
      
      (ok reward-amount)
    )
  )
)
```

### 3. Stablecoin

```lisp
;; Collateralized stablecoin
(define-map collateral-balances principal uint)
(define-constant COLLATERAL_RATIO u150) ;; 150%

(define-public (mint-stablecoin (stx-collateral uint))
  (let ((max-mint-amount (/ (* stx-collateral u100) COLLATERAL_RATIO)))
    (begin
      ;; Transfer STX collateral ke contract
      (try! (stx-transfer? stx-collateral tx-sender (as-contract tx-sender)))
      
      ;; Track collateral
      (map-set collateral-balances tx-sender 
        (+ (get-collateral-balance tx-sender) stx-collateral))
      
      ;; Mint stablecoin
      (try! (ft-mint? stablecoin max-mint-amount tx-sender))
      
      (ok max-mint-amount)
    )
  )
)
```

## Kesimpulan

SIP-010 fungible tokens provide foundation untuk DeFi ecosystem di Stacks:

**Key Features:**
✅ **Standard Interface**: Consistent API across all tokens  
✅ **Security Built-in**: Clarity prevents common vulnerabilities  
✅ **Bitcoin Integration**: Can interact dengan Bitcoin blockchain  
✅ **Composability**: Works dengan all DeFi protocols  
✅ **Predictable Costs**: Decidable execution costs  

**Implementation Checklist:**
- [ ] Implement all SIP-010 required functions
- [ ] Add proper access controls
- [ ] Implement comprehensive error handling
- [ ] Add event logging untuk transparency
- [ ] Include administrative functions (mint, burn, pause)
- [ ] Write comprehensive tests
- [ ] Add proper documentation
- [ ] Consider advanced features (governance, rewards)

**Next Steps:**
1. Deploy token to testnet
2. Test integration dengan wallets (Leather)
3. List pada DEX (Alex, StackSwap)
4. Build applications yang use your token
5. Consider governance dan utility features

Dengan understanding fungible tokens, Anda ready untuk explore NFTs dan more complex token mechanics dalam Stacks ecosystem.

---

**Selanjutnya**: Mari explore Non-Fungible Tokens (NFTs) dengan SIP-009 standard.

👉 **[Kembali ke Panduan Project Solo →](./solo-project-guide.md)**