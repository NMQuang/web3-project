import { useState, useContext } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../contractConfig";
import Link from "next/link";
import { useEffect } from 'react';
import { WalletContext } from "./_app";
import MyTokenJson from "../../blockchain/artifacts/contracts/MyToken.sol/MyToken.json";

const abi = MyTokenJson.abi;

export default function Transfer() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  const { account, setAccount } = useContext(WalletContext);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [balance, setBalance] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Tự động fetch balance và symbol khi account thay đổi
  useEffect(() => {
    async function fetchBalance() {
      if (!account) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const bal = await contract.balanceOf(account);
        const symbol = await contract.symbol();
        setBalance(ethers.formatUnits(bal, 18));
        setTokenSymbol(symbol);
      } catch (err) {
        console.error(err);
      }
    }
    fetchBalance();
  }, [account]);

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

  async function handleTransfer(e) {
    e.preventDefault();
    try {
      if (!ethers.isAddress(toAddress)) {
        setTxStatus("Invalid recipient address.");
        return;
      }
      const amountStr = String(amount).trim();
      if (
        amountStr === "" ||
        isNaN(Number(amountStr)) ||
        Number(amountStr) <= 0 ||
        !/^\d+(\.\d+)?$/.test(amountStr)
      ) {
        setTxStatus("Invalid amount.");
        return;
      }
      const parsedAmount = ethers.parseUnits(amountStr, 18);
      const currentBalance = ethers.parseUnits(balance, 18);
      if (parsedAmount > currentBalance) {
        setTxStatus("Insufficient balance.");
        return;
      }
      setTxStatus("Sending...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.transfer(toAddress, parsedAmount);
      await tx.wait();
      setTxStatus("Transfer successful!");
      // Cập nhật số dư
      const updatedBalance = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(updatedBalance, 18));
    } catch (err) {
      setTxStatus("Invalid amount format.");
      console.error(err);
    }
  }

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-2xl font-bold mb-4">Transfer Tokens</h1>
        {account ? (
          <>
            <p className="mb-4">Your balance: <strong>{balance}</strong> {tokenSymbol}</p>
            <form onSubmit={handleTransfer} className="w-full max-w-md bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Transfer Tokens</h2>
              <div className="row g-2 align-items-center mb-2">
                <div className="col">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    className="form-control"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="col-auto">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="submit"
                    className="connect-wallet-btn btn btn-sm"
                    disabled={
                      !amount ||
                      isNaN(Number(amount)) ||
                      Number(amount) <= 0 ||
                      !/^\d+(\.\d+)?$/.test(String(amount).trim())
                    }
                  >
                    Send
                  </button>
                </div>
              </div>
              {txStatus && (
                <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1050, minWidth: 300 }}>
                  <div className={`alert alert-dismissible fade show py-2 px-3 mb-0 ${/fail|invalid|insufficient/i.test(txStatus) ? 'alert-danger' : /success/i.test(txStatus) ? 'alert-success' : 'alert-info'}`} role="alert">
                    {txStatus}
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setTxStatus("")}></button>
                  </div>
                </div>
              )}
            </form>
          </>
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