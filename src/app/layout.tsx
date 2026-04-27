import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "ConsentFlow — Digital Patient Consent with Video KYC",
  description: "Digital consent forms with video KYC, electronic signatures, and WhatsApp delivery for Indian hospitals. IT Act 2000 compliant.",
  openGraph: {
    title: "ConsentFlow — Digital Patient Consent with Video KYC",
    description: "Digital consent forms with video KYC, electronic signatures, and WhatsApp delivery for Indian hospitals. IT Act 2000 compliant.",
    type: "website",
    url: "https://consentflow.app",
    images: [
      {
        url: "https://consentflow.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ConsentFlow — Digital Patient Consent",
      },
    ],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%230d9488'/><path d='M35 30h30c2 0 4 2 4 4v32c0 2-2 4-4 4H35c-2 0-4-2-4-4V34c0-2 2-4 4-4z' fill='none' stroke='white' stroke-width='4'/><path d='M40 45h20M40 53h20M40 61h12' stroke='white' stroke-width='3' stroke-linecap='round'/></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full">
        <AuthProvider><ToastProvider>{children}</ToastProvider></AuthProvider>
      </body>
    </html>
  );
}
