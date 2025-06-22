
"use client";

import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { aboutContent, socialLinks, aboutPageSettings } from "@/lib/data";
import { Info, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

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
          {aboutPageSettings.showSocialLinks && (socialLinks.facebook || socialLinks.instagram || socialLinks.twitter || socialLinks.youtube || socialLinks.whatsapp || socialLinks.telegram) && (
             <CardFooter className="flex justify-center gap-6 pt-6">
                {socialLinks.facebook && (
                    <Link href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Facebook className="h-7 w-7" />
                        <span className="sr-only">Facebook</span>
                    </Link>
                )}
                {socialLinks.instagram && (
                    <Link href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Instagram className="h-7 w-7" />
                        <span className="sr-only">Instagram</span>
                    </Link>
                )}
                {socialLinks.twitter && (
                    <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Twitter className="h-7 w-7" />
                        <span className="sr-only">Twitter</span>
                    </Link>
                )}
                {socialLinks.youtube && (
                    <Link href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Youtube className="h-7 w-7" />
                        <span className="sr-only">YouTube</span>
                    </Link>
                )}
                {socialLinks.whatsapp && (
                    <Link href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <WhatsappIcon className="h-7 w-7" />
                        <span className="sr-only">WhatsApp</span>
                    </Link>
                )}
                 {socialLinks.telegram && (
                    <Link href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <TelegramIcon className="h-7 w-7" />
                        <span className="sr-only">Telegram</span>
                    </Link>
                )}
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
