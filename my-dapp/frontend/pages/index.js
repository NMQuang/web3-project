import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [account, setAccount] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [balance, setBalance] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  // Tranfer
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState("");
  // History
  const [history, setHistory] = useState([]);
  // Mint
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintStatus, setMintStatus] = useState("");

  const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; // Replace with actual deployed address
  const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",// 追加 tranfer
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function mint(address to, uint256 amount)", // 追加 mint
  ];

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
        const supply = await contract.totalSupply();
        const bal = await contract.balanceOf(accounts[0]);

        setTokenName(name);
        setTokenSymbol(symbol);
        setTotalSupply(ethers.formatUnits(supply, 18));
        setBalance(ethers.formatUnits(bal, 18));

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
      const provider = new ethers.BrowserProvider(window.ethereum);
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

  async function handleTransfer(e) {
    e.preventDefault();
    try {
      if (!ethers.isAddress(toAddress)) {
        setTxStatus("Invalid recipient address.");
        return;
      }

      const parsedAmount = ethers.parseUnits(amount, 18);
      const currentBalance = ethers.parseUnits(balance, 18);

      if (parsedAmount > currentBalance) {
        setTxStatus("Insufficient balance.");
        return;
      }

      setTxStatus("Sending...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.transfer(toAddress, ethers.parseUnits(amount, 18));
      await tx.wait();
      setTxStatus("Transfer successful!");

      // Update balance and history
      const updatedBalance = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(updatedBalance, 18));

      // fetch history
      fetchTransferHistory(contract);
    } catch (err) {
      console.error(err);
      setTxStatus("Transfer failed.");
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

      // Update balance and history
      const updatedBalance = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(updatedBalance, 18));

      // fetch history
      fetchTransferHistory(contract);
    } catch (err) {
      console.error(err);
      setMintStatus("Mint failed.");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">My DApp Starter</h1>

      {account ? (
        <>
          <p className="text-green-600 mb-2">Connected: {account}</p>
          <p className="mb-1">Token Name: <strong>{tokenName}</strong></p>
          <p className="mb-1">Symbol: <strong>{tokenSymbol}</strong></p>
          <p>Total Supply: <strong>{totalSupply}</strong> tokens</p>
          <p className="mb-6">Your Balance: <strong>{balance}</strong> {tokenSymbol}</p>

          {/* Transfer Tokens */}
          <form onSubmit={handleTransfer} className="w-full max-w-md bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Transfer Tokens</h2>
            <input
              type="text"
              placeholder="Recipient address"
              className="w-full mb-2 p-2 border rounded"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full mb-2 p-2 border rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send
            </button>
            {txStatus && <p className="mt-2 text-sm text-gray-600">{txStatus}</p>}
          </form>

          {/* Mint Form */}
          <form onSubmit={handleMint} className="w-full max-w-md bg-white p-4 rounded shadow mt-4">
            <h2 className="text-xl font-semibold mb-2">Mint Tokens</h2>
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

          {/* Transfer History */}
          <div className="w-full max-w-md bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Transfer History</h2>
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