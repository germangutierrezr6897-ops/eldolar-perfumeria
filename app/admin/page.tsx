"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { Producto, Categoria, Marca } from "@/lib/supabase";
import {
  getProductos, crearProducto, actualizarProducto, eliminarProducto,
  getCategorias, crearCategoria, actualizarCategoria, eliminarCategoria,
  getMarcas, crearMarca, actualizarMarca, eliminarMarca,
  getBanners, crearBanner, actualizarOrdenBanner, toggleBannerActivo, eliminarBanner,
} from "./actions";
import type { Banner } from "./actions";

// ── Tipos locales ─────────────────────────────────────────────────────────────

type Tab = "productos" | "categorias" | "marcas" | "banners";

type FormProducto = {
  nombre: string;
  descripcion: string;
  marca_id: string;
  categoria_id: string;
  precio: string;
  precio_oferta: string;
  tamano: string;
  badge: string;
  imagen_url: string;
  activo: boolean;
  destacado: boolean;
  mas_vendido: boolean;
  agotado: boolean;
};

type FormCatMarca = {
  nombre: string;
  slug: string;
};

const FORM_PRODUCTO_VACIO: FormProducto = {
  nombre: "", descripcion: "", marca_id: "", categoria_id: "",
  precio: "", precio_oferta: "", tamano: "", badge: "",
  imagen_url: "", activo: true, destacado: false, mas_vendido: false, agotado: false,
};

const FORM_CAT_VACIO: FormCatMarca = { nombre: "", slug: "" };

// ── Cloudinary upload ─────────────────────────────────────────────────────────

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "eldolar_preset");
  formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error(data.error?.message ?? "Error al subir imagen");
  return data.secure_url;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrecio(n: number) {
  return `$${n.toLocaleString("es-CL")}`;
}

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ══════════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_session") === "ok") {
      setAutenticado(true);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loginUser === "administrador" && loginPass === "30052026") {
      localStorage.setItem("admin_session", "ok");
      setAutenticado(true);
    } else {
      setLoginError("Usuario o contraseña incorrectos.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_session");
    setAutenticado(false);
  }

  if (!autenticado) return <LoginScreen user={loginUser} pass={loginPass}
    error={loginError} setUser={setLoginUser} setPass={setLoginPass} onSubmit={handleLogin} />;

  return <Panel onLogout={handleLogout} />;
}

// ── Login ─────────────────────────────────────────────────────────────────────

function LoginScreen({ user, pass, error, setUser, setPass, onSubmit }: {
  user: string; pass: string; error: string;
  setUser: (v: string) => void; setPass: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={onSubmit}
        style={{ background: "white", borderRadius: "16px", padding: "40px 36px", width: "100%", maxWidth: "380px",
          boxShadow: "0 8px 32px rgba(107,45,139,0.12)", border: "1px solid rgba(107,45,139,0.12)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Image src="/logo-final.png" alt="El Dólar Perfumería" width={180} height={53} style={{ margin: "0 auto 12px" }} priority />
          <p style={{ color: "#6B2D8B", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Panel de Administración
          </p>
        </div>

        <label style={labelStyle}>Usuario</label>
        <input value={user} onChange={e => setUser(e.target.value)} autoComplete="username"
          style={inputStyle} placeholder="admin" />

        <label style={labelStyle}>Contraseña</label>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} autoComplete="current-password"
          style={{ ...inputStyle, marginBottom: error ? "8px" : "24px" }} placeholder="••••••••" />

        {error && <p style={{ color: "#C2185B", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}

        <button type="submit"
          style={{ width: "100%", background: "#6B2D8B", color: "white", border: "none", borderRadius: "8px",
            padding: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}

// ── Panel principal ───────────────────────────────────────────────────────────

function Panel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("productos");

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      {/* Navbar */}
      <header style={{ background: "white", borderBottom: "1px solid rgba(107,45,139,0.15)",
        padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px",
        position: "sticky", top: 0, zIndex: 50 }}>
        <Image src="/logo-final.png" alt="El Dólar Perfumería" width={160} height={47} priority />
        <button onClick={onLogout}
          style={{ background: "transparent", border: "1px solid #6B2D8B", color: "#6B2D8B",
            borderRadius: "8px", padding: "7px 16px", fontSize: "13px", cursor: "pointer", fontWeight: 500 }}>
          Cerrar sesión
        </button>
      </header>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Tabs */}
        <div style={{ display: "inline-flex", gap: "4px", marginBottom: "28px",
          background: "white", borderRadius: "10px", padding: "4px",
          border: "1px solid rgba(107,45,139,0.15)" }}>
          {(["productos", "categorias", "marcas", "banners"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={tab === t
                ? { background: "#6B2D8B", color: "white", border: "none", borderRadius: "7px",
                    padding: "8px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }
                : { background: "transparent", color: "#6B2D8B", border: "none", borderRadius: "7px",
                    padding: "8px 20px", fontSize: "14px", cursor: "pointer", textTransform: "capitalize" }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "productos"  && <TabProductos />}
        {tab === "categorias" && <TabCatMarca tabla="categorias" titulo="Categorías" />}
        {tab === "marcas"     && <TabCatMarca tabla="marcas" titulo="Marcas" />}
        {tab === "banners"    && <TabBanners />}
      </div>
    </div>
  );
}

// ── Tab Productos ─────────────────────────────────────────────────────────────

function TabProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState<FormProducto>(FORM_PRODUCTO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    const [prods, cats, mrcas] = await Promise.all([
      getProductos(),
      getCategorias(),
      getMarcas(),
    ]);
    setProductos(prods || []);
    setCategorias(cats || []);
    setMarcas(mrcas || []);
    setLoading(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  function abrirNuevo() {
    setEditando(null);
    setForm(FORM_PRODUCTO_VACIO);
    setModalOpen(true);
  }

  function abrirEditar(p: Producto) {
    setEditando(p);
    setForm({
      nombre: p.nombre, descripcion: p.descripcion ?? "",
      marca_id: String(p.marca_id ?? ""), categoria_id: String(p.categoria_id ?? ""),
      precio: String(p.precio), precio_oferta: p.precio_oferta ? String(p.precio_oferta) : "",
      tamano: p.tamano ?? "", badge: p.badge ?? "", imagen_url: p.imagen_url ?? "",
      activo: p.activo, destacado: p.destacado, mas_vendido: p.mas_vendido, agotado: p.agotado,
    });
    setModalOpen(true);
  }

  async function guardar() {
    if (!form.nombre || !form.precio) { setMsg({ tipo: "err", texto: "Nombre y precio son obligatorios." }); return; }
    setGuardando(true);
    const datos = {
      nombre: form.nombre, descripcion: form.descripcion || null,
      marca_id: form.marca_id ? Number(form.marca_id) : null,
      categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
      precio: Number(form.precio),
      precio_oferta: form.precio_oferta ? Number(form.precio_oferta) : null,
      tamano: form.tamano || null, badge: form.badge || null,
      imagen_url: form.imagen_url || null,
      activo: form.activo, destacado: form.destacado, mas_vendido: form.mas_vendido, agotado: form.agotado,
    };
    try {
      if (editando) {
        await actualizarProducto(editando.id, datos);
      } else {
        await crearProducto(datos);
      }
    } catch (e: unknown) {
      setGuardando(false);
      setMsg({ tipo: "err", texto: e instanceof Error ? e.message : "Error desconocido" });
      return;
    }
    setGuardando(false);
    setMsg({ tipo: "ok", texto: editando ? "Producto actualizado." : "Producto creado." });
    setModalOpen(false);
    cargar();
    setTimeout(() => setMsg(null), 3000);
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
    } catch (e: unknown) {
      setMsg({ tipo: "err", texto: e instanceof Error ? e.message : "Error al eliminar" });
      return;
    }
    setMsg({ tipo: "ok", texto: "Producto eliminado." });
    cargar();
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <>
      {msg && <Notif tipo={msg.tipo} texto={msg.texto} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={tituloStyle}>Productos ({productos.length})</h2>
        <button onClick={abrirNuevo} style={btnPrimaryStyle}>＋ Nuevo producto</button>
      </div>

      {loading ? <p style={{ color: "#6B2D8B" }}>Cargando...</p> : (
        <div style={{ overflowX: "auto", background: "white", borderRadius: "12px", border: "1px solid rgba(107,45,139,0.12)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(107,45,139,0.12)", background: "#faf8fc" }}>
                {["Imagen","Nombre","Marca","Categoría","Precio","Oferta","Badge","Activo","Dest.","Vend.","Agotado","Acciones"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(107,45,139,0.07)" }}>
                  <td style={tdStyle}>
                    {p.imagen_url
                      ? <Image src={p.imagen_url} alt={p.nombre} width={48} height={48}
                          style={{ borderRadius: "6px", objectFit: "cover" }} />
                      : <div style={{ width: 48, height: 48, borderRadius: "6px",
                          background: "linear-gradient(135deg,#1a0a2e,#6B2D8B)" }} />}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, maxWidth: "160px" }}>{p.nombre}</td>
                  <td style={tdStyle}>{p.marcas?.nombre ?? "—"}</td>
                  <td style={tdStyle}>{p.categorias?.nombre ?? "—"}</td>
                  <td style={tdStyle}>{formatPrecio(p.precio)}</td>
                  <td style={tdStyle}>{p.precio_oferta ? formatPrecio(p.precio_oferta) : "—"}</td>
                  <td style={tdStyle}>
                    {p.badge && <span style={{ background: p.badge === "OFERTA" ? "#C2185B" : "#6B2D8B",
                      color: "white", fontSize: "10px", padding: "2px 7px", borderRadius: "4px", fontWeight: 600 }}>
                      {p.badge}
                    </span>}
                  </td>
                  <td style={tdStyle}><Pill on={p.activo} /></td>
                  <td style={tdStyle}><Pill on={p.destacado} /></td>
                  <td style={tdStyle}><Pill on={p.mas_vendido} /></td>
                  <td style={tdStyle}><Pill on={p.agotado} color={p.agotado ? "#C2185B" : undefined} /></td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => abrirEditar(p)} style={btnEditStyle}>Editar</button>
                      <button onClick={() => eliminar(p.id)} style={btnDelStyle}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ModalProducto
          form={form} setForm={setForm}
          categorias={categorias} marcas={marcas}
          editando={editando} guardando={guardando}
          onGuardar={guardar} onCerrar={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

// ── Modal Producto ────────────────────────────────────────────────────────────

function ModalProducto({ form, setForm, categorias, marcas, editando, guardando, onGuardar, onCerrar }: {
  form: FormProducto; setForm: (f: FormProducto) => void;
  categorias: Categoria[]; marcas: Marca[];
  editando: Producto | null; guardando: boolean;
  onGuardar: () => void; onCerrar: () => void;
}) {
  const [subiendo, setSubiendo] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(key: keyof FormProducto, val: string | boolean) {
    setForm({ ...form, [key]: val });
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setSubiendo(true);
    try {
      const url = await uploadImage(file);
      set("imagen_url", url);
    } catch {
      alert("Error al subir la imagen. Verifica que el upload_preset 'eldolar_preset' exista en Cloudinary.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100,
      display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "32px 16px" }}>
      <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "640px",
        padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1A1A1A" }}>
            {editando ? "Editar producto" : "Nuevo producto"}
          </h3>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#666" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Nombre *</label>
            <input value={form.nombre} onChange={e => set("nombre", e.target.value)} style={inputStyle} placeholder="Ej: Chanel N°5" />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Descripción</label>
            <textarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)}
              rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Descripción breve del producto" />
          </div>

          <div>
            <label style={labelStyle}>Marca</label>
            <select value={form.marca_id} onChange={e => set("marca_id", e.target.value)} style={inputStyle}>
              <option value="">— Sin marca —</option>
              {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Categoría</label>
            <select value={form.categoria_id} onChange={e => set("categoria_id", e.target.value)} style={inputStyle}>
              <option value="">— Sin categoría —</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Precio *</label>
            <input type="number" value={form.precio} onChange={e => set("precio", e.target.value)}
              style={inputStyle} placeholder="45990" min="0" />
          </div>

          <div>
            <label style={labelStyle}>Precio oferta</label>
            <input type="number" value={form.precio_oferta} onChange={e => set("precio_oferta", e.target.value)}
              style={inputStyle} placeholder="39990 (opcional)" min="0" />
          </div>

          <div>
            <label style={labelStyle}>Tamaño</label>
            <input value={form.tamano} onChange={e => set("tamano", e.target.value)}
              style={inputStyle} placeholder="100ml" />
          </div>

          <div>
            <label style={labelStyle}>Badge</label>
            <select value={form.badge} onChange={e => set("badge", e.target.value)} style={inputStyle}>
              <option value="">— Sin badge —</option>
              <option value="NUEVO">NUEVO</option>
              <option value="OFERTA">OFERTA</option>
              <option value="TOP">TOP</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div style={{ gridColumn: "1/-1", display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {([["activo","Activo"],["destacado","Destacado"],["mas_vendido","Más vendido"]] as [keyof FormProducto, string][]).map(([k, label]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", fontSize: "14px", color: "#1A1A1A" }}>
                <input type="checkbox" checked={form[k] as boolean} onChange={e => set(k, e.target.checked)}
                  style={{ accentColor: "#6B2D8B", width: "16px", height: "16px" }} />
                {label}
              </label>
            ))}
            <label style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", fontSize: "14px", color: form.agotado ? "#C2185B" : "#1A1A1A", fontWeight: form.agotado ? 600 : 400 }}>
              <input type="checkbox" checked={form.agotado} onChange={e => set("agotado", e.target.checked)}
                style={{ accentColor: "#C2185B", width: "16px", height: "16px" }} />
              ⚠️ Agotado
            </label>
          </div>

          {/* Imagen */}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Imagen</label>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
              style={{ border: `2px dashed ${dragOver ? "#6B2D8B" : "rgba(107,45,139,0.3)"}`,
                borderRadius: "10px", padding: "20px", textAlign: "center", cursor: "pointer",
                background: dragOver ? "rgba(107,45,139,0.04)" : "white", transition: "all 0.2s" }}>
              {subiendo ? (
                <p style={{ color: "#6B2D8B", fontSize: "14px" }}>Subiendo imagen...</p>
              ) : form.imagen_url ? (
                <div>
                  <Image src={form.imagen_url} alt="preview" width={120} height={120}
                    style={{ borderRadius: "8px", objectFit: "cover", margin: "0 auto 8px" }} />
                  <p style={{ fontSize: "12px", color: "#666" }}>Clic o arrastra para cambiar</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "28px", marginBottom: "6px" }}>📷</p>
                  <p style={{ fontSize: "13px", color: "#666" }}>Arrastra una imagen o haz clic para seleccionar</p>
                </>
              )}
            </div>
            {form.imagen_url && !subiendo && (
              <input value={form.imagen_url} onChange={e => set("imagen_url", e.target.value)}
                style={{ ...inputStyle, marginTop: "8px", fontSize: "11px", color: "#888" }} placeholder="URL de imagen" />
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "28px" }}>
          <button onClick={onCerrar} style={btnSecondaryStyle}>Cancelar</button>
          <button onClick={onGuardar} disabled={guardando} style={{ ...btnPrimaryStyle, opacity: guardando ? 0.7 : 1 }}>
            {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tab Categorías / Marcas (genérico) ────────────────────────────────────────

function TabCatMarca({ tabla, titulo }: { tabla: "categorias" | "marcas"; titulo: string }) {
  const [items, setItems] = useState<(Categoria | Marca)[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormCatMarca>(FORM_CAT_VACIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    const data = tabla === "categorias" ? await getCategorias() : await getMarcas();
    setItems(data || []);
    setLoading(false);
  }, [tabla]);

  useEffect(() => { cargar(); }, [cargar]);

  function iniciarEdicion(item: Categoria | Marca) {
    setEditandoId(item.id);
    setForm({ nombre: item.nombre, slug: item.slug });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm(FORM_CAT_VACIO);
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.slug) { setMsg({ tipo: "err", texto: "Nombre y slug son obligatorios." }); return; }
    setGuardando(true);
    const datos = { nombre: form.nombre, slug: form.slug };
    try {
      if (tabla === "categorias") {
        editandoId ? await actualizarCategoria(editandoId, datos) : await crearCategoria(datos);
      } else {
        editandoId ? await actualizarMarca(editandoId, datos) : await crearMarca(datos);
      }
    } catch (e: unknown) {
      setGuardando(false);
      setMsg({ tipo: "err", texto: e instanceof Error ? e.message : "Error desconocido" });
      return;
    }
    setGuardando(false);
    setMsg({ tipo: "ok", texto: editandoId ? "Actualizado correctamente." : "Creado correctamente." });
    setForm(FORM_CAT_VACIO);
    setEditandoId(null);
    cargar();
    setTimeout(() => setMsg(null), 3000);
  }

  async function eliminar(id: number) {
    if (!confirm(`¿Eliminar este elemento? Esto puede afectar productos asociados.`)) return;
    try {
      if (tabla === "categorias") {
        await eliminarCategoria(id);
      } else {
        await eliminarMarca(id);
      }
    } catch (e: unknown) {
      setMsg({ tipo: "err", texto: e instanceof Error ? e.message : "Error al eliminar" });
      return;
    }
    setMsg({ tipo: "ok", texto: "Eliminado correctamente." });
    cargar();
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <>
      {msg && <Notif tipo={msg.tipo} texto={msg.texto} />}

      <h2 style={{ ...tituloStyle, marginBottom: "20px" }}>{titulo}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
        {/* Lista */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(107,45,139,0.12)", overflow: "hidden" }}>
          {loading ? <p style={{ padding: "24px", color: "#6B2D8B" }}>Cargando...</p> : items.length === 0 ? (
            <p style={{ padding: "24px", color: "#888" }}>No hay {titulo.toLowerCase()} todavía.</p>
          ) : items.map((item) => (
            <div key={item.id}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderBottom: "1px solid rgba(107,45,139,0.07)" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#1A1A1A" }}>{item.nombre}</p>
                <p style={{ fontSize: "12px", color: "#888", fontFamily: "monospace" }}>{item.slug}</p>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => iniciarEdicion(item)} style={btnEditStyle}>Editar</button>
                <button onClick={() => eliminar(item.id)} style={btnDelStyle}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <form onSubmit={guardar}
          style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(107,45,139,0.12)", padding: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A", marginBottom: "16px" }}>
            {editandoId ? "Editar" : "Agregar nueva"}
          </h3>

          <label style={labelStyle}>Nombre *</label>
          <input value={form.nombre} onChange={e => {
            const nombre = e.target.value;
            setForm({ nombre, slug: editandoId ? form.slug : slugify(nombre) });
          }} style={inputStyle} placeholder="Ej: Perfumes y Fragancias" />

          <label style={labelStyle}>Slug *</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
            style={{ ...inputStyle, fontFamily: "monospace" }} placeholder="perfumes-y-fragancias" />

          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            {editandoId && (
              <button type="button" onClick={cancelarEdicion} style={{ ...btnSecondaryStyle, flex: 1 }}>
                Cancelar
              </button>
            )}
            <button type="submit" disabled={guardando}
              style={{ ...btnPrimaryStyle, flex: 1, opacity: guardando ? 0.7 : 1 }}>
              {guardando ? "..." : editandoId ? "Guardar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ── Tab Banners ───────────────────────────────────────────────────────────────

function TabBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    const data = await getBanners();
    setBanners(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setSubiendo(true);
    try {
      const url = await uploadImage(file);
      const maxOrden = banners.length > 0 ? Math.max(...banners.map(b => b.orden)) : 0;
      await crearBanner(url, maxOrden + 1);
      setMsg({ tipo: "ok", texto: "Banner agregado correctamente." });
      cargar();
    } catch (e: unknown) {
      setMsg({ tipo: "err", texto: e instanceof Error ? e.message : "Error al subir" });
    } finally {
      setSubiendo(false);
      setTimeout(() => setMsg(null), 3000);
    }
  }

  async function moverBanner(id: number, direccion: "arriba" | "abajo") {
    const idx = banners.findIndex(b => b.id === id);
    const swapIdx = direccion === "arriba" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= banners.length) return;

    const updated = [...banners];
    const ordenA = updated[idx].orden;
    const ordenB = updated[swapIdx].orden;

    await Promise.all([
      actualizarOrdenBanner(updated[idx].id, ordenB),
      actualizarOrdenBanner(updated[swapIdx].id, ordenA),
    ]);
    cargar();
  }

  async function toggleActivo(banner: Banner) {
    await toggleBannerActivo(banner.id, !banner.activo);
    cargar();
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Eliminar este banner?")) return;
    try {
      await eliminarBanner(id);
      setMsg({ tipo: "ok", texto: "Banner eliminado." });
      cargar();
    } catch (e: unknown) {
      setMsg({ tipo: "err", texto: e instanceof Error ? e.message : "Error al eliminar" });
    }
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <>
      {msg && <Notif tipo={msg.tipo} texto={msg.texto} />}

      <h2 style={{ ...tituloStyle, marginBottom: "8px" }}>Banners del slideshow</h2>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
        Las imágenes se muestran en el orden indicado. Solo los banners activos aparecen en la tienda.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>

        {/* Lista de banners */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(107,45,139,0.12)", overflow: "hidden" }}>
          {loading ? (
            <p style={{ padding: "24px", color: "#6B2D8B" }}>Cargando...</p>
          ) : banners.length === 0 ? (
            <p style={{ padding: "24px", color: "#888" }}>No hay banners. Sube la primera imagen.</p>
          ) : banners.map((banner, idx) => (
            <div key={banner.id} style={{ display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px", borderBottom: "1px solid rgba(107,45,139,0.07)" }}>

              {/* Miniatura */}
              <div style={{ width: 80, height: 50, borderRadius: "6px", overflow: "hidden",
                background: "#f0f0f0", flexShrink: 0, position: "relative" }}>
                <Image src={banner.imagen_url} alt={`Banner ${idx + 1}`} fill style={{ objectFit: "cover" }} />
              </div>

              {/* Orden e info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: "13px", color: "#1A1A1A" }}>Banner #{banner.orden}</p>
                <p style={{ fontSize: "11px", color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {banner.imagen_url}
                </p>
              </div>

              {/* Controles */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                <button onClick={() => moverBanner(banner.id, "arriba")} disabled={idx === 0}
                  style={{ ...btnEditStyle, opacity: idx === 0 ? 0.3 : 1, fontSize: "14px", padding: "4px 8px" }}>↑</button>
                <button onClick={() => moverBanner(banner.id, "abajo")} disabled={idx === banners.length - 1}
                  style={{ ...btnEditStyle, opacity: idx === banners.length - 1 ? 0.3 : 1, fontSize: "14px", padding: "4px 8px" }}>↓</button>
                <button onClick={() => toggleActivo(banner)}
                  style={{ ...btnEditStyle, background: banner.activo ? "rgba(34,197,94,0.08)" : "rgba(156,163,175,0.15)",
                    color: banner.activo ? "#16a34a" : "#9ca3af",
                    border: `1px solid ${banner.activo ? "rgba(34,197,94,0.3)" : "rgba(156,163,175,0.3)"}` }}>
                  {banner.activo ? "Activo" : "Oculto"}
                </button>
                <button onClick={() => handleEliminar(banner.id)} style={btnDelStyle}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Zona de carga */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(107,45,139,0.12)", padding: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A", marginBottom: "16px" }}>
            Agregar banner
          </h3>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
            style={{ border: `2px dashed ${dragOver ? "#6B2D8B" : "rgba(107,45,139,0.3)"}`,
              borderRadius: "10px", padding: "32px 20px", textAlign: "center", cursor: "pointer",
              background: dragOver ? "rgba(107,45,139,0.04)" : "white", transition: "all 0.2s" }}>
            {subiendo ? (
              <p style={{ color: "#6B2D8B", fontSize: "14px" }}>Subiendo imagen...</p>
            ) : (
              <>
                <p style={{ fontSize: "32px", marginBottom: "8px" }}>🖼️</p>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>
                  Arrastra una imagen o haz clic
                </p>
                <p style={{ fontSize: "11px", color: "#aaa" }}>PNG, JPG, WEBP recomendado</p>
              </>
            )}
          </div>
          <p style={{ fontSize: "12px", color: "#aaa", marginTop: "12px" }}>
            El banner se agrega al final del slideshow. Usa las flechas ↑↓ para reordenar.
          </p>
        </div>
      </div>
    </>
  );
}

// ── Componentes auxiliares ────────────────────────────────────────────────────

function Pill({ on, color }: { on: boolean; color?: string }) {
  return (
    <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%",
      background: on ? (color ?? "#22c55e") : "#d1d5db" }} />
  );
}

function Notif({ tipo, texto }: { tipo: "ok" | "err"; texto: string }) {
  return (
    <div style={{ position: "fixed", top: "80px", right: "24px", zIndex: 200,
      background: tipo === "ok" ? "#dcfce7" : "#fef2f2",
      color: tipo === "ok" ? "#166534" : "#991b1b",
      border: `1px solid ${tipo === "ok" ? "#bbf7d0" : "#fecaca"}`,
      borderRadius: "8px", padding: "12px 18px", fontSize: "14px", fontWeight: 500,
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)", maxWidth: "340px" }}>
      {tipo === "ok" ? "✓ " : "✕ "}{texto}
    </div>
  );
}

// ── Estilos compartidos ───────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 600,
  color: "#6B2D8B", marginBottom: "5px", letterSpacing: "0.05em", textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid rgba(107,45,139,0.3)", borderRadius: "7px",
  padding: "9px 12px", fontSize: "14px", color: "#1A1A1A", background: "white",
  marginBottom: "14px", outline: "none", boxSizing: "border-box",
};

const tituloStyle: React.CSSProperties = {
  fontSize: "22px", fontWeight: 700, color: "#1A1A1A",
};

const btnPrimaryStyle: React.CSSProperties = {
  background: "#6B2D8B", color: "white", border: "none", borderRadius: "8px",
  padding: "9px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
};

const btnSecondaryStyle: React.CSSProperties = {
  background: "white", color: "#6B2D8B", border: "1px solid #6B2D8B",
  borderRadius: "8px", padding: "9px 18px", fontSize: "14px", cursor: "pointer",
};

const btnEditStyle: React.CSSProperties = {
  background: "rgba(107,45,139,0.08)", color: "#6B2D8B", border: "1px solid rgba(107,45,139,0.2)",
  borderRadius: "6px", padding: "5px 10px", fontSize: "12px", cursor: "pointer", fontWeight: 500,
};

const btnDelStyle: React.CSSProperties = {
  background: "rgba(194,24,91,0.08)", color: "#C2185B", border: "1px solid rgba(194,24,91,0.2)",
  borderRadius: "6px", padding: "5px 10px", fontSize: "12px", cursor: "pointer", fontWeight: 500,
};

const thStyle: React.CSSProperties = {
  padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 700,
  color: "#6B2D8B", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px", fontSize: "13px", color: "#1A1A1A", verticalAlign: "middle",
};
