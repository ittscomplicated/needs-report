function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F0] to-white px-6 md:px-12 py-16 text-[#064E65]">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#064E65]">How Needs Report Works</h1>
          <p className="text-gray-700 text-lg italic">
            A simple way to make your voice heard and your community stronger.
          </p>
        </div>

        {/* Step 1 */}
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold">1. Share What You Need</h2>
          <p className="text-gray-700">
            See something your community needs? Whether it’s a broken streetlight, limited access to fresh food,
            healthcare gaps, or anything else — we want to hear from you.
          </p>
          <p className="text-gray-700">
            You can share your report right here on the site, or simply text us. Your voice matters.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold">2. Submit Online or Text Us</h2>

          <div>
            <p className="font-medium mb-2 text-[#0B4F6C]">Online:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Click the <strong>“Create Report”</strong> button at the top right.</li>
              <li>Fill out a short form with your name, location, and what’s needed.</li>
              <li>Press <strong>Submit</strong> — and you're done!</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-2 text-[#0B4F6C]">By Text:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Send a message to <strong>[phone number]</strong></li>
              <li>Start with a category (like: “Food”, “Health”, “Education”, etc.)</li>
              <li>Then describe the issue briefly.</li>
            </ul>
            <p className="italic text-sm text-gray-600 mt-2">
              Example: <span className="text-[#064E65]">"Food: Our local store ran out of produce again this week."</span>
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold">3. See the Bigger Picture</h2>
          <p className="text-gray-700">
            Your report appears on our public map. It helps show what issues are affecting different communities —
            and highlights where help is needed most.
          </p>
          <p className="text-gray-700">
            The more people who share, the stronger our collective voice becomes.
          </p>
        </div>

        {/* Outro */}
        <div className="text-center pt-8">
          <p className="text-lg font-medium text-[#0B4F6C]">
            💛 Every report makes a difference 💛
          </p>
          <p className="text-gray-600 mt-2">
            Let’s build a stronger, more caring community — together.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorksPage;
