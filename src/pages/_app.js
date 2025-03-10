import "../styles/globals.css"; // Ensure Tailwind is working
import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* ✅ Persistent Navbar */}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer /> {/* ✅ Persistent Footer */}
    </div>
  );
}

export default MyApp;
