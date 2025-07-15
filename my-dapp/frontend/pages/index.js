import Link from "next/link";
import { useEffect } from 'react';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="mb-4">My DApp Starter</h1>
      <p className="lead">Welcome to the DApp demo!<br/>Select a function from the header above to get started.</p>
    </div>
  );
}