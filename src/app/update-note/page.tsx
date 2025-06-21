"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateNote } from "@/lib/data";
import { Loader2, Save } from "lucide-react";

export default function UpdateNotePage() {
  const { toast } = useToast();
  const [note, setNote] = useState(updateNote.text);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success!",
        description: "The update note has been saved.",
      });
    }, 1500);
  };

  return (
    <AppLayout pageTitle="Update Announcement">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Edit Update Note</CardTitle>
            <CardDescription>
              This note will be displayed on the home screen for all users.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your announcement here..."
              className="min-h-[200px] text-base"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
