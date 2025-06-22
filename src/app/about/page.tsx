"use client";

import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { aboutContent, socialLinks } from "@/lib/data";
import { Info, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function AboutPage() {
  return (
    <AppLayout pageTitle="About NoteVerse">
      <div className="flex justify-center">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-full text-accent">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-3xl">About NoteVerse</CardTitle>
                <CardDescription>Our mission and vision for students.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-base text-card-foreground/90 leading-relaxed">
            <p>{aboutContent}</p>
          </CardContent>
          {(socialLinks.facebook || socialLinks.instagram || socialLinks.twitter || socialLinks.youtube) && (
             <CardFooter className="flex-col items-start gap-4 pt-4">
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialLinks.facebook && (
                        <Link href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <Facebook className="h-6 w-6" />
                            <span className="font-medium">Facebook</span>
                        </Link>
                    )}
                    {socialLinks.instagram && (
                        <Link href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <Instagram className="h-6 w-6" />
                            <span className="font-medium">Instagram</span>
                        </Link>
                    )}
                    {socialLinks.twitter && (
                        <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <Twitter className="h-6 w-6" />
                            <span className="font-medium">Twitter</span>
                        </Link>
                    )}
                    {socialLinks.youtube && (
                        <Link href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <Youtube className="h-6 w-6" />
                            <span className="font-medium">YouTube</span>
                        </Link>
                    )}
                </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
