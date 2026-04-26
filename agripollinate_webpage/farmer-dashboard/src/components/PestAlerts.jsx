import { useState, useEffect } from "react";
import Card from "./Card";
import insectStore from "../state/insectStore";

const PEST_THRESHOLD = 3; // number of detections before alert triggers

export default function PestAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const unsub = insectStore.subscribe((state) => {
      const newAlerts = state.pests
        .filter(p => p.value >= PEST_THRESHOLD)
        .map(p => ({
          species: p.label,
          count: p.value,
          location: p.lastLocation || "Unknown",
          icon: "❗"
        }));
      setAlerts(newAlerts);
    });
    return unsub;
  }, []);

  return (
    <Card className="row-span-1 flex flex-col gap-3 bg-white border-2 border-blue-200 rounded-lg shadow-lg p-6">
      <div className="font-semibold text-slate-700">Pest Alerts</div>

      {alerts.length === 0 ? (
        <div className="text-sm text-slate-400 italic">No pest alerts at this time</div>
      ) : (
        alerts.map((alert, i) => (
          <div key={i} className="bg-red-100 text-red-700 rounded-md p-3 flex flex-col gap-1">
            <span className="font-medium">{alert.icon} {alert.species} Alert</span>
            <span className="text-sm">Detected {alert.count} times — {alert.location}</span>
          </div>
        ))
      )}
    </Card>
  );
}