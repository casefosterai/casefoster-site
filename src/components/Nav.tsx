import Link from "next/link";

export default function Nav() {
  return (
    <header>
      <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="display text-xl tracking-tight hover:text-mute transition-colors"
        >
          CASEFOSTER<span className="text-mute">.AI</span>
        </Link>
        <Link
          href="/"
          className="mono-label text-mute hover:text-ink transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </header>
  );
}
