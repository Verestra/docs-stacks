---
sidebar_position: 2
title: 2. Panduan Project Solo
description: Panduan lengkap 3 pilihan project - Simple Token (SIP-010), NFT Collection (SIP-009), dan Voting System dengan step-by-step tutorial
keywords: [solo project guide, sip-010 token, sip-009 nft, voting system, token development, nft development]
---

# Solo Project Building Guide

Panduan lengkap untuk mengerjakan individual project pada workshop Day 2. Pilih salah satu dari 3 opsi berikut dan ikuti step-by-step guide untuk menyelesaikan project Anda.

---

# 🪙 Option 2: Token Management System

## **Project Overview**
Bangun sistem manajemen token kustom dengan fitur minting, burning, transfer restrictions, dan basic staking mechanism.

### **🎯 Learning Objectives**
- Membuat custom fungible token (FT) di Stacks
- Implement minting dan burning functionality
- Menerapkan transfer restrictions
- Membangun basic staking mechanism

### **📋 Project Requirements**
- Token dengan supply management
- Admin controls untuk minting/burning
- Transfer restrictions berdasarkan whitelist
- Basic staking dengan rewards calculation
- Unit tests untuk semua functions

---

## **Step 1: Project Setup (15 menit)**

### **1.1 Initialize Project**
```bash
cd ~/stacks-workshop
clarinet new token-management-system
cd token-management-system
```

### **1.2 Project Structure**
```
token-management-system/
├── contracts/
│   ├── token-manager.clar         # Main token contract
│   └── staking-pool.clar          # Staking functionality
├── tests/
│   ├── token-manager.test.ts
│   └── staking-pool.test.ts
├── settings/
└── Clarinet.toml
```

### **1.3 Update Clarinet.toml**
```toml
[contracts.token-manager]
path = "contracts/token-manager.clar"
clarity_version = 2
epoch = 2.4

[contracts.staking-pool]
path = "contracts/staking-pool.clar"
clarity_version = 2
epoch = 2.4
depends_on = ["token-manager"]
```

---

## **Step 2: Token Contract Foundation (30 menit)**

### **2.1 Create contracts/simple-token.clar**
```lisp
;; Simple Token - SIP-010 Standard Implementation
;; Workshop Version: Minimal but compliant

;; Implement SIP-010 fungible token trait
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Define the token
(define-fungible-token workshop-token)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; Token metadata
(define-constant token-name "Workshop Token")
(define-constant token-symbol "WTK")
(define-constant token-decimals u6)
(define-constant token-uri u"https://workshop.blockdev.id/token.json")

;; SIP-010 required functions
(define-read-only (get-name)
  (ok token-name)
)

(define-read-only (get-symbol)
  (ok token-symbol)
)

(define-read-only (get-decimals)
  (ok token-decimals)
)

(define-read-only (get-balance (user principal))
  (ok (ft-get-balance workshop-token user))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply workshop-token))
)

(define-read-only (get-token-uri)
  (ok (some token-uri))
)

;; SIP-010 transfer function
(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq from tx-sender) err-not-token-owner)
    (ft-transfer? workshop-token amount from to)
  )
)

;; Mint function (owner only)
(define-public (mint (amount uint) (to principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? workshop-token amount to)
  )
)
```

### **2.2 Testing Your Simple Token**

**Update Clarinet.toml:**
```toml
[contracts.simple-token]
path = "contracts/simple-token.clar"
clarity_version = 2
epoch = 2.4
```

**Console Testing:**
```bash
# Deploy and test token
clarinet console
clarinet>> ::deploy_contract simple-token contracts/simple-token.clar

# Test SIP-010 functions
clarinet>> (contract-call? .simple-token get-name)
clarinet>> (contract-call? .simple-token get-symbol)
clarinet>> (contract-call? .simple-token get-decimals)
clarinet>> (contract-call? .simple-token get-total-supply)

# Mint tokens (only owner can do this)
clarinet>> (contract-call? .simple-token mint u1000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

# Check balance
clarinet>> (contract-call? .simple-token get-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

# Transfer tokens
clarinet>> (contract-call? .simple-token transfer u100000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 none)
```

---

## **Step 3: Token Project Complete! (15 menit)**

### **🎉 Deliverables Checklist:**
```bash
# ✅ Simple Token Workshop Checklist
# [ ] SIP-010 compliant token created
# [ ] Token metadata properly set
# [ ] Mint function working (owner only)
# [ ] Transfer function working
# [ ] All SIP-010 read functions working
# [ ] Local testing completed
# [ ] Ready for testnet deployment
```

### **🚀 Next Steps (Optional):**
If you finish early, try adding these features:
```lisp
;; Add burn function
(define-public (burn (amount uint) (from principal))
  (begin
    (asserts! (is-eq from tx-sender) err-not-token-owner)
    (ft-burn? workshop-token amount from)
  )
)

;; Add admin functions
(define-public (set-token-uri (new-uri (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set token-uri new-uri)
    (ok true)
  )
)
```

### **📝 Project Documentation:**
Create a `TOKEN_README.md`:
```markdown
# Workshop Token (WTK)

## Description
SIP-010 compliant fungible token created in Stacks workshop.

## Features
- ✅ Standard SIP-010 implementation
- ✅ Owner-controlled minting
- ✅ Standard transfer functionality
- ✅ Token metadata

## Contract Functions
- `get-name` - Returns token name
- `get-symbol` - Returns token symbol  
- `get-decimals` - Returns decimal places
- `get-balance` - Get user balance
- `get-total-supply` - Get total token supply
- `transfer` - Transfer tokens between users
- `mint` - Mint new tokens (owner only)

## Testing Commands
[Include your console testing commands here]
```

---

# 🖼️ Option 3: Simple NFT Collection

## **Project Overview**
Membangun NFT collection contract menggunakan SIP-009 standard dengan fokus pada basic minting dan metadata management.

### **🎯 Learning Objectives**
- Membuat NFT contract menggunakan SIP-009 standard
- Implement minting dengan metadata sederhana
- Mengelola collection ownership
- Transfer dan ownership management

### **📋 Project Requirements**
- NFT collection dengan metadata
- Minting functions dengan access control
- Transfer dan ownership management
- Unit tests untuk semua functions

---

## **Step 1: NFT Project Setup (15 menit)**

### **1.1 Initialize Project**
```bash
cd ~/stacks-workshop
clarinet new simple-nft-collection
cd simple-nft-collection
```

### **1.2 Update Clarinet.toml**
```toml
[contracts.simple-nft]
path = "contracts/simple-nft.clar"
clarity_version = 2
epoch = 2.4
```

---

## **Step 2: Simple NFT Contract (30 menit)**

### **2.1 Create contracts/simple-nft.clar**
```lisp
;; Simple NFT Collection - SIP-009 Standard Implementation
;; Workshop Version: Basic but compliant

;; Implement SIP-009 NFT trait
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; Define the NFT
(define-non-fungible-token workshop-nft uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; Data variables
(define-data-var last-token-id uint u0)
(define-data-var base-token-uri (string-ascii 256) "https://workshop.blockdev.id/nft/")

;; Data maps for metadata
(define-map token-metadata uint 
  {
    name: (string-ascii 64),
    description: (string-ascii 256),
    image: (string-ascii 256)
  }
)

;; SIP-009 required functions
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
  (ok (some (concat (var-get base-token-uri) (uint-to-ascii token-id))))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? workshop-nft token-id))
)

;; Transfer function
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (nft-transfer? workshop-nft token-id sender recipient)
  )
)

;; Mint function (owner only)
(define-public (mint (to principal) (name (string-ascii 64)) (description (string-ascii 256)) (image (string-ascii 256)))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    ;; Mint NFT
    (try! (nft-mint? workshop-nft token-id to))
    
    ;; Store metadata
    (map-set token-metadata token-id {
      name: name,
      description: description,
      image: image
    })
    
    ;; Update last token ID
    (var-set last-token-id token-id)
    
    (ok token-id)
  )
)

;; Get token metadata
(define-read-only (get-token-metadata (token-id uint))
  (map-get? token-metadata token-id)
)

;; Set base URI (owner only)
(define-public (set-base-uri (new-uri (string-ascii 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set base-token-uri new-uri))
  )
)
```

### **2.2 Testing Your Simple NFT**

**Update Clarinet.toml:**
```toml
[contracts.simple-nft]
path = "contracts/simple-nft.clar"
clarity_version = 2
epoch = 2.4
```

**Console Testing:**
```bash
# Deploy and test NFT
clarinet console
clarinet>> ::deploy_contract simple-nft contracts/simple-nft.clar

# Test SIP-009 functions
clarinet>> (contract-call? .simple-nft get-last-token-id)
clarinet>> (contract-call? .simple-nft get-token-uri u1)

# Mint NFT (only owner can do this)
clarinet>> (contract-call? .simple-nft mint 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM "Workshop NFT #1" "My first NFT in the workshop" "https://workshop.blockdev.id/nft1.jpg")

# Check ownership and metadata
clarinet>> (contract-call? .simple-nft get-owner u1)
clarinet>> (contract-call? .simple-nft get-token-metadata u1)

# Transfer NFT
clarinet>> (contract-call? .simple-nft transfer u1 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
```

---

## **Step 3: NFT Project Complete! (15 menit)**

### **🎉 Deliverables Checklist:**
```bash
# ✅ Simple NFT Workshop Checklist
# [ ] SIP-009 compliant NFT created
# [ ] NFT metadata properly stored
# [ ] Mint function working (owner only)
# [ ] Transfer function working
# [ ] All SIP-009 read functions working
# [ ] Local testing completed
# [ ] Ready for testnet deployment
```

### **🚀 Next Steps (Optional):**
If you finish early, try adding these features:
```lisp
;; Add batch mint function
(define-public (batch-mint (recipients (list 10 principal)) (names (list 10 (string-ascii 64))) (descriptions (list 10 (string-ascii 256))) (images (list 10 (string-ascii 256))))
  (let
    (
      (current-id (var-get last-token-id))
    )
    (fold batch-mint-helper (zip recipients (zip names (zip descriptions images))) current-id)
  )
)

;; Add burn function
(define-public (burn (token-id uint))
  (let
    (
      (token-owner (unwrap! (nft-get-owner? workshop-nft token-id) err-not-token-owner))
    )
    (asserts! (is-eq tx-sender token-owner) err-not-token-owner)
    (nft-burn? workshop-nft token-id token-owner)
  )
)
```

### **📝 Project Documentation:**
Create a `NFT_README.md`:
```markdown
# Workshop NFT Collection

## Description
SIP-009 compliant NFT collection created in Stacks workshop.

## Features
- ✅ Standard SIP-009 implementation
- ✅ Owner-controlled minting
- ✅ NFT metadata storage
- ✅ Standard transfer functionality

## Contract Functions
- `get-last-token-id` - Returns last minted token ID
- `get-token-uri` - Returns token URI
- `get-owner` - Get token owner
- `transfer` - Transfer NFT between users
- `mint` - Mint new NFT (owner only)
- `get-token-metadata` - Get token metadata

## Testing Commands
[Include your console testing commands here]
```

---

# 🗳️ Option 4: Simple Voting System

## **Project Overview**
Membangun sistem voting sederhana dengan governance token, proposal creation, dan basic voting mechanism.

### **🎯 Learning Objectives**
- Membuat governance token
- Implement proposal creation dan voting
- Mengelola voting results
- Simple execution untuk approved proposals

### **📋 Project Requirements**
- Governance token untuk voting rights
- Proposal creation dan management
- Basic voting mechanism
- Unit tests untuk semua functions

---

## **Step 1: Voting Project Setup (15 menit)**

### **1.1 Initialize Project**
```bash
cd ~/stacks-workshop
clarinet new simple-voting-system
cd simple-voting-system
```

### **1.2 Update Clarinet.toml**
```toml
[contracts.simple-voting]
path = "contracts/simple-voting.clar"
clarity_version = 2
epoch = 2.4
```

---

## **Step 2: Simple Voting Contract (45 menit)**

### **2.1 Create contracts/simple-voting.clar**
```lisp
;; Simple Voting System - Workshop Version
;; Basic governance dengan proposal dan voting functionality

;; Implement SIP-010 for governance token
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Define governance token
(define-fungible-token gov-token)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-proposal-not-found (err u101))
(define-constant err-already-voted (err u102))
(define-constant err-voting-closed (err u103))

;; Token metadata
(define-constant token-name "Workshop Gov Token")
(define-constant token-symbol "WGT")
(define-constant token-decimals u6)

;; Data variables
(define-data-var proposal-count uint u0)

;; Proposal structure
(define-map proposals uint {
  title: (string-ascii 64),
  description: (string-ascii 256),
  end-block: uint,
  yes-votes: uint,
  no-votes: uint,
  executed: bool
})

;; Voting records
(define-map votes { proposal-id: uint, voter: principal } bool)

;; SIP-010 Token Functions
(define-read-only (get-name)
  (ok token-name)
)

(define-read-only (get-symbol)
  (ok token-symbol)
)

(define-read-only (get-decimals)
  (ok token-decimals)
)

(define-read-only (get-balance (user principal))
  (ok (ft-get-balance gov-token user))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply gov-token))
)

(define-read-only (get-token-uri)
  (ok none)
)

(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq from tx-sender) err-owner-only)
    (ft-transfer? gov-token amount from to)
  )
)

;; Mint governance tokens (owner only)
(define-public (mint (amount uint) (to principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? gov-token amount to)
  )
)

;; Proposal Functions
(define-public (create-proposal (title (string-ascii 64)) (description (string-ascii 256)) (duration uint))
  (let
    (
      (proposal-id (+ (var-get proposal-count) u1))
      (end-block (+ block-height duration))
    )
    ;; Create proposal
    (map-set proposals proposal-id {
      title: title,
      description: description,
      end-block: end-block,
      yes-votes: u0,
      no-votes: u0,
      executed: false
    })
    
    (var-set proposal-count proposal-id)
    (ok proposal-id)
  )
)

;; Vote on proposal
(define-public (vote (proposal-id uint) (support bool))
  (let
    (
      (proposal (unwrap! (map-get? proposals proposal-id) err-proposal-not-found))
      (voting-power (ft-get-balance gov-token tx-sender))
      (vote-key { proposal-id: proposal-id, voter: tx-sender })
    )
    ;; Check if voting is still open
    (asserts! (< block-height (get end-block proposal)) err-voting-closed)
    ;; Check if user hasn't voted yet
    (asserts! (is-none (map-get? votes vote-key)) err-already-voted)
    ;; User must have tokens to vote
    (asserts! (> voting-power u0) err-owner-only)
    
    ;; Record vote
    (map-set votes vote-key true)
    
    ;; Update vote counts
    (if support
      (map-set proposals proposal-id 
        (merge proposal { yes-votes: (+ (get yes-votes proposal) voting-power) }))
      (map-set proposals proposal-id 
        (merge proposal { no-votes: (+ (get no-votes proposal) voting-power) }))
    )
    
    (ok voting-power)
  )
)

;; Execute approved proposal
(define-public (execute-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals proposal-id) err-proposal-not-found))
    )
    ;; Check if voting period ended
    (asserts! (>= block-height (get end-block proposal)) err-voting-closed)
    ;; Check if not already executed
    (asserts! (not (get executed proposal)) err-already-voted)
    ;; Check if proposal passed (yes > no)
    (asserts! (> (get yes-votes proposal) (get no-votes proposal)) err-owner-only)
    
    ;; Mark as executed
    (map-set proposals proposal-id (merge proposal { executed: true }))
    
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals proposal-id)
)

(define-read-only (get-user-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)

(define-read-only (get-proposal-count)
  (var-get proposal-count)
)
```

### **2.2 Testing Your Voting System**

**Update Clarinet.toml:**
```toml
[contracts.simple-voting]
path = "contracts/simple-voting.clar"
clarity_version = 2
epoch = 2.4
```

**Console Testing:**
```bash
# Deploy and test voting system
clarinet console
clarinet>> ::deploy_contract simple-voting contracts/simple-voting.clar

# Test SIP-010 token functions
clarinet>> (contract-call? .simple-voting get-name)
clarinet>> (contract-call? .simple-voting get-symbol)
clarinet>> (contract-call? .simple-voting get-total-supply)

# Mint governance tokens (only owner can do this)
clarinet>> (contract-call? .simple-voting mint u1000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
clarinet>> (contract-call? .simple-voting mint u500000 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)

# Check balances
clarinet>> (contract-call? .simple-voting get-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

# Create proposal
clarinet>> (contract-call? .simple-voting create-proposal "Workshop Proposal #1" "This is our first proposal in the voting workshop" u100)

# Vote on proposal (yes = true, no = false)
clarinet>> (contract-call? .simple-voting vote u1 true)

# Switch to different account and vote
clarinet>> ::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
clarinet>> (contract-call? .simple-voting vote u1 false)

# Check proposal results
clarinet>> (contract-call? .simple-voting get-proposal u1)
clarinet>> (contract-call? .simple-voting get-user-vote u1 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```

---

## **Step 3: Voting Project Complete! (15 menit)**

### **🎉 Deliverables Checklist:**
```bash
# ✅ Simple Voting Workshop Checklist
# [ ] SIP-010 compliant governance token created
# [ ] Proposal creation working
# [ ] Voting mechanism working
# [ ] Vote counting accurate
# [ ] Proposal execution working
# [ ] Local testing completed
# [ ] Ready for testnet deployment
```

### **🚀 Next Steps (Optional):**
If you finish early, try adding these features:
```lisp
;; Add minimum token requirement for proposals
(define-constant min-proposal-tokens u10000)

;; Add proposal deposit mechanism
(define-public (create-proposal-with-deposit (title (string-ascii 64)) (description (string-ascii 256)) (duration uint) (deposit uint))
  (begin
    (asserts! (>= (ft-get-balance gov-token tx-sender) min-proposal-tokens) err-owner-only)
    (try! (ft-transfer? gov-token deposit tx-sender (as-contract tx-sender)))
    (create-proposal title description duration)
  )
)

;; Add delegation system
(define-map delegations principal principal)

(define-public (delegate-to (delegate principal))
  (begin
    (asserts! (not (is-eq tx-sender delegate)) err-owner-only)
    (ok (map-set delegations tx-sender delegate))
  )
)
```

### **📝 Project Documentation:**
Create a `VOTING_README.md`:
```markdown
# Workshop Voting System

## Description
Simple governance system dengan SIP-010 token dan basic voting functionality.

## Features
- ✅ SIP-010 compliant governance token
- ✅ Proposal creation dan management
- ✅ Token-weighted voting
- ✅ Proposal execution

## Contract Functions
- `mint` - Mint governance tokens (owner only)
- `create-proposal` - Create new proposal
- `vote` - Vote on proposal
- `execute-proposal` - Execute approved proposal
- `get-proposal` - Get proposal details
- `get-user-vote` - Check user's vote

## Testing Commands
[Include your console testing commands here]
```

---

# 🚀 Project Completion Checklist

## **For All Projects:**

### **✅ Core Implementation**
- [ ] All main functions implemented
- [ ] Error handling untuk edge cases
- [ ] Access control mechanisms
- [ ] Data validation

### **✅ Testing & Validation**
- [ ] Console testing completed
- [ ] All functions tested manually
- [ ] Edge cases validated
- [ ] Documentation updated

### **✅ Code Quality**
- [ ] Code comments added
- [ ] Constants defined appropriately
- [ ] Helper functions extracted
- [ ] Security best practices followed

### **✅ Project Documentation**
- [ ] README.md dengan project overview
- [ ] Function documentation
- [ ] Usage examples
- [ ] Known limitations listed

---

# 💡 Tips for Success

## **Development Best Practices:**
1. **Start Small** - Implement core functions first, then add features
2. **Test Frequently** - Use console testing after each function
3. **Error Handling** - Always validate inputs dan handle edge cases
4. **Documentation** - Write clear comments dan documentation
5. **Security** - Consider access control dan validation

## **Time Management:**
- **Hour 1:** Project setup dan basic structure
- **Hour 2:** Core functions implementation
- **Hour 3:** Advanced features dan testing
- **Hour 4:** Documentation dan presentation prep

## **Common Pitfalls:**
- Forgetting to add access control checks
- Not handling optional values properly
- Insufficient error handling
- Over-engineering solutions

---

**🎯 Remember: The goal is to build a working prototype that demonstrates your understanding of Clarity programming and Stacks development. Focus on core functionality first, then add enhancements if time allows!**