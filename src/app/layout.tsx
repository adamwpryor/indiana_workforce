import type { Metadata } from "next";
import { Urbanist, Raleway } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Indiana Workforce Dashboard",
  description: "An AI Partner-Matching Dashboard for Indiana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} ${raleway.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
