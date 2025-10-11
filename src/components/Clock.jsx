// components/Clock.jsx
import React, { useState, useEffect } from "react";
import BackgroundBlob from "./BackgroundBlob";

const Clock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const hr12 = String(hours % 12 === 0 ? 12 : hours % 12).padStart(2, "0");
  const min2 = String(minutes).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl p-6">
      <BackgroundBlob />

      <div className="relative z-10 flex flex-col items-center">
        <h2
          className="text-gray-700 text-lg md:text-xl font-semibold mb-7 tracking-wide"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {" "}
          Clock{" "}
        </h2>

        <div className="relative mb-8">
          <svg
            viewBox="0 0 200 200"
            className="w-48 h-48 bg-white rounded-full shadow-lg"
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <defs>
              <radialGradient id="faceGrad" cx="50%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fef7f7" />
              </radialGradient>
            </defs>

            <circle
              cx="100"
              cy="100"
              r="90"
              fill="url(#faceGrad)"
              stroke="none"
            />

            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = i * 30;
              const isMainHour = i % 3 === 0;
              return (
                <g key={i}>
                  <line
                    x1="100"
                    y1={isMainHour ? "15" : "20"}
                    x2="100"
                    y2={isMainHour ? "25" : "25"}
                    stroke="#f8bbc4"
                    strokeWidth={isMainHour ? "2" : "1"}
                    strokeLinecap="round"
                    transform={`rotate(${angle} 100 100)`}
                  />
                </g>
              );
            })}

            {/* Hour hand */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="55"
              stroke="#ec407a"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 100 100)`}
            />

            {/* Minute hand */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="40"
              stroke="#ec407a"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 100 100)`}
            />

            {/* Second hand */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke="#f8bbc4"
              strokeWidth="1"
              strokeLinecap="round"
              transform={`rotate(${secondAngle} 100 100)`}
            />

            <circle cx="100" cy="100" r="4" fill="#ec407a" />
          </svg>
        </div>

        <div className="text-center">
          <div className="text-4xl font-light text-gray-800 tracking-wider">
            {hr12}:{min2}
            <span className="ml-2 text-lg font-bold text-pink-600 uppercase tracking-widest">
              {ampm}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
