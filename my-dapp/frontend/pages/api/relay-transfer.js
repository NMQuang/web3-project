// /pages/api/relay-transfer.js
import { ethers } from "ethers";
import MyToken from "../../../blockchain/artifacts/contracts/MyToken.sol/MyToken.json";
import { contractAddress } from "../../contractConfig";

let provider;
let signer;
if (process.env.NODE_ENV === "development") {
    provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // local Hardhat
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // signer = await provider.getSigner();
    signer = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);

} else {
    provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);
    signer = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);
}
const contract = new ethers.Contract(contractAddress, MyToken.abi, signer);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { from, to, amount, deadline, signature } = req.body;
    const tx = await contract.transferWithSig(from, to, amount, deadline, signature);
    await tx.wait();

    return res.status(200).json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error("Relay failed:", err);
    return res.status(500).json({ error: "Gasless transfer failed", detail: err.message });
  }
}
