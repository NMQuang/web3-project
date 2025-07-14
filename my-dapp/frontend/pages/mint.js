import { useState, useContext } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../contractConfig";
import Link from "next/link";
import { useEffect } from 'react';
import { WalletContext } from "./_app";
import MyTokenJson from "../../blockchain/artifacts/contracts/MyToken.sol/MyToken.json";

const abi = MyTokenJson.abi;

export default function Mint() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  const { account, setAccount } = useContext(WalletContext);
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintStatus, setMintStatus] = useState("");
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

  async function handleMint(e) {
    e.preventDefault();
    try {
      if (!ethers.isAddress(mintTo)) {
        setMintStatus("Invalid address.");
        return;
      }
      const amountStr = String(mintAmount).trim();
      if (
        amountStr === "" ||
        isNaN(Number(amountStr)) ||
        Number(amountStr) <= 0 ||
        !/^(\d+)(\.\d+)?$/.test(amountStr)
      ) {
        setMintStatus("Invalid amount.");
        return;
      }
      setMintStatus("Minting...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.mint(mintTo, ethers.parseUnits(amountStr, 18));
      await tx.wait();
      setMintStatus("Mint successful!");
      // Cập nhật số dư
      const updatedBalance = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(updatedBalance, 18));
    } catch (err) {
      setMintStatus("Mint failed.");
      console.error(err);
    }
  }

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-2xl font-bold mb-4">Mint Tokens</h1>
        {account ? (
          <>
            <p className="mb-4">Your balance: <strong>{balance}</strong> {tokenSymbol}</p>
            <form onSubmit={handleMint} className="w-full max-w-md bg-white p-4 rounded shadow">
              <div className="row g-2 align-items-center mb-2">
                <div className="col">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    className="form-control"
                    value={mintTo}
                    onChange={(e) => setMintTo(e.target.value)}
                    required
                  />
                </div>
                <div className="col-auto">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="form-control"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="submit"
                    className="connect-wallet-btn btn btn-sm"
                    disabled={
                      !mintAmount ||
                      isNaN(Number(mintAmount)) ||
                      Number(mintAmount) <= 0 ||
                      !/^\d+(\.\d+)?$/.test(String(mintAmount).trim())
                    }
                  >
                    Mint
                  </button>
                </div>
              </div>
              {mintStatus && (
                <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1050, minWidth: 300 }}>
                  <div className={`alert alert-dismissible fade show py-2 px-3 mb-0 ${/fail|invalid|insufficient/i.test(mintStatus) ? 'alert-danger' : /success/i.test(mintStatus) ? 'alert-success' : 'alert-info'}`} role="alert">
                    {mintStatus}
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setMintStatus("")}></button>
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