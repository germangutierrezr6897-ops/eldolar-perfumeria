"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const PRODUCTOS = [
  // Perfumes y Fragancias
  { id: 1,  nombre: "Chanel N°5",              marca: "Chanel",          categoria: "Perfumes y Fragancias", precio: 45990, ml: 100, emoji: "🌸", badge: "NUEVO"  },
  { id: 2,  nombre: "Dior Sauvage EDT",         marca: "Dior",            categoria: "Perfumes y Fragancias", precio: 67990, ml: 100, emoji: "🌸", badge: "OFERTA" },
  // Maquillaje
  { id: 3,  nombre: "Base Infallible",          marca: "L'Oréal",         categoria: "Maquillaje",            precio: 18990, ml: null, emoji: "💄", badge: "NUEVO"  },
  { id: 4,  nombre: "Labial Ruby Woo",          marca: "MAC",             categoria: "Maquillaje",            precio: 22990, ml: null, emoji: "💄", badge: "OFERTA" },
  // Cuidado del Rostro
  { id: 5,  nombre: "Crema Hidratante",         marca: "Nivea",           categoria: "Cuidado del Rostro",    precio: 12990, ml: null, emoji: "✨", badge: "NUEVO"  },
  { id: 6,  nombre: "Sérum Vitamina C",         marca: "Neutrogena",      categoria: "Cuidado del Rostro",    precio: 24990, ml: null, emoji: "✨", badge: "OFERTA" },
  // Cuidado Corporal
  { id: 7,  nombre: "Crema Corporal Nutritiva", marca: "Dove",            categoria: "Cuidado Corporal",      precio: 9990,  ml: null, emoji: "🧴", badge: "NUEVO"  },
  { id: 8,  nombre: "Exfoliante Avena",         marca: "St. Ives",        categoria: "Cuidado Corporal",      precio: 14990, ml: null, emoji: "🧴", badge: "OFERTA" },
  // Capilar
  { id: 9,  nombre: "Shampoo Anti-caspa",       marca: "Head & Shoulders",categoria: "Capilar",               precio: 8990,  ml: 400,  emoji: "💇", badge: "NUEVO"  },
  { id: 10, nombre: "Acondicionador Liso",      marca: "Pantene",         categoria: "Capilar",               precio: 10990, ml: 400,  emoji: "💇", badge: "OFERTA" },
  // Mi Bebé
  { id: 11, nombre: "Loción Bebé Suave",        marca: "Johnson's",       categoria: "Mi Bebé",               precio: 7990,  ml: 300,  emoji: "🍼", badge: "NUEVO"  },
  { id: 12, nombre: "Shampoo Bebé Sin Lágrimas", marca: "Johnson's",      categoria: "Mi Bebé",               precio: 6990,  ml: 300,  emoji: "🍼", badge: "OFERTA" },
  // Cuidado Personal
  { id: 13, nombre: "Desodorante 48h",          marca: "Rexona",          categoria: "Cuidado Personal",      precio: 5990,  ml: null, emoji: "🧼", badge: "NUEVO"  },
  { id: 14, nombre: "Jabón Humectante",         marca: "Dove",            categoria: "Cuidado Personal",      precio: 3990,  ml: null, emoji: "🧼", badge: "OFERTA" },
];

const CATEGORIAS = [
  "Todas",
  "Maquillaje",
  "Cuidado del Rostro",
  "Cuidado Corporal",
  "Capilar",
  "Perfumes y Fragancias",
  "Mi Bebé",
  "Cuidado Personal",
];

const BADGE_BG: Record<string, string> = {
  NUEVO:  "#6B2D8B",
  OFERTA: "#C2185B",
};

function formatPrecio(precio: number) {
  return `$${precio.toLocaleString("es-CL")}`;
}

export default function CatalogPage() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filtrados = PRODUCTOS.filter((p) => {
    const matchCategoria = categoriaActiva === "Todas" || p.categoria === categoriaActiva;
    const matchBusqueda =
      busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.marca.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { filter: drop-shadow(0 0 0px rgba(107,45,139,0)) brightness(1); }
          50%  { filter: drop-shadow(0 0 12px rgba(107,45,139,0.8)) brightness(1.15); }
          100% { filter: drop-shadow(0 0 0px rgba(107,45,139,0)) brightness(1); }
        }
        @keyframes slideShine {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(300%) skewX(-15deg); }
        }
        @keyframes pulse-wa {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.7); }
          70%  { box-shadow: 0 0 0 10px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        .product-card { transition: box-shadow 0.3s ease, transform 0.3s ease; }
        .product-card:hover {
          box-shadow: 0 8px 24px rgba(107,45,139,0.2);
          transform: translateY(-4px);
        }
        .search-input::placeholder { color: rgba(26,26,26,0.4); }
        .search-input:focus { outline: none; border-color: #6B2D8B; }
        .carousel-arrow:hover { background: #6B2D8B !important; }
      `}</style>

      {/* Navbar */}
      <header
        className="sticky top-0 z-50 border-b border-[#6B2D8B]/30"
        style={{ background: "linear-gradient(to right, #6B2D8B 0%, #ffffff 100%)" }}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4"
          style={{ minHeight: "70px" }}
        >
          <Link href="/" className="shrink-0" style={{ paddingTop: 8, paddingBottom: 8, overflow: "visible" }}>
            <div style={{ position: "relative", overflow: "hidden", animation: "shimmer 3s ease-in-out infinite", cursor: "pointer" }}>
              <Image src="/logo-final.png" alt="El Dólar Beauty Store" width={260} height={77} priority />
              <span style={{
                position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                animation: "slideShine 3s ease-in-out infinite", pointerEvents: "none",
              }} />
            </div>
          </Link>

          <div className="hidden md:flex items-center" style={{ gap: "32px" }}>
            {[
              { href: "/",         label: "Inicio"   },
              { href: "/catalog",  label: "Catálogo" },
              { href: "/#nosotros",label: "Nosotros" },
            ].reduce<React.ReactNode[]>((acc, link, i) => [
              ...acc,
              ...(i > 0 ? [<span key={`sep-${i}`} className="select-none pointer-events-none" style={{ color: "#6B2D8B" }}>|</span>] : []),
              <Link key={link.href} href={link.href}
                className="hover:text-[#6B2D8B] transition-colors duration-200"
                style={{ fontSize: "15px", letterSpacing: "0.08em", fontWeight: 500, color: "#1A1A1A" }}>
                {link.label}
              </Link>,
            ], [])}
          </div>

          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "22px", color: "#1A1A1A", padding: "4px 8px", lineHeight: 1 }}>
              {isMenuOpen ? "✕" : "☰"}
            </button>
            <a href="https://wa.me/56900000000?text=Hola!%20Me%20interesa%20conocer%20sus%20productos%20disponibles."
              target="_blank" rel="noopener noreferrer" className="shrink-0"
              style={{ background: "#25D366", color: "#ffffff", animation: "pulse-wa 2s ease-in-out infinite",
                borderRadius: "25px", padding: "10px 20px", fontWeight: "600", fontSize: "14px",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              💬 WhatsApp
            </a>
          </div>
        </nav>

        {isMenuOpen && (
          <div style={{ background: "#1A0A2E", padding: "16px" }}>
            {[
              { href: "/",          label: "Inicio"   },
              { href: "/catalog",   label: "Catálogo" },
              { href: "/#nosotros", label: "Nosotros" },
            ].map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}
                style={{ display: "block", padding: "12px 8px", color: "#E5E5E5", fontSize: "15px",
                  letterSpacing: "0.08em", borderBottom: "1px solid rgba(107,45,139,0.2)", textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Encabezado */}
      <section style={{ background: "#FFFFFF", padding: "48px 24px 32px" }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6B2D8B] mb-3">
            Colección completa
          </p>
          <h1
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 300, color: "#1A1A1A", marginBottom: "8px", lineHeight: 1.2 }}
          >
            Catálogo completo
          </h1>
          <p style={{ color: "rgba(26,26,26,0.5)", fontSize: "15px" }}>
            {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""} disponible{filtrados.length !== 1 ? "s" : ""} · Perfumes, maquillaje, cuidado personal y más
          </p>
        </div>
      </section>

      {/* Filtros y grid */}
      <section style={{ background: "#FFFFFF", paddingBottom: "64px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Buscador */}
          <input type="text" placeholder="Buscar producto..." value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} className="search-input"
            style={{ background: "white", border: "1px solid #6B2D8B", color: "#1A1A1A",
              borderRadius: "8px", padding: "8px 14px", fontSize: "14px",
              marginBottom: "20px", width: "100%", maxWidth: "320px", display: "block" }} />

          {/* Chips de categoría */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {CATEGORIAS.map((cat) => (
              <button key={cat} onClick={() => setCategoriaActiva(cat)}
                style={categoriaActiva === cat
                  ? { background: "#6B2D8B", color: "white", border: "1px solid #6B2D8B",
                      borderRadius: "9999px", padding: "6px 16px", fontSize: "14px", cursor: "pointer" }
                  : { background: "white", color: "#6B2D8B", border: "1px solid #6B2D8B",
                      borderRadius: "9999px", padding: "6px 16px", fontSize: "14px", cursor: "pointer" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid 4 columnas */}
          {filtrados.length === 0 ? (
            <div className="text-center py-24" style={{ color: "#6B2D8B" }}>
              <p className="text-5xl mb-4">✨</p>
              <p className="text-lg">No hay productos en esta categoría aún.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
              {filtrados.map((producto) => (
                <div key={producto.id} className="product-card overflow-hidden flex flex-col"
                  style={{ background: "white", border: "1px solid rgba(107,45,139,0.2)", borderRadius: "16px" }}>
                  {/* Imagen con badge */}
                  <div style={{ position: "relative", height: "200px",
                    background: "linear-gradient(135deg, #1a0a2e, #6B2D8B)",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "64px", opacity: 0.25, userSelect: "none" }}>{producto.emoji}</span>
                    <span style={{ position: "absolute", top: "10px", left: "10px",
                      background: BADGE_BG[producto.badge], color: "white",
                      fontSize: "11px", padding: "4px 10px", borderRadius: "4px", fontWeight: 600 }}>
                      {producto.badge}
                    </span>
                  </div>
                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs tracking-widest uppercase mb-1" style={{ color: "#A855C9" }}>
                      {producto.marca}
                    </span>
                    <h3 className="text-xl mb-1 leading-tight"
                      style={{ fontFamily: "var(--font-cormorant)", color: "#1A1A1A" }}>
                      {producto.nombre}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: "rgba(26,26,26,0.5)" }}>
                      {producto.ml ? `${producto.ml} ml · ` : ""}{producto.categoria}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span className="text-2xl font-light"
                        style={{ fontFamily: "var(--font-cormorant)", color: "#6B2D8B" }}>
                        {formatPrecio(producto.precio)}
                      </span>
                      <a href={`https://wa.me/56900000000?text=Hola!%20Me%20interesa%20${encodeURIComponent(producto.nombre)}${producto.ml ? `%20(${producto.ml}ml)` : ""}.%20%C2%BFEst%C3%A1%20disponible%3F`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap"
                        style={{ background: "#6B2D8B", color: "white", padding: "8px 12px",
                          borderRadius: "9999px", textDecoration: "none" }}>
                        💬 Consultar
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] mt-auto border-t border-[#6B2D8B]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-2xl italic text-white" style={{ fontFamily: "var(--font-cormorant)" }}>
              El Dólar Perfumería
            </p>
            <p className="text-white/40 text-xs tracking-wide">Martínez de Aldunate 1915</p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <a href="https://instagram.com/perfumeriaeldolar18" target="_blank" rel="noopener noreferrer"
                className="text-white/50 hover:text-[#A855C9] transition-colors text-xs tracking-widest uppercase">Instagram</a>
              <span className="text-[#6B2D8B] text-xs">·</span>
              <a href="https://wa.me/56900000000" target="_blank" rel="noopener noreferrer"
                className="text-white/50 hover:text-[#A855C9] transition-colors text-xs tracking-widest uppercase">WhatsApp</a>
              <span className="text-[#6B2D8B] text-xs">·</span>
              <a href="https://facebook.com/PerfumeriaElDolar" target="_blank" rel="noopener noreferrer"
                className="text-white/50 hover:text-[#A855C9] transition-colors text-xs tracking-widest uppercase">Facebook</a>
            </div>
            <p className="text-xs text-white/20 tracking-wide">
              © {new Date().getFullYear()} El Dólar Perfumería · Todos los derechos reservados
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textAlign: "center",
              borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: "12px",
              marginTop: "12px", letterSpacing: "0.08em" }}>
              Desarrollado por GUTIERREZ INNOVACIONES CL
            </p>
          </div>
        </div>
      </footer>

      {/* Botón WhatsApp flotante */}
      <a href="https://wa.me/56900000000" target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
          background: "#25D366", borderRadius: "50%", width: "60px", height: "60px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px", animation: "pulse-wa 2s ease-in-out infinite",
          cursor: "pointer", textDecoration: "none" }}>
        💬
      </a>
    </>
  );
}
