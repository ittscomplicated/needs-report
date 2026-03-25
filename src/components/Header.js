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
    <>
      {/* Top Banner */}
      <div className="bg-red-600 text-white text-center py-2 text-xs md:text-sm font-semibold">
        Site Still Under Construction, Please Excuse the Mess :)
      </div>

      <nav className="bg-[#C3CD00] shadow-md px-4 py-3">
        <div className="max-w-6xl mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2">
          {/* Logo - Left */}
          <Link href="/">
            <img
              src="/images/needsTransparent.png"
              alt="Needs Report Logo"
              className="h-8 md:h-10 object-contain w-[100px] md:w-[140px]"
              width={140}
              height={140}
            />
            
          </Link>

          {/* Nav Links - Center */}
          <div className="flex items-center justify-center gap-3 md:gap-4 text-sm md:text-base font-medium text-gray-700">
            <Link href="/about" className="hover:text-blue-600 transition">
              About
            </Link>
            <span className="text-gray-400">|</span>
            <Link href="/map" className="hover:text-blue-600 transition">
              Map
            </Link>
          </div>

          {/* Button - Right */}
          <div className="flex justify-end">
            {showCreateButton && (
              <Link
                href="/reports"
                className="bg-[#064E65] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-semibold hover:bg-[#043B4D] transition whitespace-nowrap"
              >
                Create Report
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
