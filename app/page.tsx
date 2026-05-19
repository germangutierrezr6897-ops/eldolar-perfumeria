"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const PRODUCTOS = [
  {
    id: 1,
    nombre: "Chanel N°5",
    marca: "Chanel",
    categoria: "Perfumes y Fragancias",
    precio: 45990,
    ml: 100,
    emoji: "🌸",
    gradient: "linear-gradient(135deg, #1e0a38, #6b2d8b)",
  },
  {
    id: 2,
    nombre: "Dior Sauvage",
    marca: "Dior",
    categoria: "Perfumes y Fragancias",
    precio: 67990,
    ml: 100,
    emoji: "🌸",
    gradient: "linear-gradient(135deg, #120826, #4a1f6b)",
  },
  {
    id: 3,
    nombre: "Base L'Oréal",
    marca: "L'Oréal",
    categoria: "Maquillaje",
    precio: 18990,
    ml: null,
    emoji: "💄",
    gradient: "linear-gradient(135deg, #280a40, #7b3aa0)",
  },
  {
    id: 4,
    nombre: "Labial MAC",
    marca: "MAC",
    categoria: "Maquillaje",
    precio: 22990,
    ml: null,
    emoji: "💄",
    gradient: "linear-gradient(135deg, #1a0830, #5a2585)",
  },
  {
    id: 5,
    nombre: "Crema Facial Nivea",
    marca: "Nivea",
    categoria: "Cuidado del Rostro",
    precio: 12990,
    ml: null,
    emoji: "✨",
    gradient: "linear-gradient(135deg, #200d3a, #6b2d8b)",
  },
  {
    id: 6,
    nombre: "Sérum Neutrogena",
    marca: "Neutrogena",
    categoria: "Cuidado del Rostro",
    precio: 24990,
    ml: null,
    emoji: "✨",
    gradient: "linear-gradient(135deg, #160a2a, #502278)",
  },
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

function formatPrecio(precio: number) {
  return `$${precio.toLocaleString("es-CL")}`;
}

export default function Home() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const filtrados = PRODUCTOS.filter(
    (p) => categoriaActiva === "Todas" || p.categoria === categoriaActiva
  );

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { filter: drop-shadow(0 0 0px rgba(107, 45, 139, 0)) brightness(1); }
          50%  { filter: drop-shadow(0 0 12px rgba(107, 45, 139, 0.8)) brightness(1.15); }
          100% { filter: drop-shadow(0 0 0px rgba(107, 45, 139, 0)) brightness(1); }
        }
        @keyframes slideShine {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(300%) skewX(-15deg); }
        }
        @keyframes pulse-wa {
          0%   { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70%  { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
      `}</style>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#6B2D8B]/30" style={{ background: 'linear-gradient(to right, #6B2D8B 0%, #ffffff 100%)' }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4" style={{ minHeight: '70px' }}>
          <Link href="/" className="shrink-0" style={{ paddingTop: 8, paddingBottom: 8, overflow: 'visible' }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              animation: 'shimmer 3s ease-in-out infinite',
              cursor: 'pointer',
            }}>
              <Image
                src="/logo-final.png"
                alt="El Dólar Beauty Store"
                width={260}
                height={77}
                priority
              />
              <span style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '40%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                animation: 'slideShine 3s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
            </div>
          </Link>

          <div className="hidden md:flex items-center" style={{ gap: '32px' }}>
            <Link
              href="/"
              className="hover:text-[#6B2D8B] transition-colors duration-200"
              style={{ fontSize: '15px', letterSpacing: '0.08em', fontWeight: 500, color: '#1A1A1A' }}
            >
              Inicio
            </Link>
            <span className="select-none pointer-events-none" style={{ color: '#6B2D8B' }}>|</span>
            <Link
              href="/catalog"
              className="hover:text-[#6B2D8B] transition-colors duration-200"
              style={{ fontSize: '15px', letterSpacing: '0.08em', fontWeight: 500, color: '#1A1A1A' }}
            >
              Catálogo
            </Link>
            <span className="select-none pointer-events-none" style={{ color: '#6B2D8B' }}>|</span>
            <Link
              href="#nosotros"
              className="hover:text-[#6B2D8B] transition-colors duration-200"
              style={{ fontSize: '15px', letterSpacing: '0.08em', fontWeight: 500, color: '#1A1A1A' }}
            >
              Nosotros
            </Link>
          </div>

          <a
            href="https://wa.me/56900000000?text=Hola!%20Me%20interesa%20conocer%20sus%20productos%20disponibles."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
            style={{
              background: '#25D366',
              color: '#ffffff',
              animation: 'pulse-wa 2s ease-in-out infinite',
              borderRadius: '25px',
              padding: '10px 20px',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            💬 WhatsApp
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2D1245] to-[#1A1A1A] flex items-center justify-center py-28 px-4 sm:px-6">
        <div className="text-center max-w-2xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#A855C9] mb-6">
            Belleza y fragancias · Santiago de Chile
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Fragancias que
            <br />
            <em>te definen</em>
          </h1>
          <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Descubre nuestra colección de perfumes, maquillaje y cuidado
            personal de las mejores marcas, con envío a todo Chile.
          </p>
          <a
            href="#productos"
            className="inline-block bg-[#6B2D8B] hover:bg-[#4A1F61] text-white text-sm font-medium tracking-widest uppercase px-8 py-4 rounded-full transition-colors duration-200"
          >
            Ver productos
          </a>
        </div>
      </section>

      {/* Productos destacados */}
      <section id="productos" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-4">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6B2D8B] mb-2">
            Selección especial
          </p>
          <h2
            className="text-3xl sm:text-4xl font-light text-gray-800 mb-8"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Productos destacados
          </h2>

          {/* Filtros por categoría */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                  categoriaActiva === cat
                    ? "bg-[#6B2D8B] border-[#6B2D8B] text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#6B2D8B] hover:text-[#6B2D8B]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          {filtrados.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-5xl mb-4">✨</p>
              <p className="text-lg">No hay productos en esta categoría aún.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrados.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#6B2D8B]/40 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div
                    className="w-full aspect-square flex items-center justify-center"
                    style={{ background: producto.gradient }}
                  >
                    <span className="text-7xl opacity-25 select-none">
                      {producto.emoji}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs tracking-widest uppercase text-[#6B2D8B] mb-1">
                      {producto.marca}
                    </span>
                    <h3
                      className="text-xl text-gray-800 mb-1 leading-tight"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {producto.nombre}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {producto.ml ? `${producto.ml} ml · ` : ""}
                      {producto.categoria}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span
                        className="text-2xl font-light text-gray-800"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {formatPrecio(producto.precio)}
                      </span>
                      <a
                        href={`https://wa.me/56900000000?text=Hola!%20Me%20interesa%20${encodeURIComponent(
                          producto.nombre
                        )}${producto.ml ? `%20(${producto.ml}ml)` : ""}.%20%C2%BFEst%C3%A1%20disponible%3F`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#6B2D8B] hover:bg-[#4A1F61] text-white text-xs font-medium px-3 py-2 rounded-full transition-colors duration-200 whitespace-nowrap"
                      >
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

      {/* Nosotros */}
      <section id="nosotros" className="bg-[#1A1A1A] py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#A855C9] mb-4">
            Nuestra historia
          </p>
          <h2
            className="text-3xl sm:text-4xl font-light text-white mb-6"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Sobre nosotros
          </h2>
          <p className="text-white/70 leading-relaxed text-lg mb-4">
            En <strong className="text-white">El Dólar Perfumería</strong> creemos
            que la belleza de lujo debe ser accesible para todas. Ofrecemos
            perfumes, maquillaje y cuidado personal 100% originales de las
            mejores marcas del mundo a precios que te sorprenderán.
          </p>
          <p className="text-white/50 leading-relaxed">
            Todos nuestros productos son importados directamente y vienen con
            garantía de autenticidad. Encuéntranos en{" "}
            <strong className="text-white/70">Martínez de Aldunate 1915</strong>.
            Consulta por WhatsApp y te asesoramos sin costo.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] mt-auto border-t border-[#6B2D8B]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <p
              className="text-2xl italic text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              El Dólar Perfumería
            </p>
            <p className="text-white/40 text-xs tracking-wide">
              Martínez de Aldunate 1915
            </p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <a
                href="https://instagram.com/perfumeriaeldolar18"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-[#A855C9] transition-colors text-xs tracking-widest uppercase"
              >
                Instagram
              </a>
              <span className="text-[#6B2D8B] text-xs">·</span>
              <a
                href="https://wa.me/56900000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-[#A855C9] transition-colors text-xs tracking-widest uppercase"
              >
                WhatsApp
              </a>
              <span className="text-[#6B2D8B] text-xs">·</span>
              <a
                href="https://facebook.com/PerfumeriaElDolar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-[#A855C9] transition-colors text-xs tracking-widest uppercase"
              >
                Facebook
              </a>
            </div>
            <p className="text-xs text-white/20 tracking-wide">
              © {new Date().getFullYear()} El Dólar Perfumería · Todos los
              derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
