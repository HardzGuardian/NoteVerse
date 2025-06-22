
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const DEFAULT_BG = "https://placehold.co/1920x1080.png";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(DEFAULT_BG);
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
     const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "login-background-image" && e.newValue) {
        setPreview(e.newValue);
      }
      if (e.key === "login-overlay-opacity" && e.newValue) {
        setOverlayOpacity(Number(e.newValue));
      }
    };
    
    // Set initial values from localStorage
    const savedBg = localStorage.getItem("login-background-image");
    if (savedBg) {
      setPreview(savedBg);
    }
    const savedOpacity = localStorage.getItem("login-overlay-opacity");
    if (savedOpacity) {
      setOverlayOpacity(Number(savedOpacity));
    }
    setMounted(true);

    // Listen for changes from other tabs to keep this page in sync
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        toast({
          title: "Image Selected",
          description: `${file.name} is ready to be saved.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = () => {
    if (preview) {
      localStorage.setItem("login-background-image", preview);
    }
    localStorage.setItem("login-overlay-opacity", String(overlayOpacity));
    toast({
        title: "Success!",
        description: "Your settings have been saved. The login page background will be updated.",
    });
  }

  return (
    <AdminLayout pageTitle="Admin Settings">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Admin Settings</CardTitle>
            <CardDescription>
              Manage global settings for the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Login Page Background</CardTitle>
                <CardDescription>Upload a new background image and adjust the overlay opacity for the login pages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  {!mounted ? (
                       <div className="w-full h-48 rounded-md bg-muted animate-pulse" />
                  ) : preview ? (
                       <div className="relative w-full h-48 rounded-md overflow-hidden border">
                           <Image src={preview} alt="Background Preview" layout="fill" objectFit="cover" data-ai-hint="abstract background" />
                           <div className="absolute inset-0" style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }} />
                       </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md">
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          <p className="text-muted-foreground mt-2">No image selected</p>
                      </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="opacity-slider" className="flex justify-between">
                      <span>Overlay Opacity</span>
                      <span>{overlayOpacity}%</span>
                    </Label>
                    <Slider
                      id="opacity-slider"
                      min={0}
                      max={100}
                      step={1}
                      value={[overlayOpacity]}
                      onValueChange={(value) => setOverlayOpacity(value[0])}
                      disabled={!mounted}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Input id="picture" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      <Button asChild variant="outline" className="w-full sm:w-auto">
                          <label htmlFor="picture" className="cursor-pointer">
                              <Upload className="mr-2 h-4 w-4" />
                              Choose Image
                          </label>
                      </Button>
                       <Button onClick={handleSaveChanges} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
                          Save Changes
                       </Button>
                  </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
