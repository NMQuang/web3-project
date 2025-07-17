# My DApp Starter - Documentation

- This project demonstrates a simple ERC20-like token using Solidity + Hardhat and a frontend built with Next.js + Tailwind CSS.

## 1. Current Features Implemented

1. **Wallet Connection**
   - Connects to MetaMask using `eth_requestAccounts`.
   - Displays current connected address.
   - Shows token balance of the connected account.

2. **Transfer Tokens**
   - Allows sending DTK tokens to any valid Ethereum address.
   - Displays success or failure message.
   - Updates sender's balance immediately after transfer.

3. **Mint Tokens**
   - Mints new DTK tokens to any valid address.
   - Requires connected account to have minting permissions.
   - Updates `totalSupply` and recipient's balance.

4. **Transfer History**
   - Displays past token transfers using `Transfer` event.
   - Fetches data from contract via `queryFilter(...)`.
   - Shows sender, receiver, amount, and transaction hash.

5. **Approve Spender**
   - Authorize another address to spend tokens on your behalf.
   - Uses `approve(spender, amount)` method.
   - Stored in `allowance[owner][spender]`.

6. **Transfer From (Authorized)**
   - Allows approved account to transfer tokens from your wallet.
   - Uses `transferFrom(from, to, amount)`.
   - Requires sufficient allowance + balance of owner.

## 2. Technology Stack

- Smart Contract: Solidity (ERC20-like)
- Blockchain Tooling: Hardhat
- Frontend: Next.js + Tailwind CSS
- Wallet Integration: MetaMask + ethers.js v6

## 3. Usage Instructions

- Start Hardhat local node: `npx hardhat node`
- Deploy contract: `npx hardhat run scripts/deploy.js --network localhost`
- Start frontend: `cd frontend && npm run dev`
- Connect MetaMask to Hardhat localhost (Chain ID: 31337)
- Use different pages for wallet, transfer, mint, approve, transferfrom, and history

## 4. Deployment Guide (Smart Contract + Frontend)

- This project consists of two parts:
  - **Smart Contract** (Hardhat)
  - **Frontend** (Next.js)

### 4.1. Deploy Smart Contract to Sepolia Testnet

1. Go to the `blockchain/` folder:
   ```bash
   cd blockchain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the same folder:
   ```env
   ALCHEMY_KEY=your_alchemy_api_key
   PRIVATE_KEY=your_metamask_private_key
   ```

4. Configure `hardhat.config.js` to use the `sepolia` network.

5. Run deploy script:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

6. Save the deployed contract address for frontend use.

### 4.2. Deploy Frontend to Vercel

1. Push your code to a GitHub repository.

2. Go to [https://vercel.com](https://vercel.com) and import the project from GitHub.

3. In project settings:
   - Set **Root Directory** to `frontend/`
   - Add the following environment variables:
     ```env
     NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContract
     NEXT_PUBLIC_CHAIN_ID=11155111
     GEMINI_API_KEY=your_gemini_api_key
     ```

4. Click **Deploy**.

5. After deploy, access your DApp at the Vercel-generated URL.

6. Notes
   - Re-deploy happens automatically when you push to the `main` branch.
   - If you update environment variables, you must trigger a **manual redeploy** from the Vercel dashboard.

## 5. AI Integration (Gemini API)

- This project includes integrated AI features using Google Gemini API to enhance Web3 DApp UX.

### 5.1. Features Using Gemini AI

1. **AI Assistant (Chatbot)**
   - Fixed popup located at bottom-right corner
   - Powered by Gemini API (`gemini-2.5-pro`)
   - Use `/api/ai-helper.js` for backend inference
   - Gemini API Key: `GEMINI_API_KEY`

2. **Transaction Explanation (AI History)**
   - Each token transfer is interpreted by Gemini into plain Vietnamese
   - Use `/api/tx-interpret.js` to call Gemini with transaction context
   - Displayed in History page below each transfer log

### 5.2. Gemini API Setup

1. Get an API key from [Google AI Studio](https://makersuite.google.com/)
2. Add this to your `.env.local` (for frontend) and `.env` (if needed for backend):
   ```env
   GEMINI_API_KEY=your_google_gemini_key
   ```

3. Gemini API endpoint used:
   ```
   https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
   ```