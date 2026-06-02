import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Raghvendra Saini | Campaign Portal & Digital Governance Leader",
  description: "Official campaign portal of Raghvendra Saini, Coordinator of the Social Media Monitoring Cell, Home Department, Government of Uttar Pradesh. Explore milestones in digital governance, cyber safety awareness, youth literacy, and voter mobilization in Fatehpur.",
  keywords: [
    "Raghvendra Saini",
    "Social Media Monitoring Cell UP",
    "UP Home Department",
    "Digital Literacy Fatehpur",
    "Voter Awareness Bindki",
    "Uttar Pradesh Government",
    "Political Leader UP",
    "Cyber Security UP",
    "Social Work UP"
  ],
  authors: [{ name: "Raghvendra Saini" }],
  creator: "Raghvendra Saini",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Raghvendra Saini | Campaign Portal & Digital Governance Leader",
    description: "Official campaign portal of Raghvendra Saini, Coordinator of the Social Media Monitoring Cell, Home Department, UP Government.",
    url: "https://raghvendrasaini.com",
    siteName: "Raghvendra Saini Campaign Portal",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
