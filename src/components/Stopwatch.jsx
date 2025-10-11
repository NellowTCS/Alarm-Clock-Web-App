import React, { useState, useRef, useEffect } from "react";
import BackgroundBlob from "./BackgroundBlob";

const Stopwatch = () => {
  const [time, setTime] = useState(0); // Initialize time state
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Load time from localStorage on mount
  useEffect(() => {
    const savedTime = parseInt(localStorage.getItem("stopwatch_time"), 10);
    if (!isNaN(savedTime)) {
      setTime(savedTime);
    }
  }, []);

  // Save time to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("stopwatch_time", time);
  }, [time]);

  // Start the stopwatch
  const start = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Stop the stopwatch
  const stop = () => {
    if (running) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRunning(false);
      // Ensure the current time is saved to localStorage
      localStorage.setItem("stopwatch_time", time);
    }
  };

  // Reset the stopwatch
  const reset = () => {
    stop();
    setTime(0);
    localStorage.removeItem("stopwatch_time"); // Clear saved time
  };

  // Format seconds into HH:MM:SS
  const format = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Circular progress (loops every 60 seconds)
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (time % 60) / 60;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl p-6">
      <BackgroundBlob />

      <div className="relative z-10 flex flex-col items-center">
        <h2
          className="text-gray-700 text-lg md:text-xl font-semibold mb-6 tracking-wide"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Stopwatch
        </h2>

        {/* Circular progress */}
        <div className="relative mb-8">
          <svg
            className={`w-48 h-48 transform -rotate-90 ${
              running ? "animate-pulse-slow" : ""
            }`}
          >
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#f8bbc4"
              strokeWidth="8"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#ec407a"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
            />
          </svg>
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              running ? "animate-pulse-text" : ""
            }`}
          >
            <span className="text-2xl font-light text-gray-700">
              {format(time)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full font-medium shadow-md hover:bg-gray-200 active:scale-95 transition transform duration-150"
          >
            Reset
          </button>
          <button
            onClick={running ? stop : start}
            className={`px-6 py-2 rounded-full font-medium shadow-md text-white transition transform duration-150 active:scale-95 ${
              running
                ? "bg-orange-400 hover:bg-red-500"
                : "bg-pink-500 hover:bg-pink-600 text-black"
            }`}
          >
            {running ? "Stop" : "Start"}
          </button>
        </div>
      </div>

      {/* Tailwind animations */}
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 1.5s ease-in-out infinite;
          }

          @keyframes pulse-text {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .animate-pulse-text {
            animation: pulse-text 1.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Stopwatch;
