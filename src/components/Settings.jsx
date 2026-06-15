import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Settings() {
  const [nasPath, setNasPath] = useState('');
  const [saveLocation, setSaveLocation] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (window.api) {
      window.api.getWatcherConfig().then(path => {
        if (path) setNasPath(path);
      });
      if (window.api.getSaveLocation) {
        window.api.getSaveLocation().then(path => {
          if (path) setSaveLocation(path);
        });
      }
    }
  }, []);

  const handleSave = async () => {
    if (window.api) {
      await window.api.updateWatcherConfig(nasPath);
      if (window.api.updateSaveLocation) {
        await window.api.updateSaveLocation(saveLocation);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="p-8">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">NAS Watch Directory Path</label>
            <Input 
              value={nasPath} 
              onChange={(e) => setNasPath(e.target.value)}
              className="border-border/50"
              placeholder="D:\TestLocation"
            />
            <p className="text-xs text-[#00f59b] font-medium">
              The system monitors this directory for new audio files.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">File Saving Location</label>
            <Input 
              value={saveLocation} 
              onChange={(e) => setSaveLocation(e.target.value)}
              className="border-border/50"
              placeholder="C:\Users\Username\Downloads"
            />
            <p className="text-xs text-[#00f59b] font-medium">
              The preferred location where downloaded files will be saved.
            </p>
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <Button onClick={handleSave}>Save Configuration</Button>
            {saved && <span className="text-sm text-[#00f59b]">Saved successfully!</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
