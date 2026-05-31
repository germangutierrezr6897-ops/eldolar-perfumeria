"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";

function formatPrecio(n: number) {
  return `$${n.toLocaleString("es-CL")}`;
}

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateCantidad, clearCart, total, count } = useCart();

  function generarMensajeWA() {
    if (items.length === 0) return;

    const lineas = items.map((item) => {
      const precio = formatPrecio(item.precio * item.cantidad);
      const tamano = item.tamano ? ` (${item.tamano})` : "";
      return `• ${item.nombre}${tamano} x${item.cantidad} → ${precio}`;
    }).join("\n");

    const mensaje =
      `Hola! Me gustaría realizar el siguiente pedido:\n\n` +
      `🛍️ *MI PEDIDO:*\n${lineas}\n\n` +
      `💰 *Total estimado: ${formatPrecio(total)}*\n\n` +
      `¿Pueden confirmar disponibilidad y coordinar el pago? ¡Gracias!`;

    const url = `https://wa.me/56991793563?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  }

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 998 }} />

      {/* Drawer */}
      <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "100%", maxWidth: "420px",
        background: "white", zIndex: 999, display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.15)" }}>

        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(107,45,139,0.12)",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
              🛒 Mi carrito
            </h2>
            <p style={{ fontSize: "13px", color: "#888", margin: "2px 0 0" }}>
              {count} {count === 1 ? "producto" : "productos"}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px",
            cursor: "pointer", color: "#666", padding: "4px" }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
              <p style={{ fontSize: "40px", marginBottom: "12px" }}>🛒</p>
              <p style={{ fontSize: "15px" }}>Tu carrito está vacío</p>
              <p style={{ fontSize: "13px", marginTop: "6px" }}>Agrega productos para continuar</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "12px", padding: "12px",
                  background: "#fafafa", borderRadius: "12px", border: "1px solid rgba(107,45,139,0.1)" }}>

                  {/* Imagen */}
                  <div style={{ width: 64, height: 64, borderRadius: "8px", overflow: "hidden",
                    background: "linear-gradient(135deg,#1a0a2e,#6B2D8B)", flexShrink: 0, position: "relative" }}>
                    {item.imagen_url
                      ? <Image src={item.imagen_url} alt={item.nombre} fill style={{ objectFit: "cover" }} />
                      : <span style={{ fontSize: "28px", display: "flex", alignItems: "center",
                          justifyContent: "center", height: "100%", opacity: 0.4 }}>🌸</span>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A1A",
                      margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.nombre}
                    </p>
                    {item.marca && (
                      <p style={{ fontSize: "11px", color: "#A855C9", textTransform: "uppercase",
                        letterSpacing: "0.06em", margin: "0 0 6px" }}>{item.marca}</p>
                    )}
                    {item.tamano && (
                      <p style={{ fontSize: "11px", color: "#888", margin: "0 0 6px" }}>{item.tamano}</p>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      {/* Cantidad */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button onClick={() => updateCantidad(item.id, item.cantidad - 1)}
                          style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(107,45,139,0.3)",
                            background: "white", color: "#6B2D8B", cursor: "pointer", fontSize: "16px",
                            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>−</button>
                        <span style={{ fontSize: "14px", fontWeight: 600, minWidth: "20px", textAlign: "center" }}>
                          {item.cantidad}
                        </span>
                        <button onClick={() => updateCantidad(item.id, item.cantidad + 1)}
                          style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(107,45,139,0.3)",
                            background: "white", color: "#6B2D8B", cursor: "pointer", fontSize: "16px",
                            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>+</button>
                      </div>

                      {/* Precio + eliminar */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#6B2D8B" }}>
                          {formatPrecio(item.precio * item.cantidad)}
                        </span>
                        <button onClick={() => removeItem(item.id)}
                          style={{ background: "none", border: "none", cursor: "pointer",
                            color: "#C2185B", fontSize: "16px", padding: "2px" }}>🗑</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "16px 20px 24px", borderTop: "1px solid rgba(107,45,139,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "15px", color: "#555" }}>Total estimado</span>
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#6B2D8B" }}>
                {formatPrecio(total)}
              </span>
            </div>

            <button onClick={generarMensajeWA}
              style={{ width: "100%", background: "#25D366", color: "white", border: "none",
                borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginBottom: "10px" }}>
              💬 Enviar pedido por WhatsApp
            </button>

            <button onClick={clearCart}
              style={{ width: "100%", background: "transparent", color: "#C2185B",
                border: "1px solid rgba(194,24,91,0.3)", borderRadius: "12px", padding: "10px",
                fontSize: "13px", cursor: "pointer" }}>
              Vaciar carrito
            </button>

            <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center", marginTop: "10px" }}>
              El personal de la tienda confirmará disponibilidad y coordinará el pago.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
