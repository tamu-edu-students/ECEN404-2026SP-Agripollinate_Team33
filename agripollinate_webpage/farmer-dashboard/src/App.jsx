import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LiveFeed from './pages/LiveFeed'
import './styles/index.css'
import useAutoDetect from "./hooks/useAutoDetect";
import usePiControl from "./hooks/usePiControl";

export default function App() {
  useAutoDetect();
  usePiControl();
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/live-feed" element={<LiveFeed />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}