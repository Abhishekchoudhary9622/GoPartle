import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GoPratle — Event Requirement Posting Platform',
  description:
    'Find and connect with verified event planners, live performers, and technical crew members across Bengaluru, Hyderabad, Mumbai, and Delhi.',
  keywords: [
    'GoPratle',
    'Event Planners',
    'Hire Performers',
    'Event Crew',
    'Sound Engineers',
    'Lighting Technicians',
    'Bands',
    'DJs',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${plusJakarta.variable}`} style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#08090C" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-[#08090C] text-[#F3F4F6]">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
