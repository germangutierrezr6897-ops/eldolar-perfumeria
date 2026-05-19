export default function Footer() {
  return (
    <footer className="bg-[#F8D7DA] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <p
            className="text-2xl italic text-gray-700"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            El Dólar Perfumería
          </p>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#D4849A] transition-colors text-xs tracking-widest uppercase"
            >
              Instagram
            </a>
            <span className="text-[#D4849A] text-xs">·</span>
            <a
              href="https://wa.me/56900000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#D4849A] transition-colors text-xs tracking-widest uppercase"
            >
              WhatsApp
            </a>
            <span className="text-[#D4849A] text-xs">·</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#D4849A] transition-colors text-xs tracking-widest uppercase"
            >
              Facebook
            </a>
          </div>

          <p className="text-xs text-gray-400 tracking-wide">
            © {new Date().getFullYear()} El Dólar Perfumería · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
