import "./globals.css";

export const metadata = {
  title: "TruVerse",
  description: "Verify what's real online",
  icons: {
    icon: "/truverse.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#18191A] text-white">{children}</body>
    </html>
  );
}
