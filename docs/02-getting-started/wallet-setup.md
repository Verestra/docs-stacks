---
sidebar_position: 7
title: 7. Setup Wallet
description: Panduan lengkap instalasi dan konfigurasi Leather Wallet untuk berinteraksi dengan Stacks blockchain, termasuk setup testnet dan security best practices
keywords: [leather wallet, stacks wallet, testnet, wallet setup, security, private key, seed phrase]
---

# Setup Stacks Wallet

Untuk berinteraksi dengan aplikasi Stacks dan mengelola aset digital Anda, Anda memerlukan wallet Stacks. Leather Wallet adalah wallet browser extension yang paling populer dan user-friendly untuk ekosistem Stacks.

## Step 1: Installing Leather Wallet Extension

### Download dan Install

1. **Kunjungi Website Resmi**
   - Buka browser dan navigasi ke https://leather.io
   - Pastikan Anda menggunakan URL resmi untuk menghindari phishing

2. **Install dari Chrome Web Store**
   - Klik tombol "Install Leather now" 
   - Pilih "Install from Chrome Web Store"
   - Anda akan diarahkan ke Chrome Web Store
   - Klik "Add to Chrome" (atau browser Anda - Leather support Chrome, Brave, Edge)

3. **Pin Extension**
   - Setelah instalasi selesai, pin extension ke browser toolbar
   - Klik icon puzzle di browser toolbar
   - Temukan Leather dan klik pin icon
   - Sekarang Leather icon akan selalu visible di toolbar

### Browser Compatibility

```
Supported Browsers:
├── Chrome: Full support ✅
├── Brave: Full support ✅  
├── Edge: Full support ✅
├── Firefox: Limited support ⚠️
├── Safari: Not supported ❌
└── Mobile: Use mobile apps (iOS/Android)
```

## Step 2: Creating Your Wallet

### Generate New Wallet

1. **Open Leather**
   - Klik Leather icon di browser toolbar
   - Akan muncul welcome screen

2. **Create New Wallet**
   - Pilih "Create new wallet"
   - Jangan pilih "Restore wallet" kecuali Anda sudah punya seed phrase

3. **Set Strong Password**
   ```
   Password Requirements:
   ├── Minimum 8 characters
   ├── Include uppercase letters
   ├── Include lowercase letters  
   ├── Include numbers
   ├── Include special characters
   └── Avoid common passwords
   
   Example Strong Password:
   MyStacks2024!@#$
   ```

4. **Confirm Password**
   - Re-enter password untuk konfirmasi
   - Pastikan password sama persis

### Secret Key (Seed Phrase) Backup

**VERY IMPORTANT STEP - READ CAREFULLY** 🚨

1. **View Secret Key**
   - Klik "Show key" untuk reveal 24-word seed phrase
   - Seed phrase akan tampil seperti ini:
   ```
   abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art
   ```

2. **Write Down Seed Phrase**
   ```
   Backup Methods (Choose Multiple):
   ✅ Write on paper (waterproof ink)
   ✅ Metal backup plate (fire/water resistant)  
   ✅ Multiple copies in different locations
   ✅ Safe deposit box storage
   ❌ Screenshot (can be hacked)
   ❌ Cloud storage (can be compromised)
   ❌ Email to yourself (insecure)
   ❌ Phone notes (can be lost)
   ```

3. **Verify Backup**
   - Leather akan ask you to verify beberapa words
   - Select correct words dalam correct order
   - Ini memastikan backup Anda correct

4. **Security Reminders**
   ```
   CRITICAL SECURITY RULES:
   🔒 NEVER share seed phrase dengan anyone
   🔒 NEVER enter seed phrase di website atau app lain  
   🔒 NEVER take photos dari seed phrase
   🔒 NEVER store seed phrase digitally
   🔒 ALWAYS keep multiple physical backups
   🔒 ALWAYS store dalam secure locations
   
   REMEMBER: 
   - Seed phrase = Complete control atas wallet
   - Lost seed phrase = Lost access forever
   - Compromised seed phrase = Funds stolen
   ```

## Step 3: Understanding Your Wallet

### Wallet Interface Overview

```
Leather Wallet Interface:
┌─────────────────────────────────────────────────┐
│ Account Balance                                 │
│ ├── STX Balance: Available STX tokens           │
│ ├── BTC Balance: Bitcoin balance (with sBTC)    │
│ └── Token Balances: Custom tokens (SIP-010)     │
├─────────────────────────────────────────────────┤
│ Transaction History                             │
│ ├── Recent Transactions: Send, receive, contract│
│ ├── Transaction Status: Pending, confirmed      │
│ └── Transaction Details: Amount, fees, time     │
├─────────────────────────────────────────────────┤
│ Actions                                         │
│ ├── Send: Transfer STX atau tokens              │
│ ├── Receive: Show address untuk incoming funds  │
│ ├── Swap: Exchange tokens (jika available)      │
│ └── Stacking: Lock STX untuk BTC rewards        │
├─────────────────────────────────────────────────┤
│ Settings                                        │
│ ├── Network: Testnet, Devnet (Workshop Focus)  │
│ ├── Security: Password, backup options          │
│ ├── Accounts: Multiple account management       │
│ └── Advanced: Developer options                 │
└─────────────────────────────────────────────────┘
```

### Account Management

#### Default Account
```
Your First Account:
├── Name: "Account 1" (dapat diganti)
├── STX Address: SP1ABC...XYZ (Stacks address)
├── BTC Address: bc1qxyz... (Bitcoin address)  
├── Derivation Path: m/44'/5757'/0'/0/0
└── Purpose: General transactions, DeFi, NFTs
```

#### Creating Additional Accounts
```
Multiple Account Benefits:  
├── Privacy: Separate addresses untuk different purposes
├── Organization: Personal vs business transactions
├── Security: Isolate high-value assets
├── Testing: Separate account untuk development
└── Specialization: DeFi account, NFT account, etc.

How to Create:
1. Click account dropdown
2. Select "Create Account"  
3. Give meaningful name
4. New account automatically generated
```

### Network Selection

```
Workshop Networks:
├── Testnet: Fake STX, testing environment (WORKSHOP FOCUS)  
│   ├── Use for: Testing apps, learning, development
│   ├── Costs: Free testnet STX dari faucets
│   └── Security: Test environment, dapat direset
└── Devnet: Local development network
    ├── Use for: Local app development
    ├── Costs: Free local STX
    └── Security: Completely local, fast reset
```

## Step 4: Getting Your First STX

### Testnet STX (untuk Learning)

1. **Switch ke Testnet**
   ```
   Steps:
   1. Open Leather wallet
   2. Click settings (gear icon)
   3. Select "Network"
   4. Choose "Testnet"
   5. Confirm network switch
   ```

2. **Get Testnet STX**
   ```
   Faucet Options:
   ├── Official Stacks Faucet: https://explorer.hiro.so/sandbox/faucet
   ├── Hiro Faucet: Free testnet STX
   ├── Developer Tools: Clarinet local faucet
   └── Community Faucets: Various community resources
   
   Process:
   1. Copy your Testnet STX address dari Leather
   2. Visit faucet website
   3. Paste address dan request tokens
   4. Wait for transaction confirmation
   5. Check balance dalam Leather
   ```

---

## Step 5: Security Best Practices (Workshop Focus)

### Wallet Security

```
Essential Security Measures:
├── Strong Password:
│   ├── Use unique password (tidak reused)
│   ├── Enable 2FA jika available
│   ├── Use password manager
│   └── Regular password updates
├── Seed Phrase Protection:
│   ├── Multiple physical backups
│   ├── Secure storage locations
│   ├── Fire/water resistant materials
│   └── Access control (safe, vault)
├── Device Security:
│   ├── Keep browser updated
│   ├── Use antivirus software
│   ├── Avoid public WiFi untuk transactions
│   └── Lock screen when away
└── Transaction Hygiene:
    ├── Always verify recipient addresses
    ├── Double-check amounts before sending
    ├── Use small test amounts first
    └── Keep transaction records
```

### Common Security Threats

```
Threats to Avoid:
├── Phishing Websites:
│   ├── Always check URL carefully
│   ├── Bookmark legitimate sites
│   ├── Never click suspicious links
│   └── Verify SSL certificates
├── Fake Browser Extensions:
│   ├── Only install dari official stores
│   ├── Check developer verification
│   ├── Read reviews carefully
│   └── Monitor permissions requested
├── Social Engineering:
│   ├── Never share seed phrases
│   ├── Be suspicious dari "support" contacts
│   ├── No legitimate service asks untuk seed phrases
│   └── Verify requests through official channels
├── Malware:
│   ├── Use reputable antivirus
│   ├── Keep system updated
│   ├── Don't download suspicious files
│   └── Be careful dengan USB devices
└── Public WiFi:
    ├── Use VPN untuk additional security
    ├── Avoid transactions on public networks
    ├── Use mobile data instead when possible
    └── Enable HTTPS everywhere
```

### Recovery Procedures

```
If You Lose Access:
├── Forgot Password:
│   ├── Use seed phrase untuk restore wallet
│   ├── Create new password
│   ├── Verify all accounts restored
│   └── Update password manager
├── Lost Seed Phrase:
│   ├── If wallet still accessible: create new wallet immediately
│   ├── Transfer all assets ke new wallet
│   ├── Create proper seed phrase backup
│   └── Decommission old wallet
├── Compromised Wallet:
│   ├── Immediately transfer assets ke secure wallet  
│   ├── Report incident if exchange involved
│   ├── Monitor addresses untuk suspicious activity
│   └── Learn dari incident untuk prevention
└── Device Issues:
    ├── Install Leather pada new device
    ├── Use seed phrase untuk restore
    ├── Verify all accounts dan balances
    └── Update security measures
```

## Step 6: Basic Wallet Operations

### Receiving STX

1. **Get Your Address**
   ```
   Steps:
   1. Open Leather wallet
   2. Click "Receive" button
   3. Copy STX address (starts dengan SP...)
   4. Share address dengan sender
   5. Wait untuk transaction confirmation
   ```

2. **Address Format**
   ```
   Stacks Address Example:
   SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS
   
   Format Rules:
   ├── Starts dengan ST (testnet) - Workshop Focus
   ├── Length: 40 characters after prefix
   ├── Case-sensitive: Capital letters only
   ├── Base58 encoding: No 0, O, I, l characters
   └── Checksum: Built-in error detection
   ```

### Sending STX

1. **Prepare Transaction**
   ```
   Required Information:
   ├── Recipient Address: Verify carefully
   ├── Amount: Double-check decimal places
   ├── Network Fee: Gas fee dalam STX
   ├── Memo: Optional message (public)
   └── Account: Select sending account
   ```

2. **Transaction Process**
   ```
   Steps:
   1. Click "Send" dalam wallet
   2. Enter recipient address
   3. Enter amount untuk send
   4. Review transaction details
   5. Confirm transaction
   6. Wait untuk network confirmation
   ```

3. **Transaction Fees**
   ```
   Fee Structure:
   ├── Base Fee: Minimum network fee
   ├── Priority Fee: Extra fee untuk faster confirmation
   ├── Contract Execution: Additional fee untuk smart contracts
   └── Total Fee: All fees combined
   
   Typical Fees:
   ├── Simple Transfer: 0.001-0.01 STX
   ├── Smart Contract: 0.01-0.1 STX
   ├── Complex DeFi: 0.1-1 STX
   └── NFT Minting: 0.05-0.5 STX
   ```

## Step 7: Advanced Features

### Stacking (Earning BTC)

```
Stacking Overview:
├── Purpose: Lock STX, earn BTC rewards
├── Minimum: 100,000 STX (atau pool delegation)
├── Duration: 2-week cycles, choose 1-8 cycles
├── Rewards: 5-12% annual yield dalam BTC
├── Risk: STX locked, cannot sell during period
└── Delegation: Can delegate ke pools dengan smaller amounts
```

### Multiple Account Management

```
Account Organization:
├── Main Account: Daily transactions
├── DeFi Account: Liquidity providing, farming
├── NFT Account: Digital art, collectibles
├── Stacking Account: Long-term STX holding
├── Trading Account: Active trading
└── Development Account: Testing, experimentation
```

### Hardware Wallet Integration

```
Hardware Wallet Support:
├── Ledger: Full Stacks support dengan Ledger Live
├── Trezor: Limited support, community tools
├── Setup Process: Install Stacks app pada hardware wallet
├── Security Benefit: Private keys never exposed
└── Trade-off: Slower transactions, need physical device
```

## Troubleshooting Common Issues

### Connection Problems

```
Common Solutions:
├── Refresh browser page
├── Restart browser
├── Clear browser cache
├── Disable conflicting extensions
├── Check network status
└── Update Leather extension
```

### Transaction Issues

```
Failed Transactions:
├── Insufficient Balance: Need more STX untuk fees
├── Network Congestion: Wait atau increase fee
├── Invalid Address: Double-check recipient
├── Contract Error: Check contract status
└── Nonce Issues: Wait untuk previous TX confirmation
```

### Recovery Issues

```
Wallet Recovery:
├── Verify seed phrase word order
├── Check for typos dalam words
├── Ensure correct network selected
├── Try different derivation paths
└── Contact support jika persistent issues
```

## Kesimpulan

Setting up Leather Wallet adalah langkah pertama penting dalam Stacks ecosystem:

**Key Takeaways:**
✅ **Security First**: Seed phrase backup adalah critical  
✅ **Start Small**: Use testnet untuk learning  
✅ **Stay Updated**: Keep wallet dan browser updated  
✅ **Verify Everything**: Double-check addresses dan amounts  
✅ **Learn Gradually**: Master basic features sebelum advanced  

**Next Steps:**
1. Practice sending small amounts pada testnet
2. Explore DeFi applications seperti Alex DEX
3. Try minting atau buying NFTs
4. Learn about stacking untuk BTC rewards  
5. Develop smart contracts dengan Clarinet

Dengan wallet setup yang proper, Anda siap untuk explore rich ecosystem Stacks applications dan services.

---

**Selanjutnya**: Mari setup development environment dengan Clarinet untuk building smart contracts.

👉 **[Lanjut ke Clarinet Setup →](./clarinet-setup.md)**