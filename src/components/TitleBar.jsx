import React from "react";
import { Minus, Square, X, MoreHorizontal } from "lucide-react";

export default function TitleBar() {
  const handleMenuClick = (e) => {
    e.stopPropagation();
    // Get the coordinates of the button to position the native menu right below it
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left;
    const y = rect.bottom;
    
    if (window.api && window.api.showContextMenu) {
      window.api.showContextMenu('main', x, y);
    }
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    if (window.api && window.api.windowControls) {
      window.api.windowControls.minimize();
    }
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    if (window.api && window.api.windowControls) {
      window.api.windowControls.maximize();
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (window.api && window.api.windowControls) {
      window.api.windowControls.close();
    }
  };

  return (
    <div
      className="h-8 w-full bg-[#0a0a0a] flex items-center justify-between select-none z-50 shrink-0 border-b border-white/5"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* Left side: Menu */}
      <div className="flex items-center h-full">
        <button
          onClick={handleMenuClick}
          className="h-full px-4 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          style={{ WebkitAppRegion: "no-drag" }}
          title="Menu"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Optional Title (left empty to match minimalist screenshot) */}
      <div className="flex-1"></div>

      {/* Right side: Window Controls */}
      <div className="flex items-center h-full" style={{ WebkitAppRegion: "no-drag" }}>
        <button
          onClick={handleMinimize}
          className="h-full w-12 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          title="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-full w-12 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          title="Maximize"
        >
          <Square className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleClose}
          className="h-full w-12 flex items-center justify-center hover:bg-red-500 text-white/70 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
