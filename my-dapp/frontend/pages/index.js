import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">My DApp Starter</h1>
      <p className="mb-8 text-lg text-gray-700">Welcome to the DApp demo!<br/>Select a function below to get started.</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link href="/wallet" className="block px-4 py-2 bg-blue-500 text-white rounded text-center hover:bg-blue-600">Wallet</Link>
        <Link href="/transfer" className="block px-4 py-2 bg-green-500 text-white rounded text-center hover:bg-green-600">Tranfer Token</Link>
        <Link href="/mint" className="block px-4 py-2 bg-yellow-500 text-white rounded text-center hover:bg-yellow-600">Mint Token</Link>
        <Link href="/history" className="block px-4 py-2 bg-gray-500 text-white rounded text-center hover:bg-gray-600">Tranfer History</Link>
      </div>
    </main>
  );
}