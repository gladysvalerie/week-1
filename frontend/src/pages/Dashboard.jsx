import { useEffect, useState } from "react";

const API = "http://localhost:8000";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    (async () => {
      const w = await fetch(`${API}/weather/`).then(r => r.json());
      setWeather(w);

      const e = await fetch(`${API}/entries/`).then(r => r.json());
      setEntries(e.slice(0, 5));
    })();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
        <h2 className="font-semibold">Weather</h2>
        {!weather ? (
          <div className="text-sm text-white/60">Loading…</div>
        ) : (
          <div className="mt-2 text-sm">
            <div>Temp: {weather.current?.temperature_2m}°C</div>
            <div>Code: {weather.current?.weather_code}</div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
        <h2 className="font-semibold">Top 5 entries</h2>
        <div className="mt-2 space-y-2">
          {entries.map(e => (
            <div key={e.id ?? e._id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-white/70 line-clamp-2">{e.content}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}