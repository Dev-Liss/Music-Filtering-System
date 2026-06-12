import React, { useState } from 'react';
import Settings from './components/Settings';
import MetadataWizard from './components/MetadataWizard';
import LibraryBrowser from './components/LibraryBrowser';
import { Library, Settings as SettingsIcon, LayoutList } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('browser');

  const navItems = [
    { id: 'browser', label: 'Library Browser', icon: Library },
    { id: 'wizard', label: 'Metadata Queue', icon: LayoutList },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground dark overflow-hidden selection:bg-primary/30">
      {/* App Sidebar Navigation */}
      <div className="w-16 md:w-64 border-r border-border bg-card flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Library className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="ml-3 font-bold text-lg hidden md:block tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              SoundVault
            </span>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-center md:justify-start px-0 md:px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="ml-3 font-medium hidden md:block">{item.label}</span>
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
          {currentView === 'settings' && <Settings />}
          {currentView === 'wizard' && <MetadataWizard onTagged={() => {}} />}
          {currentView === 'browser' && <LibraryBrowser />}
        </div>
      </main>
    </div>
  );
}

export default App;
