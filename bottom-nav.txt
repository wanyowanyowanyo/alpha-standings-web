"use client";
import React from "react";

export default function BottomNav({ currentTab, setTab }: { currentTab: string, setTab: (tab: string) => void }) {
  const navItems = [
    { id: "home", label: "Matches", icon: "⚽" },
    { id: "standings", label: "Standings", icon: "🏆" },
    { id: "admin", label: "Admin Panel", icon: "⚙️" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md z-50 flex justify-around items-center">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setTab(item.id)}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${
            currentTab === item.id ? "text-emerald-500 font-bold" : "text-neutral-400"
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] tracking-wide">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
