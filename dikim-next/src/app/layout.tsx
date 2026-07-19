import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dikim Rock Garden",
  description: "Dikim Rock Garden - A unique destination combining natural beauty, relaxation, and entertainment in Jos, Nigeria.",
  icons: {
    icon: "/images/Reallogo.jpg",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
