import { Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata = {
  title: "Garden State Greenery",
  description:
    "Lawn mowing, blowing, edging, mulching, leaf cleanup, raking, and snow shoveling for homes in River Edge, Oradell, and Paramus.",
  icons: {
    icon: [{ url: "/favicon.png?v=3", type: "image/png" }],
    shortcut: [{ url: "/favicon.png?v=3", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
