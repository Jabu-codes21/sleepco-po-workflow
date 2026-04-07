import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "PO Manager — The Sleep Company",
  description: "Purchase Order Approval Workflow for Comfort Grid Technologies Pvt Ltd",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
