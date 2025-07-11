import { useState } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../contractConfig";

const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function symbol() view returns (string)",
];

export default function History() {
  const [account, setAccount] = useState("");
  const [history, setHistory] = useState([]);
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
        const symbol = await contract.symbol();
        setTokenSymbol(symbol);
        fetchTransferHistory(contract);
      } else {
        alert("Please install MetaMask");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }

  async function fetchTransferHistory(contract) {
    try {
      const logs = await contract.queryFilter("Transfer");
      const formatted = logs.map((log) => ({
        from: log.args.from,
        to: log.args.to,
        value: ethers.formatUnits(log.args.value, 18),
        txHash: log.transactionHash,
      })).reverse();
      setHistory(formatted);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Transfer History</h1>
      {account ? (
        <div className="w-full max-w-md bg-white p-4 rounded shadow">
          {history.length === 0 ? (
            <p className="text-gray-500">No transactions found.</p>
          ) : (
            <ul className="space-y-2 text-sm max-h-60 overflow-y-auto">
              {history.map((tx, index) => (
                <li key={index} className="border-b pb-2">
                  <p><strong>From:</strong> <code>{tx.from}</code></p>
                  <p><strong>To:</strong> <code>{tx.to}</code></p>
                  <p><strong>Amount:</strong> {tx.value} {tokenSymbol}</p>
                  <p className="text-gray-400"><strong>Tx:</strong> {tx.txHash.slice(0, 20)}...</p>
                </li>
              ))}
            </ul>
          )}
        </div>
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