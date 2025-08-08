# 🔁 DApp Development & Deployment Flow

This guide helps you test, deploy, and verify your Web3 DApp from local to testnet.

---

## 🧪 1. Local Development (Hardhat local network)

### ➤ Start local blockchain
```bash
npx hardhat node
```

### ➤ Deploy contract to localhost
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### ➤ Update frontend `.env.local`
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (your localhost deployed address)
```

### ➤ Start frontend app
```bash
cd frontend
npm run dev
```

### ➤ Connect MetaMask
- Add network: `http://127.0.0.1:8545`
- Import private key from Hardhat accounts (logged after `npx hardhat node`)

---

## 🌐 2. Deploy to Sepolia (Testnet)

### ➤ Fund your deployer wallet via Sepolia faucet:
- [https://sepoliafaucet.com](https://sepoliafaucet.com)

### ➤ Deploy contract to Sepolia
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### ➤ Update `.env.local` & Vercel:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (Sepolia contract address)
```

> Make sure to go to **Vercel Dashboard → Project → Environment Variables** and update the same value.

---

## 🚀 3. Redeploy Frontend (Vercel)

- If `.env.local` changed → Vercel needs redeploy
- You can:
  - Manually click **"Redeploy"** on Vercel
  - Or just `git commit` and push to `main`

---

## ✅ Final Test

- Open the deployed site (e.g. `https://your-dapp.vercel.app`)
- Connect MetaMask (set to Sepolia)
- Test:
  - ✅ Wallet connection
  - ✅ Token info
  - ✅ Transfer, Mint, Approve
  - ✅ AI integration
  - ✅ Transaction History
  - ✅ Signed Transfer (gasless)
    - Ensure environment variables are set:
      ```env
      RELAYER_PRIVATE_KEY=0x...
      NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
      NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here
      ```
    - Test flow:
      - Sign using MetaMask
      - Relay API sends transaction with gas
      - Recipient receives token
---