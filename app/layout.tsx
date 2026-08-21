import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAD AI Resource Hub",
  description:
    "Verified AI tools, creative workflows, project ideas, and critical resources for the School of Technology, Art & Design.",
  authors: [{ name: "Eric Carlson" }],
  creator: "Eric Carlson",
  metadataBase: new URL("https://theeray.github.io/tad-ai/"),
  alternates: { canonical: "https://theeray.github.io/tad-ai/" },
  openGraph: {
    title: "TAD AI Resource Hub",
    description:
      "Verified tools, creative workflows, project ideas, and critical resources for Technology, Art & Design.",
    type: "website",
    images: [{ url: "https://theeray.github.io/tad-ai/og.png", width: 1734, height: 907, alt: "TAD AI Resource Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TAD AI Resource Hub",
    description: "Verified tools, creative workflows, and critical resources.",
    images: ["https://theeray.github.io/tad-ai/og.png"],
  },
  icons: {
    icon: [{ url: "https://theeray.github.io/tad-ai/ai-tad-favicon.png", type: "image/png", sizes: "354x355" }],
    shortcut: "https://theeray.github.io/tad-ai/ai-tad-favicon.png",
    apple: "https://theeray.github.io/tad-ai/ai-tad-favicon.png",
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
