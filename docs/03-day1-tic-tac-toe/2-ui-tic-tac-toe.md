---
sidebar_position: 2
title: 2. Frontend Development - Tic Tac Toe UI
description: Tutorial lengkap membangun frontend interface untuk game Tic Tac Toe dengan Next.js, TypeScript, dan Stacks Connect - dari setup hingga deployment
keywords: [frontend tic tac toe, next.js, typescript, stacks connect, web3 ui, game interface, tailwindcss]
---

# Frontend Development: Tic Tac Toe Game UI

Selamat datang di bagian kedua workshop! Setelah berhasil membangun smart contract di bagian sebelumnya, sekarang kita akan membangun frontend interface yang modern dan user-friendly untuk berinteraksi dengan game Tic Tac Toe di Stacks blockchain.

## 🎯 Apa yang Akan Kita Bangun

### UI Features yang Akan Kita Implementasi

```
Frontend Features:
   🎨 Modern UI: Clean dan responsive design dengan TailwindCSS
   🔗 Wallet Integration: Stacks Connect untuk wallet connection
   🎮 Game Board: Interactive 3x3 grid untuk gameplay
   💰 Betting Interface: Create games dengan bet amount
   👥 Multiplayer: Join existing games
   📊 Game Status: Real-time game state display
   📱 Responsive: Mobile-first design
   🔄 Real-time Updates: Auto refresh game state
```

### Technology Stack

- **Next.js 15**: React framework dengan App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Stacks Connect**: Wallet connection library

## 📁 Struktur Project yang Akan Kita Buat

```
frontend/
   app/
      globals.css           # Global styles
      layout.tsx           # Root layout
      page.tsx             # Home page
      create/
         page.tsx         # Create game page
      game/
          [gameId]/
              page.tsx     # Game detail page
   components/
      game-board.tsx       # Game board component
      games-list.tsx       # Games list component
      navbar.tsx           # Navigation component
      play-game.tsx        # Play game component
   hooks/
      use-stacks.ts        # Stacks integration hook
   lib/
      contract.ts          # Contract interaction utilities
      stx-utils.ts         # STX formatting utilities
```

## 🚀 Step 1: Setup Project dan Dependencies

Mari kita mulai dengan setup project dan menginstall dependencies yang diperlukan.

### 1.1 Create Next.js Project

```bash
# Create Next.js frontend
npx create-next-app@latest frontend --typescript --tailwind --app

# Navigate ke frontend directory
cd frontend
```

### 1.2 Install Stacks Dependencies

```bash
# Install dependencies untuk Stacks integration
npm install @stacks/connect @stacks/transactions @stacks/network
```

### 1.3 Verifikasi Package.json

Pastikan `package.json` Anda memiliki dependencies berikut:

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@stacks/connect": "^7.10.0",
    "@stacks/network": "^7.0.2",
    "@stacks/transactions": "^7.0.2",
    "next": "15.1.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.1.5",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

## ⚙️ Step 2: Konfigurasi Environment Variables

### 2.1 Buat Environment File

Buat file `.env.local` di root folder frontend:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=ST3P49R8XXQWG69S66MZASYPTTGNDKK0WW32RRJDN
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Catatan**: Ganti contract address dengan yang Anda deploy di bagian sebelumnya.

## 🎨 Step 3: Update Configuration Files

### 3.1 Update TailwindCSS Configuration

Update file `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### 3.2 Create PostCSS Configuration

Buat file `postcss.config.mjs`:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

### 3.3 Update Global CSS

Update file `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}
```

## 🔧 Step 4: Membuat Utility Functions

### 4.1 Buat STX Utilities

Buat file `lib/stx-utils.ts`:

```typescript
export function abbreviateAddress(address: string) {
  return `${address.substring(0, 5)}...${address.substring(36)}`;
}

export function abbreviateTxnId(txnId: string) {
  return `${txnId.substring(0, 5)}...${txnId.substring(62)}`;
}

export function explorerAddress(address: string) {
  return `https://explorer.hiro.so/address/${address}?chain=testnet`;
}

export async function getStxBalance(address: string) {
  const baseUrl = "https://api.testnet.hiro.so";
  const url = `${baseUrl}/extended/v1/address/${address}/stx`;

  const response = await fetch(url).then((res) => res.json());
  const balance = parseInt(response.balance);
  return balance;
}

// Convert a raw STX amount to a human readable format by respecting the 6 decimal places
export function formatStx(amount: number) {
  return parseFloat((amount / 10 ** 6).toFixed(2));
}

// Convert a human readable STX balance to the raw amount
export function parseStx(amount: number) {
  return amount * 10 ** 6;
}
```

## 📡 Step 5: Contract Interaction Functions

### 5.1 Buat Contract Functions

Buat file `lib/contract.ts`:

```typescript
import { STACKS_TESTNET } from "@stacks/network";
import {
  BooleanCV,
  cvToValue,
  fetchCallReadOnlyFunction,
  ListCV,
  OptionalCV,
  PrincipalCV,
  TupleCV,
  uintCV,
  UIntCV,
} from "@stacks/transactions";

const CONTRACT_ADDRESS = "ST3P49R8XXQWG69S66MZASYPTTGNDKK0WW32RRJDN";
const CONTRACT_NAME = "tic-tac-toe";

type GameCV = {
  "player-one": PrincipalCV;
  "player-two": OptionalCV<PrincipalCV>;
  "is-player-one-turn": BooleanCV;
  "bet-amount": UIntCV;
  board: ListCV<UIntCV>;
  winner: OptionalCV<PrincipalCV>;
};

export type Game = {
  id: number;
  "player-one": string;
  "player-two": string | null;
  "is-player-one-turn": boolean;
  "bet-amount": number;
  board: number[];
  winner: string | null;
};

export enum Move {
  EMPTY = 0,
  X = 1,
  O = 2,
}

export const EMPTY_BOARD = [
  Move.EMPTY,
  Move.EMPTY,
  Move.EMPTY,
  Move.EMPTY,
  Move.EMPTY,
  Move.EMPTY,
  Move.EMPTY,
  Move.EMPTY,
  Move.EMPTY,
];

export async function getAllGames() {
  // Fetch the latest-game-id from the contract
  const latestGameIdCV = (await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-latest-game-id",
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
    network: STACKS_TESTNET,
  })) as UIntCV;

  // Convert the uintCV to a JS/TS number type
  const latestGameId = parseInt(latestGameIdCV.value.toString());

  // Loop from 0 to latestGameId-1 and fetch the game details for each game
  const games: Game[] = [];
  for (let i = 0; i < latestGameId; i++) {
    const game = await getGame(i);
    if (game) games.push(game);
  }
  return games;
}

export async function getGame(gameId: number) {
  // Use the get-game read only function to fetch the game details for the given gameId
  const gameDetails = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-game",
    functionArgs: [uintCV(gameId)],
    senderAddress: CONTRACT_ADDRESS,
    network: STACKS_TESTNET,
  });

  const responseCV = gameDetails as OptionalCV<TupleCV<GameCV>>;
  // If we get back a none, then the game does not exist and we return null
  if (responseCV.type === "none") return null;
  // If we get back a value that is not a tuple, something went wrong and we return null
  if (responseCV.value.type !== "tuple") return null;

  // If we got back a GameCV tuple, we can convert it to a Game object
  const gameCV = responseCV.value.value;

  const game: Game = {
    id: gameId,
    "player-one": gameCV["player-one"].value,
    "player-two":
      gameCV["player-two"].type === "some"
        ? gameCV["player-two"].value.value
        : null,
    "is-player-one-turn": cvToValue(gameCV["is-player-one-turn"]),
    "bet-amount": parseInt(gameCV["bet-amount"].value.toString()),
    board: gameCV["board"].value.map((cell) => parseInt(cell.value.toString())),
    winner:
      gameCV["winner"].type === "some" ? gameCV["winner"].value.value : null,
  };
  return game;
}

export async function createNewGame(
  betAmount: number,
  moveIndex: number,
  move: Move
) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "create-game",
    functionArgs: [uintCV(betAmount), uintCV(moveIndex), uintCV(move)],
  };

  return txOptions;
}

export async function joinGame(gameId: number, moveIndex: number, move: Move) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "join-game",
    functionArgs: [uintCV(gameId), uintCV(moveIndex), uintCV(move)],
  };

  return txOptions;
}

export async function play(gameId: number, moveIndex: number, move: Move) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "play",
    functionArgs: [uintCV(gameId), uintCV(moveIndex), uintCV(move)],
  };

  return txOptions;
}
```

## 🔌 Step 6: Stacks Integration Hook

### 6.1 Buat Stacks Hook

Buat file `hooks/use-stacks.ts`:

```typescript
import { createNewGame, joinGame, Move, play } from "@/lib/contract";
import { getStxBalance } from "@/lib/stx-utils";
import {
  AppConfig,
  openContractCall,
  showConnect,
  type UserData,
  UserSession,
} from "@stacks/connect";
import { PostConditionMode } from "@stacks/transactions";
import { useEffect, useState } from "react";

const appDetails = {
  name: "Tic Tac Toe",
  icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
};

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });

export function useStacks() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stxBalance, setStxBalance] = useState(0);

  function connectWallet() {
    showConnect({
      appDetails,
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  }

  function disconnectWallet() {
    userSession.signUserOut();
    setUserData(null);
  }

  async function handleCreateGame(
    betAmount: number,
    moveIndex: number,
    move: Move
  ) {
    if (typeof window === "undefined") return;
    if (moveIndex < 0 || moveIndex > 8) {
      window.alert("Invalid move. Please make a valid move.");
      return;
    }
    if (betAmount === 0) {
      window.alert("Please make a bet");
      return;
    }

    try {
      if (!userData) throw new Error("User not connected");
      const txOptions = await createNewGame(betAmount, moveIndex, move);
      await openContractCall({
        ...txOptions,
        appDetails,
        onFinish: (data) => {
          console.log(data);
          window.alert("Sent create game transaction");
        },
        postConditionMode: PostConditionMode.Allow,
      });
    } catch (_err) {
      const err = _err as Error;
      console.error(err);
      window.alert(err.message);
    }
  }

  async function handleJoinGame(gameId: number, moveIndex: number, move: Move) {
    if (typeof window === "undefined") return;
    if (moveIndex < 0 || moveIndex > 8) {
      window.alert("Invalid move. Please make a valid move.");
      return;
    }

    try {
      if (!userData) throw new Error("User not connected");
      const txOptions = await joinGame(gameId, moveIndex, move);
      await openContractCall({
        ...txOptions,
        appDetails,
        onFinish: (data) => {
          console.log(data);
          window.alert("Sent join game transaction");
        },
        postConditionMode: PostConditionMode.Allow,
      });
    } catch (_err) {
      const err = _err as Error;
      console.error(err);
      window.alert(err.message);
    }
  }

  async function handlePlayGame(gameId: number, moveIndex: number, move: Move) {
    if (typeof window === "undefined") return;
    if (moveIndex < 0 || moveIndex > 8) {
      window.alert("Invalid move. Please make a valid move.");
      return;
    }

    try {
      if (!userData) throw new Error("User not connected");
      const txOptions = await play(gameId, moveIndex, move);
      await openContractCall({
        ...txOptions,
        appDetails,
        onFinish: (data) => {
          console.log(data);
          window.alert("Sent play game transaction");
        },
        postConditionMode: PostConditionMode.Allow,
      });
    } catch (_err) {
      const err = _err as Error;
      console.error(err);
      window.alert(err.message);
    }
  }

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const address = userData.profile.stxAddress.testnet;
      getStxBalance(address).then((balance) => {
        setStxBalance(balance);
      });
    }
  }, [userData]);

  return {
    userData,
    stxBalance,
    connectWallet,
    disconnectWallet,
    handleCreateGame,
    handleJoinGame,
    handlePlayGame,
  };
}
```

## 🎮 Step 7: Membuat Components

### 7.1 Game Board Component

Buat file `components/game-board.tsx`:

```typescript
"use client";

import { Move } from "@/lib/contract";

type GameBoardProps = {
  board: Move[];
  onCellClick?: (index: number) => void;
  cellClassName?: string;
  nextMove?: Move;
};

export function GameBoard({
  board,
  onCellClick,
  nextMove,
  cellClassName,
}: GameBoardProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <div
            key={index}
            className={
              "border border-gray-600 rounded-md flex items-center justify-center font-bold group cursor-pointer " +
              cellClassName
            }
            onClick={() => onCellClick?.(index)}
          >
            {cell === Move.EMPTY ? (
              <span className="hidden group-hover:block text-gray-500">
                {nextMove === Move.X ? "X" : nextMove === Move.O ? "O" : ""}
              </span>
            ) : (
              <span>{cell === Move.X ? "X" : cell === Move.O ? "O" : ""}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 7.2 Navigation Component

Buat file `components/navbar.tsx`:

```typescript
"use client";

import { useStacks } from "@/hooks/use-stacks";
import { abbreviateAddress } from "@/lib/stx-utils";
import Link from "next/link";

export function Navbar() {
  const { userData, connectWallet, disconnectWallet } = useStacks();

  return (
    <nav className="flex w-full items-center justify-between gap-4 p-4 h-16 border-b border-gray-500">
      <Link href="/" className="text-2xl font-bold">
        TicTacToe 🎲
      </Link>

      <div className="flex items-center gap-8">
        <Link href="/" className="text-gray-300 hover:text-gray-50">
          Home
        </Link>
        <Link href="/create" className="text-gray-300 hover:text-gray-50">
          Create Game
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {userData ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {abbreviateAddress(userData.profile.stxAddress.testnet)}
            </button>
            <button
              type="button"
              onClick={disconnectWallet}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={connectWallet}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
```

### 7.3 Games List Component

Buat file `components/games-list.tsx`:

```typescript
"use client";

import { Game } from "@/lib/contract";
import Link from "next/link";
import { GameBoard } from "./game-board";
import { useStacks } from "@/hooks/use-stacks";
import { useMemo } from "react";
import { formatStx } from "@/lib/stx-utils";

export function GamesList({ games }: { games: Game[] }) {
  const { userData } = useStacks();

  // User Games are games in which the user is a player
  // and a winner has not been decided yet
  const userGames = useMemo(() => {
    if (!userData) return [];
    const userAddress = userData.profile.stxAddress.testnet;
    const filteredGames = games.filter(
      (game) =>
        (game["player-one"] === userAddress ||
          game["player-two"] === userAddress) &&
        game.winner === null
    );
    return filteredGames;
  }, [userData, games]);

  // Joinable games are games in which there still isn't a second player
  // and also the currently logged in user is not the creator of the game
  const joinableGames = useMemo(() => {
    if (!userData) return [];
    const userAddress = userData.profile.stxAddress.testnet;

    return games.filter(
      (game) =>
        game.winner === null &&
        game["player-one"] !== userAddress &&
        game["player-two"] === null
    );
  }, [games, userData]);

  // Ended games are games in which the winner has been decided
  const endedGames = useMemo(() => {
    return games.filter((game) => game.winner !== null);
  }, [games]);

  return (
    <div className="w-full max-w-4xl space-y-12">
      {userData ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Active Games</h2>
          {userGames.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500 mb-4">
                You haven&apos;t joined any games yet
              </p>
              <Link
                href="/create"
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create New Game
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-8 max-w-7xl overflow-y-scroll">
              {userGames.map((game, index) => (
                <Link
                  key={`your-game-${index}`}
                  href={`/game/${game.id}`}
                  className="shrink-0 flex flex-col gap-2 border p-4 rounded-md border-gray-700 bg-gray-900 w-fit"
                >
                  <GameBoard
                    key={index}
                    board={game.board}
                    cellClassName="size-8 text-xl"
                  />
                  <div className="text-md px-1 py-0.5 bg-gray-800 rounded text-center w-full">
                    {formatStx(game["bet-amount"])} STX
                  </div>
                  <div className="text-md px-1 py-0.5 bg-gray-800 rounded text-center w-full">
                    Next Turn: {game["is-player-one-turn"] ? "X" : "O"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div>
        <h2 className="text-2xl font-bold mb-4">Joinable Games</h2>
        {joinableGames.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 mb-4">
              No joinable games found. Do you want to create a new one?
            </p>
            <Link
              href="/create"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Game
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-8 max-w-7xl overflow-y-scroll">
            {joinableGames.map((game, index) => (
              <Link
                key={`joinable-game-${index}`}
                href={`/game/${game.id}`}
                className="shrink-0 flex flex-col gap-2 border p-4 rounded-md border-gray-700 bg-gray-900 w-fit"
              >
                <GameBoard
                  key={index}
                  board={game.board}
                  cellClassName="size-8 text-xl"
                />
                <div className="text-md px-1 py-0.5 bg-gray-800 rounded text-center w-full">
                  {formatStx(game["bet-amount"])} STX
                </div>
                <div className="text-md px-1 py-0.5 bg-gray-800 rounded text-center w-full">
                  Next Turn: {game["is-player-one-turn"] ? "X" : "O"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Ended Games</h2>
        {endedGames.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 mb-4">
              No ended games yet. Do you want to create a new one?
            </p>
            <Link
              href="/create"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Game
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-8 max-w-7xl overflow-y-scroll">
            {endedGames.map((game, index) => (
              <Link
                key={`ended-game-${index}`}
                href={`/game/${game.id}`}
                className="shrink-0 flex flex-col gap-2 border p-4 rounded-md border-gray-700 bg-gray-900 w-fit"
              >
                <GameBoard
                  key={index}
                  board={game.board}
                  cellClassName="size-8 text-xl"
                />
                <div className="text-md px-1 py-0.5 bg-gray-800 rounded text-center w-full">
                  {formatStx(game["bet-amount"])} STX
                </div>
                <div className="text-md px-1 py-0.5 bg-gray-800 rounded text-center w-full">
                  Winner: {game["is-player-one-turn"] ? "O" : "X"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 7.4 Play Game Component

Buat file `components/play-game.tsx`:

```typescript
"use client";

import { Game, Move } from "@/lib/contract";
import { GameBoard } from "./game-board";
import { abbreviateAddress, explorerAddress, formatStx } from "@/lib/stx-utils";
import Link from "next/link";
import { useStacks } from "@/hooks/use-stacks";
import { useState } from "react";

interface PlayGameProps {
  game: Game;
}

export function PlayGame({ game }: PlayGameProps) {
  const { userData, handleJoinGame, handlePlayGame } = useStacks();
  const [board, setBoard] = useState(game.board);
  const [playedMoveIndex, setPlayedMoveIndex] = useState(-1);
  if (!userData) return null;

  const isPlayerOne =
    userData.profile.stxAddress.testnet === game["player-one"];
  const isPlayerTwo =
    userData.profile.stxAddress.testnet === game["player-two"];

  const isJoinable = game["player-two"] === null && !isPlayerOne;
  const isJoinedAlready = isPlayerOne || isPlayerTwo;
  const nextMove = game["is-player-one-turn"] ? Move.X : Move.O;
  const isMyTurn =
    (game["is-player-one-turn"] && isPlayerOne) ||
    (!game["is-player-one-turn"] && isPlayerTwo);
  const isGameOver = game.winner !== null;

  function onCellClick(index: number) {
    const tempBoard = [...game.board];
    tempBoard[index] = nextMove;
    setBoard(tempBoard);
    setPlayedMoveIndex(index);
  }

  return (
    <div className="flex flex-col gap-4 w-[400px]">
      <GameBoard
        board={board}
        onCellClick={onCellClick}
        nextMove={nextMove}
        cellClassName="size-32 text-6xl"
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-500">Bet Amount: </span>
          <span>{formatStx(game["bet-amount"])} STX</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-500">Player One: </span>
          <Link
            href={explorerAddress(game["player-one"])}
            target="_blank"
            className="hover:underline"
          >
            {abbreviateAddress(game["player-one"])}
          </Link>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-500">Player Two: </span>
          {game["player-two"] ? (
            <Link
              href={explorerAddress(game["player-two"])}
              target="_blank"
              className="hover:underline"
            >
              {abbreviateAddress(game["player-two"])}
            </Link>
          ) : (
            <span>Nobody</span>
          )}
        </div>

        {game["winner"] && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500">Winner: </span>
            <Link
              href={explorerAddress(game["winner"])}
              target="_blank"
              className="hover:underline"
            >
              {abbreviateAddress(game["winner"])}
            </Link>
          </div>
        )}
      </div>

      {isJoinable && (
        <button
          onClick={() => handleJoinGame(game.id, playedMoveIndex, nextMove)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Join Game
        </button>
      )}

      {isMyTurn && (
        <button
          onClick={() => handlePlayGame(game.id, playedMoveIndex, nextMove)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Play
        </button>
      )}

      {isJoinedAlready && !isMyTurn && !isGameOver && (
        <div className="text-gray-500">Waiting for opponent to play...</div>
      )}
    </div>
  );
}
```

## 📄 Step 8: Membuat Pages

### 8.1 Root Layout

Update file `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description: "Play Tic Tac Toe on Stacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

### 8.2 Home Page

Update file `app/page.tsx`:

```typescript
import { GamesList } from "@/components/games-list";
import { getAllGames } from "@/lib/contract";

export const dynamic = "force-dynamic";

export default async function Home() {
  const games = await getAllGames();

  return (
    <section className="flex flex-col items-center py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold">Tic Tac Toe 🎲</h1>
        <span className="text-sm text-gray-500">
          Play 1v1 Tic Tac Toe on the Stacks blockchain
        </span>
      </div>

      <GamesList games={games} />
    </section>
  );
}
```

### 8.3 Create Game Page

Buat file `app/create/page.tsx`:

```typescript
"use client";

import { GameBoard } from "@/components/game-board";
import { useStacks } from "@/hooks/use-stacks";
import { EMPTY_BOARD, Move } from "@/lib/contract";
import { formatStx, parseStx } from "@/lib/stx-utils";
import { useState } from "react";

export default function CreateGame() {
  const { stxBalance, userData, connectWallet, handleCreateGame } = useStacks();

  const [betAmount, setBetAmount] = useState(0);
  // When creating a new game, the initial board is entirely empty
  const [board, setBoard] = useState(EMPTY_BOARD);

  function onCellClick(index: number) {
    // Update the board to be the empty board + the move played by the user
    // Since this is inside 'Create Game', the user's move is the very first move and therefore always an X
    const tempBoard = [...EMPTY_BOARD];
    tempBoard[index] = Move.X;
    setBoard(tempBoard);
  }

  async function onCreateGame() {
    // Find the moveIndex (i.e. the cell) where the user played their move
    const moveIndex = board.findIndex((cell) => cell !== Move.EMPTY);
    const move = Move.X;
    // Trigger the onchain transaction popup
    await handleCreateGame(parseStx(betAmount), moveIndex, move);
  }

  return (
    <section className="flex flex-col items-center py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold">Create Game</h1>
        <span className="text-sm text-gray-500">
          Make a bet and play your first move
        </span>
      </div>

      <div className="flex flex-col gap-4 w-[400px]">
        <GameBoard
          board={board}
          onCellClick={onCellClick}
          nextMove={Move.X}
          cellClassName="size-32 text-6xl"
        />

        <div className="flex items-center gap-2 w-full">
          <span className="">Bet: </span>
          <input
            type="number"
            className="w-full rounded bg-gray-800 px-1"
            placeholder="0"
            value={betAmount}
            onChange={(e) => {
              setBetAmount(parseInt(e.target.value));
            }}
          />
          <div
            className="text-xs px-1 py-0.5 cursor-pointer hover:bg-gray-700 bg-gray-600 border border-gray-600 rounded"
            onClick={() => {
              setBetAmount(formatStx(stxBalance));
            }}
          >
            Max
          </div>
        </div>

        {userData ? (
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onCreateGame}
          >
            Create Game
          </button>
        ) : (
          <button
            type="button"
            onClick={connectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </section>
  );
}
```

### 8.4 Game Detail Page

Buat file `app/game/[gameId]/page.tsx`:

```typescript
import { PlayGame } from "@/components/play-game";
import { getGame } from "@/lib/contract";

type Params = Promise<{ gameId: string }>;

export default async function GamePage({ params }: { params: Params }) {
  const gameId = (await params).gameId;
  const game = await getGame(parseInt(gameId));
  if (!game) return <div>Game not found</div>;

  return (
    <section className="flex flex-col items-center py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold">Game #{gameId}</h1>
        <span className="text-sm text-gray-500">
          Play the game with your opponent
        </span>
      </div>

      <PlayGame game={game} />
    </section>
  );
}
```

## 🏃‍♂️ Step 9: Menjalankan Development Server

Sekarang mari kita jalankan aplikasi untuk memastikan semuanya bekerja dengan baik.

### 9.1 Start Development Server

```bash
npm run dev
```

### 9.2 Buka Browser

Buka browser dan navigate ke:
```
http://localhost:3000
```

Anda harus melihat aplikasi Tic Tac Toe dengan:
- Landing page dengan judul "Tic Tac Toe 🎲"
- Navigation bar dengan tombol connect wallet
- List of games (kosong jika belum ada game)

## 🧪 Step 10: Testing Aplikasi

Mari kita test semua fitur utama:

### 10.1 Test Wallet Connection

1. Click tombol "Connect Wallet" di navigation bar
2. Pilih wallet provider (Hiro Wallet, Xverse, dll)
3. Authorize connection
4. Verify bahwa address muncul di navbar dengan tombol disconnect

### 10.2 Test Create Game

1. Click "Create Game" di navigation
2. Click pada salah satu cell di game board untuk pilih opening move
3. Enter bet amount (contoh: 1)  
4. Click "Create Game" button
5. Confirm transaction di wallet
6. Wait untuk transaction confirmation

### 10.3 Test Join Game

1. Buka tab browser baru dengan address berbeda atau gunakan wallet berbeda
2. Connect wallet yang berbeda
3. Navigate ke game yang statusnya "Joinable"
4. Click pada game untuk masuk ke detail page
5. Click pada empty cell untuk place move
6. Click "Join Game" button
7. Confirm transaction di wallet

### 10.4 Test Gameplay

1. Alternate moves between players
2. Click pada empty cells untuk make moves
3. Click "Play" button untuk submit moves
4. Verify game state updates setelah each move
5. Check winner detection when game selesai

## 🎉 Step 11: Selesai!

Congratulations! Anda telah berhasil membangun frontend lengkap untuk Tic Tac Toe game dengan:

✅ **Modern UI**: Clean interface dengan TailwindCSS
✅ **Wallet Integration**: Seamless Stacks Connect integration  
✅ **Game Board**: Interactive 3x3 grid dengan hover effects
✅ **Betting System**: STX betting functionality
✅ **Multiplayer**: Create dan join games
✅ **Game Management**: Active, joinable, dan ended games sections

## 🚀 Next Steps (Optional)

Jika Anda ingin mengembangkan lebih lanjut:

1. **Add Notifications**: Implement toast notifications untuk user feedback
2. **Game History**: Show player's complete game history
3. **Leaderboard**: Display top players berdasarkan wins
4. **Mobile Optimization**: Improve mobile responsive design
5. **Real-time Updates**: Add WebSocket untuk live updates
6. **PWA Features**: Add offline capabilities

## 📝 Troubleshooting

### Jika mengalami errors:

**Module not found errors**:
```bash
# Re-install dependencies
npm install @stacks/connect @stacks/transactions @stacks/network
```

**TypeScript errors**:
- Pastikan semua files sudah dibuat dengan benar
- Check import paths
- Restart TypeScript server di VS Code

**Build errors**:
- Check environment variables di `.env.local`
- Pastikan contract address sudah benar

**Wallet connection issues**:
- Pastikan menggunakan testnet
- Pastikan wallet sudah funded dengan STX
- Try different wallet providers

**Contract call errors**:
- Verify contract address dan function names
- Check network configuration (testnet vs mainnet)
- Ensure sufficient STX balance untuk gas fees

---

**🎊 Workshop Part 2 Complete!** 

Anda telah berhasil membangun frontend lengkap yang terintegrasi dengan smart contract Tic Tac Toe. Players sekarang bisa:

- 🔗 Connect Stacks wallets 
- 🎮 Create new games dengan STX bets
- 👥 Join existing games
- 🎯 Play interactive games dengan real-time updates
- 🏆 See game results dan winners

**Next**: Deploy aplikasi ke production atau lanjut ke workshop selanjutnya untuk advanced features!

---

**📚 Resource Links:**
- [Stacks Documentation](https://docs.stacks.co)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stacks Connect Guide](https://docs.hiro.so/stacks-connect)
- [TailwindCSS Documentation](https://tailwindcss.com)