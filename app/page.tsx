"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Producto, Categoria, Marca } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";
import CartDrawer from "@/app/components/CartDrawer";
import ProductModal from "@/app/components/ProductModal";

function formatPrecio(precio: number) {
  return `$${precio.toLocaleString("es-CL")}`;
}

const BADGE_BG: Record<string, string> = {
  NUEVO:  "#6B2D8B",
  OFERTA: "#C2185B",
  TOP:    "#C2185B",
};

// ── Fila de marca estilo Netflix ─────────────────────────────────────────────

function BrandRow({
  marca,
  productos,
  onProductoClick,
  onAddToCart,
}: {
  marca: Marca;
  productos: Producto[];
  onProductoClick: (p: Producto) => void;
  onAddToCart: (p: Producto) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    rowRef.current?.scrollBy({ left: dir === "right" ? 248 : -248, behavior: "smooth" });
  }

  return (
    <section
      id={`marca-${marca.slug}`}
      style={{ padding: "28px 0 20px", borderBottom: "1px solid rgba(107,45,139,0.08)" }}
    >
      {/* Encabezado de la fila */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          marginBottom: "14px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1A1A1A",
              marginBottom: "2px",
              letterSpacing: "0.01em",
            }}
          >
            {marca.nombre}
          </h2>
          <p style={{ fontSize: "12px", color: "rgba(26,26,26,0.45)" }}>
            {productos.length} producto{productos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => scroll("left")}
            className="carousel-arrow"
            style={{
              background: "rgba(107,45,139,0.1)",
              color: "#6B2D8B",
              border: "none",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="carousel-arrow"
            style={{
              background: "rgba(107,45,139,0.1)",
              color: "#6B2D8B",
              border: "none",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Fila horizontal scrolleable */}
      <div
        ref={rowRef}
        className="carousel-container"
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "scroll",
          padding: "4px 16px 12px",
          scrollBehavior: "smooth",
        }}
      >
        {productos.map((producto) => (
          <div
            key={producto.id}
            className={`product-card flex-shrink-0 overflow-hidden flex flex-col${producto.agotado ? " agotado" : ""}`}
            style={{
              width: "200px",
              minWidth: "200px",
              background: "white",
              border: "1px solid rgba(107,45,139,0.18)",
              borderRadius: "14px",
              cursor: "pointer",
            }}
            onClick={() => onProductoClick(producto)}
          >
            {/* Imagen */}
            <div
              style={{
                position: "relative",
                height: "160px",
                borderRadius: "14px 14px 0 0",
                overflow: "hidden",
                background: "linear-gradient(135deg,#1a0a2e,#6B2D8B)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {producto.imagen_url ? (
                <Image
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "44px", opacity: 0.22, userSelect: "none" }}>🌸</span>
              )}
              {producto.agotado && (
                <div className="agotado-overlay">
                  <span className="agotado-label">Agotado</span>
                </div>
              )}
              {!producto.agotado && producto.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    background: BADGE_BG[producto.badge] ?? "#6B2D8B",
                    color: "white",
                    fontSize: "9px",
                    padding: "3px 7px",
                    borderRadius: "4px",
                    fontWeight: 700,
                    zIndex: 1,
                    letterSpacing: "0.06em",
                  }}
                >
                  {producto.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div
              style={{
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: "#1A1A1A",
                  fontSize: "16px",
                  lineHeight: 1.3,
                  marginBottom: "3px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {producto.nombre}
              </h3>
              <p style={{ color: "rgba(26,26,26,0.45)", fontSize: "11px", marginBottom: "10px" }}>
                {producto.tamano ? `${producto.tamano} · ` : ""}
                {producto.categorias?.nombre}
              </p>

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      color: "#6B2D8B",
                      fontSize: "18px",
                      fontWeight: 300,
                    }}
                  >
                    {formatPrecio(producto.precio)}
                  </span>
                  {producto.precio_oferta && (
                    <span
                      style={{
                        color: "rgba(26,26,26,0.38)",
                        fontSize: "10px",
                        textDecoration: "line-through",
                      }}
                    >
                      {formatPrecio(producto.precio_oferta)}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (producto.agotado) return;
                    onAddToCart(producto);
                  }}
                  disabled={producto.agotado}
                  style={{
                    background: producto.agotado ? "#9ca3af" : "#6B2D8B",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "6px 10px",
                    borderRadius: "9999px",
                    border: "none",
                    cursor: producto.agotado ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {producto.agotado ? "Agotado" : "🛒"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [marcaActivaBar, setMarcaActivaBar] = useState<string>("");
  const [busqueda, setBusqueda] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const brandBarRef = useRef<HTMLDivElement>(null);
  const { addItem, count } = useCart();

  const [banners, setBanners] = useState<string[]>([
    "/banner-01-coloracion.jpg",
    "/banner-02-marcas.jpg",
    "/banner-03-italicare-quebradizo.jpg",
    "/banner-04-italicare-normal.jpg",
    "/banner-05-italicare-linea.jpg",
    "/banner-06-equilibrium.jpg",
  ]);
  const [bannerActual, setBannerActual] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerActual((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    async function cargarDatos() {
      const [{ data: prods }, { data: cats }, { data: bans }, { data: mrcs }] =
        await Promise.all([
          supabase
            .from("productos")
            .select("*, marcas(nombre), categorias(nombre)")
            .eq("activo", true)
            .order("nombre", { ascending: true }),
          supabase.from("categorias").select("*").order("nombre"),
          supabase.from("banners").select("imagen_url").eq("activo", true).order("orden"),
          supabase.from("marcas").select("*").order("nombre"),
        ]);
      setProductos(prods || []);
      setCategorias(cats || []);
      setMarcas(mrcs || []);
      if (bans && bans.length > 0) {
        setBanners(bans.map((b: { imagen_url: string }) => b.imagen_url));
      }
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const masVendidos = productos.filter((p) => p.mas_vendido);

  const filtrados = productos.filter((p) => {
    const nombreCat = p.categorias?.nombre ?? "";
    const matchCategoria =
      categoriaActiva === "Todas" || nombreCat === categoriaActiva;
    const matchBusqueda =
      busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.marcas?.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  // Agrupar productos por marca (solo marcas con productos visibles)
  const filasPorMarca = marcas
    .map((marca) => ({
      marca,
      productos: filtrados.filter((p) => p.marcas?.nombre === marca.nombre),
    }))
    .filter(({ productos }) => productos.length > 0);

  // Productos sin marca asignada (o cuya marca no calza con ninguna registrada):
  // se muestran igual en una fila aparte para no perder publicaciones.
  const nombresConFila = new Set(marcas.map((m) => m.nombre));
  const sinMarca = filtrados.filter((p) => !p.marcas?.nombre || !nombresConFila.has(p.marcas.nombre));
  if (sinMarca.length > 0) {
    filasPorMarca.push({
      marca: { id: -1, nombre: "Otros productos", slug: "otros" },
      productos: sinMarca,
    });
  }

  // Auto-scroll carrusel "Más vendidos"
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    let isPaused = false;
    const autoScroll = setInterval(() => {
      if (isPaused) return;
      const cardWidth = 248;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll - 10) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollTo({ left: carousel.scrollLeft + cardWidth, behavior: "smooth" });
      }
    }, 2500);
    carousel.addEventListener("mouseenter", () => { isPaused = true; });
    carousel.addEventListener("mouseleave", () => { isPaused = false; });
    return () => clearInterval(autoScroll);
  }, [masVendidos.length]);

  function scrollCarousel(direction: "left" | "right") {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: direction === "right" ? 248 : -248, behavior: "smooth" });
  }

  function seleccionarCategoria(nombre: string) {
    setCategoriaActiva(nombre);
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToMarca(slug: string, nombre: string) {
    setMarcaActivaBar(nombre);
    const el = document.getElementById(`marca-${slug}`);
    if (el) {
      // offset por el header sticky (~130px navbar + brand bar)
      const y = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  function handleAddToCart(producto: Producto) {
    if (producto.agotado) return;
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precio_oferta: producto.precio_oferta,
      imagen_url: producto.imagen_url,
      tamano: producto.tamano,
      marca: producto.marcas?.nombre,
    });
    setIsCartOpen(true);
  }

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
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Producto cards ── */
        .product-card { transition: box-shadow 0.3s ease, transform 0.3s ease; }
        .product-card:hover { box-shadow: 0 8px 24px rgba(107,45,139,0.22); transform: translateY(-4px); }
        .product-card.agotado { opacity: 0.82; }
        .agotado-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center; z-index: 2;
        }
        .agotado-label {
          background: #C2185B; color: white; font-size: 11px; font-weight: 700;
          padding: 5px 14px; border-radius: 6px; letter-spacing: 0.12em;
          text-transform: uppercase; pointer-events: none;
        }

        /* ── Inputs ── */
        .search-input::placeholder { color: rgba(26,26,26,0.4); }
        .search-input:focus { outline: none; border-color: #6B2D8B; }

        /* ── Carrusel ── */
        .carousel-container { -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .carousel-container::-webkit-scrollbar { display: none; }
        .carousel-arrow:hover { background: #6B2D8B !important; color: white !important; }

        /* ── Brand bar ── */
        .brand-bar { -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .brand-bar::-webkit-scrollbar { display: none; }
        .brand-tab {
          padding: 9px 18px; font-size: 13px; font-weight: 500;
          border: none; background: transparent; cursor: pointer;
          border-bottom: 2px solid transparent; white-space: nowrap;
          color: #555; transition: all 0.2s; letter-spacing: 0.03em;
          flex-shrink: 0;
        }
        .brand-tab:hover { color: #6B2D8B; }
        .brand-tab.active { color: #6B2D8B; border-bottom-color: #6B2D8B; font-weight: 700; }

        /* ── Sidebar categorías ── */
        .sidebar-cat {
          padding: 10px 20px; font-size: 13px; color: #555555;
          cursor: pointer; border-left: 3px solid transparent;
          transition: all 0.2s; background: transparent;
          border-top: none; border-right: none; border-bottom: none;
          text-align: left; width: 100%;
        }
        .sidebar-cat:hover  { color: #6B2D8B; border-left-color: #6B2D8B; background: rgba(107,45,139,0.06); }
        .sidebar-cat.active { color: #6B2D8B; border-left-color: #6B2D8B; background: rgba(107,45,139,0.06); font-weight: 600; }

        /* ── Mobile chips ── */
        .mobile-chip {
          padding: 6px 14px; font-size: 13px; border-radius: 9999px; cursor: pointer;
          border: 1px solid #6B2D8B; white-space: nowrap; transition: all 0.2s;
          background: white; color: #6B2D8B;
        }
        .mobile-chip.active { background: #6B2D8B; color: white; }

        /* ── Layout responsivo ── */
        .main-layout   { display: flex; }
        .sidebar       { width: 200px; min-height: 100vh; background: #FFFFFF; position: sticky;
                         top: 0; padding-top: 20px; border-right: 1px solid rgba(107,45,139,0.15);
                         z-index: 10; display: flex; flex-direction: column; flex-shrink: 0;
                         max-height: 100vh; overflow-y: auto; }
        .main-content  { flex: 1; min-width: 0; overflow: hidden; }
        .mobile-cats   { display: none; }

        /* Hero split */
        .hero-split    { display: flex; height: 460px; width: 100%; }
        .hero-half     { width: 50%; height: 100%; position: relative; overflow: hidden; }

        /* ── Tablet (< 1024px) ── */
        @media (max-width: 1024px) {
          .sidebar      { display: none; }
          .mobile-cats  { display: flex; }
        }

        /* ── Mobile (< 640px) ── */
        @media (max-width: 640px) {
          .hero-split   { flex-direction: column; height: auto; }
          .hero-half    { width: 100%; height: 240px; }
          .hero-half.video-half { height: 280px; }
          .nav-logo     { width: 160px !important; height: 48px !important; }
          .wa-btn-text  { display: none; }
          .wa-btn       { padding: 10px 12px !important; border-radius: 50% !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50" style={{ borderBottom: "1px solid rgba(107,45,139,0.2)" }}>
        {/* Barra de navegación principal */}
        <nav
          className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4"
          style={{
            background: "linear-gradient(to right, #FFFFFF 0%, #6B2D8B 100%)",
            minHeight: "64px",
          }}
        >
          <Link href="/" className="shrink-0" style={{ paddingTop: 6, paddingBottom: 6, overflow: "visible" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                animation: "shimmer 3s ease-in-out infinite",
                cursor: "pointer",
              }}
            >
              <Image
                src="/logo-final.png"
                alt="El Dólar Perfumería"
                width={200}
                height={60}
                className="nav-logo"
                priority
                style={{ width: 200, height: "auto" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "40%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  animation: "slideShine 3s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center" style={{ gap: "24px" }}>
            {[
              { href: "/",        label: "Inicio"   },
              { href: "/catalog", label: "Catálogo" },
              { href: "#nosotros",label: "Nosotros" },
            ].reduce<React.ReactNode[]>((acc, link, i) => [
              ...acc,
              ...(i > 0
                ? [
                    <span key={`sep-${i}`} className="select-none pointer-events-none" style={{ color: "#6B2D8B" }}>
                      |
                    </span>,
                  ]
                : []),
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#6B2D8B] transition-colors duration-200"
                style={{ fontSize: "14px", letterSpacing: "0.08em", fontWeight: 500, color: "#1A1A1A" }}
              >
                {link.label}
              </Link>,
            ], [])}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "22px",
                color: "#1A1A1A",
                padding: "4px 8px",
                lineHeight: 1,
              }}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            {/* Carrito */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                position: "relative",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "22px",
                padding: "6px",
                lineHeight: 1,
              }}
            >
              🛒
              {count > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "#C2185B",
                    color: "white",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {count}
                </span>
              )}
            </button>

            <a
              href="https://wa.me/56991793563?text=Hola!%20Me%20interesa%20conocer%20sus%20productos%20disponibles."
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 wa-btn"
              style={{
                background: "#25D366",
                color: "#ffffff",
                animation: "pulse-wa 2s ease-in-out infinite",
                borderRadius: "25px",
                padding: "9px 16px",
                fontWeight: "600",
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              💬 <span className="wa-btn-text">WhatsApp</span>
            </a>
          </div>
        </nav>

        {/* ── Barra de marcas (franja delgada blanca) ── */}
        <div
          ref={brandBarRef}
          className="brand-bar"
          style={{
            background: "white",
            borderBottom: "1px solid rgba(107,45,139,0.12)",
            display: "flex",
            overflowX: "auto",
            padding: "0 8px",
          }}
        >
          {/* "Todas" como primera opción */}
          <button
            className={`brand-tab${marcaActivaBar === "" ? " active" : ""}`}
            onClick={() => {
              setMarcaActivaBar("");
              document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Todas
          </button>

          {marcas.map((marca) => (
            <button
              key={marca.id}
              className={`brand-tab${marcaActivaBar === marca.nombre ? " active" : ""}`}
              onClick={() => scrollToMarca(marca.slug, marca.nombre)}
            >
              {marca.nombre}
            </button>
          ))}
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div style={{ background: "#1A0A2E", padding: "16px" }}>
            {[
              { href: "/", label: "Inicio" },
              { href: "/catalog", label: "Catálogo" },
              { href: "#nosotros", label: "Nosotros" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 8px",
                  color: "#E5E5E5",
                  fontSize: "15px",
                  letterSpacing: "0.08em",
                  borderBottom: "1px solid rgba(107,45,139,0.2)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── Layout: sidebar + contenido ── */}
      <div className="main-layout">

        {/* Sidebar (solo desktop) */}
        <aside className="sidebar">
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              color: "#6B2D8B",
              padding: "0 20px 8px",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Categorías
          </p>
          <button
            className={`sidebar-cat${categoriaActiva === "Todas" ? " active" : ""}`}
            onClick={() => seleccionarCategoria("Todas")}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              className={`sidebar-cat${categoriaActiva === cat.nombre ? " active" : ""}`}
              onClick={() => seleccionarCategoria(cat.nombre)}
            >
              {cat.nombre}
            </button>
          ))}

          <div style={{ height: "1px", background: "rgba(107,45,139,0.12)", margin: "16px 16px 4px" }} />

          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              color: "#6B2D8B",
              padding: "12px 20px 8px",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Síguenos
          </p>
          <a
            href="https://instagram.com/perfumeriaeldolar18"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 20px",
              fontSize: "13px",
              color: "#6B2D8B",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            📷 Instagram
          </a>
          <a
            href="https://facebook.com/PerfumeriaElDolar"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 20px",
              fontSize: "13px",
              color: "#6B2D8B",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            📘 Facebook
          </a>

          <div style={{ marginTop: "auto", padding: "16px" }}>
            <a
              href="https://wa.me/56991793563"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "#25D366",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              💬 +56 9 9179 3563
            </a>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="main-content">

          {/* ── Hero + Slideshow ── */}
          <div className="hero-split">
            {/* Slideshow */}
            <div className="hero-half" style={{ background: "#0A0A0A" }}>
              {banners.map((src, i) => (
                <div
                  key={src}
                  style={{
                    position: "absolute",
                    inset: 0,
                    transition: "opacity 0.8s ease",
                    opacity: i === bannerActual ? 1 : 0,
                    pointerEvents: i === bannerActual ? "auto" : "none",
                  }}
                >
                  <Image
                    src={src}
                    alt={`Banner ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    priority={i === 0}
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setBannerActual((prev) => (prev - 1 + banners.length) % banners.length)
                }
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.4)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  fontSize: "16px",
                  cursor: "pointer",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ←
              </button>
              <button
                onClick={() =>
                  setBannerActual((prev) => (prev + 1) % banners.length)
                }
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.4)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  fontSize: "16px",
                  cursor: "pointer",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                →
              </button>
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  gap: "6px",
                  zIndex: 2,
                }}
              >
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBannerActual(i)}
                    style={{
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      height: "6px",
                      borderRadius: "4px",
                      transition: "all 0.3s",
                      width: i === bannerActual ? "20px" : "6px",
                      background:
                        i === bannerActual ? "#6B2D8B" : "rgba(255,255,255,0.5)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Video hero */}
            <div className="hero-half video-half">
              <video
                src="/hero-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(10,0,20,0.35) 0%, rgba(107,45,139,0.25) 100%)",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "0 24px",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#A855C9",
                    marginBottom: "16px",
                  }}
                >
                  Belleza y fragancias · Punta Arenas
                </p>
                <h1
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(26px, 4vw, 60px)",
                    fontWeight: 300,
                    color: "white",
                    marginBottom: "16px",
                    lineHeight: 1.2,
                    animation: "fadeSlideUp 0.8s ease forwards",
                  }}
                >
                  Fragancias que
                  <br />
                  <em>te definen</em>
                </h1>
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "clamp(13px, 1.5vw, 16px)",
                    lineHeight: 1.6,
                    maxWidth: "360px",
                    marginBottom: "24px",
                    opacity: 0,
                    animation: "fadeSlideUp 0.8s ease 0.2s forwards",
                  }}
                >
                  Productos de belleza, cosmética y cuidado capilar. Tinturas
                  profesionales, perfumes nacionales e importados.
                </p>
                <a
                  href="#productos"
                  style={{
                    display: "inline-block",
                    background: "#6B2D8B",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "12px 24px",
                    borderRadius: "9999px",
                    textDecoration: "none",
                    opacity: 0,
                    animation: "fadeSlideUp 0.8s ease 0.4s forwards",
                  }}
                >
                  Ver productos
                </a>
              </div>
            </div>
          </div>

          {/* ── Chips móvil (ocultos en desktop) ── */}
          <div
            className="mobile-cats carousel-container"
            style={{
              overflowX: "auto",
              padding: "12px 16px",
              gap: "8px",
              background: "white",
              borderBottom: "1px solid rgba(107,45,139,0.1)",
            }}
          >
            {[{ id: 0, nombre: "Todas" }, ...categorias].map((cat) => (
              <button
                key={cat.id}
                className={`mobile-chip${categoriaActiva === cat.nombre ? " active" : ""}`}
                onClick={() => seleccionarCategoria(cat.nombre)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* ── Carrusel Más Vendidos ── */}
          {(loading || masVendidos.length > 0) && (
            <section style={{ background: "#FFFFFF", padding: "32px 0 28px" }}>
              <div style={{ padding: "0 16px" }}>
                <p style={{ color: "#1A1A1A", fontSize: "20px", fontWeight: 700, marginBottom: "2px" }}>
                  🔥 Más Vendidos
                </p>
                <p style={{ color: "rgba(26,26,26,0.5)", fontSize: "13px", marginBottom: "16px" }}>
                  Los favoritos de nuestros clientes
                </p>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#6B2D8B" }}>
                    Cargando...
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => scrollCarousel("left")}
                      className="carousel-arrow"
                      style={{
                        background: "rgba(107,45,139,0.1)",
                        color: "#6B2D8B",
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        cursor: "pointer",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 0.2s",
                      }}
                    >
                      ←
                    </button>
                    <div
                      ref={carouselRef}
                      className="carousel-container"
                      style={{
                        display: "flex",
                        gap: "12px",
                        overflowX: "scroll",
                        scrollBehavior: "smooth",
                        flex: 1,
                      }}
                    >
                      {masVendidos.map((producto) => (
                        <div
                          key={producto.id}
                          className="product-card flex-shrink-0 overflow-hidden flex flex-col"
                          style={{
                            width: "200px",
                            background: "white",
                            border: "1px solid rgba(107,45,139,0.2)",
                            borderRadius: "14px",
                            cursor: "pointer",
                          }}
                          onClick={() => setProductoSeleccionado(producto)}
                        >
                          <div
                            style={{
                              position: "relative",
                              height: "150px",
                              borderRadius: "14px 14px 0 0",
                              overflow: "hidden",
                              background: "linear-gradient(135deg,#1a0a2e,#6B2D8B)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {producto.imagen_url ? (
                              <Image
                                src={producto.imagen_url}
                                alt={producto.nombre}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <span style={{ fontSize: "44px", opacity: 0.22, userSelect: "none" }}>
                                🌸
                              </span>
                            )}
                            <span
                              style={{
                                position: "absolute",
                                top: "8px",
                                left: "8px",
                                background: "#C2185B",
                                color: "white",
                                fontSize: "9px",
                                padding: "3px 7px",
                                borderRadius: "4px",
                                fontWeight: 700,
                                zIndex: 1,
                              }}
                            >
                              TOP
                            </span>
                          </div>
                          <div
                            style={{ padding: "12px", display: "flex", flexDirection: "column", flex: 1 }}
                          >
                            <span
                              style={{
                                color: "#A855C9",
                                fontSize: "10px",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                marginBottom: "3px",
                              }}
                            >
                              {producto.marcas?.nombre}
                            </span>
                            <h3
                              style={{
                                fontFamily: "var(--font-cormorant)",
                                color: "#1A1A1A",
                                fontSize: "16px",
                                lineHeight: 1.3,
                                marginBottom: "4px",
                              }}
                            >
                              {producto.nombre}
                            </h3>
                            <p style={{ color: "rgba(26,26,26,0.45)", fontSize: "11px", marginBottom: "10px" }}>
                              {producto.tamano ? `${producto.tamano} · ` : ""}{producto.categorias?.nombre}
                            </p>
                            <div
                              style={{
                                marginTop: "auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "6px",
                              }}
                            >
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span
                                  style={{
                                    fontFamily: "var(--font-cormorant)",
                                    color: "#6B2D8B",
                                    fontSize: "18px",
                                    fontWeight: 300,
                                  }}
                                >
                                  {formatPrecio(producto.precio)}
                                </span>
                                {producto.precio_oferta && (
                                  <span
                                    style={{
                                      color: "rgba(26,26,26,0.38)",
                                      fontSize: "10px",
                                      textDecoration: "line-through",
                                    }}
                                  >
                                    {formatPrecio(producto.precio_oferta)}
                                  </span>
                                )}
                              </div>
                              <a
                                href={`https://wa.me/56991793563?text=Hola!%20Me%20interesa%20${encodeURIComponent(producto.nombre)}${producto.tamano ? `%20(${encodeURIComponent(producto.tamano)})` : ""}.%20%C2%BFEst%C3%A1%20disponible%3F`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  background: "#6B2D8B",
                                  color: "white",
                                  fontSize: "10px",
                                  fontWeight: 600,
                                  padding: "5px 8px",
                                  borderRadius: "9999px",
                                  textDecoration: "none",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                💬
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => scrollCarousel("right")}
                      className="carousel-arrow"
                      style={{
                        background: "rgba(107,45,139,0.1)",
                        color: "#6B2D8B",
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        cursor: "pointer",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 0.2s",
                      }}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Sección de productos por marca (estilo Netflix) ── */}
          <section id="productos" style={{ background: "#FAFAFA" }}>
            {/* Encabezado de sección + buscador */}
            <div
              style={{
                padding: "32px 16px 16px",
                background: "white",
                borderBottom: "1px solid rgba(107,45,139,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#6B2D8B",
                  marginBottom: "4px",
                }}
              >
                Selección especial
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 300,
                  color: "#1A1A1A",
                  marginBottom: "16px",
                }}
              >
                Nuestros productos
              </h2>
              <input
                type="text"
                placeholder="Buscar producto o marca..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
                style={{
                  background: "white",
                  border: "1px solid #6B2D8B",
                  color: "#1A1A1A",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  fontSize: "14px",
                  width: "100%",
                  maxWidth: "340px",
                  display: "block",
                }}
              />
            </div>

            {/* Filas de marcas */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "64px", color: "#6B2D8B" }}>
                <p>Cargando productos...</p>
              </div>
            ) : filasPorMarca.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px", color: "#6B2D8B" }}>
                <p style={{ fontSize: "48px", marginBottom: "12px" }}>✨</p>
                <p>No hay productos en esta categoría aún.</p>
              </div>
            ) : (
              <div style={{ background: "white" }}>
                {filasPorMarca.map(({ marca, productos: prods }) => (
                  <BrandRow
                    key={marca.id}
                    marca={marca}
                    productos={prods}
                    onProductoClick={setProductoSeleccionado}
                    onAddToCart={handleAddToCart}
                  />
                ))}
                {/* Espacio final */}
                <div style={{ height: "32px" }} />
              </div>
            )}
          </section>

          {/* ── Nosotros ── */}
          <section
            id="nosotros"
            style={{
              position: "relative",
              padding: "80px 24px",
              backgroundImage: "url('/tienda-fachada.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 0 }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "700px",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#A855C9",
                  marginBottom: "16px",
                }}
              >
                Nuestra historia
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(28px, 5vw, 42px)",
                  fontWeight: 300,
                  color: "white",
                  marginBottom: "20px",
                }}
              >
                Sobre nosotros
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "clamp(14px, 2vw, 17px)",
                  lineHeight: 1.75,
                  marginBottom: "16px",
                }}
              >
                En{" "}
                <strong style={{ color: "white" }}>El Dólar Beauty Store</strong> creemos
                que la belleza debe ser accesible para todos. Ofrecemos productos de belleza,
                cosmética y cuidado capilar de las mejores marcas nacionales e importadas.
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "clamp(13px, 1.8vw, 15px)",
                  lineHeight: 1.75,
                }}
              >
                Variedad en tinturas profesionales, perfumes y cuidado personal.
                Encuéntranos en{" "}
                <strong style={{ color: "rgba(255,255,255,0.8)" }}>
                  Martínez de Aldunate 1915, Punta Arenas
                </strong>
                . Consulta por WhatsApp y te asesoramos sin costo.
              </p>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer style={{ background: "#1A1A1A", borderTop: "1px solid rgba(107,45,139,0.2)" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "22px",
                    fontStyle: "italic",
                    color: "white",
                  }}
                >
                  El Dólar Perfumería
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                  Martínez de Aldunate 1915 · Punta Arenas
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {[
                    { href: "https://instagram.com/perfumeriaeldolar18", label: "Instagram" },
                    { href: "https://wa.me/56991793563", label: "WhatsApp" },
                    { href: "https://facebook.com/PerfumeriaElDolar", label: "Facebook" },
                  ].map((s, i, arr) => (
                    <span key={s.href} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "11px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                        }}
                      >
                        {s.label}
                      </a>
                      {i < arr.length - 1 && (
                        <span style={{ color: "#6B2D8B", fontSize: "11px" }}>·</span>
                      )}
                    </span>
                  ))}
                </div>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>
                  © {new Date().getFullYear()} El Dólar Perfumería · Todos los derechos reservados
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.3)",
                    borderTop: "0.5px solid rgba(255,255,255,0.1)",
                    paddingTop: "12px",
                    letterSpacing: "0.08em",
                  }}
                >
                  Desarrollado por{" "}
                  <a
                    href="https://gutierrezinnovaciones.cl"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "underline" }}
                  >
                    GUTIERREZ INNOVACIONES CL
                  </a>
                </p>
              </div>
            </div>
          </footer>

        </div>{/* fin main-content */}
      </div>{/* fin main-layout */}

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {productoSeleccionado && (
        <ProductModal
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          onAgregar={() => {
            setProductoSeleccionado(null);
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Botón WhatsApp flotante */}
      <a
        href="https://wa.me/56991793563"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          background: "#25D366",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          animation: "pulse-wa 2s ease-in-out infinite",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        💬
      </a>
    </>
  );
}
