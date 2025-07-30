import { ethers } from "ethers";
export const  getProvider = () => {
    if (typeof window !== "undefined" && window.ethereum && window.location.hostname === "localhost") {
      return new ethers.BrowserProvider(window.ethereum);
    }
  
    const sepoliaRpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
    return new ethers.JsonRpcProvider(sepoliaRpcUrl);
  }