import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#F8D7DA]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-xl sm:text-2xl italic text-gray-800 shrink-0"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          El Dólar Perfumería
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/", label: "Inicio" },
            { href: "/catalog", label: "Catálogo" },
            { href: "/#nosotros", label: "Nosotros" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase text-gray-500 hover:text-[#D4849A] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <a
          href="https://wa.me/56900000000?text=Hola!%20Me%20interesa%20conocer%20sus%20fragancias%20disponibles."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 bg-[#F2A7B3] hover:bg-[#D4849A] text-white text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200"
        >
          💬 WhatsApp
        </a>
      </nav>
    </header>
  );
}
