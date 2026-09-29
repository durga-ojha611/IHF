import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import "./top-fold.css";
import "./pages-polish.css";
import "./responsive-master.css";
import { CommerceProvider } from "@/components/commerce-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "India Home Furnishings",
  description: "Bespoke window treatments and fine home furnishings.",
};

import { AuthProvider } from "@/components/auth-context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CommerceProvider>{children}</CommerceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
