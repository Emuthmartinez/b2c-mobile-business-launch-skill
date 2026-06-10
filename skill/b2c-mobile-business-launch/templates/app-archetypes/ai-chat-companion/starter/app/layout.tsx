import type { Metadata } from "next";
import { AnalyticsProvider } from "@/components/analytics-provider";

// Replace name/description from DESIGN.md and the locked spec — never ship
// the placeholder metadata.
export const metadata: Metadata = {
  title: "AI Chat Companion Starter",
  description: "Archetype starter — customize via the prompt pack.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
