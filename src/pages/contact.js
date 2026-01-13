import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" }); // idle | sending | success | error

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });

    try {
      const res = await fetch("/api/contactEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({
          state: "error",
          msg: data?.error || "Something went wrong",
        });
        return;
      }

      setStatus({
        state: "success",
        msg: "Message sent. We will get back to you soon.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ state: "error", msg: "Network error. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A2D6F9] to-[#FAF8F0] px-6 py-16 text-[#064E65]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
        <p className="text-gray-700 italic mb-8">
          Have a question or feedback? Send us a message and we will respond
          soon.
        </p>

        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 border border-gray-200">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#064E65]"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#064E65]"
                placeholder="you@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#064E65]"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-[#064E65]"
                placeholder="Write your message here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={status.state === "sending"}
              className="w-full bg-[#064E65] text-white py-2 rounded-md hover:bg-[#053847] transition disabled:opacity-60"
            >
              {status.state === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status.state === "success" && (
              <p className="text-sm text-green-700">{status.msg}</p>
            )}
            {status.state === "error" && (
              <p className="text-sm text-red-600">{status.msg}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
