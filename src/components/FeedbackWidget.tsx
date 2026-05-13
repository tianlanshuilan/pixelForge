"use client";

import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const pathname = usePathname();

  const handleSubmit = async () => {
    if (message.trim().length < 3) return;
    setSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, page: pathname, email: email || undefined }),
      });
      setSent(true);
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-400 shadow-lg transition-all hover:border-purple-500 hover:text-white ${open ? "hidden" : ""}`}
      >
        <MessageSquare className="h-4 w-4" />
        Feedback
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-gray-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>

            {sent ? (
              <div className="py-8 text-center">
                <p className="text-lg font-semibold text-white">Thank you!</p>
                <p className="mt-2 text-sm text-gray-400">Your feedback has been sent.</p>
                <button onClick={() => { setOpen(false); setSent(false); setMessage(""); }} className="mt-4 text-sm text-purple-400 hover:text-purple-300">
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white">Send Feedback</h3>
                <p className="mt-1 text-sm text-gray-400">Tell us what&apos;s working, what&apos;s broken, or what you&apos;d like to see.</p>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your feedback..."
                  className="mt-4 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  rows={4}
                  autoFocus
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                />

                <button
                  onClick={handleSubmit}
                  disabled={message.trim().length < 3 || sending}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
                >
                  {sending ? "Sending..." : <>
                    <Send className="h-3.5 w-3.5" />
                    Send Feedback
                  </>}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
