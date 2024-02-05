import "./globals.css";
import { Inter, Work_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const work_sans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${work_sans.variable} font-sans`}>{children}</body>
    </html>
  );
}