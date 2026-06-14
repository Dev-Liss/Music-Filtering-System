import React, { useState } from "react";
import Settings from "./components/Settings";
import MetadataWizard from "./components/MetadataWizard";
import LibraryBrowser from "./components/LibraryBrowser";
import {
  Library,
  Settings as SettingsIcon,
  LayoutList,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

function App() {
  const [currentView, setCurrentView] = useState("browser");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "browser", label: "Library Browser", icon: Library },
    { id: "wizard", label: "Metadata Queue", icon: LayoutList },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground dark overflow-hidden selection:bg-primary/30">
      {/* App Sidebar Navigation */}
      <div
        className={`border-r border-border bg-card flex flex-col justify-between transition-all duration-300 relative overflow-visible ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div>
          <div
            className={`h-16 flex items-center border-b border-border transition-all duration-300 ${
              isCollapsed ? "justify-between px-3" : "justify-between px-4"
            }`}
          >
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <Library className="w-4 h-4 text-primary-foreground" />
              </div>
              {!isCollapsed && (
                <span className="ml-3 font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate animate-in fade-in duration-300">
                  SoundVault
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 ml-1"
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
                  className={
                    isCollapsed
                      ? `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative mx-auto focus:outline-none ${
                          isActive
                            ? "bg-[#00f59b] text-[#090d16] shadow-md shadow-[#00f59b]/25 font-semibold"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:bg-[#00f59b] focus-visible:text-[#090d16]"
                        }`
                      : `w-full flex items-center pl-6 pr-4 py-3 rounded-l-none rounded-r-full transition-all duration-200 group relative focus:outline-none ${
                          isActive
                            ? "bg-[#00f59b] text-[#090d16] shadow-md shadow-[#00f59b]/25 font-semibold"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:bg-[#00f59b] focus-visible:text-[#090d16]"
                        }`
                  }
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform ${isActive ? "text-[#090d16]" : "group-hover:scale-110 group-focus-visible:text-[#090d16]"}`}
                  />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium truncate animate-in fade-in duration-200">
                      {item.label}
                    </span>
                  )}
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
        </div>
      </main>
    </div>
  );
}

export default App;
