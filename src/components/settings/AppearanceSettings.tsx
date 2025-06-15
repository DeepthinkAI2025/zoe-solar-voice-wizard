
import React from 'react';
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const AppearanceSettings = () => {
  const { setTheme } = useTheme();

  return (
    <div className="space-y-4 p-4 bg-secondary rounded-lg">
      <h3 className="text-lg font-semibold">Darstellung</h3>
      <div className="flex items-center justify-between">
        <Label>Theme</Label>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTheme('light')} className="hover:bg-accent hover:text-accent-foreground">Hell</Button>
          <Button variant="outline" onClick={() => setTheme('dark')} className="hover:bg-accent hover:text-accent-foreground">Dunkel</Button>
          <Button variant="outline" onClick={() => setTheme('system')} className="hover:bg-accent hover:text-accent-foreground">System</Button>
        </div>
      </div>
    </div>
  );
};
