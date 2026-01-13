import Link from "next/link";
function Footer() {
  return (
    <footer className="bg-[#064E65] text-white text-center px-4 py-6 mt-12">
      <p className="text-lg font-medium text-white">
        💛 Every report makes a difference 💛
      </p>

      <Link href="/contact">
        <button
          type="button"
          className="mt-4 px-6 py-2 bg-white text-[#064E65] rounded-full font-medium shadow hover:bg-[#A2D6F9] transition"
        >
          Contact Us
        </button>
      </Link>

      <hr className="my-4 border-t-2 border-white w-1/5 mx-auto" />

      <p className="text-xlg tracking-wide">
        <span className="font-semibold">Needs Report</span> is a project of
        EmpowermentWORKS 501(c)3.
      </p>
    </footer>
  );
}

export default Footer;
