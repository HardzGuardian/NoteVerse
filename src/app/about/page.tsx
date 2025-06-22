
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { aboutContent, socialLinks as defaultSocials } from "@/lib/data";
import { Info, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" {...props} fill="currentColor">
        <path d="M 25 3 C 12.861573 3 3 12.861581 3 25 C 3 37.138419 12.861573 47 25 47 C 37.138427 47 47 37.138419 47 25 C 47 12.861581 37.138427 3 25 3 z M 25 5 C 36.057548 5 45 13.94246 45 25 C 45 36.05754 36.057548 45 25 45 C 15.770054 45 8.0344319 38.760182 5.7226562 30.269531 L 12 33.515625 C 12.00858 37.086695 14.926996 40 18.5 40 C 21.943695 40 24.772053 37.291523 24.980469 33.898438 C 26.599427 32.696887 29.667309 30.769956 31.955078 28.976562 C 36.426116 28.73744 40 25.028996 40 20.5 C 40 15.817425 36.182578 12 31.5 12 C 26.971001 12 23.26256 15.573886 23.023438 20.044922 C 21.229598 22.33218 19.30272 25.398081 18.101562 27.017578 C 16.868603 27.092898 15.735848 27.526562 14.78125 28.197266 L 5.0859375 23.183594 C 6.0024189 12.980152 14.555289 5 25 5 z M 31.5 14 C 35.101699 14 38 16.898304 38 20.5 C 38 24.101696 35.101699 27 31.5 27 C 27.898301 27 25 24.101696 25 20.5 C 25 16.898304 27.898301 14 31.5 14 z M 31.5 16 C 30.083334 16 28.893559 16.567256 28.126953 17.429688 C 27.360347 18.292119 27 19.402778 27 20.5 C 27 21.597222 27.360347 22.707881 28.126953 23.570312 C 28.893559 24.432744 30.083334 25 31.5 25 C 32.916666 25 34.106441 24.432744 34.873047 23.570312 C 35.639653 22.707881 36 21.597222 36 20.5 C 36 19.402778 35.639653 18.292119 34.873047 17.429688 C 34.106441 16.567256 32.916666 16 31.5 16 z M 31.5 18 C 32.416666 18 32.976893 18.307744 33.376953 18.757812 C 33.777013 19.207881 34 19.847222 34 20.5 C 34 21.152778 33.777013 21.792119 33.376953 22.242188 C 32.976893 22.692256 32.416666 23 31.5 23 C 30.583334 23 30.023107 22.692256 29.623047 22.242188 C 29.222987 21.792119 29 21.152778 29 20.5 C 29 19.847222 29.222987 19.207881 29.623047 18.757812 C 30.023107 18.307744 30.583334 18 31.5 18 z M 23.363281 22.949219 C 24.184509 25.666966 26.333033 27.81549 29.050781 28.636719 C 27.596648 29.659231 26.010472 30.693762 24.714844 31.599609 C 24.08294 29.545055 22.454945 27.91706 20.400391 27.285156 C 21.305971 25.989544 22.340454 24.403383 23.363281 22.949219 z M 5.0097656 25.396484 L 18.958984 32.611328 C 19.45946 32.869984 19.648027 33.458143 19.388672 33.958984 L 19.386719 33.958984 C 19.205768 34.309253 18.858327 34.5 18.498047 34.5 C 18.342886 34.5 18.189365 34.46563 18.041016 34.388672 L 5.1914062 27.742188 C 5.086268 26.973594 5.0252269 26.190517 5.0097656 25.396484 z M 18.5 29 C 20.997732 29 23 31.002268 23 33.5 C 23 35.997732 20.997732 38 18.5 38 C 16.396508 38 14.660849 36.57297 14.160156 34.632812 L 17.121094 36.164062 C 17.558745 36.391103 18.033208 36.5 18.498047 36.5 C 19.585767 36.5 20.63506 35.900685 21.164062 34.876953 C 21.920707 33.415794 21.340431 31.589329 19.878906 30.833984 L 16.900391 29.292969 C 17.396429 29.103968 17.933663 29 18.5 29 z"/>
    </svg>
);

const ICONS: Record<string, React.ReactElement> = {
    facebook: <Facebook className="h-7 w-7" />,
    instagram: <Instagram className="h-7 w-7" />,
    twitter: <Twitter className="h-7 w-7" />,
    youtube: <Youtube className="h-7 w-7" />,
    whatsapp: <WhatsappIcon className="h-7 w-7" />,
    telegram: <TelegramIcon className="h-7 w-7" />,
    steam: <SteamIcon className="h-7 w-7" />,
};

export default function AboutPage() {
  const [content, setContent] = useState("");
  const [socials, setSocials] = useState(defaultSocials);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem('about-content');
    setContent(savedContent || aboutContent);

    const savedSocials = localStorage.getItem('social-links');
    setSocials(savedSocials ? JSON.parse(savedSocials) : defaultSocials);

    setIsMounted(true);
  }, []);
  
  const visibleLinks = socials.filter(link => link.enabled && link.url);

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
            {isMounted ? (
                <p>{content}</p>
            ) : (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            )}
          </CardContent>
          {visibleLinks.length > 0 && (
             <CardFooter className="flex justify-center gap-6 pt-6">
                {isMounted ? (
                    visibleLinks.map(link => (
                        <Link key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            {ICONS[link.id]}
                            <span className="sr-only">{link.name}</span>
                        </Link>
                    ))
                ) : (
                    <div className="flex justify-center gap-6">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-7 w-7 rounded-full" />
                    </div>
                )}
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
