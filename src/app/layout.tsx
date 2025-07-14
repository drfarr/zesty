import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

import { Bricolage_Grotesque } from "next/font/google";
const font = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "sozesty.zi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <body className="flex min-h-svh flex-col" suppressHydrationWarning>
          <main>
            <div className={`${font.variable} !font-(family-name:" Bricolage Grotesque")`}>
              {children}
            </div>
          </main>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
