import '../styles/globals.css';

export const metadata = {
  title: 'Crypto Pulse',
  description: 'Clean crypto dashboard built with Next.js + Tailwind',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-txt">
        {children}
      </body>
    </html>
  );
}
