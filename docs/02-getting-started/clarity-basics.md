---
sidebar_position: 9
title: 9. Dasar-dasar Clarity
description: Pengenalan bahasa pemrograman Clarity - syntax, tipe data, functions, error handling, dan konsep fundamental untuk smart contract development
keywords: [clarity language, smart contract programming, functional programming, lisp syntax, stacks development]
---

# Dasar-Dasar Clarity

Clarity adalah bahasa pemrograman functional yang dirancang khusus untuk mengembangkan smart contracts di blockchain Stacks. Tidak seperti banyak bahasa pemrograman tradisional yang mengikuti paradigma imperative, Clarity mengadopsi pendekatan functional di mana komputasi diperlakukan sebagai evaluasi fungsi matematika sambil menghindari perubahan state atau mutable data.

## Apa itu Clarity?

Clarity adalah interpreted, decidable smart contract language yang berjalan di Stacks blockchain. Berbeda dengan Solidity (Ethereum) yang di-compile, Clarity code di-deploy ke network dalam bentuk aslinya, memungkinkan full transparency dan auditability.

### Karakteristik Utama Clarity

```
Clarity Features:
├── Functional Programming: Pure functions, immutable data
├── Interpreted Language: No compilation step
├── Decidable: Can predict execution cost
├── Type Safe: Strong static typing
├── Bitcoin-aware: Native Bitcoin integration
├── Security-focused: Prevents common vulnerabilities
└── Readable: Human-readable syntax
```

## Mengapa Clarity Dipilih untuk Stacks?

Clarity dipilih secara deliberate sebagai bahasa pemrograman untuk Stacks due to beberapa advantages over languages lain dalam konteks blockchain:

### 1. Predictability (Keterdugaan)

```lisp
;; Clarity function - completely predictable
(define-public (add-numbers (a uint) (b uint))
  (ok (+ a b))
)

;; Execution cost dapat diprediksi exactly:
;; - Function call: 5 units
;; - Addition operation: 1 unit  
;; - Return value: 1 unit
;; Total: 7 units (deterministic)
```

Dengan mengikuti paradigma functional dan tidak memiliki side effects, Clarity code sangat predictable dan mengurangi ambiguity, yang critical untuk financial applications.

### 2. No Compiler

```
Traditional Smart Contract:
Source Code → Compiler → Bytecode → Deploy
Problem: Bugs bisa introduced during compilation

Clarity Approach:
Source Code → Direct Deploy
Benefit: What you see is what gets executed
```

Clarity code tidak di-compile tetapi di-deploy ke network as-is, menghilangkan risiko bugs being introduced selama proses compilation.

### 3. Security

```lisp
;; Clarity prevents common vulnerabilities automatically:

;; Reentrancy protection - built-in
(define-public (withdraw (amount uint))
  (let ((balance (get-balance tx-sender)))
    (asserts! (>= balance amount) (err u1))
    ;; State updated before external call - no reentrancy possible
    (map-set user-balances tx-sender (- balance amount))
    (stx-transfer? amount tx-sender tx-sender)
  )
)

;; Integer overflow protection - built-in  
(+ u18446744073709551615 u1) ;; Error: overflow detected at compile time

;; Access control - explicit checks required
(define-public (admin-function)
  (asserts! (is-eq tx-sender contract-owner) (err u403))
  ;; Function body
  (ok true)
)
```

Language ini dirancang dengan blockchain environments dalam mind, memungkinkan developers untuk menambahkan custom conditions ke any transaction untuk prevent unexpected behavior.

### 4. Decidability

```lisp
;; Clarity is designed to be decidable
(define-read-only (fibonacci (n uint))
  (if (<= n u1)
    n
    (+ (fibonacci (- n u1)) (fibonacci (- n u2)))
  )
)

;; Execution cost: O(2^n) - predictable tapi expensive
;; Developer dapat determine cost sebelum execution
;; Network dapat reject jika cost too high
```

Clarity dirancang untuk decidable, meaning it's possible untuk menentukan berapa biaya execution smart contract tertentu just by looking at the code, tanpa actually running it.

## Syntax Dasar Clarity

### 1. Comments

```lisp
;; This is a single-line comment

;; Multi-line comments
;; dapat dibuat dengan
;; multiple single-line comments

;; Documentation comments untuk functions
;; @desc: Adds two numbers together
;; @param a: First number
;; @param b: Second number  
;; @returns: Sum of a and b
(define-public (add (a uint) (b uint))
  (ok (+ a b))
)
```

### 2. Data Types

#### Basic Types
```lisp
;; Unsigned integers (non-negative)
u0 u1 u42 u1000000

;; Signed integers  
0 1 -42 1000000

;; Booleans
true false

;; Strings (ASCII - max 128 bytes)
"hello world" "Stacks is awesome!"

;; UTF-8 strings (max 1024 bytes)  
u"Hello 🌍" u"こんにちは"

;; Buffers (byte arrays - max 1024 bytes)
0x48656c6c6f 0x00112233

;; Principal (Stacks addresses)
'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE
'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.my-contract

;; None (represents absence of value)
none

;; Some (wraps a value)
(some u42)
(some "hello")
```

#### Collection Types
```lisp
;; Lists (max 32768 elements)
(list u1 u2 u3 u4 u5)
(list "alice" "bob" "charlie")

;; Tuples (key-value pairs)
{name: "Alice", age: u25, active: true}
{x: u10, y: u20}

;; Optional types
(some u42)   ;; Has value
none         ;; No value

;; Response types (for error handling)
(ok u42)           ;; Success dengan value
(err u404)         ;; Error dengan error code
(ok "success")     ;; Success dengan string
(err "not found")  ;; Error dengan message
```

### 3. Variables

#### Constants
```lisp
;; Define constants (immutable)
(define-constant contract-owner 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE)
(define-constant max-supply u1000000)
(define-constant error-not-authorized (err u403))
(define-constant token-name "My Token")

;; Constants must be defined at top level
;; Cannot be changed after deployment
;; Naming convention: kebab-case
```

#### Data Variables
```lisp
;; Define mutable data variables
(define-data-var counter uint u0)
(define-data-var total-supply uint u0)
(define-data-var contract-paused bool false)
(define-data-var base-uri (string-ascii 256) "https://api.example.com/")

;; Access data variables
(var-get counter)          ;; Read current value
(var-set counter u10)      ;; Set new value
```

#### Maps
```lisp
;; Define maps (key-value storage)
(define-map user-balances 
  principal     ;; Key type
  uint         ;; Value type
)

(define-map user-profiles
  principal                    ;; Key type
  {                           ;; Value type (tuple)
    name: (string-ascii 50),
    email: (string-ascii 100),
    verified: bool
  }
)

;; Map operations
(map-get? user-balances 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE)
(map-set user-balances 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE u1000)
(map-insert user-balances 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE u500)
(map-delete user-balances 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE)
```

### 4. Functions

#### Read-Only Functions
```lisp
;; Read-only functions - cannot modify state
(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? user-balances user))
)

(define-read-only (get-counter)
  (var-get counter)
)

;; Read-only functions:
;; - Cannot call var-set, map-set, etc.
;; - Cannot transfer tokens
;; - Free to call (no gas cost untuk reads)
;; - Can be called by other contracts
```

#### Public Functions  
```lisp
;; Public functions - can modify state, callable externally
(define-public (increment-counter)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (ok (var-get counter))
  )
)

(define-public (transfer (amount uint) (recipient principal))
  (let ((sender-balance (get-balance tx-sender)))
    (asserts! (>= sender-balance amount) (err u1))
    (map-set user-balances tx-sender (- sender-balance amount))
    (map-set user-balances recipient (+ (get-balance recipient) amount))
    (ok true)
  )
)
```

#### Private Functions
```lisp
;; Private functions - only callable within contract
(define-private (calculate-fee (amount uint))
  (/ (* amount u3) u100) ;; 3% fee
)

(define-private (is-authorized (user principal))
  (or 
    (is-eq user contract-owner)
    (is-eq user (var-get admin))
  )
)
```

### 5. Control Flow

#### Conditionals
```lisp
;; if statement
(if (> amount u0)
  (ok "positive amount")
  (err "amount must be positive")
)

;; Nested conditionals
(if (is-eq user contract-owner)
  (if (> amount max-withdrawal)
    (err u2) ;; Amount too large
    (ok true)) ;; Success
  (err u1) ;; Not authorized
)
```

#### Pattern Matching
```lisp
;; match for optional values
(match (map-get? user-balances user)
  balance (ok balance)     ;; Some case
  (err u404)              ;; None case
)

;; match for response values  
(match (stx-transfer? amount tx-sender recipient)
  success (ok success)    ;; ok case
  error (err error)       ;; err case  
)
```

#### Assertions
```lisp
;; asserts! - halt execution jika condition false
(define-public (withdraw (amount uint))
  (begin
    (asserts! (> amount u0) (err u1))                    ;; Amount must be positive
    (asserts! (is-eq tx-sender contract-owner) (err u2)) ;; Must be owner
    (asserts! (<= amount (stx-get-balance tx-sender)) (err u3)) ;; Sufficient balance
    ;; ... rest of function
    (ok true)
  )
)
```

### 6. Error Handling

```lisp
;; try! - unwrap response, return error jika err
(define-public (complex-operation (amount uint))
  (begin
    ;; jika transfer fails, function returns error immediately
    (try! (stx-transfer? amount tx-sender recipient))
    ;; jika mint fails, function returns error immediately  
    (try! (ft-mint? my-token amount recipient))
    ;; If both succeed, return success
    (ok "operation completed")
  )
)

;; unwrap! - unwrap optional, return default jika none
(define-read-only (get-user-balance (user principal))
  (unwrap! (map-get? user-balances user) u0)
)

;; unwrap-err! - unwrap error dari response
(define-public (handle-error)
  (let ((result (some-operation-that-might-fail)))
    (match result
      success (ok success)
      error (err (unwrap-err! error u999)) ;; Extract error code
    )
  )
)
```

## Built-in Functions

### 1. Arithmetic
```lisp
;; Basic arithmetic
(+ u10 u20)        ;; Addition: u30
(- u50 u30)        ;; Subtraction: u20  
(* u5 u4)          ;; Multiplication: u20
(/ u20 u4)         ;; Division: u5
(mod u23 u5)       ;; Modulo: u3

;; Comparison
(> u10 u5)         ;; Greater than: true
(< u5 u10)         ;; Less than: true
(>= u10 u10)       ;; Greater than or equal: true
(<= u5 u10)        ;; Less than or equal: true
(is-eq u10 u10)    ;; Equality: true
```

### 2. Logic Operations
```lisp
;; Boolean operations
(and true false)    ;; Logical AND: false
(or true false)     ;; Logical OR: true  
(not true)          ;; Logical NOT: false

;; Conditional logic
(if true "yes" "no")              ;; Conditional: "yes"
(if (> u10 u5) "greater" "less")  ;; Conditional dengan comparison: "greater"
```

### 3. List Operations
```lisp
;; List functions
(len (list u1 u2 u3))                    ;; Length: u3
(append (list u1 u2) (list u3 u4))       ;; Append: (u1 u2 u3 u4)
(concat (list u1 u2) (list u3 u4))       ;; Concat: (u1 u2 u3 u4)
(element-at (list u1 u2 u3) u1)          ;; Get element: (some u2)
(index-of (list u1 u2 u3) u2)            ;; Find index: (some u1)

;; List processing
(map + (list u1 u2 u3) (list u4 u5 u6))  ;; Map function: (u5 u7 u9)
(filter is-even (list u1 u2 u3 u4))      ;; Filter: (u2 u4)
(fold + (list u1 u2 u3) u0)              ;; Fold/reduce: u6
```

### 4. String Operations  
```lisp
;; String functions
(len "hello")                     ;; Length: u5
(concat "hello" " world")         ;; Concatenation: "hello world"
(as-max-len? "test" u10)         ;; Length check: (some "test")
(int-to-ascii 42)                ;; Integer to string: "42"
(string-to-int? "42")            ;; String to integer: (some 42)
```

### 5. Cryptographic Functions
```lisp
;; Hash functions
(keccak256 0x48656c6c6f)         ;; Keccak-256 hash
(sha256 0x48656c6c6f)            ;; SHA-256 hash
(sha512 0x48656c6c6f)            ;; SHA-512 hash

;; Digital signatures
(secp256k1-verify message-hash signature public-key)  ;; Verify signature
(principal-of? public-key)                            ;; Get principal dari public key
```

## Contoh Program Sederhana

### Counter Contract
```lisp
;; Simple counter contract
(define-data-var counter uint u0)
(define-constant contract-owner tx-sender)

;; Get current counter value
(define-read-only (get-counter)
  (var-get counter)
)

;; Increment counter (anyone can call)
(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (ok (var-get counter))
  )
)

;; Reset counter (only owner)
(define-public (reset)
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (var-set counter u0)
    (ok u0)
  )
)

;; Add specific amount (with validation)
(define-public (add (amount uint))
  (begin
    (asserts! (> amount u0) (err u400))
    (asserts! (<= (+ (var-get counter) amount) u1000000) (err u413))
    (var-set counter (+ (var-get counter) amount))
    (ok (var-get counter))  
  )
)
```

### Simple Bank Contract
```lisp
;; Simple bank contract
(define-map account-balances principal uint)
(define-data-var total-supply uint u0)

;; Get balance
(define-read-only (get-balance (account principal))
  (default-to u0 (map-get? account-balances account))
)

;; Get total supply
(define-read-only (get-total-supply)
  (var-get total-supply)
)

;; Deposit STX
(define-public (deposit (amount uint))
  (begin
    (asserts! (> amount u0) (err u400))
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set account-balances tx-sender (+ (get-balance tx-sender) amount))
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok amount)
  )
)

;; Withdraw STX
(define-public (withdraw (amount uint))
  (let ((current-balance (get-balance tx-sender)))
    (asserts! (> amount u0) (err u400))
    (asserts! (>= current-balance amount) (err u401))
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    (map-set account-balances tx-sender (- current-balance amount))
    (var-set total-supply (- (var-get total-supply) amount))
    (ok amount)
  )
)

;; Transfer between accounts
(define-public (transfer (amount uint) (recipient principal))
  (let ((sender-balance (get-balance tx-sender)))
    (asserts! (> amount u0) (err u400))
    (asserts! (>= sender-balance amount) (err u401))
    (map-set account-balances tx-sender (- sender-balance amount))
    (map-set account-balances recipient (+ (get-balance recipient) amount))
    (ok amount)
  )
)
```

## Best Practices

### 1. Security Practices
```lisp
;; Always validate inputs
(define-public (safe-function (amount uint) (recipient principal))
  (begin
    ;; Input validation
    (asserts! (> amount u0) (err u400))
    (asserts! (is-standard recipient) (err u401))
    (asserts! (not (is-eq recipient tx-sender)) (err u402))
    ;; ... rest of function
  )
)

;; Use access control
(define-constant admin 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE)
(define-public (admin-only-function)
  (begin
    (asserts! (is-eq tx-sender admin) (err u403))
    ;; Admin functionality here
    (ok true)
  )
)

;; Handle errors properly
(define-public (safe-transfer (amount uint) (recipient principal))
  (match (stx-transfer? amount tx-sender recipient)
    success (ok success)
    error (err error)
  )
)
```

### 2. Code Organization
```lisp
;; Group related constants together
(define-constant contract-owner tx-sender)
(define-constant max-supply u1000000)
(define-constant error-unauthorized (err u403))
(define-constant error-insufficient-funds (err u401))

;; Group data structures
(define-data-var total-supply uint u0)
(define-data-var contract-paused bool false)
(define-map user-balances principal uint)

;; Group read-only functions
(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? user-balances user))
)

;; Group public functions
(define-public (transfer (amount uint) (recipient principal))
  ;; Implementation
)

;; Group private functions
(define-private (validate-transfer (amount uint) (sender principal))
  ;; Validation logic
)
```

### 3. Documentation
```lisp
;; @title: Simple Token Contract
;; @version: 1.0.0
;; @author: Developer Name
;; @desc: A basic token contract implementing transfers and balances

;; Error codes
;; u400: Invalid input
;; u401: Insufficient balance  
;; u402: Invalid recipient
;; u403: Unauthorized access

;; @desc: Get token balance untuk specified account
;; @param account: The principal whose balance untuk query
;; @returns: The balance as uint, or u0 jika account tidak found
(define-read-only (get-balance (account principal))
  (default-to u0 (map-get? balances account))
)
```

## Common Patterns

### 1. Ownership Pattern
```lisp
(define-constant contract-owner tx-sender)

(define-private (is-owner)
  (is-eq tx-sender contract-owner)
)

(define-public (owner-only-function)
  (begin
    (asserts! (is-owner) (err u403))
    ;; Owner functionality
    (ok true)
  )
)
```

### 2. Pausable Pattern
```lisp
(define-data-var contract-paused bool false)

(define-private (is-paused)
  (var-get contract-paused)
)

(define-public (pause-contract)
  (begin
    (asserts! (is-owner) (err u403))
    (var-set contract-paused true)
    (ok true)
  )
)

(define-public (pausable-function)
  (begin
    (asserts! (not (is-paused)) (err u503))
    ;; Function logic
    (ok true)
  )
)
```

### 3. Rate Limiting Pattern
```lisp
(define-map last-action-time principal uint)
(define-constant min-time-between-actions u10) ;; 10 blocks

(define-private (can-act (user principal))
  (let ((last-time (default-to u0 (map-get? last-action-time user))))
    (>= (- block-height last-time) min-time-between-actions)
  )
)

(define-public (rate-limited-function)
  (begin
    (asserts! (can-act tx-sender) (err u429))
    (map-set last-action-time tx-sender block-height)
    ;; Function logic
    (ok true)
  )
)
```

## Kesimpulan

Clarity provides powerful foundation untuk building secure smart contracts:

**Key Advantages:**
✅ **Security First**: Built-in protections against common vulnerabilities  
✅ **Predictable**: Decidable execution costs  
✅ **Transparent**: Human-readable deployed code  
✅ **Bitcoin Integration**: Native Bitcoin blockchain awareness  
✅ **Type Safety**: Strong static typing prevents runtime errors  

**Development Approach:**
1. **Start Simple**: Begin dengan basic contracts
2. **Test Thoroughly**: Use Clarinet untuk comprehensive testing  
3. **Follow Patterns**: Use established security patterns
4. **Document Code**: Clear comments dan documentation
5. **Validate Inputs**: Always check user inputs
6. **Handle Errors**: Proper error handling critical

Dengan memahami fundamentals Clarity, Anda siap untuk building sophisticated smart contracts yang secure dan efficient di Stacks blockchain.

---

**Selanjutnya**: Setelah memahami dasar-dasar Clarity, mari langsung praktek dengan membangun project Tic Tac Toe!

👉 **[Lanjut ke Project Tic Tac Toe →](../03-day1-tic-tac-toe/)**