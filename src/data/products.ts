
import { Product } from "../context/CartContext";

export const products: Product[] = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 199.99,
    quantity: 50,
    sku: "HDPHN-001",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=60",
    ]
  },
  {
    id: "2",
    title: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smart watch featuring heart rate monitor and sleep tracking.",
    price: 149.99,
    quantity: 75,
    sku: "WATCH-002",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60",
    ]
  },
  {
    id: "3",
    title: "Ultra HD 4K Smart TV",
    description: "Immersive viewing experience with this 55-inch 4K Smart TV with built-in streaming apps.",
    price: 599.99,
    quantity: 30,
    sku: "TV-003",
    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&auto=format&fit=crop&q=60",
    ]
  },
  {
    id: "4",
    title: "Professional Camera Set",
    description: "DSLR camera with multiple lenses perfect for professional photography.",
    price: 1299.99,
    quantity: 15,
    sku: "CAM-004",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=60",
    ]
  },
  {
    id: "5",
    title: "Standing Desk",
    description: "Ergonomic standing desk with electric height adjustment for a comfortable work experience.",
    price: 349.99,
    quantity: 25,
    sku: "DESK-005",
    images: [
      "https://images.unsplash.com/photo-1518655048521-f130df041f66?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&auto=format&fit=crop&q=60",
    ]
  },
  {
    id: "6",
    title: "Portable Power Bank",
    description: "Fast charging power bank with 20000mAh capacity for all your devices.",
    price: 49.99,
    quantity: 100,
    sku: "PWRB-006",
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=800&auto=format&fit=crop&q=60",
    ]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};
