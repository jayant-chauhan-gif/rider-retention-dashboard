import './globals.css';

export const metadata = {
  title: 'Rider Retention Dashboard',
  description: 'Last Mile Rider Retention Analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
