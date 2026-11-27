import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ISO-COMPASS | Sistema Guía ISO/IEC 29110',
  description: 'Biblioteca digital, lista de verificación y tablero de estado de aplicación de la familia ISO/IEC 29110',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">{children}</body>
    </html>
  );
}
