import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Header() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;

  useEffect(() => {
    setMounted(true);
  }, []);

  const showCreateButton = mounted && pathname !== "/";

  return (
    <nav className="bg-[#C3CD00] shadow-md relative">
      <div className="flex items-center justify-between">
        {/* Logo - flush left */}
        <Link href="/" className="bg-[#A8B800] px-6 py-3">
          <img
            src="/images/needsTransparent.png"
            alt="Needs Report Logo"
            className="h-10 md:h-14 object-contain w-[120px] md:w-[180px]"
            width={180}
            height={180}
          />
        </Link>

        {/* Nav Links - truly centered on the full page */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-8 text-base md:text-lg font-bold text-[#064E65]">
          <Link href="/about" className="hover:opacity-70 transition">
            About
          </Link>
          <span className="text-[#064E65] opacity-40">|</span>
          <Link href="/map" className="hover:opacity-70 transition">
            Map
          </Link>
        </div>

        {/* Button - flush right */}
        <div className="px-6 py-3">
          {showCreateButton && (
            <Link
              href="/reports"
              className="bg-[#064E65] text-white px-5 py-2 md:px-7 md:py-3 rounded-full text-base md:text-lg font-semibold hover:bg-[#043B4D] transition whitespace-nowrap"
            >
              Share a Need
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
