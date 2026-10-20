export type ProductOption = {
  id: string;
  label: string;
  weightKg: number;
  portions: string;
  price: number;
};

export type ProductImage = { src: string; alt: string };

export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  kind: string;
  categories: string[];
  subtitle: string;
  description: string;
  options: ProductOption[];
  images: ProductImage[];
  badges: Array<"hit" | "new" | "seasonal">;
  occasions: string[];
  style: string;
  createdAt: string;
  customizable: boolean;
};

export type CatalogData = {
  meta: { demo: boolean; note: string };
  categories: Category[];
  products: Product[];
};

export type CartLine = {
  key: string;
  slug: string;
  optionId: string;
  qty: number;
  message?: string;
  date?: string;
};

export type OrderPayload = {
  customer: {
    name: string;
    phone: string;
    method: "delivery" | "pickup";
    address?: string;
    date?: string;
    time?: string;
    comment?: string;
  };
  items: Array<{
    slug: string;
    name: string;
    optionLabel: string;
    qty: number;
    price: number;
    message?: string;
  }>;
  total: number;
};

export type CustomRequestPayload = {
  name: string;
  phone: string;
  occasion: string;
  weight: string;
  date: string;
  flavor: string[];
  design: string;
  inscription: string;
  budget: string;
  comment: string;
};
