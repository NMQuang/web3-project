import { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../contractConfig";
import Link from "next/link";
import { WalletContext } from "./_app";
import MyTokenJson from "../../blockchain/artifacts/contracts/MyToken.sol/MyToken.json";

const abi = MyTokenJson.abi;

export default function Approve() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  const { account, setAccount } = useContext(WalletContext);
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("");
  const [approveStatus, setApproveStatus] = useState("");
  const [balance, setBalance] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

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

  async function handleApprove(e) {
    e.preventDefault();
    try {
      if (!ethers.isAddress(spender)) {
        setApproveStatus("Invalid spender address.");
        return;
      }
      const amountStr = String(amount).trim();
      if (
        amountStr === "" ||
        isNaN(Number(amountStr)) ||
        Number(amountStr) <= 0 ||
        !/^(\d+)(\.\d+)?$/.test(amountStr)
      ) {
        setApproveStatus("Invalid amount.");
        return;
      }
      setApproveStatus("Approving...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.approve(spender, ethers.parseUnits(amountStr, 18));
      await tx.wait();
      setApproveStatus("Approve successful!");
    } catch (err) {
      setApproveStatus("Approve failed.");
      console.error(err);
    }
  }

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-2xl font-bold mb-4">Approve Spender</h1>
        {account ? (
          <>
            <p className="mb-4">Your balance: <strong>{balance}</strong> {tokenSymbol}</p>
            <form onSubmit={handleApprove} className="w-full max-w-md bg-white p-4 rounded shadow">
              <div className="row g-2 align-items-center mb-2">
                <div className="col">
                  <input
                    type="text"
                    placeholder="Spender address"
                    className="form-control"
                    value={spender}
                    onChange={(e) => setSpender(e.target.value)}
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
                    Approve
                  </button>
                </div>
              </div>
              {approveStatus && (
                <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1050, minWidth: 300 }}>
                  <div className={`alert alert-dismissible fade show py-2 px-3 mb-0 ${/fail|invalid|insufficient/i.test(approveStatus) ? 'alert-danger' : /success/i.test(approveStatus) ? 'alert-success' : 'alert-info'}`} role="alert">
                    {approveStatus}
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setApproveStatus("")}></button>
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