import Link from "next/link";
import { useEffect } from 'react';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="mb-4 text-3xl font-bold">My DApp Starter</h1>
      <p className="lead text-gray-700 mb-6">
        Welcome to the DApp demo!<br/>
        Select a function from the header above to get started.
      </p>
    </div>
  );
}