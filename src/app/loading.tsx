import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#FAF8FC]/50 to-white">
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Glow */}
        <div className="absolute h-24 w-24 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
        
        {/* Spinning Gradient Rings */}
        <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
        
        {/* Center Logo Icon or Accent Dot */}
        <div className="absolute h-6 w-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-md animate-pulse" />
      </div>

      <div className="mt-6 text-center space-y-1.5">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          Loading FundWave
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Preparing your crowdfunding experience...
        </p>
      </div>
    </div>
  );
}
