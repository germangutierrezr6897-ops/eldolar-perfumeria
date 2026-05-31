"use server";

import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

// ── Productos ─────────────────────────────────────────────────────────────────

export async function getProductos() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*, marcas(nombre), categorias(nombre)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function crearProducto(datos: Record<string, unknown>) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("productos").insert(datos);
  if (error) throw new Error(error.message);
}

export async function actualizarProducto(id: number, datos: Record<string, unknown>) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("productos").update(datos).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function eliminarProducto(id: number) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Categorías ────────────────────────────────────────────────────────────────

export async function getCategorias() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("categorias").select("*").order("nombre");
  if (error) throw new Error(error.message);
  return data;
}

export async function crearCategoria(datos: { nombre: string; slug: string }) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("categorias").insert(datos);
  if (error) throw new Error(error.message);
}

export async function actualizarCategoria(id: number, datos: { nombre: string; slug: string }) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("categorias").update(datos).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function eliminarCategoria(id: number) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Marcas ────────────────────────────────────────────────────────────────────

export async function getMarcas() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("marcas").select("*").order("nombre");
  if (error) throw new Error(error.message);
  return data;
}

export async function crearMarca(datos: { nombre: string; slug: string }) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("marcas").insert(datos);
  if (error) throw new Error(error.message);
}

export async function actualizarMarca(id: number, datos: { nombre: string; slug: string }) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("marcas").update(datos).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function eliminarMarca(id: number) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("marcas").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Banners ───────────────────────────────────────────────────────────────────

export type Banner = {
  id: number;
  imagen_url: string;
  orden: number;
  activo: boolean;
  created_at: string;
};

export async function getBanners() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("banners").select("*").order("orden");
  if (error) throw new Error(error.message);
  return data as Banner[];
}

export async function crearBanner(imagen_url: string, orden: number) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("banners").insert({ imagen_url, orden, activo: true });
  if (error) throw new Error(error.message);
}

export async function actualizarOrdenBanner(id: number, orden: number) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("banners").update({ orden }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleBannerActivo(id: number, activo: boolean) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("banners").update({ activo }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function eliminarBanner(id: number) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
