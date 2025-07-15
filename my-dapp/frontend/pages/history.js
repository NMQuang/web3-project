import { useState, useContext } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../contractConfig";
import Link from "next/link";
import { useEffect } from 'react';
import { WalletContext } from "./_app";
import MyTokenJson from "../../blockchain/artifacts/contracts/MyToken.sol/MyToken.json";

const abi = MyTokenJson.abi;

export default function History() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  const { account, setAccount } = useContext(WalletContext);
  const [history, setHistory] = useState([]);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);


  async function fetchTransferHistory() {
    if (!account) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const symbol = await contract.symbol();
      setTokenSymbol(symbol);
      const logs = await contract.queryFilter("Transfer");
      const formatted = await Promise.all(
        logs.map(async (log) => {
          const block = await provider.getBlock(log.blockNumber);
          return {
            from: log.args.from,
            to: log.args.to,
            value: ethers.formatUnits(log.args.value, 18),
            txHash: log.transactionHash,
            timestamp: new Date(block.timestamp * 1000).toLocaleString(),
          };
        })
      );
      setHistory(formatted);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }

  useEffect(() => {
    fetchTransferHistory();
  }, [account]);

  async function connectWallet() {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
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
    <>
      <div className="container mt-5">
        <h1 className="text-2xl font-bold mb-4">Transfer History</h1>
        {account ? (
          <div className="w-full max-w-md bg-white p-4 rounded shadow">
            {history.length === 0 ? (
              <p className="text-gray-500">No transactions found.</p>
            ) : (
              <ul className="space-y-2 text-sm max-h-60 overflow-y-auto">
                {history.map((tx, index) => (
                  <li key={index} className="border-b pb-2">
                    {tx.from === "0x0000000000000000000000000000000000000000" ? (
                      <span className="badge bg-success me-2">Mint</span>
                    ) : (
                      <span className="badge bg-primary me-2">Transfer</span>
                    )}
                    <p><strong>From:</strong> <code>{tx.from}</code></p>
                    <p><strong>To:</strong> <code>{tx.to}</code></p>
                    <p><strong>Amount:</strong> {tx.value} {tokenSymbol}</p>
                    <p className="text-gray-400"><strong>Tx:</strong> {tx.txHash.slice(0, 20)}...</p>
                    <p><strong>Time:</strong> {tx.timestamp}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <button
            className={"connect-wallet-btn px-4 py-2" + (isConnecting ? " disabled" : "")}
            onClick={connectWallet}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </>
  );
} 