import { useState, useContext } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../contractConfig";
import Link from "next/link";
import { useEffect } from 'react';
import { WalletContext } from "./_app";
import MyTokenJson from "../../blockchain/artifacts/contracts/MyToken.sol/MyToken.json";

const abi = MyTokenJson.abi;

export default function Wallet() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  const { account, setAccount } = useContext(WalletContext);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [owner, setOwner] = useState("");

  useEffect(() => {
    async function fetchTokenInfo() {
      if (!account) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const bal = await contract.balanceOf(account);
        const supply = await contract.totalSupply();
        const owner = await contract.owner();
        setOwner(owner);
        setTokenName(name);
        setTokenSymbol(symbol);
        setBalance(ethers.formatUnits(bal, 18));
        setTotalSupply(ethers.formatUnits(supply, 18));
      } catch (err) {
        console.error(err);
      }
    }
    fetchTokenInfo();
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
        const name = await contract.name();
        const symbol = await contract.symbol();
        const bal = await contract.balanceOf(accounts[0]);
        const supply = await contract.totalSupply();
        const owner = await contract.owner();
        setOwner(owner);
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
    <>
      <div className="container mt-5">
        <h1 className="text-2xl font-bold mb-4">Wallet</h1>
        {account ? (
          <div className="w-full max-w-md bg-white p-4 rounded shadow mx-auto">
            <p className="text-green-600 mb-2">Owner: {owner}</p>
            <p className="text-green-600 mb-2">Connected: {account}</p>
            <p className="mb-1">Token Name: <strong>{tokenName}</strong></p>
            <p className="mb-1">Symbol: <strong>{tokenSymbol}</strong></p>
            <p>Total Supply: <strong>{totalSupply}</strong> {tokenSymbol}</p>
            <p className="mb-6">Your Balance: <strong>{balance}</strong> {tokenSymbol}</p>
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