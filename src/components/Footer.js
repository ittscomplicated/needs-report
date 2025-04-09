function Footer() {
  return (
    <footer className="bg-[#064E65] text-white text-center px-4 py-6 mt-12">
      <p className="text-sm tracking-wide">
        &copy; {new Date().getFullYear()} <span className="font-semibold">Needs Report</span>. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
