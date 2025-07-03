import "./globals.css";
import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import { Toaster } from "react-hot-toast";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PDL Institute | Spiritual Development & Universal Harmony",
  description:"PDL Institute is a non-governmental organization dedicated to fostering spiritual growth, inner transformation, and global harmony. Rooted in timeless spiritual principles, the Institute serves as a guiding light for individuals seeking deeper meaning, inner peace, and a more compassionate world.",
  keywords: [
    "Conscious Mind Development",
    "Subconscious Mind Training",
    "Unconscious Mind Activation",
    "Astral Body Awareness",
    "Astral Travel and Consciousness Expansion",
    "Cosmic Sound Healing",
    "Abha Energy Transmission",
    "Light Energy Meditation",
    "Energy Body Activation",
    "Chakra Balancing and Alignment",
    "Third Eye Awakening",
    "Higher Consciousness Training",
    "Inner Transformation Practices",
    "Soul Liberation (Moksha)",
    "Spiritual Liberation Techniques",
    "Inner Peace and Self-Realization",
    "Vaidik Siddha Healing",
    "Holistic Mind-Body-Spirit Integration",
    "Universal Harmony and Oneness",
    "Divine Wisdom Teachings",
    "Meditation for Mind Mastery",
    "Tranquility Through Cosmic Frequencies",
    "Self-Awareness and Inner Clarity",
    "Advanced Spiritual Sadhana",
    "Sacred Sound and Light Practices",
    "Enlightenment and Self-Discovery",
    "Non-Duality and Universal Consciousness",
    "Journey Beyond Ego and Illusion",
    "Awakening Dormant Spiritual Potential",
    "Inner Science and Metaphysical Education",
  ],
  authors: [
    {
      name: "Maharshi Gaj Arvind",
      url: "https://www.pdlinstitute.org",
    },
  ],
  publisher: "Gaj Arvind",
  creator: "Gaj Arvind",
  metadataBase: new URL("https://www.pdlinstitute.org"),
  alternates: {
    canonical: "https://www.pdlinstitute.org",
  },
  themeColor: "#ffffff",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "PDL Institute | Spiritual Development & Universal Harmony",
    description:
      "PDL Institute is a non-governmental organization dedicated to fostering spiritual growth, inner transformation, and global harmony. Rooted in timeless spiritual principles, the Institute serves as a guiding light for individuals seeking deeper meaning, inner peace, and a more compassionate world.",
    url: "https://www.pdlinstitute.org",
    siteName: "PDL Institute | Spiritual Development & Universal Harmony",
    images: [
      {
        url: "https://www.pdlinstitute.org/images/cover-image.jpg",
        width: 1200,
        height: 630,
        alt: "PDL Institute | Spiritual Development & Universal Harmony",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDL Institute | Spiritual Development & Universal Harmony",
    description:
      "PDL Institute is a non-governmental organization dedicated to fostering spiritual growth, inner transformation, and global harmony. Rooted in timeless spiritual principles, the Institute serves as a guiding light for individuals seeking deeper meaning, inner peace, and a more compassionate world.",
    images: [
      {
        url: "https://www.pdlinstitute.org/images/cover-image.jpg",
        alt: "PDL Institute | Spiritual Development & Universal Harmony",
      },
    ],
    creator: "@Maharshi_Gaj_Arvind_",
    site: "@Maharshi_Gaj_Arvind_",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    noimageindex: false,
    notranslate: false,
  },
};
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {    
  return (
    <html lang="en">
      <body className={oswald.variable}>
        <Toaster
          toastOptions={{
            duration: 3000,
            style: {
              background: "white",
              border: "1.5px solid orange",
              borderRadius: "10px",
              padding: "6px",
              width: "auto",
              textAlign: "center",
              fontFamily: "var(--font-oswald), sans-serif",
              fontSize: "0.875rem",
              fontStyle: "italic",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}