import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Dólar Perfumería | Belleza y Fragancias en Chile",
  description:
    "Perfumes, maquillaje, cuidado del rostro, capilar y más al mejor precio en Chile. Envío a todo el país.",
  keywords: [
    "perfumes",
    "maquillaje",
    "fragancias",
    "cuidado del rostro",
    "belleza",
    "Chile",
    "Chanel",
    "Dior",
    "L'Oréal",
    "MAC",
  ],
  openGraph: {
    title: "El Dólar Perfumería",
    description:
      "Perfumes, maquillaje y cuidado personal al mejor precio. Envío a todo Chile.",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
