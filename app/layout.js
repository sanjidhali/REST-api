import "./globals.css";

export const metadata = {
  title: "BFHL Node Processor",
  description:
    "Process directed graph edges, detect cycles, build tree hierarchies, and generate summaries.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
