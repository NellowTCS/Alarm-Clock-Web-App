// components/BackgroundBlob.jsx
import React, { useMemo } from "react";

const BackgroundBlob = () => {
  // Generate random values for each blob to make animations feel more random
  const randomValues = useMemo(
    () => ({
      blob1: { duration: 3.5 + Math.random() * 2, delay: Math.random() * 4 },
      blob2: { duration: 3.5 + Math.random() * 2, delay: Math.random() * 4 },
      blob3: { duration: 3.5 + Math.random() * 2, delay: Math.random() * 4 },
      blob4: { duration: 3.5 + Math.random() * 2, delay: Math.random() * 4 },
      blob5: { duration: 3.5 + Math.random() * 2, delay: Math.random() * 4 },
    }),
    []
  );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float1 {
          0%, 100% { transform: translate(-50%, -50%) rotate(25deg) translateY(0px) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(30deg) translateY(-15px) scale(0.98); }
          50% { transform: translate(-50%, -50%) rotate(25deg) translateY(-30px) scale(1.02); }
          75% { transform: translate(-50%, -50%) rotate(20deg) translateY(-15px) scale(0.98); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(-50%, -50%) rotate(15deg) translateY(0px) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(10deg) translateY(15px) scale(0.98); }
          50% { transform: translate(-50%, -50%) rotate(15deg) translateY(30px) scale(1.02); }
          75% { transform: translate(-50%, -50%) rotate(20deg) translateY(15px) scale(0.98); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(-50%, -50%) rotate(-15deg) translateY(0px) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(-10deg) translateY(-15px) scale(0.98); }
          50% { transform: translate(-50%, -50%) rotate(-15deg) translateY(-30px) scale(1.02); }
          75% { transform: translate(-50%, -50%) rotate(-20deg) translateY(-15px) scale(0.98); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(-50%, -50%) rotate(120deg) translateY(0px) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(125deg) translateY(15px) scale(0.98); }
          50% { transform: translate(-50%, -50%) rotate(120deg) translateY(30px) scale(1.02); }
          75% { transform: translate(-50%, -50%) rotate(115deg) translateY(15px) scale(0.98); }
        }
        @keyframes float5 {
          0%, 100% { transform: translate(-50%, -50%) rotate(90deg) translateY(0px) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(95deg) translateY(-15px) scale(0.98); }
          50% { transform: translate(-50%, -50%) rotate(90deg) translateY(-30px) scale(1.02); }
          75% { transform: translate(-50%, -50%) rotate(85deg) translateY(-15px) scale(0.98); }
        }
      `,
        }}
      />
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
          animation: `float1 ${randomValues.blob1.duration}s ease-in-out ${randomValues.blob1.delay}s infinite`,
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
          animation: `float2 ${randomValues.blob2.duration}s ease-in-out ${randomValues.blob2.delay}s infinite`,
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
          animation: `float3 ${randomValues.blob3.duration}s ease-in-out ${randomValues.blob3.delay}s infinite`,
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
          animation: `float4 ${randomValues.blob4.duration}s ease-in-out ${randomValues.blob4.delay}s infinite`,
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
          animation: `float5 ${randomValues.blob5.duration}s ease-in-out ${randomValues.blob5.delay}s infinite`,
        }}
      />
    </>
  );
};

export default BackgroundBlob;
