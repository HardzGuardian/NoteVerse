
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { aboutContent, socialLinks as initialSocials, SocialLink } from "@/lib/data";
import { Loader2, Save, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

const SteamIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M15.5 15.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
        <path d="M15.5 15.5L12 12l-4.5 4.5"/>
        <path d="M12 12l2-2.5-3-2.5"/>
    </svg>
);

const socialIcons: Record<SocialLink['id'], React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    whatsapp: WhatsappIcon,
    telegram: TelegramIcon,
    steam: SteamIcon,
};


export default function AdminEditAboutPage() {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem('about-content');
    setContent(savedContent || aboutContent);
    
    const savedSocials = localStorage.getItem('social-links');
    setSocials(savedSocials ? JSON.parse(savedSocials) : initialSocials);
    
    setIsMounted(true);
  }, []);


  const handleSocialChange = (id: SocialLink['id'], key: 'url' | 'enabled', value: string | boolean) => {
    setSocials(currentSocials => 
        currentSocials.map(social => 
            social.id === id ? { ...social, [key]: value } : social
        )
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, you would save this to a database.
      // For this mock, we use localStorage.
      localStorage.setItem('about-content', content);
      localStorage.setItem('social-links', JSON.stringify(socials));

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
              {isMounted ? (
                <Textarea
                  id="about-content"
                  placeholder="Type the about page content here..."
                  className="min-h-[200px] text-base"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              ) : (
                <Skeleton className="w-full min-h-[200px] rounded-md" />
              )}
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium text-foreground">Social Links</h3>
              <p className="text-sm text-muted-foreground">Enable and provide URLs for the social media links you want to display on the public About page.</p>
              <div className="space-y-3">
                {isMounted ? (
                  socials.map(social => {
                    const Icon = socialIcons[social.id];
                    return (
                      <div key={social.id} className="flex items-center gap-4 rounded-lg border p-3.5">
                        <Icon className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                        <div className="flex-grow space-y-1">
                            <Label htmlFor={social.id} className="font-medium">{social.name}</Label>
                            <Input 
                              id={social.id} 
                              placeholder={social.placeholder} 
                              value={social.url}
                              onChange={(e) => handleSocialChange(social.id, 'url', e.target.value)}
                              disabled={!social.enabled}
                              className="text-sm"
                            />
                        </div>
                        <Switch
                            id={`switch-${social.id}`}
                            checked={social.enabled}
                            onCheckedChange={(checked) => handleSocialChange(social.id, 'enabled', checked)}
                            aria-label={`Enable ${social.name} link`}
                        />
                      </div>
                    );
                  })
                ) : (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-full h-[88px] rounded-lg" />)
                )}
              </div>
            </div>
            
            <div className="pt-2">
              <Button onClick={handleSave} disabled={isLoading || !isMounted} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
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
