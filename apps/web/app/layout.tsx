import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITP Portal",
  description: "ITP Portal Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
