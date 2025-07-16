# web3-project

## Current Features Implemented
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
## Features TODO
| Tính năng                         | Mục tiêu học được                   |
| --------------------------------- | ----------------------------------- |
| `burn()`                          | Giảm `totalSupply`                  |
| Tích hợp `ERC721` (NFT)           | Hiểu token không thể chia, metadata |
| Lưu metadata lên IPFS             | Thực hành decentralized storage     |
| Dùng Chainlink Price Feed         | Học tương tác với oracle            |
| Tích hợp frontend upload file/NFT | UI thực chiến Web3                  |
| Kết nối testnet & verify contract | Chuẩn bị bước deploy thực tế        |

## Features DOING
| Công cụ        | Dùng cho                                  |
| -------------- | ----------------------------------------- |
| OpenAI/Google API     | LLM trả lời/gợi ý                         |
| Replicate API  | DALL·E, StableDiffusion, Whisper,...      |
| TensorFlow\.js | Phân tích dữ liệu trên frontend           |
| Pinata / IPFS  | Lưu nội dung AI sinh ra (ảnh/video/audio) |
| Ethers.js      | Giao tiếp smart contract                  |

1. AI hỗ trợ người dùng trong DApp
   - Sử dụng OpenAI/Google API (hoặc local LLM nếu cần rẻ/riêng tư)
   - Dùng frontend tạo chat interface hoặc popover thông minh
2. AI phân tích dữ liệu giao dịch
   - Dùng TensorFlow.js, hoặc sklearn backend + API
   - Sử dụng data từ event logs của DApp
3. AI tạo nội dung on-chain (kết hợp NFT)
   - Pinata, Web3.storage, NFT.Storage để lưu ảnh
   - Frontend form + AI backend API
  
     
