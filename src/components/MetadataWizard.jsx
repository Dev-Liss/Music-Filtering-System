import React, { useState, useEffect } from "react";
import TagForm from "./TagForm";
import { Card, CardContent } from "./ui/card";
import { Layers } from "lucide-react";

export default function MetadataWizard({ onTagged }) {
  const [pendingTracks, setPendingTracks] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    if (window.api) {
      const tracks = await window.api.getPendingTracks();
      setPendingTracks(tracks || []);
    }
  };

  const handleSave = async (payload) => {
    if (window.api) {
      await window.api.updateTrackMetadata(payload);
      fetchPending();
      if (onTagged) onTagged();
    }
  };

  const handleIgnore = async (id) => {
    if (window.api && window.api.ignoreTrack) {
      await window.api.ignoreTrack(id);
      fetchPending();
    }
  };

  if (pendingTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <Layers className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">Queue is Empty</h2>
        <p>No new tracks detected in the monitored NAS directory.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Metadata Wizard</h2>
          <p className="text-muted-foreground">
            You have {pendingTracks.length} pending track(s) to tag.
          </p>
        </div>

        <div className="space-y-6">
          {pendingTracks.map((track, index) => (
            <Card
              key={track.id}
              className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm relative"
              style={{ zIndex: pendingTracks.length - index }}
            >
              <CardContent className="pt-6">
                <TagForm track={track} onSave={handleSave} onIgnore={handleIgnore} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
