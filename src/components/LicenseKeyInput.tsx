"use client";

import { useState } from "react";
import { Key, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface LicenseKeyInputProps {
  onActivated: (expiresAt: string | null) => void;
  className?: string;
}

export default function LicenseKeyInput({ onActivated, className }: LicenseKeyInputProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/license/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: trimmed }),
      });

      const data = (await res.json()) as {
        valid?: boolean;
        error?: string;
        expiresAt?: string | null;
      };

      if (!data.valid) {
        setError(data.error || "Invalid license key. Please check and try again.");
        setLoading(false);
        return;
      }

      // Set Pro cookie via server action route
      await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: trimmed,
          expiresAt: data.expiresAt ?? null,
        }),
      });

      onActivated(data.expiresAt ?? null);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Enter License Key
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !key.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Key className="h-4 w-4" />
          )}
          Activate
        </button>
      </div>
      {error && (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </form>
  );
}
