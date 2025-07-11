import { useState } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../contractConfig";

const abi = [
  "function mint(address to, uint256 amount)",
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
];

export default function Mint() {
  const [account, setAccount] = useState("");
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintStatus, setMintStatus] = useState("");
  const [balance, setBalance] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  async function connectWallet() {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const bal = await contract.balanceOf(accounts[0]);
        const symbol = await contract.symbol();
        setBalance(ethers.formatUnits(bal, 18));
        setTokenSymbol(symbol);
      } else {
        alert("Please install MetaMask");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleMint(e) {
    e.preventDefault();
    try {
      if (!ethers.isAddress(mintTo)) {
        setMintStatus("Invalid address.");
        return;
      }
      setMintStatus("Minting...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.mint(mintTo, ethers.parseUnits(mintAmount, 18));
      await tx.wait();
      setMintStatus("Mint successful!");
      // Cập nhật số dư
      const updatedBalance = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(updatedBalance, 18));
    } catch (err) {
      console.error(err);
      setMintStatus("Mint failed.");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Mint Tokens</h1>
      {account ? (
        <>
          <p className="mb-4">Your balance: <strong>{balance}</strong> {tokenSymbol}</p>
          <form onSubmit={handleMint} className="w-full max-w-md bg-white p-4 rounded shadow">
            <input
              type="text"
              placeholder="Recipient address"
              className="w-full mb-2 p-2 border rounded"
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full mb-2 p-2 border rounded"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Mint
            </button>
            {mintStatus && <p className="mt-2 text-sm text-gray-600">{mintStatus}</p>}
          </form>
        </>
      ) : (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </main>
  );
} 