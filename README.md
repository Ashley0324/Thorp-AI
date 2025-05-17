# Thorp.AI: AI-Dirved Bitcoin Analysis Platform 

### Overview

Thorp.AI is a Bitcoin analysis platform that provides real-time market data, technical indicators, derivatives information, AI-powered predictions, and market insights. The platform is designed for both casual investors and professional traders who need accurate, timely information about the Bitcoin market.

To make AI predictions more transparent and verifiable, we propose Thorp Protocol: a minimal Solana smart contract (program) built with Anchor to record and verify AI prediction results on-chain. Thorp Protocol not onl enables you to publish AI-driven financial forecasts to the blockchain, but is also suitable for scenarios like sports betting and beyond.

### Features

- **Real-time Bitcoin Price Tracking**: Monitor BTC prices across major exchanges
- **Technical Indicators**: Access to RSI, MACD, Bollinger Bands, and other key indicators
- **Derivatives Data**: View funding rates, open interest, and liquidations from major futures exchanges
- **AI Advisor**: Get AI-powered market insights and answers to your Bitcoin-related questions
- **Price Prediction**: Machine learning-based price prediction with historical accuracy tracking
- **News Aggregation**: Latest Bitcoin and crypto market news
- **Market Events Calendar**: Track important upcoming events affecting the market
- **Multi-user Support**: Different permission levels for various user types
- **Web3 Integration**: Connect your wallet for enhanced features
- **Admin Dashboard**: Manage content, users, and platform settings

### Thorp Prototol
This is a decentralized protocol built on **Solana**, enabling AI models to submit and timestamp their predictions in an immutable, transparent way.

Typical use cases include:
- Recording AI predictions for financial prices, weather, or sports
- Creating verifiable track records for model performance
- Forming the basis of decentralized prediction markets or AI model reputation systems

#### Features

- Record AI model predictions with metadata
- Include model and input hashes to protect intellectual property
- Associate predictions with public keys (wallets) for accountability
- Designed for expansion (e.g., rewards, ZK proofs, prediction validation)

#### Account Structure

```rust
pub struct Prediction {
    pub prediction_id: String,      // Unique identifier (e.g. "pred_001")
    pub model_hash: [u8; 32],       // Hash of the model identity
    pub input_hash: [u8; 32],       // Hash of the input data
    pub predicted_output: u64,      // Prediction result
    pub timestamp: i64,             // Time of prediction (UNIX)
    pub submitter: Pubkey,          // Who submitted this prediction
}
```
#### Security & Optimizations

- Only minimal data is stored on-chain to reduce cost
- Consider storing full model/input off-chain (e.g. IPFS/Arweave)
- Signature & access control can be added for extra integrity

#### Roadmap

- [ ] 🔗 Chain offload: support IPFS/Arweave file references
- [ ] ✅ Verifier contract: validate prediction outcome
- [ ] 💰 Incentive layer: staking/reward system for accurate models
- [ ] 🧠 ZKML integration: zero-knowledge model execution proof

### Blockchain Integration

Thorp.AI deeply integrates with blockchain technology to provide enhanced functionality:

1. **Wallet Authentication**: Users can log in using their Web3 wallets (MetaMask, WalletConnect, etc.), providing a secure, passwordless authentication experience.

2. **On-chain Prediction Storage**: All prediction results are stored on-chain as NFTs, ensuring transparency, immutability, and verifiability of historical predictions.

3. **Wallet Investment Analysis** (Coming Soon): The platform will analyze users' wallet transaction history to provide personalized insights and recommendations based on their investment behavior.

4. **One-click Strategy Execution** (Coming Soon): Integration with on-chain operating systems will allow users to execute trading strategies directly from the platform with a single click.

### Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **API Integration**: Multiple cryptocurrency exchange APIs
- **Authentication**: JWT-based authentication, Web3 wallet authentication
- **Blockchain Integration**: Ethereum, NFT standards (ERC-721/ERC-1155)
- **Styling**: Tailwind CSS with dark/light theme support
- **Internationalization**: Multi-language support

### Quick Start-Dapp

1. Clone the repository:
   ```bash
   git clone https://github.com/Ashley0324/Thorp-AI
   cd btcanalysisplatform1
```

2. Install dependencies:
   ```bash
   npm install

### Quick Start-Protocol

- [Rust + Cargo](https://www.rust-lang.org/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://book.anchor-lang.com/getting_started/installation.html)
- Node.js (for tests)

#### 1. Build the program

```bash
anchor build
```

#### 2. Start local test validator

```bash
solana-test-validator
```

#### 3. Deploy to localnet

```bash
anchor deploy
```

#### 4. Run tests

```bash
anchor test
```

#### Example: Submit a Prediction

```ts
await program.methods.submitPrediction(
  "predict123",
  new Array(32).fill(1),
  new Array(32).fill(2),
  new anchor.BN(1234),              // predicted output
  new anchor.BN(Date.now())         // timestamp
).accounts({
  prediction: predictionPda,
  submitter: provider.wallet.publicKey,
  systemProgram: anchor.web3.SystemProgram.programId,
}).rpc();