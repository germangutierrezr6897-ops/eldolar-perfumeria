"use client";

import { useState } from "react";
import type { Producto } from "@/lib/products";

const MARCAS = ["Todos", "Chanel", "Dior", "Tom Ford", "Carolina Herrera"];
const CATEGORIAS = ["Todos", "Floral", "Oriental", "Amaderado", "Unisex"];

const GRADIENTS = [
  "linear-gradient(135deg, #fce7eb, #f9c1cf)",
  "linear-gradient(135deg, #fad1d8, #f4b3c3)",
  "linear-gradient(135deg, #f9d4e8, #f2a7c3)",
  "linear-gradient(135deg, #fce0e9, #f7bfcc)",
  "linear-gradient(135deg, #fad8e7, #f0a8c0)",
  "linear-gradient(135deg, #f8d7da, #e8849a)",
  "linear-gradient(135deg, #fce4ed, #f9c1d8)",
  "linear-gradient(135deg, #f7d4e0, #f2a7b8)",
  "linear-gradient(135deg, #fbe0ec, #f4b0ca)",
  "linear-gradient(135deg, #f8dde6, #eda7bc)",
  "linear-gradient(135deg, #fcdee9, #f7c0d2)",
  "linear-gradient(135deg, #f9d6e3, #f0a5bc)",
];

const CATEGORIA_EMOJI: Record<string, string> = {
  Floral: "🌸",
  Oriental: "✨",
  Amaderado: "🌿",
  Unisex: "💎",
};

function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-CL")}`;
}

interface Props {
  productos: Producto[];
}

export default function FilteredProducts({ productos }: Props) {
  const [marcaActiva, setMarcaActiva] = useState("Todos");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  const filtrados = productos.filter(
    (p) =>
      (marcaActiva === "Todos" || p.marca === marcaActiva) &&
      (categoriaActiva === "Todos" || p.categoria === categoriaActiva)
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Filtros */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs tracking-widest uppercase text-gray-400 mr-1 shrink-0">
            Marca
          </span>
          {MARCAS.map((marca) => (
            <button
              key={marca}
              onClick={() => setMarcaActiva(marca)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                marcaActiva === marca
                  ? "bg-[#F2A7B3] border-[#F2A7B3] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#F2A7B3] hover:text-[#D4849A]"
              }`}
            >
              {marca}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs tracking-widest uppercase text-gray-400 mr-1 shrink-0">
            Categoría
          </span>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                categoriaActiva === cat
                  ? "bg-[#F2A7B3] border-[#F2A7B3] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#F2A7B3] hover:text-[#D4849A]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid o vacío */}
      {filtrados.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🌸</p>
          <p className="text-lg">No hay productos con ese filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((producto, index) => (
            <div
              key={producto.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#F8D7DA] hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Imagen placeholder */}
              <div
                className="w-full aspect-square flex items-center justify-center"
                style={{ background: GRADIENTS[index % GRADIENTS.length] }}
              >
                <span className="text-7xl opacity-30 select-none">
                  {CATEGORIA_EMOJI[producto.categoria] ?? "🌸"}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs tracking-widest uppercase text-[#D4849A] mb-1">
                  {producto.marca}
                </span>
                <h3
                  className="text-xl text-gray-800 mb-1 leading-tight"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {producto.nombre}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {producto.ml} ml · {producto.categoria}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <span
                    className="text-2xl font-light text-gray-800"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {formatPrecio(producto.precio)}
                  </span>
                  <a
                    href={`https://wa.me/56900000000?text=Hola!%20Me%20interesa%20el%20perfume%20${encodeURIComponent(
                      producto.nombre
                    )}%20(${producto.ml}ml).%20%C2%BFEst%C3%A1%20disponible%3F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-[#F2A7B3] hover:bg-[#D4849A] text-white text-xs font-medium px-3 py-2 rounded-full transition-colors duration-200 whitespace-nowrap"
                  >
                    💬 Consultar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
