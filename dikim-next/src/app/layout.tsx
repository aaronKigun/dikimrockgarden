import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dikim Rock Garden",
  description:
    "Dikim Rock Garden - A unique destination combining natural beauty, relaxation, and entertainment in Jos, Nigeria.",
  icons: {
    icon: [{ url: "/images/Reallogo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/images/Reallogo.jpg", type: "image/jpeg" }],
    shortcut: "/images/Reallogo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/images/Reallogo.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/images/Reallogo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/images/Reallogo.jpg" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          precedence="default"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
