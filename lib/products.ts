export interface Producto {
  id: number;
  nombre: string;
  marca: "Chanel" | "Dior" | "Tom Ford" | "Carolina Herrera";
  categoria: "Floral" | "Oriental" | "Amaderado" | "Unisex";
  precio: number;
  ml: number;
}

export const productos: Producto[] = [
  { id: 1, nombre: "Chanel N°5", marca: "Chanel", categoria: "Floral", precio: 45990, ml: 100 },
  { id: 2, nombre: "Coco Mademoiselle", marca: "Chanel", categoria: "Floral", precio: 58990, ml: 100 },
  { id: 3, nombre: "Chance Eau Tendre", marca: "Chanel", categoria: "Floral", precio: 52990, ml: 100 },
  { id: 4, nombre: "Sauvage EDT", marca: "Dior", categoria: "Amaderado", precio: 52990, ml: 100 },
  { id: 5, nombre: "Miss Dior", marca: "Dior", categoria: "Floral", precio: 43990, ml: 50 },
  { id: 6, nombre: "J'adore", marca: "Dior", categoria: "Floral", precio: 55990, ml: 75 },
  { id: 7, nombre: "Black Orchid", marca: "Tom Ford", categoria: "Oriental", precio: 89990, ml: 50 },
  { id: 8, nombre: "Oud Wood", marca: "Tom Ford", categoria: "Unisex", precio: 95990, ml: 50 },
  { id: 9, nombre: "Noir Extrême", marca: "Tom Ford", categoria: "Oriental", precio: 79990, ml: 50 },
  { id: 10, nombre: "Good Girl", marca: "Carolina Herrera", categoria: "Floral", precio: 48990, ml: 80 },
  { id: 11, nombre: "Bad Boy", marca: "Carolina Herrera", categoria: "Amaderado", precio: 42990, ml: 100 },
  { id: 12, nombre: "212 VIP Rosé", marca: "Carolina Herrera", categoria: "Unisex", precio: 38990, ml: 100 },
];
