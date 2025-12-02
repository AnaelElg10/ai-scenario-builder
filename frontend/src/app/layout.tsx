import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Scenario Builder",
  description: "Generate workflows, diagrams, and data models from scenario descriptions using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
