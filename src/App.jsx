import React, { useState } from "react";
import Settings from "./components/Settings";
import MetadataWizard from "./components/MetadataWizard";
import LibraryBrowser from "./components/LibraryBrowser";
import Favorites from "./components/Favorites";
import Playlists from "./components/Playlists";
import MusicPlayer from "./components/MusicPlayer";
import TitleBar from "./components/TitleBar";
import {
  Library,
  Settings as SettingsIcon,
  LayoutList,
  PanelLeftClose,
  PanelLeftOpen,
  Component,
  Heart,
  ListMusic,
} from "lucide-react";

function App() {
  const [currentView, setCurrentView] = useState("browser");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "browser", label: "Library Browser", icon: Component },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "playlists", label: "Playlists", icon: ListMusic },
    { id: "wizard", label: "Metadata Queue", icon: LayoutList },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground dark overflow-hidden selection:bg-primary/30 relative">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden pb-24 relative w-full">
      {/* App Sidebar Navigation */}
      <div
        className={`border-r border-border bg-card flex flex-col justify-between transition-all duration-300 relative overflow-visible h-full ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div>
          <div
            className={`h-16 flex items-center border-b border-border transition-all duration-300 relative group/header overflow-hidden ${
              isCollapsed ? "pl-5" : "pl-4"
            }`}
          >
            <div
              className={`flex items-center min-w-0 transition-all duration-300 ${
                isCollapsed
                  ? "group-hover/header:opacity-0 group-hover/header:scale-75 group-hover/header:pointer-events-none"
                  : ""
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <Library className="w-6 h-6 text-primary-foreground" />
              </div>
              <span
                className={`font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate transition-all duration-300 origin-left overflow-hidden whitespace-nowrap ${
                  isCollapsed
                    ? "opacity-0 max-w-0 ml-0 pointer-events-none scale-95"
                    : "opacity-100 max-w-32 ml-3 scale-100"
                }`}
              >
                SoundVault
              </span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`absolute flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-300 focus:outline-none ${
                isCollapsed
                  ? "left-5 w-10 h-10 opacity-0 pointer-events-none group-hover/header:opacity-100 group-hover/header:pointer-events-auto scale-75 group-hover/header:scale-100"
                  : "left-[208px] w-8 h-8 opacity-100 scale-100"
              }`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>
          <nav
            className={`py-4 space-y-2 transition-all duration-300 ${isCollapsed ? "px-2" : "pl-0 pr-4"}`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center transition-all duration-300 group relative focus:outline-none h-12 ${
                    isCollapsed
                      ? "w-12 rounded-xl mx-auto pl-[14px]"
                      : "w-full pl-6 pr-4 rounded-l-none rounded-r-[24px]"
                  } ${
                    isActive
                      ? "bg-[#00f59b] text-[#090d16] shadow-md shadow-[#00f59b]/25 font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:bg-[#00f59b] focus-visible:text-[#090d16]"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform ${isActive ? "text-[#090d16]" : "group-hover:scale-110 group-focus-visible:text-[#090d16]"}`}
                  />
                  <span
                    className={`font-medium truncate transition-[max-width,opacity,margin,transform] duration-300 origin-left overflow-hidden whitespace-nowrap ${
                      isCollapsed
                        ? "opacity-0 max-w-0 ml-0 pointer-events-none scale-95"
                        : "opacity-100 max-w-48 ml-3 scale-100"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-lg shadow-lg border border-border whitespace-nowrap opacity-0 scale-95 origin-left pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-1 transition-all duration-150 z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />

        <div className="relative h-full w-full">
          {currentView === "settings" && <Settings />}
          {currentView === "wizard" && <MetadataWizard onTagged={() => {}} />}
          {currentView === "browser" && <LibraryBrowser />}
          {currentView === "favorites" && <Favorites />}
          {currentView === "playlists" && <Playlists />}
        </div>
      </main>

      {/* Bottom Music Player */}
      <MusicPlayer />
      </div>
    </div>
  );
}

export default App;
