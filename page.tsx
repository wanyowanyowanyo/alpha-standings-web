"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "../components/bottom-nav";

export default function MobileWebApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [matches, setMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  
  // State untuk Admin Input
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");

  useEffect(() => {
    fetchData();
    // Fitur Real-time: Layar HP otomatis update jika ada gol masuk
    const channel = supabase.channel("fotmob-core").on("postgres_changes", { event: "*", schema: "public", table: "matches" }, () => {
      fetchData();
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchData() {
    const { data: matchData } = await supabase.from("matches").select("*, home_team:home_team_id(name), away_team:away_team_id(name)");
    const { data: standingData } = await supabase.from("standings").select("*, team:team_id(name)").order("points", { ascending: false });
    setMatches(matchData || []);
    setStandings(standingData || []);
  }

  async function handleUpdateSkor(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMatch) return alert("Pilih pertandingan dulu!");
    
    await supabase.from("matches").update({
      home_score: parseInt(homeScore),
      away_score: parseInt(awayScore),
      status: "FINISHED"
    }).eq("id", selectedMatch);

    alert("Skor berhasil diupdate & Klasemen otomatis berubah!");
    setHomeScore(""); setAwayScore("");
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans px-4/3 max-w-md mx-auto">
      {/* HEADER APP */}
      <header className="py-4 border-b border-neutral-900 sticky top-0 bg-black/80 backdrop-blur z-40 px-4">
        <h1 className="text-xl font-black text-emerald-500 tracking-tight">FotMob<span className="text-white">Lite</span></h1>
      </header>

      <main className="p-4">
        {/* TAB 1: MATCHES (HOME) */}
        {activeTab === "home" && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-neutral-400 mb-2">Pertandingan Hari Ini</h2>
            {matches.map((m) => (
              <div key={m.id} className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>{m.home_team?.name}</span>
                    <span className="font-mono font-bold">{m.status !== "UPCOMING" ? m.home_score : "-"}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>{m.away_team?.name}</span>
                    <span className="font-mono font-bold">{m.status !== "UPCOMING" ? m.away_score : "-"}</span>
                  </div>
                </div>
                <div className="pl-4 ml-2 border-l border-neutral-800 text-center w-14 font-bold text-[10px]">
                  {m.status === "LIVE" ? <span className="text-emerald-400 animate-pulse">LIVE</span> : m.status === "FINISHED" ? <span className="text-neutral-500">SELESAI</span> : "VS"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: STANDINGS (KLASEMEN) */}
        {activeTab === "standings" && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-neutral-400 mb-2">Klasemen Sementara</h2>
            <div className="bg-neutral-900/40 rounded-xl border border-neutral-800 overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-neutral-900 p-2.5 font-bold text-neutral-400 text-[10px]">
                <span className="col-span-2 text-center">#</span>
                <span className="col-span-6">Tim</span>
                <span className="col-span-2 text-center">P</span>
                <span className="col-span-2 text-center text-emerald-400">PTS</span>
              </div>
              {standings.map((row, idx) => (
                <div key={row.id} className="grid grid-cols-12 p-3 border-b border-neutral-800/50 items-center">
                  <span className="col-span-2 text-center font-mono font-bold">{idx + 1}</span>
                  <span className="col-span-6 font-semibold truncate">{row.team?.name}</span>
                  <span className="col-span-2 text-center font-mono">{row.played}</span>
                  <span className="col-span-2 text-center font-mono font-bold text-emerald-400">{row.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN PANEL */}
        {activeTab === "admin" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-neutral-400">Input Hasil Skor Pertandingan</h2>
            <form onSubmit={handleUpdateSkor} className="space-y-3 bg-neutral-900 p-4 rounded-xl border border-neutral-800 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Pilih Pertandingan</label>
                <select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)} className="w-full bg-black border border-neutral-800 p-2.5 rounded-lg text-white">
                  <option value="">-- Pilih Laga --</option>
                  {matches.map(m => (
                    <option key={m.id} value={m.id}>{m.home_team?.name} VS {m.away_team?.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Skor Home</label>
                  <input type="number" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} className="w-full bg-black border border-neutral-800 p-2.5 rounded-lg font-mono text-center" />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Skor Away</label>
                  <input type="number" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} className="w-full bg-black border border-neutral-800 p-2.5 rounded-lg font-mono text-center" />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-lg mt-2 transition-colors">
                Simpan & Selesaikan Laga
              </button>
            </form>
          </div>
        )}
      </main>

      {/* NAVIGASI BAWAH HP */}
      <BottomNav currentTab={activeTab} setTab={setActiveTab} />
    </div>
  );
}
