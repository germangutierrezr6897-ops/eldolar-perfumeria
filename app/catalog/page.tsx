"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Producto, Categoria } from "@/lib/supabase";

const BADGE_BG: Record<string, string> = {
  NUEVO:  "#6B2D8B",
  OFERTA: "#C2185B",
  TOP:    "#C2185B",
};

function formatPrecio(precio: number) {
  return `$${precio.toLocaleString("es-CL")}`;
}

export default function CatalogPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase
          .from("productos")
          .select("*, marcas(nombre), categorias(nombre)")
          .eq("activo", true)
          .order("created_at", { ascending: false }),
        supabase.from("categorias").select("*").order("nombre"),
      ]);
      setProductos(prods || []);
      setCategorias(cats || []);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const filtrados = productos.filter((p) => {
    const nombreCat = p.categorias?.nombre ?? "";
    const matchCategoria = categoriaActiva === "Todas" || nombreCat === categoriaActiva;
    const matchBusqueda =
      busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.marcas?.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase());
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
              <Image src="/logo-final.png" alt="El Dólar Perfumería" width={260} height={77} priority />
              <span style={{
                position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                animation: "slideShine 3s ease-in-out infinite", pointerEvents: "none",
              }} />
            </div>
          </Link>

          <div className="hidden md:flex items-center" style={{ gap: "32px" }}>
            {[
              { href: "/",          label: "Inicio"   },
              { href: "/catalog",   label: "Catálogo" },
              { href: "/#nosotros", label: "Nosotros" },
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
            {loading
              ? "Cargando productos..."
              : `${filtrados.length} producto${filtrados.length !== 1 ? "s" : ""} disponible${filtrados.length !== 1 ? "s" : ""} · Perfumes, maquillaje, cuidado personal y más`}
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

          {/* Chips de categoría dinámicos */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {[{ id: 0, nombre: "Todas" }, ...categorias].map((cat) => (
              <button key={cat.id} onClick={() => setCategoriaActiva(cat.nombre)}
                style={categoriaActiva === cat.nombre
                  ? { background: "#6B2D8B", color: "white", border: "1px solid #6B2D8B",
                      borderRadius: "9999px", padding: "6px 16px", fontSize: "14px", cursor: "pointer" }
                  : { background: "white", color: "#6B2D8B", border: "1px solid #6B2D8B",
                      borderRadius: "9999px", padding: "6px 16px", fontSize: "14px", cursor: "pointer" }}>
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-24" style={{ color: "#6B2D8B" }}>
              <p className="text-lg">Cargando productos...</p>
            </div>
          ) : filtrados.length === 0 ? (
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
                  <div style={{ position: "relative", height: "200px", borderRadius: "16px 16px 0 0", overflow: "hidden",
                    background: "linear-gradient(135deg, #1a0a2e, #6B2D8B)",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {producto.imagen_url ? (
                      <Image src={producto.imagen_url} alt={producto.nombre} fill style={{ objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "64px", opacity: 0.25, userSelect: "none" }}>🌸</span>
                    )}
                    {producto.badge && (
                      <span style={{ position: "absolute", top: "10px", left: "10px",
                        background: BADGE_BG[producto.badge] ?? "#6B2D8B", color: "white",
                        fontSize: "11px", padding: "4px 10px", borderRadius: "4px", fontWeight: 600, zIndex: 1 }}>
                        {producto.badge}
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs tracking-widest uppercase mb-1" style={{ color: "#A855C9" }}>
                      {producto.marcas?.nombre}
                    </span>
                    <h3 className="text-xl mb-1 leading-tight"
                      style={{ fontFamily: "var(--font-cormorant)", color: "#1A1A1A" }}>
                      {producto.nombre}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: "rgba(26,26,26,0.5)" }}>
                      {producto.tamano ? `${producto.tamano} · ` : ""}{producto.categorias?.nombre}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="text-2xl font-light"
                          style={{ fontFamily: "var(--font-cormorant)", color: "#6B2D8B" }}>
                          {formatPrecio(producto.precio)}
                        </span>
                        {producto.precio_oferta && (
                          <span style={{ color: "rgba(26,26,26,0.4)", fontSize: "12px", textDecoration: "line-through" }}>
                            {formatPrecio(producto.precio_oferta)}
                          </span>
                        )}
                      </div>
                      <a href={`https://wa.me/56900000000?text=Hola!%20Me%20interesa%20${encodeURIComponent(producto.nombre)}${producto.tamano ? `%20(${encodeURIComponent(producto.tamano)})` : ""}.%20%C2%BFEst%C3%A1%20disponible%3F`}
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
