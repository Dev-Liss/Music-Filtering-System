import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Settings() {
  const [nasPath, setNasPath] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (window.api) {
      window.api.getWatcherConfig().then(path => {
        if (path) setNasPath(path);
      });
    }
  }, []);

  const handleSave = async () => {
    if (window.api) {
      await window.api.updateWatcherConfig(nasPath);
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">NAS Watch Directory Path</label>
            <Input 
              value={nasPath} 
              onChange={e => setNasPath(e.target.value)} 
              placeholder="e.g. \\NAS\Music or Z:\Music"
            />
            <p className="text-xs text-muted-foreground">
              The system will monitor this directory for new .mp3 and .wav files.
            </p>
          </div>
          <Button onClick={handleSave}>Save Configuration</Button>
          {saved && <span className="ml-4 text-sm text-green-500">Saved successfully! Watcher restarted.</span>}
        </CardContent>
      </Card>
    </div>
  );
}
