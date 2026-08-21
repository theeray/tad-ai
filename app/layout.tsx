import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAD AI Resource Hub",
  description:
    "Verified AI tools, creative workflows, project ideas, and critical resources for the School of Technology, Art & Design.",
  metadataBase: new URL("https://tad-ai-resource-hub.the-eray.chatgpt.site"),
  openGraph: {
    title: "TAD AI Resource Hub",
    description:
      "Verified tools, creative workflows, project ideas, and critical resources for Technology, Art & Design.",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "TAD AI Resource Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TAD AI Resource Hub",
    description: "Verified tools, creative workflows, and critical resources.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/ai-tad-favicon.png", type: "image/png", sizes: "354x355" }],
    shortcut: "/ai-tad-favicon.png",
    apple: "/ai-tad-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
