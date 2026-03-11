import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PatentOS Dashboard",
  description: "PatentOS product dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f7f9fc] text-[#122033]">
        <div className="min-h-screen">
          <header className="border-b border-[rgba(20,87,184,0.08)] bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
              <a href="https://www.patentos.in" className="inline-flex items-center">
                <img
                  src="/patentos-logo.png"
                  alt="PatentOS logo"
                  className="h-10 w-auto object-contain sm:h-12"
                />
              </a>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}