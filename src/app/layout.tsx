
// 1. ARREGLO: Importar Metadata de 'next'
import type { Metadata } from "next";

// (Aquí van tus imports de Poppins)
import "./globals.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

// 2. ARREGLO: Restaurar el contenido del objeto
export const metadata: Metadata = {
  title: "Fundación Huahuacuna",
  description: "Conectando corazones, transformando vidas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-['Poppins'] antialiased">{children}</body>
    </html>
  );
}