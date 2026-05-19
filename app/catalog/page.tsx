import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilteredProducts from "@/components/FilteredProducts";
import { productos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catálogo | El Dólar Perfumería",
  description: "Explora nuestra colección completa de fragancias de lujo al mejor precio.",
};

export default function CatalogPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-[#F8D7DA] to-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[#D4849A] mb-3">
            Colección completa
          </p>
          <h1
            className="text-4xl sm:text-5xl font-light text-gray-800"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Catálogo de fragancias
          </h1>
          <p className="text-gray-400 mt-3 text-sm">
            {productos.length} fragancias disponibles · Chanel, Dior, Tom Ford, Carolina Herrera
          </p>
        </div>
      </section>

      {/* Products */}
      <div className="bg-white">
        <FilteredProducts productos={productos} />
      </div>

      <Footer />
    </>
  );
}
