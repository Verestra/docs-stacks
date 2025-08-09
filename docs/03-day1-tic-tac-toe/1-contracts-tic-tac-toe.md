---
sidebar_position: 1
title: 1. Smart Contract Development - Tic Tac Toe
description: Tutorial lengkap membangun smart contract game Tic Tac Toe dengan betting mechanism menggunakan Clarity - dari setup hingga deployment
keywords: [tic tac toe smart contract, clarity development, game logic, betting system, stacks blockchain, contract testing]
---

# Smart Contract Development: Tic Tac Toe Game

Mari build smart contract Tic Tac Toe lengkap di Stacks dengan betting mechanism! Tutorial ini fokus pada development backend logic dan contract testing.

## Overview Smart Contract

### Game Features yang Akan Dibangun

```
Smart Contract Features:
   ✨ Complete Game Logic: Tic-tac-toe rules implementation
   💰 Betting System: Players bet STX untuk bermain
   👥 Multiplayer Support: Two players per game
   ✨ Prize Distribution: Winner gets both bets
   🔗 Anti-Cheat: Prevents invalid moves dan cheating
   💰 Game State Management: Multiple concurrent games
   ✨ Turn Validation: Enforces correct player turns
   🎯 Win Detection: Automatic winner determination
```

### Learning Objectives

Setelah tutorial ini, Anda akan memahami:
- Complex state management dalam Clarity
- Game logic implementation yang secure
- Financial transactions dalam smart contracts
- Error handling dan input validation
- Comprehensive testing strategies
- Contract deployment dan verification

## Step 1: Project Setup dan Architecture

### Create New Clarinet Project

```bash
# Navigate ke directory yang diinginkan
cd ~/stacks-projects

# Create new Clarinet project
clarinet new tic-tac-toe-game
cd tic-tac-toe-game

# Verify project structure
ls -la
```

Expected project structure:
```
tic-tac-toe-game/
  Clarinet.toml          # Project configuration
  contracts/             # Smart contracts directory
  tests/                # Test files
  settings/             # Network settings
  deployments/          # Deployment configurations
```

### Configure Project Settings

Update `Clarinet.toml`:

```toml
[project]
name = "tic-tac-toe-game"
description = "A betting-based Tic Tac Toe game on Stacks blockchain"
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

## Step 2: Game Architecture Design

### Game State Structure

```lisp
;; Game state disimpan dalam map dengan struktur:
;; Key: uint (game-id)  
;; Value: game-data tuple
{
    player-one: principal,           ;; Address player 1 (plays X)
    player-two: (optional principal), ;; Address player 2 (plays O)
    is-player-one-turn: bool,        ;; Current turn indicator
    bet-amount: uint,                ;; Bet amount dalam microSTX
    board: (list 9 uint),           ;; Board state representation
    winner: (optional principal)     ;; Game winner (if finished)
}
```

### Board Representation Logic

```
Visual Board Layout:
 0 | 1 | 2
-----------
 3 | 4 | 5  
-----------
 6 | 7 | 8

Cell Values:
- 0 = Empty cell
- 1 = X (Player One)
- 2 = O (Player Two)
```

### Game Flow Design

```
Complete Game Flow:
1. Player 1 creates game + places bet + makes first move (X)
2. Player 2 joins game + places matching bet + makes move (O)
3. Players alternate turns making moves
4. Game validation on each move (valid position, correct turn)
5. Win condition checked after each move
6. Game ends: winner gets both bets OR draw returns bets
```

## Step 3: Smart Contract Implementation

Create `contracts/tic-tac-toe.clar`:

```lisp
;; Tic Tac Toe Game Contract with Betting
;; Secure multiplayer game dengan financial incentives

;; === CONSTANTS ===
(define-constant THIS_CONTRACT (as-contract tx-sender))

;; Error codes
(define-constant ERR_MIN_BET_AMOUNT (err u100))
(define-constant ERR_INVALID_MOVE (err u101))
(define-constant ERR_GAME_NOT_FOUND (err u102))
(define-constant ERR_GAME_CANNOT_BE_JOINED (err u103))
(define-constant ERR_NOT_YOUR_TURN (err u104))
(define-constant ERR_GAME_ALREADY_FINISHED (err u105))
(define-constant ERR_INSUFFICIENT_FUNDS (err u106))
(define-constant ERR_CANNOT_JOIN_OWN_GAME (err u107))

;; === DATA STORAGE ===

;; Game ID counter untuk unique game identification
(define-data-var latest-game-id uint u0)

;; Main games storage map
(define-map games 
    uint ;; Game ID (key)
    { ;; Game data (value)
        player-one: principal,
        player-two: (optional principal),
        is-player-one-turn: bool,
        bet-amount: uint,
        board: (list 9 uint),
        winner: (optional principal)
    }
)

;; === PUBLIC FUNCTIONS ===

;; Create new game dengan initial move
(define-public (create-game (bet-amount uint) (move-index uint) (move uint))
    (let (
        ;; Get next available game ID
        (game-id (var-get latest-game-id))
        ;; Initialize empty board
        (starting-board (list u0 u0 u0 u0 u0 u0 u0 u0 u0))
        ;; Apply creator's first move
        (game-board (unwrap! (replace-at? starting-board move-index move) ERR_INVALID_MOVE))
        ;; Create initial game data
        (game-data {
            player-one: contract-caller,
            player-two: none,
            is-player-one-turn: false, ;; Next turn belongs to player two
            bet-amount: bet-amount,
            board: game-board,
            winner: none
        })
    )
    ;; Input validation
    (asserts! (> bet-amount u0) ERR_MIN_BET_AMOUNT)
    (asserts! (is-eq move u1) ERR_INVALID_MOVE) ;; Creator must play X
    (asserts! (validate-move starting-board move-index move) ERR_INVALID_MOVE)
    
    ;; Check caller has sufficient balance
    (asserts! (>= (stx-get-balance contract-caller) bet-amount) ERR_INSUFFICIENT_FUNDS)
    
    ;; Transfer bet amount to contract
    (try! (stx-transfer? bet-amount contract-caller THIS_CONTRACT))
    
    ;; Store game state
    (map-set games game-id game-data)
    
    ;; Increment game counter untuk next game
    (var-set latest-game-id (+ game-id u1))
    
    ;; Emit event for tracking
    (print { 
        action: "create-game", 
        game-id: game-id,
        player-one: contract-caller,
        bet-amount: bet-amount,
        first-move: move-index
    })
    
    ;; Return new game ID
    (ok game-id)
    )
)

;; Join existing game as second player
(define-public (join-game (game-id uint) (move-index uint) (move uint))
    (let (
        ;; Load existing game data
        (original-game-data (unwrap! (map-get? games game-id) ERR_GAME_NOT_FOUND))
        ;; Get current board state
        (original-board (get board original-game-data))
        ;; Apply second player's move
        (game-board (unwrap! (replace-at? original-board move-index move) ERR_INVALID_MOVE))
        ;; Update game data dengan second player
        (game-data (merge original-game-data {
            board: game-board,
            player-two: (some contract-caller),
            is-player-one-turn: true ;; Next turn back to player one
        }))
    )
    ;; Validation checks
    (asserts! (is-none (get player-two original-game-data)) ERR_GAME_CANNOT_BE_JOINED)
    (asserts! (is-none (get winner original-game-data)) ERR_GAME_ALREADY_FINISHED)
    (asserts! (not (is-eq contract-caller (get player-one original-game-data))) ERR_CANNOT_JOIN_OWN_GAME)
    
    ;; Move validation
    (asserts! (is-eq move u2) ERR_INVALID_MOVE) ;; Second player must play O
    (asserts! (validate-move original-board move-index move) ERR_INVALID_MOVE)
    
    ;; Check sufficient funds for matching bet
    (asserts! (>= (stx-get-balance contract-caller) (get bet-amount original-game-data)) ERR_INSUFFICIENT_FUNDS)
    
    ;; Transfer matching bet to contract
    (try! (stx-transfer? (get bet-amount original-game-data) contract-caller THIS_CONTRACT))
    
    ;; Update game state
    (map-set games game-id game-data)
    
    ;; Emit join event
    (print { 
        action: "join-game", 
        game-id: game-id,
        player-two: contract-caller,
        move: move-index
    })
    
    (ok game-id)
    )
)

;; Make move dalam ongoing game
(define-public (play (game-id uint) (move-index uint) (move uint))
    (let (
        ;; Load current game state
        (original-game-data (unwrap! (map-get? games game-id) ERR_GAME_NOT_FOUND))
        ;; Get board state
        (original-board (get board original-game-data))
        ;; Determine current player dan move type
        (is-player-one-turn (get is-player-one-turn original-game-data))
        (current-player (if is-player-one-turn 
            (get player-one original-game-data) 
            (unwrap! (get player-two original-game-data) ERR_GAME_NOT_FOUND)))
        (expected-move (if is-player-one-turn u1 u2))
        ;; Apply the move
        (game-board (unwrap! (replace-at? original-board move-index move) ERR_INVALID_MOVE))
        ;; Check for winning condition
        (is-winner (has-won game-board))
        ;; Check for draw condition
        (is-draw (and (not is-winner) (is-board-full-list game-board)))
        ;; Create updated game state
        (game-data (merge original-game-data {
            board: game-board,
            is-player-one-turn: (not is-player-one-turn),
            winner: (if is-winner (some current-player) none)
        }))
    )
    ;; Turn validation
    (asserts! (is-eq contract-caller current-player) ERR_NOT_YOUR_TURN)
    (asserts! (is-none (get winner original-game-data)) ERR_GAME_ALREADY_FINISHED)
    
    ;; Move validation
    (asserts! (is-eq move expected-move) ERR_INVALID_MOVE)
    (asserts! (validate-move original-board move-index move) ERR_INVALID_MOVE)
    
    ;; Handle game end scenarios
    (if is-winner
        ;; Winner takes all - transfer double bet amount
        (try! (as-contract (stx-transfer? 
            (* u2 (get bet-amount game-data)) 
            tx-sender 
            current-player)))
        ;; Check for draw
        (if is-draw
            ;; Draw - return bets to both players
            (begin
                (try! (as-contract (stx-transfer? 
                    (get bet-amount game-data) 
                    tx-sender 
                    (get player-one game-data))))
                (try! (as-contract (stx-transfer? 
                    (get bet-amount game-data) 
                    tx-sender 
                    (unwrap! (get player-two game-data) ERR_GAME_NOT_FOUND))))
            )
            false
        )
    )
    
    ;; Update game state
    (map-set games game-id game-data)
    
    ;; Emit move event
    (print { 
        action: "play", 
        game-id: game-id,
        player: current-player,
        move: move-index,
        winner: (get winner game-data),
        is-draw: is-draw
    })
    
    (ok game-id)
    )
)

;; === READ-ONLY FUNCTIONS ===

;; Get complete game data
(define-read-only (get-game (game-id uint))
    (map-get? games game-id)
)

;; Get latest game ID (for finding most recent games)
(define-read-only (get-latest-game-id)
    (var-get latest-game-id)
)

;; Get just the board state
(define-read-only (get-game-board (game-id uint))
    (match (map-get? games game-id)
        game-data (ok (get board game-data))
        (err ERR_GAME_NOT_FOUND)
    )
)

;; Get current turn information
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

;; Get comprehensive game status
(define-read-only (get-game-status (game-id uint))
    (match (map-get? games game-id)
        game-data (let (
            (has-winner (is-some (get winner game-data)))
            (has-player-two (is-some (get player-two game-data)))
            (board-full (is-board-full-list (get board game-data)))
        )
        (ok {
            status: (if has-winner
                "finished"
                (if (not has-player-two)
                    "waiting-for-player"
                    (if (and (not has-winner) board-full)
                        "draw"
                        "in-progress"))),
            winner: (get winner game-data),
            total-prize: (* u2 (get bet-amount game-data)),
            is-draw: (and (not has-winner) board-full)
        }))
        (err ERR_GAME_NOT_FOUND)
    )
)

;; Check if board is full (for draw detection)
(define-read-only (is-board-full (game-id uint))
    (match (map-get? games game-id)
        game-data (ok (is-board-full-list (get board game-data)))
        (err ERR_GAME_NOT_FOUND)
    )
)

;; === PRIVATE HELPER FUNCTIONS ===

;; Validate move adalah legal
(define-private (validate-move (board (list 9 uint)) (move-index uint) (move uint))
    (let (
        ;; Check index dalam range 0-8
        (index-in-range (and (>= move-index u0) (< move-index u9)))
        ;; Check move value valid (1 atau 2)
        (valid-move (or (is-eq move u1) (is-eq move u2)))
        ;; Check target cell adalah empty
        (empty-spot (is-eq (unwrap! (element-at? board move-index) false) u0))
    )
    ;; All conditions must be true
    (and index-in-range valid-move empty-spot)
    )
)

;; Check apakah ada winning combination
(define-private (has-won (board (list 9 uint))) 
    (or
        ;; Check all possible winning lines
        ;; Horizontal rows
        (is-line board u0 u1 u2)
        (is-line board u3 u4 u5)
        (is-line board u6 u7 u8)
        ;; Vertical columns
        (is-line board u0 u3 u6)
        (is-line board u1 u4 u7)
        (is-line board u2 u5 u8)
        ;; Diagonal lines
        (is-line board u0 u4 u8)
        (is-line board u2 u4 u6)
    )
)

;; Check apakah three positions membentuk winning line
(define-private (is-line (board (list 9 uint)) (a uint) (b uint) (c uint)) 
    (let (
        ;; Get values at the three positions
        (a-val (unwrap! (element-at? board a) false))
        (b-val (unwrap! (element-at? board b) false))
        (c-val (unwrap! (element-at? board c) false))
    )
    ;; Check all three sama dan not empty
    (and 
        (is-eq a-val b-val) 
        (is-eq a-val c-val) 
        (not (is-eq a-val u0))
    )
    )
)

;; Helper function untuk check board penuh
(define-private (is-board-full-list (board (list 9 uint)))
    ;; Board penuh jika tidak ada empty cells (0)
    (is-eq (len (filter is-empty-cell board)) u0)
)

;; Helper untuk identify empty cells
(define-private (is-empty-cell (cell uint))
    (is-eq cell u0)
)
```

## Step 4: Testing Strategy

### Setup Modern Testing Environment

```bash
# Install testing dependencies
npm install @hirosystems/clarinet-sdk
npm install -D vitest @stacks/transactions vitest-environment-clarinet
```

### Configure Vitest

Create `vitest.config.js`:

```javascript
import { defineConfig } from "vite";
import { vitestSetupFilePath, getClarinetVitestsArgv } from "@hirosystems/clarinet-sdk/vitest";

export default defineConfig({
  test: {
    environment: "clarinet",
    pool: "forks",
    poolOptions: {
      threads: { singleThread: true },
      forks: { singleFork: true },
    },
    setupFiles: [vitestSetupFilePath],
    environmentOptions: {
      clarinet: {
        ...getClarinetVitestsArgv(),
      },
    },
  },
});
```

### Main Test Suite

Create `tests/tic-tac-toe.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

describe("Tic Tac Toe Game Tests", () => {

  it("Can create new game successfully", () => {
    const accounts = simnet.getAccounts();
    const player1 = accounts.get('wallet_1')!;
    const betAmount = 1000000;
    
    const result = simnet.callPublicFn(
      'tic-tac-toe',
      'create-game', 
      [Cl.uint(betAmount), Cl.uint(0), Cl.uint(1)],
      player1
    );
    
    expect(result.result).toEqual(Cl.ok(Cl.uint(0)));
  });

  it("Player two can join game successfully", () => {
    const accounts = simnet.getAccounts();
    const player1 = accounts.get('wallet_1')!;
    const player2 = accounts.get('wallet_2')!;
    const betAmount = 1000000;
    
    // Create game first
    simnet.callPublicFn(
      'tic-tac-toe',
      'create-game', 
      [Cl.uint(betAmount), Cl.uint(0), Cl.uint(1)],
      player1
    );
    
    // Join game
    const result = simnet.callPublicFn(
      'tic-tac-toe',
      'join-game', 
      [Cl.uint(0), Cl.uint(1), Cl.uint(2)],
      player2
    );
    
    expect(result.result).toEqual(Cl.ok(Cl.uint(0)));
  });

  it("Winner receives complete prize pool", () => {
    const accounts = simnet.getAccounts();
    const player1 = accounts.get('wallet_1')!;
    const player2 = accounts.get('wallet_2')!;
    const betAmount = 1000000;
    const gameId = 0;
    
    // Create and join game
    simnet.callPublicFn('tic-tac-toe', 'create-game', [Cl.uint(betAmount), Cl.uint(0), Cl.uint(1)], player1);
    simnet.callPublicFn('tic-tac-toe', 'join-game', [Cl.uint(gameId), Cl.uint(1), Cl.uint(2)], player2);
    
    // Setup winning game scenario untuk Player 1 (diagonal win: 0, 4, 8)
    simnet.callPublicFn('tic-tac-toe', 'play', [Cl.uint(gameId), Cl.uint(3), Cl.uint(2)], player2);
    simnet.callPublicFn('tic-tac-toe', 'play', [Cl.uint(gameId), Cl.uint(4), Cl.uint(1)], player1);
    simnet.callPublicFn('tic-tac-toe', 'play', [Cl.uint(gameId), Cl.uint(5), Cl.uint(2)], player2);
    
    // Winning move
    const winningMove = simnet.callPublicFn(
      'tic-tac-toe', 
      'play', 
      [Cl.uint(gameId), Cl.uint(8), Cl.uint(1)],
      player1
    );
    expect(winningMove.result).toEqual(Cl.ok(Cl.uint(0)));
    
    // Verify game status
    const statusResult = simnet.callReadOnlyFn(
      'tic-tac-toe',
      'get-game-status',
      [Cl.uint(gameId)],
      player1
    );
    
    expect(statusResult.result).toBeOk(
      Cl.tuple({
        status: Cl.stringAscii("finished"),
        winner: Cl.some(Cl.standardPrincipal(player1)),
        "total-prize": Cl.uint(2000000),
        "is-draw": Cl.bool(false)
      })
    );
  });

});
```

## Step 5: Run Tests

```bash
# Run all tests
npm run test

# Run dengan watch mode  
npm run test:watch

# Run dengan coverage
npm run test:coverage
```

## Step 6: Deployment

### Network Configuration

Update `settings/Testnet.toml`:

```toml
[network]
name = "testnet"
node_rpc_address = "https://stacks-node-api.testnet.stacks.co"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "your testnet mnemonic phrase here"
balance = 100000000000000
```

### Deploy to Testnet

```bash
# Generate deployment plan
clarinet deployment generate --testnet

# Deploy contract
clarinet deployment apply --testnet
```

## Troubleshooting

### Common Issues

1. **Syntax Errors**
```bash
clarinet check --verbose
```

2. **Test Failures**
```bash
npm run test:watch
```

3. **Deployment Problems**
- Check STX balance
- Verify network connectivity
- Validate mnemonic/private key

## Next Steps

Setelah berhasil mengembangkan smart contract:

1. **Frontend Integration**: Build UI untuk berinteraksi dengan contract
2. **Advanced Features**: Tournament systems, rankings, multiple game modes
3. **Production**: Security audits, gas optimization, monitoring

Congratulations! Anda telah berhasil membangun smart contract Tic Tac Toe yang lengkap dengan betting mechanism dan modern testing approach.

---

**Selanjutnya**: Mari kita build frontend interface untuk berinteraksi dengan smart contract ini.

📱 **[Lanjut ke UI Development 🎮](2-ui-tic-tac-toe.md)**