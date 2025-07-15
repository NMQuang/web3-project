My DApp Starter - Documentation
===============================

This project demonstrates a simple ERC20-like token using Solidity + Hardhat and a frontend built with Next.js + Tailwind CSS.

Current Features Implemented
----------------------------

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

Technology Stack
----------------

- Smart Contract: Solidity (ERC20-like)
- Blockchain Tooling: Hardhat
- Frontend: Next.js + Tailwind CSS
- Wallet Integration: MetaMask + ethers.js v6

Usage Instructions
------------------

- Start Hardhat local node: `npx hardhat node`
- Deploy contract: `npx hardhat run scripts/deploy.js --network localhost`
- Start frontend: `cd frontend && npm run dev`
- Connect MetaMask to Hardhat localhost (Chain ID: 31337)
- Use different pages for wallet, transfer, mint, approve, transferfrom, and history

Note
----
Replace `<PUT_YOUR_DEPLOYED_ADDRESS_HERE>` in frontend config with the actual contract address after deployment.

Author: Web3 Learner