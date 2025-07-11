import { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
];

export default function Wallet() {
  const [account, setAccount] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
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
        const name = await contract.name();
        const symbol = await contract.symbol();
        const bal = await contract.balanceOf(accounts[0]);
        const supply = await contract.totalSupply();
        setTokenName(name);
        setTokenSymbol(symbol);
        setBalance(ethers.formatUnits(bal, 18));
        setTotalSupply(ethers.formatUnits(supply, 18));
      } else {
        alert("Please install MetaMask");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">My DApp Starter</h1>
      {account ? (
        <>
          <p className="text-green-600 mb-2">Connected: {account}</p>
          <p className="mb-1">Token Name: <strong>{tokenName}</strong></p>
          <p className="mb-1">Symbol: <strong>{tokenSymbol}</strong></p>
          <p>Total Supply: <strong>{totalSupply}</strong> {tokenSymbol}</p>
          <p className="mb-6">Your Balance: <strong>{balance}</strong> {tokenSymbol}</p>
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