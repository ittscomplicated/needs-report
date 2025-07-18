function Footer() {
  return (
    <footer className="bg-[#064E65] text-white text-center px-4 py-6 mt-12">
      <p className="text-lg font-medium text-white">
        💛 Every report makes a difference 💛
      </p>
        {/* <p className="text-lg font-medium text-white">
          Let’s build a stronger, more caring community together.
        </p> */}
      <hr className="my-4 border-t-2 border-white w-1/5 mx-auto" />
      <p className="text-xlg tracking-wide">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold">Needs Report</span>. All rights
        reserved.
      </p>
    </footer>
  );
}

export default Footer;
