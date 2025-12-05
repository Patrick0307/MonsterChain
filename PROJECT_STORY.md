# MonsterChain

## 💡 Inspiration

- "Why is it always humans hunting monsters? Why can't we flip the script?"
- In every RPG, players are heroes slaying monsters — we asked: **what if YOU were the monster?**
- Most Web3 games have high gas fees, poor UX, and the same old narrative
- We wanted zero-cost entry, real-time multiplayer, true NFT ownership, and a fresh perspective

---

## What it does

- **Play as a Monster** — Hunt humans instead of being hunted
- **Choose Your Vessel** — Warrior, Archer, or Mage class with customizable appearance
- **Battle Humans** — Enter maps, defeat human enemies, earn random weapon drops
- **Survive** — Avoid death or face 10 seconds respawn ("10 seconds feels like 10 years")
- **Own NFT Weapons** — 3 types × 3 rarities × 10 levels, fully tradeable
- **Synthesize Weapons** — Merge same-class weapons + pay LingStone to upgrade
- **Trade in Marketplace** — Buy/sell weapons with other players using LingStone + OCT
- **Team Up** — Public hunts with strangers or private rooms with friends
- **Zero Gas Fees** — Sponsored transactions cover everything for new players

---

## How we built it

- **Frontend**: React 19 + Vite, deployed on Vercel
- **Backend**: Node.js + Express + WebSocket, deployed on Render
- **Blockchain**: Sui Move smart contracts on OneChain Testnet
- **Wallet**: OneWallet integration via @mysten/sui SDK

### Smart Contracts:
- `player.move` — Soulbound Token (non-transferable character)
- `weapon.move` — NFT weapons with type, rarity, level
- `lingstone.move` — In-game currency (LING, 9 decimals)
- `marketplace.move` — P2P trading with escrow
- `random_utils.move` — On-chain randomness for drops

---

## Challenges we ran into

- **Flipping the Narrative** — Designing game flow from monster's perspective, not just reskinning heroes
- **Sponsored Transactions** — Implementing gas-free UX while preventing abuse
- **Real-time Multiplayer** — Keeping state consistent across clients with varying network conditions
- **On-chain Randomness** — Generating fair random numbers on deterministic blockchain
- **Marketplace Security** — Building trustless P2P trades with escrow mechanism
- **Wallet Integration** — Supporting OneWallet while staying compatible with Sui ecosystem

---

## Accomplishments that we're proud of

- **Zero barrier entry** — Sponsored transactions mean no gas fees for players
- **Unique concept** — Players ARE the monsters hunting humans
- **Full on-chain economy** — SBT characters, NFT weapons, LING tokens, decentralized marketplace
- **Real-time multiplayer** — Smooth WebSocket-based co-op with public/private rooms
- **7 contract iterations** — V1 to V7 to get the design right
- **Live deployment** — Running on OneChain Testnet, Vercel, and Render

---

## What we learned

- **Sui Move** — Ownership model, capabilities, object-centric design
- **Sponsored TX** — Gasless UX without compromising security
- **WebSocket** — Scalable real-time systems with room isolation
- **UX First** — Blockchain complexity should be invisible to players
- **True Ownership** — NFTs need real utility, not just speculation
- **Iteration** — 7 contract versions taught us to embrace change

---

## What's next for MonsterChain

- More maps and human enemy varieties
- Monster vs Monster PvP combat
- Mobile app support (iOS/Android)
- Monster Clan system
- Seasonal events with exclusive drops
- Cross-chain bridge integration

---

## 🛠️ Built With

React, Vite, Node.js, Express.js, WebSocket, Sui Move, JavaScript, CSS, OneChain Testnet, @mysten/sui, Vercel, Render, OneWallet, Sui CLI, ESLint, Tiled

---

## 🔗 Links

- 🎮 [Live Demo](https://tai-xu-chain.vercel.app)
- 📺 [YouTube Demo](https://www.youtube.com/watch?v=l86PfXooajU)
- 📊 [Block Explorer](https://explorer.onelabs.cc/)
- 💧 [Faucet](https://faucet-testnet.onelabs.cc/)
