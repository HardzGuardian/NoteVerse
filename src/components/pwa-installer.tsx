"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function PwaInstaller() {
    const { toast } = useToast();

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker.register("/sw.js").then(
                    function (registration) {
                        console.log("Service Worker registration successful with scope: ", registration.scope);
                    },
                    function (err) {
                        console.log("Service Worker registration failed: ", err);
                         toast({
                            variant: "destructive",
                            title: "Offline Mode Failed",
                            description: "Could not initialize offline capabilities.",
                         });
                    }
                );
            });
        }
    }, [toast]);

    return null;
}
