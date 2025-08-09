---
sidebar_position: 3
title: 3. Easy Challenges - Extend Your Tic Tac Toe
description: Collection of beginner-friendly challenges to enhance your Tic Tac Toe game with additional features for both frontend and smart contract
keywords: [tic tac toe challenges, stacks challenges, frontend challenges, smart contract challenges, web3 exercises, blockchain development]
---

# Easy Challenges: Extend Your Tic Tac Toe Game

Selamat! Anda telah berhasil membangun Tic Tac Toe game yang lengkap. Sekarang saatnya untuk mengembangkan skills Anda lebih lanjut dengan challenges yang menarik dan praktis.

## 🎯 Overview

Challenges ini dirancang untuk participants yang sudah menyelesaikan basic Tic Tac Toe implementation dan ingin menambahkan features yang akan meningkatkan user experience dan functionality.

### 🏆 Challenge Categories
- **Frontend Challenges**: Improve user interface dan user experience
- **Smart Contract Challenges**: Enhance blockchain logic dan game mechanics
- **Bonus**: Full-stack integrations

### 📈 Difficulty Level: Easy
Challenges ini cocok untuk developers yang:
- Sudah familiar dengan basic React/Next.js
- Memahami Clarity smart contract basics
- Ingin practice dengan real-world features
- Siap untuk learn new concepts step by step

---

## 🌟 Frontend Challenges

### Challenge 1: Game Statistics Counter
**Goal**: Display win/loss statistics for each connected player

#### Requirements
- [ ] Track total games played per player
- [ ] Display wins, losses, dan total games
- [ ] Show win percentage
- [ ] Persist data using localStorage atau IndexedDB
- [ ] Display stats dalam user-friendly format

#### Implementation Tips
```typescript
// Example data structure
interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winPercentage: number;
}

// localStorage key example
const STATS_KEY = `tic-tac-toe-stats-${userAddress}`;
```

#### UI Mockup
```
Player Statistics
┌─────────────────────┐
│ Games Played: 15    │
│ Wins: 8             │
│ Losses: 7           │
│ Win Rate: 53.3%     │
└─────────────────────┘
```

#### Success Criteria
- Stats update after each completed game
- Data persists after browser refresh
- Clean display dalam navbar atau sidebar
- Accurate calculations

---

### Challenge 2: Loading States & Spinners
**Goal**: Improve user experience with loading indicators during blockchain operations

#### Requirements
- [ ] Show loading spinner saat creating game
- [ ] Display "Processing..." saat joining game
- [ ] Loading state untuk each move submission
- [ ] Disable buttons during transaction processing
- [ ] Clear loading state setelah transaction complete

#### Implementation Tips
```typescript
// Loading state management
const [isLoading, setIsLoading] = useState({
  createGame: false,
  joinGame: false,
  playMove: false,
});

// Usage example
const handleCreateGame = async () => {
  setIsLoading(prev => ({ ...prev, createGame: true }));
  try {
    await createGameTransaction();
  } finally {
    setIsLoading(prev => ({ ...prev, createGame: false }));
  }
};
```

#### Success Criteria
- Visual feedback untuk all async operations
- Buttons disabled during loading
- Smooth transitions
- Clear loading messages

---

### Challenge 3: Toast Notifications
**Goal**: Provide instant feedback untuk user actions dengan toast notifications

#### Requirements
- [ ] Success notifications untuk completed actions
- [ ] Error notifications untuk failed operations  
- [ ] Info notifications untuk game state changes
- [ ] Auto-dismiss after 3-5 seconds
- [ ] Stack multiple notifications

#### Implementation Options
1. **Custom Implementation**: Build your own toast system
2. **Library**: Use `react-hot-toast` atau `react-toastify`

#### Example Notifications
- ✅ "Game created successfully!"
- ❌ "Failed to join game. Try again."
- ℹ️ "Waiting for opponent's move..."
- 🎉 "You won the game!"

#### Success Criteria
- Notifications appear untuk all major actions
- Different styles untuk different message types
- Non-intrusive positioning
- Mobile-friendly

---

### Challenge 4: Game Timer
**Goal**: Add countdown timer untuk each player's turn (30 seconds)

#### Requirements
- [ ] 30-second countdown untuk each move
- [ ] Visual timer display (progress bar atau countdown)
- [ ] Auto-forfeit jika time runs out
- [ ] Pause timer when game completed
- [ ] Reset timer untuk new turn

#### Implementation Tips
```typescript
const [timeLeft, setTimeLeft] = useState(30);
const [isMyTurn, setIsMyTurn] = useState(false);

useEffect(() => {
  if (!isMyTurn || timeLeft <= 0) return;
  
  const timer = setInterval(() => {
    setTimeLeft(prev => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [isMyTurn, timeLeft]);
```

#### Visual Design Ideas
- Circular progress bar
- Linear progress bar dengan colors (green → yellow → red)
- Digital countdown display
- Pulsing animation when < 10 seconds

#### Success Criteria
- Accurate countdown timing
- Visual indication of urgency
- Automatic forfeit mechanism
- Smooth animations

---

### Challenge 5: Player Avatars
**Goal**: Generate unique visual avatars berdasarkan wallet addresses

#### Requirements
- [ ] Generate consistent avatar untuk each address
- [ ] Display avatars dalam game board
- [ ] Show avatars dalam player lists
- [ ] Use deterministic generation (same address = same avatar)
- [ ] Make avatars visually distinct

#### Implementation Options
1. **Identicon**: Geometric patterns based on address hash
2. **Boring Avatars**: Simple, colorful avatars
3. **DiceBear**: Customizable avatar styles
4. **Custom**: Create your own generation logic

#### Example Implementation
```typescript
// Simple color-based avatar
function generateAvatar(address: string) {
  const hash = address.slice(-6); // Last 6 chars
  const hue = parseInt(hash, 16) % 360;
  
  return {
    backgroundColor: `hsl(${hue}, 70%, 60%)`,
    initials: address.slice(0, 2).toUpperCase()
  };
}
```

#### Success Criteria
- Consistent avatars untuk same addresses
- Visually appealing design
- Fast generation
- Accessible color combinations

---

## ⛓️ Smart Contract Challenges

### Challenge 1: Game Expiry System
**Goal**: Auto-cancel games yang inactive untuk prevent stuck games

#### Requirements
- [ ] Set expiry time saat creating game (contoh: 100 blocks)
- [ ] Function untuk check if game expired
- [ ] Auto-refund bet amount jika expired
- [ ] Only allow expiry after timeout period
- [ ] Prevent new moves on expired games

#### Smart Contract Implementation
```clarity
;; Add to game data structure
(define-map games uint {
  ;; existing fields...
  created-at: uint,
  expires-at: uint
})

;; New function
(define-public (expire-game (game-id uint))
  (let ((game (unwrap! (map-get? games game-id) (err u404))))
    (asserts! (> block-height (get expires-at game)) (err u400))
    (asserts! (is-none (get winner game)) (err u401))
    ;; Refund logic here
    (ok true)))
```

#### Success Criteria
- Games expire after set block count
- Bet amounts refunded properly
- Frontend shows expiry status
- Cannot make moves pada expired games

---

### Challenge 2: Minimum Bet Requirement
**Goal**: Set minimum bet amount untuk prevent spam games

#### Requirements
- [ ] Define minimum bet constant (contoh: 1 STX)
- [ ] Validate bet amount dalam create-game function
- [ ] Return clear error jika bet too low
- [ ] Update frontend untuk show minimum requirement

#### Smart Contract Implementation
```clarity
;; Add constant
(define-constant MIN-BET-AMOUNT u1000000) ;; 1 STX in microSTX

;; Update create-game function
(define-public (create-game (bet-amount uint) (move-index uint) (move uint))
  (begin
    (asserts! (>= bet-amount MIN-BET-AMOUNT) (err u402))
    ;; rest of function...
  ))
```

#### Frontend Updates
- Show minimum bet requirement dalam UI
- Validate bet amount before submission
- Display helpful error messages

#### Success Criteria
- Games cannot be created dengan bet < minimum
- Clear error messages
- Frontend prevents invalid submissions

---

### Challenge 3: Player Statistics Tracking
**Goal**: Track win/loss statistics directly dalam smart contract

#### Requirements
- [ ] Store player statistics dalam contract storage
- [ ] Update stats saat game completes
- [ ] Provide read-only functions untuk get stats
- [ ] Track games played, wins, losses
- [ ] Handle edge cases (draws, forfeits)

#### Smart Contract Implementation
```clarity
;; Player stats data structure
(define-map player-stats principal {
  games-played: uint,
  wins: uint,
  losses: uint
})

;; Read-only function
(define-read-only (get-player-stats (player principal))
  (default-to 
    {games-played: u0, wins: u0, losses: u0}
    (map-get? player-stats player)))

;; Update stats function (called when game ends)
(define-private (update-player-stats (winner (optional principal)) 
                                    (player-one principal) 
                                    (player-two principal))
  ;; Implementation here
)
```

#### Success Criteria
- Accurate statistics tracking
- Efficient storage usage
- Frontend dapat display stats from contract
- Handle all game end scenarios

---

### Challenge 4: Total Games Counter
**Goal**: Track total number of games created dengan efficient counter

#### Requirements
- [ ] Global counter untuk total games
- [ ] Read-only function untuk get total count
- [ ] Increment counter saat new game created
- [ ] Display total dalam frontend

#### Smart Contract Implementation
```clarity
;; Global counter
(define-data-var total-games-created uint u0)

;; Read-only getter
(define-read-only (get-total-games-count)
  (var-get total-games-created))

;; Update dalam create-game function
(var-set total-games-created (+ (var-get total-games-created) u1))
```

#### Frontend Integration
```typescript
export async function getTotalGamesCount() {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-total-games-count",
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
    network: STACKS_TESTNET,
  });
  
  return parseInt((result as UIntCV).value.toString());
}
```

#### Success Criteria
- Accurate counting
- Efficient implementation
- Frontend displays count
- Counter never decreases

---

### Challenge 5: Forfeit Mechanism
**Goal**: Allow players untuk surrender dan automatically award win to opponent

#### Requirements
- [ ] New forfeit function dalam contract
- [ ] Only allow current player untuk forfeit
- [ ] Award win to opponent
- [ ] Refund appropriate bet amounts
- [ ] Update player statistics

#### Smart Contract Implementation
```clarity
(define-public (forfeit-game (game-id uint))
  (let ((game (unwrap! (map-get? games game-id) (err u404)))
        (sender tx-sender))
    ;; Validate sender is a player
    (asserts! (or (is-eq sender (get player-one game))
                  (is-eq sender (get player-two game))) (err u403))
    ;; Validate game is active
    (asserts! (is-none (get winner game)) (err u401))
    ;; Award win to opponent
    (let ((winner (if (is-eq sender (get player-one game))
                     (get player-two game)
                     (some (get player-one game)))))
      ;; Update game with winner
      ;; Handle bet distribution
      (ok true))))
```

#### Success Criteria
- Only active players dapat forfeit
- Opponent automatically wins
- Proper bet distribution
- Frontend forfeit button

---

## 🏅 Challenge Completion Guide

### Getting Started
1. **Choose Your Challenge**: Start dengan 1-2 challenges yang interesting
2. **Fork Repository**: Create your own copy untuk development
3. **Create Feature Branch**: `git checkout -b challenge/[challenge-name]`
4. **Read Requirements**: Understand goals dan success criteria
5. **Plan Implementation**: Break down into smaller tasks

### Implementation Process
1. **Start Small**: Implement basic functionality first
2. **Test Frequently**: Verify each component works
3. **Document Changes**: Comment your code clearly
4. **Handle Edge Cases**: Think about error scenarios
5. **Polish UI/UX**: Make it user-friendly

### Submission Requirements
- [ ] **Working Implementation**: Feature works as described
- [ ] **Clean Code**: Well-organized dan readable
- [ ] **Basic Testing**: Manual testing completed
- [ ] **Documentation**: README update dengan feature explanation
- [ ] **Screenshots/Demo**: Visual proof of implementation
- [ ] **Code Comments**: Explain complex logic

### Review Checklist
#### Frontend Challenges
- [ ] Component renders correctly
- [ ] Responsive design
- [ ] Error handling
- [ ] Performance considerations
- [ ] Accessibility basics

#### Smart Contract Challenges  
- [ ] Functions work as expected
- [ ] Proper error handling
- [ ] Gas efficiency
- [ ] Security considerations
- [ ] Frontend integration

---

## 🎉 Next Steps

### After Completing Easy Challenges:
1. **Share Your Work**: Post screenshots dalam community
2. **Get Feedback**: Ask for code reviews dari peers
3. **Try Medium Challenges**: Level up your skills
4. **Help Others**: Mentor other participants
5. **Build Portfolio**: Use implementations untuk showcase work

### Learning Resources:
- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [React Best Practices](https://react.dev/learn)
- [Web3 UX Guidelines](https://web3ux.design)

---

**🚀 Ready to Start?**

Pick your first challenge dan start building! Remember, the goal adalah learning dan improving your skills step by step. Don't hesitate untuk ask questions dalam community channels.

**Good luck, dan happy coding!** 🎮⚡