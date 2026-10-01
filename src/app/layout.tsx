import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "TimeOffer — Odmori i odsustva", template: "%s | TimeOffer" },
  description:
    "Zatražite odsustvo, pratite odobrenje i upravljajte slobodnim danima svog tima na jednom mestu.",
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/" signUpFallbackRedirectUrl="/onboarding">
      <html lang="sr-Latn" suppressHydrationWarning>
        <body
          className={inter.variable + " font-sans antialiased"}
        >
          <ThemeProvider>
            {children}
            <Toaster richColors position="top-center" closeButton />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
