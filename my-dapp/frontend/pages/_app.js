import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';
import Link from "next/link";
import { useEffect, createContext, useState } from 'react';
import ChatPopup from "../components/chatPopup_openai.js";

export const WalletContext = createContext({
  account: '',
  setAccount: () => {},
});

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  const [account, setAccount] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts && accounts.length > 0) setAccount(accounts[0]);
      });
    }
  }, []);
  return (
    <WalletContext.Provider value={{ account, setAccount }}>
      <div className="custom-bg">
        <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: '#a7ffeb', position: 'sticky', top: 0, zIndex: 1030, width: '100%' }}>
          <div className="container-fluid">
            <a className="navbar-brand" href="/" style={{ color: '#222', fontWeight: 'bold' }}>My DApp</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link href="/wallet" className="nav-link" style={{ color: '#222' }}>Wallet</Link>
                </li>
                <li className="nav-item">
                  <Link href="/transfer" className="nav-link" style={{ color: '#222' }}>Transfer Token</Link>
                </li>
                <li className="nav-item">
                  <Link href="/mint" className="nav-link" style={{ color: '#222' }}>Mint Token</Link>
                </li>
                <li className="nav-item">
                  <Link href="/approve" className="nav-link" style={{ color: '#222' }}>Approve</Link>
                </li>
                <li className="nav-item">
                  <Link href="/transferForm" className="nav-link" style={{ color: '#222' }}>TransferFrom</Link>
                </li>
                <li className="nav-item">
                  <Link href="/history" className="nav-link" style={{ color: '#222' }}>Transfer History</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container mt-5" style={{ marginTop: '6rem' }}>
          <Component {...pageProps} />
          <ChatPopup /> 
        </div>
      </div>
    </WalletContext.Provider>
  );
} 