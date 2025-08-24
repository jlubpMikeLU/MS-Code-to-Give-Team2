import React from 'react'
import { REACHApp } from './components/REACHApp';

export default function App() {
  return (
    <div className="h-svh bg-white overflow-hidden">
      <div className="mx-auto w-full max-w-[420px] h-svh flex flex-col">
        <REACHApp />
      </div>
    </div>
  );
}