"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { aboutContent } from "@/lib/data";
import { Loader2, Save } from "lucide-react";

export default function AdminEditAboutPage() {
  const { toast } = useToast();
  const [content, setContent] = useState(aboutContent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, you would save this to a database.
      console.log("Saving content:", content);
      setIsLoading(false);
      toast({
        title: "Success!",
        description: "The About page has been updated.",
      });
    }, 1500);
  };

  return (
    <AdminLayout pageTitle="Edit About Page">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Edit About Page</CardTitle>
            <CardDescription>
              This content will be displayed on the public-facing About page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type the about page content here..."
              className="min-h-[300px] text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
    </AdminLayout>
  );
}
