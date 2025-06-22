
"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { aboutContent, socialLinks as initialSocials, aboutPageSettings as initialAboutSettings } from "@/lib/data";
import { Loader2, Save, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
);


export default function AdminEditAboutPage() {
  const { toast } = useToast();
  const [content, setContent] = useState(aboutContent);
  const [isLoading, setIsLoading] = useState(false);
  const [socials, setSocials] = useState(initialSocials);
  const [showSocials, setShowSocials] = useState(initialAboutSettings.showSocialLinks);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, you would save this to a database.
      console.log("Saving content:", content);
      console.log("Saving socials:", socials);
      console.log("Saving show socials:", showSocials);
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
          <CardContent className="space-y-6">
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
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="show-socials" className="text-base font-medium">Show Social Links</Label>
                <p className="text-sm text-muted-foreground">Display social media links on the About page.</p>
              </div>
              <Switch
                id="show-socials"
                checked={showSocials}
                onCheckedChange={setShowSocials}
              />
            </div>

            {showSocials && (
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
                   <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <div className="flex items-center gap-2">
                      <WhatsappIcon className="h-5 w-5 text-muted-foreground" />
                      <Input id="whatsapp" placeholder="https://wa.me/your-number" value={socials.whatsapp} onChange={e => setSocials({...socials, whatsapp: e.target.value})} />
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram</Label>
                    <div className="flex items-center gap-2">
                      <TelegramIcon className="h-5 w-5 text-muted-foreground" />
                      <Input id="telegram" placeholder="https://t.me/your-channel" value={socials.telegram} onChange={e => setSocials({...socials, telegram: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            )}
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
