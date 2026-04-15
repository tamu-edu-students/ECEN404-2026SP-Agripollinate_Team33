import { useState, useEffect } from "react";
import Card from "./Card";

// Persists across page changes
let persistedTesting = false;
let persistedAutoConfig = false;
let persistedSkipLidar = true;

export default function PiControl() {
  const [status, setStatus] = useState({ running: false, recent_logs: [], testing: false });
  const [testing, setTesting] = useState(persistedTesting);
  const [autoConfig, setAutoConfig] = useState(persistedAutoConfig);
  const [skipLidar, setSkipLidar] = useState(persistedSkipLidar);
  const [loading, setLoading] = useState(false);
  const [pendingFlower, setPendingFlower] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // Poll for pending flowers during setup
  useEffect(() => {
    if (!status.running) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/pi/flower-pending`);
        const data = await res.json();
        if (data.pending) {
          setPendingFlower(data.prompt);
        } else {
          setPendingFlower(null);
        }
      } catch (err) {
        console.error('Failed to fetch flower status:', err);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status.running]);

  async function fetchStatus() {
    try {
      const res = await fetch(`${BACKEND_URL}/pi/status`);
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch Pi status:', err);
    }
  }

  function handleSetTesting(val) {
    persistedTesting = val;
    setTesting(val);
  }

  function handleSetAutoConfig(val) {
    persistedAutoConfig = val;
    setAutoConfig(val);
  }

  function handleSetSkipLidar(val) {
    persistedSkipLidar = val;
    setSkipLidar(val);
  }

  async function startProgram() {
    setLoading(true);
    await fetch(`${BACKEND_URL}/pi/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testing, autoConfig, skipLidarClient: skipLidar })
    });
    setLoading(false);
    fetchStatus();
  }

  async function stopProgram() {
    await fetch(`${BACKEND_URL}/pi/stop`, { method: 'POST' });
    fetchStatus();
  }

  async function triggerEvent() {
    await fetch(`${BACKEND_URL}/pi/trigger`, { method: 'POST' });
  }

  async function respondToFlower(include) {
    await fetch(`${BACKEND_URL}/pi/flower-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ include })
    });
    setPendingFlower(null);
  }

  const isReady = status.recent_logs?.some(log => log.includes("[READY]"));
  const readyMessage = status.recent_logs?.find(log => log.includes("[READY]"));

  return (
    <Card className="row-span-1 flex flex-col gap-3 bg-white border-2 border-blue-200 rounded-lg shadow-lg p-6">
      <div className="font-semibold text-slate-700">Pi Control</div>

      {/* Status indicator */}
      <div className={`flex items-center gap-2 text-sm font-medium ${status.running ? 'text-green-600' : 'text-slate-400'}`}>
        <div className={`w-2 h-2 rounded-full ${status.running ? 'bg-green-500' : 'bg-slate-300'}`} />
        {status.running ? 'Program Running' : 'Program Stopped'}
      </div>

      {/* Ready indicator */}
      {isReady && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="text-sm font-medium text-green-700">✅ System Ready</div>
          <div className="text-xs text-green-600 font-mono mt-1">{readyMessage}</div>
        </div>
      )}

      {/* Flower approval */}
      {pendingFlower && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex flex-col gap-2">
          <div className="text-sm font-medium text-yellow-800">Flower Detected</div>
          <div className="text-xs text-yellow-700 font-mono">{pendingFlower}</div>
          <div className="flex gap-2">
            <button
              onClick={() => respondToFlower(true)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1.5 rounded-md"
            >
              Include ✓
            </button>
            <button
              onClick={() => respondToFlower(false)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1.5 rounded-md"
            >
              Skip ✗
            </button>
          </div>
        </div>
      )}

      {/* Options */}
      {!status.running && (
        <div className="flex flex-col gap-2">
          {[
            { label: 'Testing Mode', value: testing, setter: handleSetTesting },
            { label: 'Auto-Configure Flowers', value: autoConfig, setter: handleSetAutoConfig },
            { label: 'Skip LiDAR Client', value: skipLidar, setter: handleSetSkipLidar },
          ].map(({ label, value, setter }) => (
            <div key={label} className="flex items-center justify-between text-sm text-slate-600">
              <span>{label}</span>
              <button
                onClick={() => setter(!value)}
                className={`w-10 h-5 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-1">
        {!status.running ? (
          <button
            onClick={startProgram}
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Program'}
          </button>
        ) : (
          <button
            onClick={stopProgram}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Stop Program
          </button>
        )}

        {status.running && status.testing && (
          <button
            onClick={triggerEvent}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Trigger Event
          </button>
        )}
      </div>

      {/* Logs */}
      {status.recent_logs?.length > 0 && (
        <div className="bg-slate-50 rounded-md p-2 max-h-32 overflow-y-auto">
          {status.recent_logs.map((log, i) => (
            <div key={i} className="text-xs text-slate-500 font-mono">{log}</div>
          ))}
        </div>
      )}
    </Card>
  );
}