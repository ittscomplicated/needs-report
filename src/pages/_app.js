import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A2D6F9] to-[#FAF8F0] flex flex-col">
      <Header />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}

export default MyApp;
