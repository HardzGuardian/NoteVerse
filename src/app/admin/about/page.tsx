"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { aboutContent } from "@/lib/data";
import { Loader2, Save, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function AdminEditAboutPage() {
  const { toast } = useToast();
  const [content, setContent] = useState(aboutContent);
  const [isLoading, setIsLoading] = useState(false);
  const [socials, setSocials] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
  });

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, you would save this to a database.
      console.log("Saving content:", content);
      console.log("Saving socials:", socials);
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
            <div>
              <Label htmlFor="about-content">Page Content</Label>
              <Textarea
                id="about-content"
                placeholder="Type the about page content here..."
                className="min-h-[200px] text-base"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium text-foreground">Social Links</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-muted-foreground" />
                    <Input id="facebook" placeholder="https://facebook.com/your-page" value={socials.facebook} onChange={e => setSocials({...socials, facebook: e.target.value})} />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-muted-foreground" />
                    <Input id="instagram" placeholder="https://instagram.com/your-handle" value={socials.instagram} onChange={e => setSocials({...socials, instagram: e.target.value})} />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-muted-foreground" />
                    <Input id="twitter" placeholder="https://twitter.com/your-handle" value={socials.twitter} onChange={e => setSocials({...socials, twitter: e.target.value})} />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-muted-foreground" />
                    <Input id="youtube" placeholder="https://youtube.com/your-channel" value={socials.youtube} onChange={e => setSocials({...socials, youtube: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}