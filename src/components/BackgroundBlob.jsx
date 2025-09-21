// components/BackgroundBlob.jsx
import React from "react";

const BackgroundBlob = () => {
  return (
    <>
      {/* Central large blob */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 w-72 h-72 opacity-25"
        style={{
          background: "#F8E8ED",
          filter: "blur(0px)",
          borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%",
          transform: "translate(-50%, -50%) rotate(25deg)",
          zIndex: 0,
        }}
      />

      {/* Slightly upper-right medium blob */}
      <div
        aria-hidden
        className="absolute left-2/3 top-1/3 w-56 h-56 opacity-30"
        style={{
          background: "#F5D5E0",
          filter: "blur(0px)",
          borderRadius: "45% 55% 68% 32% / 42% 58% 37% 63%",
          transform: "translate(-50%, -50%) rotate(15deg)",
          zIndex: 1,
        }}
      />

      {/* Slightly lower-left medium blob */}
      <div
        aria-hidden
        className="absolute left-1/3 top-2/3 w-48 h-48 opacity-25"
        style={{
          background: "#F5D5E0",
          filter: "blur(0px)",
          borderRadius: "55% 45% 32% 68% / 43% 57% 62% 38%",
          transform: "translate(-50%, -50%) rotate(-15deg)",
          zIndex: 1,
        }}
      />

      {/* Top-center subtle blob */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/4 w-40 h-40 opacity-20"
        style={{
          background: "#FAF0F4",
          filter: "blur(0px)",
          borderRadius: "67% 33% 48% 52% / 42% 58% 37% 63%",
          transform: "translate(-50%, -50%) rotate(120deg)",
          zIndex: 0,
        }}
      />

      {/* Bottom-center subtle blob */}
      <div
        aria-hidden
        className="absolute left-1/2 top-3/4 w-44 h-44 opacity-18"
        style={{
          background: "#FAF0F4",
          filter: "blur(0px)",
          borderRadius: "53% 47% 37% 63% / 48% 52% 62% 38%",
          transform: "translate(-50%, -50%) rotate(90deg)",
          zIndex: 0,
        }}
      />
    </>
  );
};

export default BackgroundBlob;
