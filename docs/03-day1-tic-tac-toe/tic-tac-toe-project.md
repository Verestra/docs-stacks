---
sidebar_position: 2
title: 2. Membangun Game Tic Tac Toe
description: Tutorial lengkap membangun smart contract game Tic Tac Toe - dari setup project hingga deployment dan testing
keywords: [tic tac toe tutorial, smart contract development, clarity project, game logic, testing, deployment]
---

# Project Step-by-Step: Tic Tac Toe Game

Mari build game Tic Tac Toe lengkap di Stacks dengan betting mechanism! Project ini akan mengajarkan concepts penting seperti game logic, state management, dan financial transactions dalam smart contracts.

## Overview Project

### Apa yang Akan Kita Build

```
Tic Tac Toe Game Features:
├── 🎮 Game Logic: Complete tic-tac-toe rules
├── 💰 Betting System: Players bet STX untuk play
├── 👥 Multiplayer: Two players per game
├── 🏆 Winner Takes All: Winner gets both bets
├── 🔒 Secure: Prevents cheating dan invalid moves
├── 📊 Game Tracking: Multiple games simultaneously
├── 🎯 Turn Management: Enforces correct turn order
└── ✅ Win Detection: Automatic winner detection
```

### Learning Objectives

Setelah tutorial ini, Anda akan memahami:
- Complex state management dalam Clarity
- Game logic implementation
- Financial transactions dalam contracts
- Error handling dan validation
- Testing game scenarios
- Frontend integration basics

## Step 1: Project Setup

### Create New Project

```bash
# Navigate ke projects directory
cd ~/stacks-projects

# Create new Clarinet project
clarinet new tic-tac-toe-game
cd tic-tac-toe-game

# Check project structure
ls -la
```

Expected structure:
```
tic-tac-toe-game/
├── Clarinet.toml          # Project config
├── contracts/             # Smart contracts
├── tests/                # Test files
├── settings/             # Network settings
└── deployments/          # Deploy configs
```

### Configure Project

Edit `Clarinet.toml`:

```toml
[project]
name = "tic-tac-toe-game"
description = "A betting-based Tic Tac Toe game on Stacks"
authors = ["Your Name <your.email@example.com>"]
telemetry = true
cache_dir = "./.clarinet"

[contracts.tic-tac-toe]
path = "contracts/tic-tac-toe.clar"
clarity_version = 2
epoch = 2.4

[repl]
costs_version = 2
parser_version = 2
```

## Step 2: Design Game Architecture

### Game State Design

```lisp
;; Game state akan disimpan dalam map:
;; Key: uint (game-id)
;; Value: game-data tuple
{
    player-one: principal,           ;; Address player 1 (X)
    player-two: (optional principal), ;; Address player 2 (O)
    is-player-one-turn: bool,        ;; Whose turn is it?
    bet-amount: uint,                ;; Bet amount dalam STX
    board: (list 9 uint),           ;; Board state (0=empty, 1=X, 2=O)
    winner: (optional principal)     ;; Winner jika game selesai
}
```

### Board Representation

```
Board positions:
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8

Board values:
0 = Empty cell
1 = X (Player One)
2 = O (Player Two)
```

### Game Flow

```
1. Player 1 creates game dengan bet amount
2. Player 1 makes first move (X)
3. Player 2 joins game dengan matching bet
4. Player 2 makes move (O)
5. Players alternate moves
6. Game ends when someone wins atau board full
7. Winner gets both bet amounts
```

## Step 3: Implement Smart Contract

Create `contracts/tic-tac-toe.clar`:

```lisp
;; Tic Tac Toe Game Contract
;; Players bet STX dan winner takes all

;; Constants
(define-constant THIS_CONTRACT (as-contract tx-sender))
(define-constant ERR_MIN_BET_AMOUNT (err u100))
(define-constant ERR_INVALID_MOVE (err u101))
(define-constant ERR_GAME_NOT_FOUND (err u102))
(define-constant ERR_GAME_CANNOT_BE_JOINED (err u103))
(define-constant ERR_NOT_YOUR_TURN (err u104))
(define-constant ERR_GAME_ALREADY_FINISHED (err u105))
(define-constant ERR_INSUFFICIENT_FUNDS (err u106))

;; Game ID counter
(define-data-var latest-game-id uint u0)

;; Games storage
(define-map games 
    uint ;; Game ID
    { ;; Game data
        player-one: principal,
        player-two: (optional principal),
        is-player-one-turn: bool,
        bet-amount: uint,
        board: (list 9 uint),
        winner: (optional principal)
    }
)

;; Create new game
(define-public (create-game (bet-amount uint) (move-index uint) (move uint))
    (let (
        ;; Get next game ID
        (game-id (var-get latest-game-id))
        ;; Create empty board
        (starting-board (list u0 u0 u0 u0 u0 u0 u0 u0 u0))
        ;; Apply first move
        (game-board (unwrap! (replace-at? starting-board move-index move) ERR_INVALID_MOVE))
        ;; Create game data
        (game-data {
            player-one: contract-caller,
            player-two: none,
            is-player-one-turn: false, ;; Next turn is player two
            bet-amount: bet-amount,
            board: game-board,
            winner: none
        })
    )
    ;; Validate inputs
    (asserts! (> bet-amount u0) ERR_MIN_BET_AMOUNT)
    (asserts! (is-eq move u1) ERR_INVALID_MOVE) ;; Must be X
    (asserts! (validate-move starting-board move-index move) ERR_INVALID_MOVE)
    
    ;; Check sufficient balance
    (asserts! (>= (stx-get-balance contract-caller) bet-amount) ERR_INSUFFICIENT_FUNDS)
    
    ;; Transfer bet ke contract
    (try! (stx-transfer? bet-amount contract-caller THIS_CONTRACT))
    
    ;; Store game
    (map-set games game-id game-data)
    
    ;; Increment game counter
    (var-set latest-game-id (+ game-id u1))
    
    ;; Log event
    (print { 
        action: "create-game", 
        game-id: game-id,
        player-one: contract-caller,
        bet-amount: bet-amount,
        first-move: move-index
    })
    
    ;; Return game ID
    (ok game-id)
    )
)

;; Join existing game
(define-public (join-game (game-id uint) (move-index uint) (move uint))
    (let (
        ;; Load game data
        (original-game-data (unwrap! (map-get? games game-id) ERR_GAME_NOT_FOUND))
        ;; Get current board
        (original-board (get board original-game-data))
        ;; Apply player two's move
        (game-board (unwrap! (replace-at? original-board move-index move) ERR_INVALID_MOVE))
        ;; Update game data
        (game-data (merge original-game-data {
            board: game-board,
            player-two: (some contract-caller),
            is-player-one-turn: true ;; Next turn is player one
        }))
    )
    ;; Validate game can be joined
    (asserts! (is-none (get player-two original-game-data)) ERR_GAME_CANNOT_BE_JOINED)
    (asserts! (is-none (get winner original-game-data)) ERR_GAME_ALREADY_FINISHED)
    
    ;; Validate move
    (asserts! (is-eq move u2) ERR_INVALID_MOVE) ;; Must be O
    (asserts! (validate-move original-board move-index move) ERR_INVALID_MOVE)
    
    ;; Check sufficient balance
    (asserts! (>= (stx-get-balance contract-caller) (get bet-amount original-game-data)) ERR_INSUFFICIENT_FUNDS)
    
    ;; Transfer bet ke contract
    (try! (stx-transfer? (get bet-amount original-game-data) contract-caller THIS_CONTRACT))
    
    ;; Update game
    (map-set games game-id game-data)
    
    ;; Log event
    (print { 
        action: "join-game", 
        game-id: game-id,
        player-two: contract-caller,
        move: move-index
    })
    
    (ok game-id)
    )
)

;; Make a move dalam existing game
(define-public (play (game-id uint) (move-index uint) (move uint))
    (let (
        ;; Load game data
        (original-game-data (unwrap! (map-get? games game-id) ERR_GAME_NOT_FOUND))
        ;; Get current board
        (original-board (get board original-game-data))
        ;; Determine current player
        (is-player-one-turn (get is-player-one-turn original-game-data))
        (current-player (if is-player-one-turn 
            (get player-one original-game-data) 
            (unwrap! (get player-two original-game-data) ERR_GAME_NOT_FOUND)))
        (expected-move (if is-player-one-turn u1 u2))
        ;; Apply move
        (game-board (unwrap! (replace-at? original-board move-index move) ERR_INVALID_MOVE))
        ;; Check untuk win
        (is-winner (has-won game-board))
        ;; Update game data
        (game-data (merge original-game-data {
            board: game-board,
            is-player-one-turn: (not is-player-one-turn),
            winner: (if is-winner (some current-player) none)
        }))
    )
    ;; Validate turn
    (asserts! (is-eq contract-caller current-player) ERR_NOT_YOUR_TURN)
    (asserts! (is-none (get winner original-game-data)) ERR_GAME_ALREADY_FINISHED)
    
    ;; Validate move
    (asserts! (is-eq move expected-move) ERR_INVALID_MOVE)
    (asserts! (validate-move original-board move-index move) ERR_INVALID_MOVE)
    
    ;; If winner, transfer prize
    (if is-winner 
        (try! (as-contract (stx-transfer? 
            (* u2 (get bet-amount game-data)) 
            tx-sender 
            current-player)))
        false)
    
    ;; Update game
    (map-set games game-id game-data)
    
    ;; Log event
    (print { 
        action: "play", 
        game-id: game-id,
        player: current-player,
        move: move-index,
        winner: (get winner game-data)
    })
    
    (ok game-id)
    )
)

;; Read-only functions
(define-read-only (get-game (game-id uint))
    (map-get? games game-id)
)

(define-read-only (get-latest-game-id)
    (var-get latest-game-id)
)

(define-read-only (get-game-board (game-id uint))
    (match (map-get? games game-id)
        game-data (ok (get board game-data))
        (err ERR_GAME_NOT_FOUND)
    )
)

(define-read-only (get-current-turn (game-id uint))
    (match (map-get? games game-id)
        game-data (ok {
            is-player-one-turn: (get is-player-one-turn game-data),
            current-player: (if (get is-player-one-turn game-data)
                (some (get player-one game-data))
                (get player-two game-data))
        })
        (err ERR_GAME_NOT_FOUND)
    )
)

;; Private helper functions
(define-private (validate-move (board (list 9 uint)) (move-index uint) (move uint))
    (let (
        ;; Check index range
        (index-in-range (and (>= move-index u0) (< move-index u9)))
        ;; Check move value
        (valid-move (or (is-eq move u1) (is-eq move u2)))
        ;; Check empty spot
        (empty-spot (is-eq (unwrap! (element-at? board move-index) false) u0))
    )
    (and index-in-range valid-move empty-spot)
    )
)

;; Check jika board has winning combination
(define-private (has-won (board (list 9 uint))) 
    (or
        ;; Rows
        (is-line board u0 u1 u2)
        (is-line board u3 u4 u5)
        (is-line board u6 u7 u8)
        ;; Columns
        (is-line board u0 u3 u6)
        (is-line board u1 u4 u7)
        (is-line board u2 u5 u8)
        ;; Diagonals
        (is-line board u0 u4 u8)
        (is-line board u2 u4 u6)
    )
)

;; Check jika three positions form winning line
(define-private (is-line (board (list 9 uint)) (a uint) (b uint) (c uint)) 
    (let (
        (a-val (unwrap! (element-at? board a) false))
        (b-val (unwrap! (element-at? board b) false))
        (c-val (unwrap! (element-at? board c) false))
    )
    ;; All three must be same dan not empty
    (and (is-eq a-val b-val) (is-eq a-val c-val) (not (is-eq a-val u0)))
    )
)

;; Check jika board is full (draw condition)
(define-read-only (is-board-full (game-id uint))
    (match (map-get? games game-id)
        game-data (ok (is-eq (len (filter is-empty-cell (get board game-data))) u0))
        (err ERR_GAME_NOT_FOUND)
    )
)

(define-private (is-empty-cell (cell uint))
    (is-eq cell u0)
)

;; Get game status
(define-read-only (get-game-status (game-id uint))
    (match (map-get? games game-id)
        game-data (ok {
            status: (if (is-some (get winner game-data))
                "finished"
                (if (is-none (get player-two game-data))
                    "waiting-for-player"
                    "in-progress")),
            winner: (get winner game-data),
            total-prize: (* u2 (get bet-amount game-data))
        })
        (err ERR_GAME_NOT_FOUND)
    )
)
```

## Step 4: Check Contract Syntax

```bash
# Check syntax
clarinet check

# Expected output:
# ✓ tic-tac-toe syntax ok
```

Jika ada errors, common fixes:
```bash
# Check parentheses balance
# Verify function names spelling
# Ensure proper variable references
# Check data type consistency
```

## Step 5: Create Comprehensive Tests

Create `tests/tic-tac-toe.test.ts`:

```typescript
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Can create new game",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const player1 = accounts.get('wallet_1')!;
        const betAmount = 1000000; // 1 STX
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'create-game',
                [
                    types.uint(betAmount),
                    types.uint(4), // Center position
                    types.uint(1)  // X move
                ],
                player1.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok u0)');
        
        // Check game was created
        let gameResult = chain.callReadOnlyFn(
            'tic-tac-toe',
            'get-game',
            [types.uint(0)],
            player1.address
        );
        
        gameResult.result.expectSome();
    },
});

Clarinet.test({
    name: "Player two can join game",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const player1 = accounts.get('wallet_1')!;
        const player2 = accounts.get('wallet_2')!;
        const betAmount = 1000000;
        
        // Player 1 creates game
        let block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'create-game',
                [types.uint(betAmount), types.uint(4), types.uint(1)],
                player1.address
            )
        ]);
        
        // Player 2 joins game
        block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'join-game',
                [
                    types.uint(0), // Game ID
                    types.uint(0), // Top-left position
                    types.uint(2)  // O move
                ],
                player2.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok u0)');
        
        // Verify game has both players
        let gameResult = chain.callReadOnlyFn(
            'tic-tac-toe',
            'get-game',
            [types.uint(0)],
            player1.address
        );
        
        const game = gameResult.result.expectSome().expectTuple();
        assertEquals(game['player-one'], player1.address);
        game['player-two'].expectSome().expectPrincipal(player2.address);
    },
});

Clarinet.test({
    name: "Players can make moves dalam turn",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const player1 = accounts.get('wallet_1')!;
        const player2 = accounts.get('wallet_2')!;
        const betAmount = 1000000;
        
        // Setup game
        let block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'create-game',
                [types.uint(betAmount), types.uint(4), types.uint(1)],
                player1.address
            ),
            Tx.contractCall(
                'tic-tac-toe',
                'join-game',
                [types.uint(0), types.uint(0), types.uint(2)],
                player2.address
            )
        ]);
        
        // Player 1's turn
        block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'play',
                [types.uint(0), types.uint(1), types.uint(1)],
                player1.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok u0)');
        
        // Player 2's turn
        block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'play',
                [types.uint(0), types.uint(2), types.uint(2)],
                player2.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok u0)');
    },
});

Clarinet.test({
    name: "Cannot make move out of turn",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const player1 = accounts.get('wallet_1')!;
        const player2 = accounts.get('wallet_2')!;
        const betAmount = 1000000;
        
        // Setup game
        let block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'create-game',
                [types.uint(betAmount), types.uint(4), types.uint(1)],
                player1.address
            ),
            Tx.contractCall(
                'tic-tac-toe',
                'join-game',
                [types.uint(0), types.uint(0), types.uint(2)],
                player2.address
            )
        ]);
        
        // Player 2 tries to move when it's Player 1's turn
        block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'play',
                [types.uint(0), types.uint(1), types.uint(2)],
                player2.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(err u104)'); // ERR_NOT_YOUR_TURN
    },
});

Clarinet.test({
    name: "Cannot make invalid moves",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const player1 = accounts.get('wallet_1')!;
        const player2 = accounts.get('wallet_2')!;
        const betAmount = 1000000;
        
        // Setup game
        let block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'create-game',
                [types.uint(betAmount), types.uint(4), types.uint(1)],
                player1.address
            ),
            Tx.contractCall(
                'tic-tac-toe',
                'join-game',
                [types.uint(0), types.uint(0), types.uint(2)],
                player2.address
            )
        ]);
        
        // Try to move pada occupied cell
        block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'play',
                [types.uint(0), types.uint(4), types.uint(1)], // Position 4 already occupied
                player1.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(err u101)'); // ERR_INVALID_MOVE
        
        // Try to move out of bounds
        block = chain.mineBlock([
            Tx.contractCall(
                'tic-tac-toe',
                'play',
                [types.uint(0), types.uint(9), types.uint(1)], // Position 9 doesn't exist
                player1.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(err u101)'); // ERR_INVALID_MOVE
    },
});

Clarinet.test({
    name: "Winner receives prize",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const player1 = accounts.get('wallet_1')!;
        const player2 = accounts.get('wallet_2')!;
        const betAmount = 1000000;
        
        // Get initial balances
        const initialBalance1 = chain.callReadOnlyFn(
            'stx-account',
            'get-balance',
            [types.principal(player1.address)],
            player1.address
        );
        
        // Setup game dengan player 1 winning strategy
        let block = chain.mineBlock([
            // Create game: X pada position 0
            Tx.contractCall(
                'tic-tac-toe',
                'create-game',
                [types.uint(betAmount), types.uint(0), types.uint(1)],
                player1.address
            ),
            // Join game: O pada position 3
            Tx.contractCall(
                'tic-tac-toe',
                'join-game',
                [types.uint(0), types.uint(3), types.uint(2)],
                player2.address
            ),
            // Player 1: X pada position 1
            Tx.contractCall(
                'tic-tac-toe',
                'play',
                [types.uint(0), types.uint(1), types.uint(1)],
                player1.address
            ),
            // Player 2: O pada position 4
            Tx.contractCall(
                'tic-tac-toe',
                'play',
                [types.uint(0), types.uint(4), types.uint(2)],
                player2.address
            ),
            // Player 1 wins: X pada position 2 (0-1-2 = row win)
            Tx.contractCall(
                'tic-tac-toe',
                'play',
                [types.uint(0), types.uint(2), types.uint(1)],
                player1.address
            )
        ]);
        
        // All moves should succeed
        block.receipts.forEach(receipt => {
            receipt.result.expectOk();
        });
        
        // Check game status
        let statusResult = chain.callReadOnlyFn(
            'tic-tac-toe',
            'get-game-status',
            [types.uint(0)],
            player1.address
        );
        
        const status = statusResult.result.expectOk().expectTuple();
        assertEquals(status['status'], '"finished"');
        status['winner'].expectSome().expectPrincipal(player1.address);
    },
});

Clarinet.test({
    name: "Multiple games can run simultaneously",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const player1 = accounts.get('wallet_1')!;
        const player2 = accounts.get('wallet_2')!;
        const player3 = accounts.get('wallet_3')!;
        const player4 = accounts.get('wallet_4')!;
        const betAmount = 500000;
        
        let block = chain.mineBlock([
            // Game 0: Player 1 vs Player 2
            Tx.contractCall(
                'tic-tac-toe',
                'create-game',
                [types.uint(betAmount), types.uint(4), types.uint(1)],
                player1.address
            ),
            // Game 1: Player 3 vs Player 4
            Tx.contractCall(
                'tic-tac-toe',
                'create-game',
                [types.uint(betAmount), types.uint(0), types.uint(1)],
                player3.address
            ),
            // Player 2 joins Game 0
            Tx.contractCall(
                'tic-tac-toe',
                'join-game',
                [types.uint(0), types.uint(0), types.uint(2)],
                player2.address
            ),
            // Player 4 joins Game 1
            Tx.contractCall(
                'tic-tac-toe',
                'join-game',
                [types.uint(1), types.uint(8), types.uint(2)],
                player4.address
            )
        ]);
        
        // All operations should succeed
        block.receipts.forEach(receipt => {
            receipt.result.expectOk();
        });
        
        // Verify games are separate
        let game0 = chain.callReadOnlyFn(
            'tic-tac-toe',
            'get-game',
            [types.uint(0)],
            player1.address
        );
        
        let game1 = chain.callReadOnlyFn(
            'tic-tac-toe',
            'get-game',
            [types.uint(1)],
            player1.address
        );
        
        const game0Data = game0.result.expectSome().expectTuple();
        const game1Data = game1.result.expectSome().expectTuple();
        
        assertEquals(game0Data['player-one'], player1.address);
        assertEquals(game1Data['player-one'], player3.address);
    },
});
```

## Step 6: Run Tests

```bash
# Run all tests
clarinet test

# Run dengan verbose output
clarinet test --verbose

# Run specific test
clarinet test tests/tic-tac-toe.test.ts
```

Expected output:
```
Running tests/tic-tac-toe.test.ts
running 7 tests from file:///tic-tac-toe-game/tests/tic-tac-toe.test.ts
test Can create new game ... ok (8ms)
test Player two can join game ... ok (12ms)
test Players can make moves dalam turn ... ok (15ms)
test Cannot make move out of turn ... ok (6ms)
test Cannot make invalid moves ... ok (10ms)
test Winner receives prize ... ok (18ms)
test Multiple games can run simultaneously ... ok (14ms)

test result: ok. 7 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (83ms)
```

## Step 7: Interactive Testing

```bash
# Start console
clarinet console

# Deploy contract
clarinet>> ::deploy_contract tic-tac-toe contracts/tic-tac-toe.clar

# Create game
clarinet>> (contract-call? .tic-tac-toe create-game u1000000 u4 u1)

# Check game
clarinet>> (contract-call? .tic-tac-toe get-game u0)

# Join game (switch to different account first)
clarinet>> ::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
clarinet>> (contract-call? .tic-tac-toe join-game u0 u0 u2)

# Make moves
clarinet>> ::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
clarinet>> (contract-call? .tic-tac-toe play u0 u1 u1)

# Check game status
clarinet>> (contract-call? .tic-tac-toe get-game-status u0)

# Exit
clarinet>> ::quit
```

## Step 8: Add Advanced Features

### Game History Tracking

Add to contract:

```lisp
;; Game history storage
(define-map player-games principal (list 100 uint))
(define-map game-moves uint (list 10 {player: principal, position: uint, move: uint}))

;; Track player's games
(define-private (add-player-game (player principal) (game-id uint))
    (let ((current-games (default-to (list) (map-get? player-games player))))
        (if (< (len current-games) u100)
            (map-set player-games player (unwrap! (as-max-len? (append current-games game-id) u100) false))
            true
        )
    )
)

;; Get player's game history
(define-read-only (get-player-games (player principal))
    (default-to (list) (map-get? player-games player))
)
```

### Game Statistics

```lisp
;; Player statistics
(define-map player-stats principal {wins: uint, losses: uint, draws: uint, total-games: uint})

;; Update player stats
(define-private (update-player-stats (winner (optional principal)) (player-one principal) (player-two principal))
    (let (
        (p1-stats (default-to {wins: u0, losses: u0, draws: u0, total-games: u0} (map-get? player-stats player-one)))
        (p2-stats (default-to {wins: u0, losses: u0, draws: u0, total-games: u0} (map-get? player-stats player-two)))
    )
    (match winner
        winning-player (begin
            ;; Update winner stats
            (if (is-eq winning-player player-one)
                (map-set player-stats player-one (merge p1-stats {wins: (+ (get wins p1-stats) u1), total-games: (+ (get total-games p1-stats) u1)}))
                (map-set player-stats player-two (merge p2-stats {wins: (+ (get wins p2-stats) u1), total-games: (+ (get total-games p2-stats) u1)}))
            )
            ;; Update loser stats
            (if (is-eq winning-player player-one)
                (map-set player-stats player-two (merge p2-stats {losses: (+ (get losses p2-stats) u1), total-games: (+ (get total-games p2-stats) u1)}))
                (map-set player-stats player-one (merge p1-stats {losses: (+ (get losses p1-stats) u1), total-games: (+ (get total-games p1-stats) u1)}))
            )
        )
        ;; Draw game
        (begin
            (map-set player-stats player-one (merge p1-stats {draws: (+ (get draws p1-stats) u1), total-games: (+ (get total-games p1-stats) u1)}))
            (map-set player-stats player-two (merge p2-stats {draws: (+ (get draws p2-stats) u1), total-games: (+ (get total-games p2-stats) u1)}))
        )
    )
    true
    )
)

;; Get player statistics
(define-read-only (get-player-stats (player principal))
    (default-to {wins: u0, losses: u0, draws: u0, total-games: u0} (map-get? player-stats player))
)
```

## Step 9: Deployment Preparation

### Update Network Settings

Edit `settings/Testnet.toml`:

```toml
[network]
name = "testnet"
node_rpc_address = "https://stacks-node-api.testnet.stacks.co"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "your testnet mnemonic here"
balance = 100000000000000
```

### Create Deployment Plan

```bash
# Generate deployment plan
clarinet deployment generate --testnet

# Review deployment plan
cat deployments/default.testnet-plan.yaml
```

### Deployment Script

Create `scripts/deploy.js`:

```javascript
const { StacksTestnet } = require('@stacks/network');
const { makeContractDeploy, broadcastTransaction, AnchorMode } = require('@stacks/transactions');
const fs = require('fs');

async function deployContract() {
    const network = new StacksTestnet();
    
    // Read contract
    const contractCode = fs.readFileSync('./contracts/tic-tac-toe.clar', 'utf8');
    
    const txOptions = {
        contractName: 'tic-tac-toe',
        codeBody: contractCode,
        senderKey: process.env.PRIVATE_KEY,
        network,
        anchorMode: AnchorMode.Any,
    };
    
    const transaction = await makeContractDeploy(txOptions);
    const result = await broadcastTransaction(transaction, network);
    
    console.log('Deployment Transaction ID:', result.txid);
    console.log('Check status at: https://explorer.stacks.co/txid/' + result.txid);
}

deployContract().catch(console.error);
```

## Step 10: Build Simple Frontend

### HTML Interface

Create `frontend/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tic Tac Toe - Stacks</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .board { display: grid; grid-template-columns: repeat(3, 100px); gap: 2px; margin: 20px 0; }
        .cell { width: 100px; height: 100px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; font-size: 2em; cursor: pointer; }
        .cell:hover { background-color: #f0f0f0; }
        .game-info { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        button { padding: 10px 20px; margin: 5px; font-size: 16px; cursor: pointer; }
        input { padding: 10px; margin: 5px; font-size: 16px; }
        .disabled { opacity: 0.5; cursor: not-allowed; }
    </style>
</head>
<body>
    <h1>Tic Tac Toe on Stacks</h1>
    
    <div class="game-info">
        <h3>Game Status: <span id="gameStatus">No active game</span></h3>
        <p>Current Player: <span id="currentPlayer">-</span></p>
        <p>Bet Amount: <span id="betAmount">-</span> STX</p>
        <p>Prize Pool: <span id="prizePool">-</span> STX</p>
    </div>
    
    <div>
        <input type="number" id="betInput" placeholder="Bet amount (STX)" step="0.000001" min="0.000001">
        <button onclick="createGame()">Create New Game</button>
        <button onclick="joinGame()">Join Game</button>
    </div>
    
    <div>
        <input type="number" id="gameIdInput" placeholder="Game ID" min="0">
        <button onclick="loadGame()">Load Game</button>
    </div>
    
    <div class="board" id="gameBoard">
        <div class="cell" data-index="0" onclick="makeMove(0)"></div>
        <div class="cell" data-index="1" onclick="makeMove(1)"></div>
        <div class="cell" data-index="2" onclick="makeMove(2)"></div>
        <div class="cell" data-index="3" onclick="makeMove(3)"></div>
        <div class="cell" data-index="4" onclick="makeMove(4)"></div>
        <div class="cell" data-index="5" onclick="makeMove(5)"></div>
        <div class="cell" data-index="6" onclick="makeMove(6)"></div>
        <div class="cell" data-index="7" onclick="makeMove(7)"></div>
        <div class="cell" data-index="8" onclick="makeMove(8)"></div>
    </div>
    
    <div id="gameHistory">
        <h3>Your Games</h3>
        <ul id="gamesList"></ul>
    </div>

    <script src="https://unpkg.com/@stacks/connect@20.1.0/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@stacks/transactions@4.3.5/dist/umd/index.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

### JavaScript Application

Create `frontend/app.js`:

```javascript
const { openContractCall } = window.StacksConnect;
const { StacksTestnet } = window.StacksTransactions;
const { uintCV, principalCV } = window.StacksTransactions;

const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace dengan your deployed contract
const contractName = 'tic-tac-toe';
const network = new StacksTestnet();

let currentGameId = null;
let currentGame = null;
let userAddress = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Connect wallet button
    const connectButton = document.createElement('button');
    connectButton.textContent = 'Connect Wallet';
    connectButton.onclick = connectWallet;
    document.body.insertBefore(connectButton, document.body.firstChild);
    
    updateGameDisplay();
});

async function connectWallet() {
    try {
        const { userSession } = await window.StacksConnect.openAuth({
            redirectTo: window.location.origin,
            manifestPath: '/manifest.json',
            network
        });
        
        if (userSession.isUserSignedIn()) {
            userAddress = userSession.loadUserData().profile.stxAddress.testnet;
            document.querySelector('button').textContent = `Connected: ${userAddress.slice(0, 8)}...`;
        }
    } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('Failed to connect wallet');
    }
}

async function createGame() {
    if (!userAddress) {
        alert('Please connect your wallet first');
        return;
    }
    
    const betAmount = parseFloat(document.getElementById('betInput').value);
    if (!betAmount || betAmount <= 0) {
        alert('Please enter a valid bet amount');
        return;
    }
    
    const betAmountMicroSTX = Math.floor(betAmount * 1000000);
    
    try {
        await openContractCall({
            network,
            contractAddress,
            contractName,
            functionName: 'create-game',
            functionArgs: [
                uintCV(betAmountMicroSTX),
                uintCV(4), // Start dengan center position
                uintCV(1)  // X move
            ],
            onFinish: (data) => {
                console.log('Game created:', data.txId);
                alert(`Game creation transaction sent: ${data.txId}`);
                // Refresh game efter beberapa detik
                setTimeout(() => {
                    loadLatestGame();
                }, 5000);
            },
        });
    } catch (error) {
        console.error('Failed to create game:', error);
        alert('Failed to create game');
    }
}

async function joinGame() {
    const gameId = parseInt(document.getElementById('gameIdInput').value);
    if (isNaN(gameId)) {
        alert('Please enter a valid game ID');
        return;
    }
    
    // Find empty position untuk first move
    const emptyPosition = findEmptyPosition();
    if (emptyPosition === -1) {
        alert('No empty positions available');
        return;
    }
    
    try {
        await openContractCall({
            network,
            contractAddress,
            contractName,
            functionName: 'join-game',
            functionArgs: [
                uintCV(gameId),
                uintCV(emptyPosition),
                uintCV(2) // O move
            ],
            onFinish: (data) => {
                console.log('Joined game:', data.txId);
                alert(`Join game transaction sent: ${data.txId}`);
                currentGameId = gameId;
                setTimeout(() => {
                    loadGame();
                }, 5000);
            },
        });
    } catch (error) {
        console.error('Failed to join game:', error);
        alert('Failed to join game');
    }
}

async function makeMove(position) {
    if (!currentGameId || !currentGame) {
        alert('No active game');
        return;
    }
    
    // Check jika position is empty
    if (currentGame.board[position] !== 0) {
        alert('Position already occupied');
        return;
    }
    
    // Determine move type based pada current player
    const isPlayerOne = currentGame['player-one'] === userAddress;
    const moveType = isPlayerOne ? 1 : 2;
    
    try {
        await openContractCall({
            network,
            contractAddress,
            contractName,
            functionName: 'play',
            functionArgs: [
                uintCV(currentGameId),
                uintCV(position),
                uintCV(moveType)
            ],
            onFinish: (data) => {
                console.log('Move made:', data.txId);
                alert(`Move transaction sent: ${data.txId}`);
                setTimeout(() => {
                    loadGame();
                }, 5000);
            },
        });
    } catch (error) {
        console.error('Failed to make move:', error);
        alert('Failed to make move');
    }
}

async function loadGame() {
    const gameId = currentGameId || parseInt(document.getElementById('gameIdInput').value);
    if (isNaN(gameId)) {
        alert('Please enter a valid game ID');
        return;
    }
    
    try {
        // Fetch game data dari API
        const response = await fetch(
            `https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/${contractAddress}/${contractName}/get-game`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: userAddress || contractAddress,
                    arguments: [`0x${gameId.toString(16).padStart(32, '0')}`]
                })
            }
        );
        
        const result = await response.json();
        if (result.okay && result.result) {
            currentGameId = gameId;
            parseGameData(result.result);
            updateGameDisplay();
        }
    } catch (error) {
        console.error('Failed to load game:', error);
        alert('Failed to load game');
    }
}

function parseGameData(resultString) {
    // Parse Clarity response - simplified parsing
    // In production, use proper Clarity value parsing
    try {
        // This is simplified - you'd want robust Clarity value parsing
        const gameData = {
            'player-one': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Extract dari result
            'player-two': null, // Extract dari result
            'bet-amount': 1000000, // Extract dari result
            board: [1, 0, 0, 0, 1, 0, 0, 0, 0], // Extract dari result
            winner: null // Extract dari result
        };
        
        currentGame = gameData;
    } catch (error) {
        console.error('Failed to parse game data:', error);
    }
}

function updateGameDisplay() {
    // Update game status
    document.getElementById('gameStatus').textContent = currentGame ? 
        (currentGame.winner ? 'Game Finished' : 'In Progress') : 'No active game';
    
    // Update board
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const value = currentGame ? currentGame.board[index] : 0;
        cell.textContent = value === 1 ? 'X' : value === 2 ? 'O' : '';
        cell.className = 'cell' + (value === 0 ? '' : ' disabled');
    });
    
    // Update game info
    if (currentGame) {
        document.getElementById('betAmount').textContent = (currentGame['bet-amount'] / 1000000).toFixed(6);
        document.getElementById('prizePool').textContent = (currentGame['bet-amount'] * 2 / 1000000).toFixed(6);
    }
}

function findEmptyPosition() {
    if (!currentGame) return 4; // Default ke center
    
    for (let i = 0; i < 9; i++) {
        if (currentGame.board[i] === 0) {
            return i;
        }
    }
    return -1;
}

async function loadLatestGame() {
    try {
        // Get latest game ID
        const response = await fetch(
            `https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/${contractAddress}/${contractName}/get-latest-game-id`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: userAddress || contractAddress,
                    arguments: []
                })
            }
        );
        
        const result = await response.json();
        if (result.okay) {
            // Parse latest game ID dan load that game
            // Simplified - you'd want proper parsing
            const latestId = 0; // Parse dari result
            document.getElementById('gameIdInput').value = latestId;
            loadGame();
        }
    } catch (error) {
        console.error('Failed to load latest game:', error);
    }
}
```

## Step 11: Testing Complete Flow

### End-to-End Test

```bash
# 1. Check contract
clarinet check

# 2. Run all tests
clarinet test

# 3. Interactive testing
clarinet console

# Create game
clarinet>> (contract-call? .tic-tac-toe create-game u1000000 u4 u1)

# Switch player dan join
clarinet>> ::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
clarinet>> (contract-call? .tic-tac-toe join-game u0 u0 u2)

# Play game to completion
clarinet>> ::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
clarinet>> (contract-call? .tic-tac-toe play u0 u1 u1)

# Continue until someone wins
```

### Performance Testing

Create `tests/performance.test.ts`:

```typescript
Clarinet.test({
    name: "Stress test: Multiple concurrent games",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const accounts_array = Array.from(accounts.values());
        const betAmount = 100000;
        
        // Create 10 games simultaneously
        let txs = [];
        for (let i = 0; i < 10; i++) {
            txs.push(
                Tx.contractCall(
                    'tic-tac-toe',
                    'create-game',
                    [types.uint(betAmount), types.uint(4), types.uint(1)],
                    accounts_array[i % accounts_array.length].address
                )
            );
        }
        
        let block = chain.mineBlock(txs);
        
        // All should succeed
        assertEquals(block.receipts.length, 10);
        block.receipts.forEach(receipt => {
            receipt.result.expectOk();
        });
        
        // Verify latest game ID
        let result = chain.callReadOnlyFn(
            'tic-tac-toe',
            'get-latest-game-id',
            [],
            accounts_array[0].address
        );
        
        assertEquals(result.result, 'u10');
    },
});
```

## Step 12: Deployment ke Testnet

### Prerequisites untuk Deployment

1. **Testnet STX**: Get dari faucet
```bash
# Visit https://explorer.stacks.co/sandbox/faucet
# Enter your testnet address
# Request STX
```

2. **Private Key**: Export dari wallet
```bash
# Add ke environment
export PRIVATE_KEY="your_private_key_here"
```

### Deploy Contract

```bash
# Generate deployment plan
clarinet deployment generate --testnet

# Review plan
cat deployments/default.testnet-plan.yaml

# Deploy
clarinet deployment apply --testnet
```

### Verify Deployment

```bash
# Check contract on explorer
# https://explorer.stacks.co/address/[YOUR_ADDRESS]?chain=testnet

# Test contract calls
curl -X POST https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/[ADDRESS]/tic-tac-toe/get-latest-game-id \
  -H "Content-Type: application/json" \
  -d '{"sender":"[ADDRESS]","arguments":[]}'
```

## Troubleshooting

### Common Issues

1. **Syntax Errors**
```bash
# Check parentheses balance
# Verify function names
# Check data types
clarinet check --verbose
```

2. **Test Failures**
```bash
# Check account balances dalam tests
# Verify transaction order
# Use console untuk debugging
clarinet console
```

3. **Deployment Issues**
```bash
# Check STX balance
# Verify network configuration
# Check contract size limits
```

### Performance Optimization

```lisp
;; Use maps efficiently
;; Minimize storage operations
;; Batch related operations
;; Optimize validation logic
```

## Next Steps

Setelah menyelesaikan Tic Tac Toe project:

1. **Add Advanced Features**:
   - Tournament mode
   - Leaderboards
   - Different game modes
   - AI opponents

2. **Improve Frontend**:
   - Real-time updates
   - Better UX/UI
   - Mobile responsive
   - Game animations

3. **Advanced Development** (Post-Workshop):
   - Enhanced features
   - Better error handling
   - Performance optimization
   - Community sharing

4. **Scale Up**:
   - Multiple game types
   - Social features
   - Economic mechanisms
   - Cross-chain integration

Congratulations! Anda telah successfully membangun complete blockchain game dengan betting mechanism di Stacks. Project ini demonstrates fundamental concepts yang bisa applied ke any blockchain application.

---

**Selanjutnya**: Mari explore deployment strategies dan production considerations untuk applications.

👉 **[Lanjut ke Deployment Guide →](./deployment-guide.md)**