import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cairo, Changa, Geist, Geist_Mono, Orbitron, Press_Start_2P } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { translate, type Locale } from "@/lib/i18n/messages";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const changa = Changa({
  variable: "--font-changa",
  subsets: ["arabic", "latin"],
});

function readLocale(value: string | undefined): Locale {
  return value === "ar" ? "ar" : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const jar = await cookies();
  const locale = readLocale(jar.get("arcade-eatery-lang")?.value);
  return {
    title: translate(locale, "meta.title"),
    description: translate(locale, "meta.description"),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const jar = await cookies();
  const locale = readLocale(jar.get("arcade-eatery-lang")?.value);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} ${orbitron.variable} ${cairo.variable} ${changa.variable} h-full overflow-hidden antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("arcade-eatery-lang");if(l==="ar"||l==="en"){document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr";}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="h-full overflow-hidden">
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
