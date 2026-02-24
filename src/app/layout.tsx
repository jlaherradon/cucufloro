import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers, AuthBootstrap } from "@/components/providers";

export const metadata: Metadata = {
  title: "Parking Swap",
  description: "Swap parking spots with nearby drivers"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <AuthBootstrap />
          {children}
        </Providers>
      </body>
    </html>
  );
}
