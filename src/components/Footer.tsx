import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} PixelForge. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/pricing" className="hover:text-gray-300">
            Pricing
          </Link>
          <Link href="/privacy" className="hover:text-gray-300">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-300">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
