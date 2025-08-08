# Pengenalan Bitcoin

Bitcoin adalah sistem uang terdesentralisasi - sebuah cryptocurrency - yang menggunakan kriptografi fundamental untuk mengamankan aset (koin BTC) dalam ledger terdesentralisasi tanpa memerlukan perantara. Tidak seperti mata uang fiat tradisional yang dikontrol oleh bank sentral dan pemerintah, Bitcoin diatur oleh kode, matematika, dan kriptografi, membuatnya tahan terhadap sensor, korupsi, dan campur tangan dari entitas tunggal.

## Sejarah dan Visi Bitcoin

### Kelahiran Bitcoin
- **31 Oktober 2008**: Satoshi Nakamoto mempublikasikan Bitcoin whitepaper
- **3 Januari 2009**: Block Genesis Bitcoin ditambang
- **12 Januari 2009**: Transaksi Bitcoin pertama (Satoshi ke Hal Finney)
- **22 Mei 2010**: Bitcoin Pizza Day - 10,000 BTC untuk 2 pizza ($41 saat itu)

### Masalah yang Dipecahkan Bitcoin

#### Double Spending Problem
Sebelum Bitcoin, tidak ada cara untuk mencegah seseorang menghabiskan digital money yang sama dua kali tanpa otoritas pusat. Bitcoin memecahkan ini dengan:
- **Distributed ledger**: Semua transaksi dicatat secara publik
- **Consensus mechanism**: Network sepakat tentang transaksi mana yang valid
- **Cryptographic proof**: Transaksi dibuktikan secara matematis

#### Byzantine Generals Problem
Bagaimana mencapai konsensus dalam network terdistribusi di mana beberapa node mungkin tidak dapat dipercaya? Bitcoin menyelesaikannya dengan:
- **Proof of Work**: Membuat biaya ekonomi untuk menjadi dishonest
- **Longest chain rule**: Node mengikuti chain dengan proof of work terbanyak
- **Economic incentives**: Miners diberi reward untuk berperilaku jujur

## Arsitektur Bitcoin dan Cara Kerjanya

Bitcoin beroperasi pada blockchain - rantai "blok" yang berisi grup transaksi yang diurutkan secara berurutan. Blockchain berfungsi sebagai ledger publik terdistribusi yang secara permanen mencatat semua transaksi.

### Komponen Kunci Arsitektur Bitcoin

#### 1. Nodes (Node)
Komputer yang berpartisipasi dalam network dengan memvalidasi dan merelay transaksi:

```
Full Node:
├── Menyimpan blockchain lengkap (~500GB+)
├── Memvalidasi semua transaksi dan blok
├── Merelay transaksi ke node lain
└── Menegakkan aturan consensus

Light Node (SPV):
├── Menyimpan block headers saja
├── Bergantung pada full nodes untuk data
├── Cocok untuk mobile wallets
└── Trade-off: security vs resource usage
```

#### 2. Miners (Penambang)
Node khusus yang berkompetisi untuk memproduksi blok baru dan mendapat reward:

**Peran Miners:**
- Mengumpulkan transaksi dari mempool
- Memvalidasi transaksi
- Membuat block template
- Menghitung hash yang memenuhi difficulty target
- Broadcast blok baru ke network

**Mining Hardware Evolution:**
```
CPU (2009-2010) → GPU (2010-2013) → ASIC (2013-sekarang)
```

#### 3. Transactions (Transaksi)
Transfer Bitcoin antar address yang diamankan oleh tanda tangan kriptografi:

**Struktur Transaksi:**
```
Transaction:
├── Version: Versi protokol transaksi
├── Inputs: Referensi ke output transaksi sebelumnya
│   ├── Previous TX Hash
│   ├── Output Index
│   └── Signature Script (scriptSig)
├── Outputs: Tujuan dan jumlah Bitcoin
│   ├── Value: Jumlah satoshi
│   └── Public Key Script (scriptPubKey)
├── Locktime: Waktu kapan transaksi bisa dimasukkan ke blok
└── TX Fee: Biaya untuk miners
```

**Contoh Transaksi Sederhana:**
```
Alice ingin mengirim 1 BTC ke Bob:

Input:
- Alice memiliki UTXO senilai 1.5 BTC dari transaksi sebelumnya
- Alice menggunakan private key untuk sign input

Output:
- 1.0 BTC ke address Bob
- 0.499 BTC kembali ke address Alice (change)
- 0.001 BTC sebagai transaction fee untuk miners
```

#### 4. Blocks (Blok)
Grup transaksi yang ditambahkan ke blockchain sekitar setiap 10 menit:

**Struktur Blok:**
```
Block Header (80 bytes):
├── Version: Versi block
├── Previous Block Hash: Hash dari blok sebelumnya (32 bytes)
├── Merkle Root: Root dari merkle tree transaksi (32 bytes)
├── Timestamp: Waktu pembuatan blok (4 bytes)
├── Difficulty Target: Target untuk mining (4 bytes)
├── Nonce: Angka yang divariasikan miners (4 bytes)
└── Block Hash: SHA-256 dari block header

Block Body:
├── Transaction Count: Jumlah transaksi dalam blok
└── Transactions: Daftar transaksi lengkap
```

#### 5. Consensus Rules
Protokol yang menentukan bagaimana network mencapai kesepakatan tentang validitas transaksi:

**Aturan Validasi Transaksi:**
- Input harus reference ke UTXO yang valid
- Signature harus valid untuk public key yang benar
- Total input ≥ total output + fee
- No double spending
- Conform to script rules

**Aturan Validasi Blok:**
- Block header harus memiliki format yang benar
- Proof of work harus memenuhi difficulty target
- Semua transaksi dalam blok harus valid
- Merkle root harus match dengan transaksi
- Block size tidak boleh > 1MB (pre-SegWit rule)

## UTXO Model

Bitcoin menggunakan UTXO (Unspent Transaction Output) model, berbeda dengan account-based model:

### Cara Kerja UTXO

```
Contoh: Alice memiliki 5 BTC, ingin kirim 2 BTC ke Bob

Step 1: Alice punya UTXO
UTXO 1: 3 BTC (dari transaksi lama)
UTXO 2: 2 BTC (dari transaksi lama)
Total: 5 BTC

Step 2: Alice buat transaksi
Input:  UTXO 1 (3 BTC) + UTXO 2 (2 BTC) = 5 BTC
Output: 2 BTC ke Bob + 2.99 BTC change ke Alice + 0.01 BTC fee
```

### Keunggulan UTXO Model

1. **Privacy**: Setiap transaksi bisa menggunakan address baru
2. **Parallelization**: Transaksi yang tidak terkait bisa diproses paralel
3. **Auditability**: Mudah memverifikasi total supply
4. **Stateless**: Setiap UTXO independent, tidak perlu state global

## Merkle Trees

Bitcoin menggunakan Merkle trees untuk efisiensi dan keamanan:

```
Merkle Tree Example:
                Root Hash
               /          \
         Hash(H1+H2)    Hash(H3+H4)
         /        \        /        \
    Hash(TX1)  Hash(TX2) Hash(TX3) Hash(TX4)
       |         |         |         |
      TX1       TX2       TX3       TX4
```

**Keunggulan:**
- **Efficient verification**: Bisa verifikasi transaksi tanpa download seluruh blok
- **Tamper detection**: Perubahan satu transaksi akan mengubah root hash
- **SPV support**: Light clients bisa verifikasi transaksi dengan merkle proof

## Address dan Key Management

### Jenis Address Bitcoin

#### 1. Legacy Address (P2PKH)
```
Format: 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2
- Dimulai dengan '1'
- Pay-to-Public-Key-Hash
- Format paling lama, support universal
- Transaction fee paling tinggi
```

#### 2. Script Address (P2SH)
```
Format: 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
- Dimulai dengan '3'
- Pay-to-Script-Hash
- Support multi-signature dan complex scripts
- Medium transaction fee
```

#### 3. Native SegWit (Bech32)
```
Format: bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4
- Dimulai dengan 'bc1'
- Paling efisien untuk transaction fee
- Support terbaru, beberapa exchange/service belum support
- Lowercase only
```

### Key Derivation

Bitcoin menggunakan hierarchical deterministic (HD) wallets:

```
Seed Phrase (12/24 words)
    ↓
Master Private Key
    ↓
Extended Private Keys (m/44'/0'/0')
    ↓
Account Private Keys (m/44'/0'/0'/0)
    ↓
Individual Private Keys (m/44'/0'/0'/0/0, m/44'/0'/0'/0/1, ...)
    ↓
Public Keys (secp256k1 curve)
    ↓
Bitcoin Addresses
```

## Network Types

### 1. Mainnet
- **Jaringan utama** Bitcoin dengan value ekonomi real
- **Block time**: ~10 menit
- **Difficulty adjustment**: Setiap 2016 blok (~2 minggu)
- **Genesis block**: 3 Januari 2009

### 2. Testnet
- **Jaringan testing** untuk development
- **Coins tidak memiliki value** ekonomi real
- **Faster reset**: Bisa direset jika diperlukan
- **Address prefix**: Dimulai dengan 'm' atau 'n' (legacy), '2' (script), 'tb1' (bech32)

### 3. Regtest
- **Local testing** environment
- **Instant mining**: Bisa generate blok instantly
- **Full control**: Developer punya kontrol penuh
- **Reset sesuka hati**: Perfect untuk unit testing

## Mining dan Difficulty Adjustment

### Mining Process
```
1. Miner mengumpulkan transaksi dari mempool
2. Membuat block template dengan:
   - Coinbase transaction (block reward + fees)
   - Valid transactions from mempool
   - Block header dengan previous block hash
3. Mencari nonce yang membuat block hash < difficulty target
4. Broadcast blok ke network jika ditemukan
5. Network memvalidasi dan accept/reject blok
```

### Difficulty Adjustment Algorithm
```python
new_difficulty = old_difficulty * (actual_time / target_time)

Where:
- target_time = 2016 blok * 10 menit = 20,160 menit
- actual_time = waktu real untuk mining 2016 blok terakhir
- Adjustment maximum: 4x naik atau 4x turun per periode
```

**Tujuan**: Mempertahankan block time ~10 menit meskipun hash rate berubah

## Bitcoin Script

Bitcoin menggunakan script language sederhana untuk menentukan kondisi spending:

### Jenis Script Umum

#### 1. Pay-to-Public-Key-Hash (P2PKH)
```
scriptPubKey: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
scriptSig: <signature> <publicKey>

Execution:
1. Push signature dan public key ke stack
2. Duplicate public key
3. Hash public key
4. Verify hash matches pubKeyHash
5. Verify signature with public key
```

#### 2. Pay-to-Script-Hash (P2SH)
```
scriptPubKey: OP_HASH160 <scriptHash> OP_EQUAL
scriptSig: <data> <redeemScript>

Use case: Multi-signature wallets
```

#### 3. Multi-Signature
```
2-of-3 multisig:
OP_2 <pubKey1> <pubKey2> <pubKey3> OP_3 OP_CHECKMULTISIG

Membutuhkan 2 dari 3 signature untuk spend
```

## Economic Model

### Block Rewards
```
2009-2012: 50 BTC per blok
2012-2016: 25 BTC per blok  
2016-2020: 12.5 BTC per blok
2020-2024: 6.25 BTC per blok
2024-2028: 3.125 BTC per blok
...
```

**Halving**: Setiap ~4 tahun (210,000 blok), block reward dibagi dua

### Total Supply
```
Total Bitcoin Supply = 21,000,000 BTC (approximately)
Current Circulating Supply ≈ 19.7M BTC (per 2024)
Lost Bitcoin estimate ≈ 3-4M BTC
```

### Transaction Fees
```
Fee = (Input UTXO value) - (Output value)
Fee rate = Fee / Transaction size (sat/vByte)

Factors affecting fees:
- Network congestion
- Transaction size (inputs/outputs count)
- Priority (higher fee = faster confirmation)
```

## Keamanan Bitcoin

### Kekuatan Keamanan
1. **Cryptographic**: SHA-256, ECDSA secp256k1
2. **Economic**: Cost to attack > potential gain
3. **Network effect**: Lebih banyak nodes = lebih secure
4. **Time-tested**: 15+ tahun tanpa major security breach

### Potential Attack Vectors
1. **51% Attack**: Control majority mining power
2. **Double Spending**: Spend same UTXO twice
3. **Selfish Mining**: Withhold blocks untuk advantage
4. **Eclipse Attack**: Isolate node dari network

### Security Best Practices
```
✅ Use hardware wallets untuk large amounts
✅ Multi-signature untuk business/organization
✅ Verify receiving addresses
✅ Keep private keys offline (cold storage)
✅ Use full nodes untuk maximum security
✅ Regular backup seed phrases
❌ Jangan share private keys/seed phrases
❌ Jangan gunakan brain wallets
❌ Jangan reuse addresses
```

## Keterbatasan Bitcoin

Meskipun revolusioner, Bitcoin memiliki keterbatasan signifikan:

### 1. Scalability Issues
- **7 TPS**: Hanya ~7 transaksi per detik
- **Block size limit**: 1MB block size (4MB weight dengan SegWit)
- **Confirmation time**: 10 menit per blok, 6 konfirmasi untuk finality

### 2. High Transaction Fees
```
Biaya transaksi Bitcoin (historical):
2017 Bull Run: $50+ per transaksi
2021 Bull Run: $40+ per transaksi
Normal time: $1-5 per transaksi
Low activity: $0.50-1 per transaksi
```

### 3. Energy Consumption
- **~150 TWh/year**: Setara konsumsi energi negara kecil
- **Carbon footprint**: Concern lingkungan meskipun banyak mining menggunakan renewable energy

### 4. Limited Programmability
```
Bitcoin Script limitations:
❌ Tidak Turing complete
❌ Tidak ada loops
❌ Tidak ada complex state management
❌ Tidak ada native support untuk complex financial instruments
✅ Simple, predictable, secure
✅ Focused pada value transfer
```

## Mengapa Keterbatasan Ini Ada?

Bitcoin's limitations bukanlah bug, tetapi design choice yang disengaja untuk memprioritaskan:

1. **Security**: Script language sederhana mengurangi attack surface
2. **Decentralization**: Block size kecil memungkinkan lebih banyak node
3. **Stability**: Conservative approach untuk network triliunan dollar
4. **Predictability**: Simple rules lebih mudah dipahami dan diaudit

## Bitcoin sebagai Settlement Layer

Dengan keterbataannya, Bitcoin fungsi sebagai **settlement layer** - foundation untuk system pembayaran lainnya:

### Analogi: Banking System
```
Bitcoin = Central Bank Settlement
Lightning Network = Bank transfers  
Stacks = Investment banking
Liquid = Corporate banking
```

### Value Proposition Bitcoin
✅ **Digital Gold**: Store of value yang tahan inflasi  
✅ **Censorship Resistance**: Tidak bisa di-freeze atau disita  
✅ **Global Access**: 24/7, borderless  
✅ **Programmable Money**: Basic smart contract capability  
✅ **Network Effect**: Paling established cryptocurrency  

## Kesimpulan

Bitcoin adalah foundational layer yang membuktikan bahwa:

1. **Decentralized consensus** bisa bekerja dalam skala global
2. **Digital scarcity** bisa diciptakan tanpa otoritas pusat  
3. **Cryptoeconomics** bisa mengamankan network triliunan dollar
4. **Peer-to-peer value transfer** mungkin tanpa intermediary

Namun keterbatasan Bitcoin dalam programmability dan scalability membuka peluang untuk **Layer 2 solutions** seperti Stacks yang bisa menambah functionality sambil memanfaatkan keamanan Bitcoin.

---

**Selanjutnya**: Mari pelajari mekanisme Proof of Work yang mengamankan Bitcoin dan mengapa ini penting untuk memahami Proof of Transfer di Stacks.

👉 **[Lanjut ke Proof of Work →](./proof-of-work.md)**