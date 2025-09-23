import React, { useState, useRef, useEffect } from "react";
import BackgroundBlob from "./BackgroundBlob";

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const intervalRef = useRef(null);
  const totalSecondsRef = useRef(0);
  const audioRef = useRef(null);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  // Initialize audio only once
  useEffect(() => {
    audioRef.current = new Audio("/alarm.mp3");
  }, []);

  // Play alarm when finished
  useEffect(() => {
    if (finished && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [finished]);

  // Update HH:MM:SS from total seconds
  const updateFromSeconds = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);

    // Update circular progress
    setProgress(totalSecondsRef.current > 0 ? totalSecondsRef.current / maxSecondsRef.current : 0);
  };

  const maxSecondsRef = useRef(0);

  // Start timer
  const start = () => {
    if (totalSecondsRef.current <= 0 || running) return;
    setRunning(true);
    setFinished(false);

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (totalSecondsRef.current <= 1) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setFinished(true);
        totalSecondsRef.current = 0;
        updateFromSeconds(0);
        return;
      }
      totalSecondsRef.current -= 1;
      updateFromSeconds(totalSecondsRef.current);
    }, 1000);
  };

  // Pause timer
  const pause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  // Reset timer
  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setFinished(false);
    totalSecondsRef.current = 0;
    maxSecondsRef.current = 0;
    updateFromSeconds(0);
  };

  // Set timer (resets and starts instantly)
  const setTimer = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) return alert("⚠️ Time must be greater than 0");
    totalSecondsRef.current = total;
    maxSecondsRef.current = total;
    clearInterval(intervalRef.current);
    setFinished(false);
    setRunning(false);
    updateFromSeconds(totalSecondsRef.current);
    start();
  };

  // Close popup + stop sound
  const handleClose = () => {
    setFinished(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatDisplay = () =>
    `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;

  // Gradient color based on remaining time
  const getStrokeColor = () => {
    const pct = totalSecondsRef.current / (maxSecondsRef.current || 1);
    if (pct > 0.5) return "#34D399"; // green
    if (pct > 0.2) return "#FACC15"; // yellow
    return "#F87171"; // red
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl p-6 pt-28">
      <BackgroundBlob />

      <div className="relative z-10 flex flex-col items-center">
        <h2
          className="text-gray-700 text-lg md:text-xl font-semibold mb-6 tracking-wide"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Timer
        </h2>

        {/* Circular progress */}
        <div className="relative mb-8 w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#f8bbc4"
              strokeWidth="8"
              fill="none"
              opacity="0.2"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke={getStrokeColor()}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-light text-gray-700">{formatDisplay()}</span>
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
            onClick={running ? pause : start}
            className={`px-6 py-2 rounded-full font-medium shadow-md text-white transition transform duration-150 active:scale-95 ${
              running
                ? "bg-yellow-400 hover:bg-yellow-500"
                : "bg-pink-500 hover:bg-pink-600 text-black"
            }`}
          >
            {running ? "Pause" : "Start"}
          </button>
        </div>
      </div>

      {/* HH:MM:SS input */}
<div className="flex items-center gap-0 mt-8 bg-pink-50 bg-opacity-30 backdrop-blur-md rounded-full shadow-md px-3 py-2 hover:bg-pink-100 transition-colors duration-200">
  <input
    type="number"
    min={0}
    max={99}
    value={hours}
    onChange={(e) =>
      setHours(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))
    }
    className="w-16 h-8 text-center bg-transparent text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200 rounded-l-full transition"
  />
  <span className="px-1 text-gray-600 select-none">:</span>
  <input
    type="number"
    min={0}
    max={59}
    value={minutes}
    onChange={(e) =>
      setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))
    }
    className="w-16 h-8 text-center bg-transparent text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
  />
  <span className="px-1 text-gray-600 select-none">:</span>
  <input
    type="number"
    min={0}
    max={59}
    value={seconds}
    onChange={(e) =>
      setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))
    }
    className="w-16 h-8 text-center bg-transparent text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200 rounded-r-full transition"
  />
  <button
    onClick={setTimer}
    className="ml-3 px-6 py-2 bg-pink-300 text-black font-medium rounded-full shadow-md hover:bg-pink-400 active:scale-95 transition transform duration-150"
  >
    Set
  </button>
</div>

      {/* Popup */}
      {finished && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

          {/* Popup card */}
          <div className="relative bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 text-center z-10 max-w-sm w-full">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Time’s Up!
            </h2>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-pink-500 text-white font-medium rounded-full shadow-md hover:bg-pink-600 active:scale-95 transition transform duration-150"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
