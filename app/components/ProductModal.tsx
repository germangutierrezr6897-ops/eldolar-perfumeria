"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import type { Producto } from "@/lib/supabase";

function formatPrecio(n: number) {
  return `$${n.toLocaleString("es-CL")}`;
}

const BADGE_BG: Record<string, string> = {
  NUEVO:  "#6B2D8B",
  OFERTA: "#C2185B",
  TOP:    "#C2185B",
};

export default function ProductModal({
  producto,
  onClose,
  onAgregar,
}: {
  producto: Producto;
  onClose: () => void;
  onAgregar: () => void;
}) {
  const { addItem } = useCart();

  function handleAgregar() {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precio_oferta: producto.precio_oferta,
      imagen_url: producto.imagen_url,
      tamano: producto.tamano,
      marca: producto.marcas?.nombre,
    });
    onAgregar();
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000 }} />

      {/* Modal */}
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 1001, background: "white", borderRadius: "20px", width: "90%", maxWidth: "560px",
        maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>

        {/* Botón cerrar */}
        <button onClick={onClose}
          style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(0,0,0,0.07)",
            border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer",
            fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2, color: "#333" }}>
          ✕
        </button>

        {/* Imagen */}
        <div style={{ position: "relative", height: "320px", borderRadius: "20px 20px 0 0",
          overflow: "hidden", background: "#f8f4fc",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          {producto.imagen_url
            ? <Image src={producto.imagen_url} alt={producto.nombre} fill style={{ objectFit: "contain", padding: "16px" }} />
            : <span style={{ fontSize: "80px", opacity: 0.2 }}>🌸</span>}
          {producto.badge && (
            <span style={{ position: "absolute", top: "14px", left: "14px",
              background: BADGE_BG[producto.badge] ?? "#6B2D8B", color: "white",
              fontSize: "12px", padding: "5px 12px", borderRadius: "6px", fontWeight: 700 }}>
              {producto.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "24px" }}>
          {producto.marcas?.nombre && (
            <p style={{ fontSize: "11px", color: "#A855C9", textTransform: "uppercase",
              letterSpacing: "0.12em", fontWeight: 600, marginBottom: "6px" }}>
              {producto.marcas.nombre}
            </p>
          )}

          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 400,
            color: "#1A1A1A", marginBottom: "8px", lineHeight: 1.2 }}>
            {producto.nombre}
          </h2>

          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
            {[producto.categorias?.nombre, producto.tamano].filter(Boolean).join(" · ")}
          </p>

          {producto.descripcion && (
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.7,
              marginBottom: "20px", borderTop: "1px solid rgba(107,45,139,0.1)",
              paddingTop: "16px" }}>
              {producto.descripcion}
            </p>
          )}

          {/* Precios */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "24px" }}>
            <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "32px",
              fontWeight: 300, color: "#6B2D8B", lineHeight: 1 }}>
              {formatPrecio(producto.precio)}
            </span>
            {producto.precio_oferta && (
              <span style={{ fontSize: "16px", color: "#aaa", textDecoration: "line-through",
                marginBottom: "4px" }}>
                {formatPrecio(producto.precio_oferta)}
              </span>
            )}
          </div>

          {/* Botones */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleAgregar}
              style={{ flex: 1, background: "#6B2D8B", color: "white", border: "none",
                borderRadius: "12px", padding: "14px", fontSize: "14px", fontWeight: 700,
                cursor: "pointer" }}>
              🛒 Agregar al carrito
            </button>
            <a href={`https://wa.me/56991793563?text=Hola!%20Me%20interesa%20${encodeURIComponent(producto.nombre)}${producto.tamano ? `%20(${encodeURIComponent(producto.tamano)})` : ""}.%20%C2%BFEst%C3%A1%20disponible%3F`}
              target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, background: "#25D366", color: "white",
                borderRadius: "12px", padding: "14px", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", textDecoration: "none", display: "flex",
                alignItems: "center", justifyContent: "center" }}>
              💬 Consultar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
