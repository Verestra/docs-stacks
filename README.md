# Tutorial Stacks Layer 2 Bitcoin

Tutorial komprehensif untuk membangun aplikasi di Stacks, Layer 2 Bitcoin yang memungkinkan smart contracts dan DApps di ekosistem Bitcoin.

Website ini dibangun menggunakan [Docusaurus](https://docusaurus.io/), generator website static modern.

## Apa yang Akan Anda Pelajari

### 🏗️ Fondasi Teknologi
- **Teknologi Blockchain**: Memahami dasar-dasar teknologi blockchain dan cara kerjanya
- **Bitcoin**: Mendalami arsitektur Bitcoin dan mekanisme Proof of Work
- **Layer 2 Solutions**: Mengapa Layer 2 diperlukan dan bagaimana mengatasi keterbatasan Layer 1

### 🔧 Stacks Ecosystem
- **Arsitektur Stacks**: Bagaimana Stacks bekerja sebagai Layer 2 Bitcoin
- **Proof of Transfer (PoX)**: Mekanisme konsensus unik yang memanfaatkan keamanan Bitcoin
- **Nakamoto Upgrade**: Peningkatan terbaru yang membuat Stacks lebih cepat dan aman

### 💻 Pengembangan Smart Contract
- **Bahasa Clarity**: Bahasa pemrograman functional yang aman untuk smart contracts
- **Clarinet**: Environment pengembangan lokal untuk testing dan deployment
- **SIP Standards**: Token standards (SIP-010 untuk Fungible Tokens, SIP-009 untuk NFTs)

### 🚀 Aplikasi Praktis
- **Setup Wallet**: Menggunakan Leather Wallet untuk berinteraksi dengan Stacks
- **Fungible Tokens**: Membuat dan mengelola token ERC-20 style di Stacks
- **Non-Fungible Tokens (NFTs)**: Membangun koleksi NFT yang compliant dengan SIP-009
- **NFT Marketplace**: Proyek akhir - marketplace NFT full-stack

## Struktur Tutorial

1. **[Fondasi Blockchain](./docs/blockchain-fundamentals/)** - Memahami teknologi dasar
2. **[Pengenalan Stacks](./docs/stacks-introduction/)** - Arsitektur dan konsep Stacks
3. **[Setup Development](./docs/development-setup/)** - Menyiapkan environment pengembangan
4. **[Clarity Basics](./docs/clarity-language/)** - Belajar bahasa Clarity
5. **[Token Development](./docs/token-development/)** - Membuat Fungible dan Non-Fungible Tokens
6. **[Final Project](./docs/nft-marketplace/)** - Membangun NFT Marketplace

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

Perintah ini memulai development server lokal dan membuka browser window. Sebagian besar perubahan akan tercermin secara langsung tanpa perlu restart server.

## Build

```bash
npm run build
```

Perintah ini menghasilkan konten static ke dalam direktori `build` dan dapat disajikan menggunakan layanan hosting konten static apa pun.

## Deployment

Menggunakan SSH:

```bash
USE_SSH=true npm run deploy
```

Tidak menggunakan SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

Jika Anda menggunakan GitHub pages untuk hosting, perintah ini adalah cara yang mudah untuk build website dan push ke branch `gh-pages`.
