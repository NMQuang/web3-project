import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../contractConfig";
import { WalletContext } from "./_app";
import MyTokenJson from "../../blockchain/artifacts/contracts/MyToken.sol/MyToken.json";

const abi = MyTokenJson.abi;

export default function SignedTransfer() {
  const { account, setAccount } = useContext(WalletContext);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");
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

  async function signAndSend(e) {
    e.preventDefault();
    try {
      if (!ethers.isAddress(to)) {
        setStatus("Invalid from or to address.");
        return;
      }
      const amountStr = String(amount).trim();
      if (
        amountStr === "" ||
        isNaN(Number(amountStr)) ||
        Number(amountStr) <= 0 ||
        !/^(\d+)(\.\d+)?$/.test(amountStr)
      ) {
        setStatus("Invalid amount.");
        return;
      }
      setStatus("Signed Transfering...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const value = ethers.parseUnits(amount, 18);
      const currentNonce = await contract.nonces(signerAddress);
      const chainId = await signer.provider.getNetwork().then(n => n.chainId);

      const domain = {
        name: "Demo Token",
        version: "1",
        chainId,
        verifyingContract: contractAddress,
      };

      const types = {
        Transfer: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const message = {
        from: signerAddress,
        to,
        amount: value,
        nonce: currentNonce,
        deadline: deadline,
      };

      const signature = await signer.signTypedData(domain, types, message);
      console.log("domain: ", domain)
      console.log("types: ", types)
      console.log("message: ", message)
      console.log("signature: ", signature)
      const recovered = ethers.verifyTypedData(domain, types, message, signature);
      console.log("Recovered signer:", recovered);
      console.log("Expected signer:", await signer.getAddress());

      const tx = await contract.transferWithSig(signerAddress, to, value, deadline, signature);
      await tx.wait();

      setStatus("Signed Transfer successful!");
      // Cập nhật số dư
      const updatedBalance = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(updatedBalance, 18));
    } catch (err) {
      setStatus("Signed Transfer failed.");
      console.error(err);
    }
  }

  return (

    <>
      <div className="container mt-5">
        <h1 className="text-2xl font-bold mb-4">Signed Transfer (EIP-712)</h1>
        {account ? (
          <>
            <p className="mb-4">Your balance: <strong>{balance}</strong> {tokenSymbol}</p>
            <form onSubmit={signAndSend} className="w-full max-w-md bg-white p-4 rounded shadow">
              <div className="row g-2 align-items-center mb-2">
                <div className="col">
                  <input
                    placeholder="To Address"
                    className="form-control"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
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
                <div className="col">
                  <input
                    placeholder="Deadline (timestamp)"
                    className="form-control"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
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
                    Sign&Send
                  </button>
                </div>
              </div>
              {status && (
                <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1050, minWidth: 300 }}>
                  <div className={`alert alert-dismissible fade show py-2 px-3 mb-0 ${/fail|invalid|insufficient/i.test(status) ? 'alert-danger' : /success/i.test(status) ? 'alert-success' : 'alert-info'}`} role="alert">
                    {status}
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setStatus("")}></button>
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
