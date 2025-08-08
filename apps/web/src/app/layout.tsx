import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ToastProvider } from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobTrackr - The Smart Way to Track Job Applications",
  description: "Organize and track your job applications in one place with JobTrackr. Get insights, manage your pipeline, and land your dream job.",
  openGraph: {
    title: "JobTrackr",
    description: "The Smart Way to Track Job Applications",
    url: "https://jobtrackr.app", // Replace with your actual domain
    siteName: "JobTrackr",
    images: [
      {
        url: "https://jobtrackr.app/og-image.png", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`bg-background text-foreground ${inter.className}`}>
        <AuthProvider>
          <ErrorBoundary>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow container mx-auto p-4">{children}</main>
              </div>
            </ToastProvider>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
