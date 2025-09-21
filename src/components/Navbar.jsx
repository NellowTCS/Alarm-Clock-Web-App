// src/components/Navbar.jsx
import React from "react";
import { Clock, AlarmCheck, Timer, Hourglass } from "lucide-react";

const Navbar = ({ current, setCurrent }) => {
  const tabs = [
    { id: "clock", icon: <Clock /> },
    { id: "alarm", icon: <AlarmCheck /> },
    { id: "stopwatch", icon: <Timer /> },
    { id: "timer", icon: <Hourglass /> },
  ];

  return (
    <nav className="relative flex justify-around py-3 bg-pink-100/50 backdrop-blur-md rounded-full shadow-lg px-2 overflow-hidden">

      {/* Active indicator at top */}
      <div
        className="absolute top-0 h-1 bg-pink-500 rounded-full transition-all duration-300"
        style={{
          left: `${tabs.findIndex((tab) => tab.id === current) * 25}%`,
          width: "25%",
        }}
      ></div>

      {tabs.map((tab) => {
        const isActive = current === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrent(tab.id)}
            className={`
              relative flex items-center justify-center text-2xl p-3 rounded-full transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-pink-200
              ${isActive 
                ? "text-pink-500 scale-110 -translate-y-1" 
                : "text-gray-400 hover:text-pink-400 hover:scale-105"}
            `}
          >
            {tab.icon}
          </button>
        );
      })}
    </nav>
  );
};

export default Navbar;
