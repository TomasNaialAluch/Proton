import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import GlobalPlayer from "@/components/player/GlobalPlayer";
import SupportAssistantPanel from "@/components/help/SupportAssistantPanel";
import ThemeProvider from "@/components/providers/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import FirebaseInit from "@/components/providers/FirebaseInit";
import DevInspectorNoiseFilter from "@/components/providers/DevInspectorNoiseFilter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Proton",
  description: "Radio and artist management platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        {/*
          Blocking script — runs before the first paint.
          Reads the saved theme from localStorage and applies it immediately
          to avoid any flash of wrong theme. Defaults to "light".
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = JSON.parse(localStorage.getItem('proton-theme') || '{}');
                  var theme = stored && stored.state && stored.state.theme === 'dark' ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <DevInspectorNoiseFilter />
        <QueryProvider>
          <ThemeProvider>
            <FirebaseInit />
            {children}
            <GlobalPlayer />
            <SupportAssistantPanel />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
