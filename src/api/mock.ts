import { DashboardStats, Order, Product, SalesData, User } from "../types";

// Utility delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- IN-MEMORY STORE (MOCK DATABASE) ---

let products: Product[] = [];

let categories: string[] = [];

let orders: Order[] = [];

// --- MOCK API ---

export const mockApi = {
  // LOGIN
  login: async (email: string) => {
    await delay(800);

    if (email === "admin@thetablegem.com") {
      return {
        token: "mock-jwt-token-12345",
        user: { name: "Admin User", role: "admin" },
      };
    }

    throw new Error("Invalid credentials");
  },

  // DASHBOARD STATS
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(600);

    const topProduct = products.length > 0
      ? products.reduce((prev, curr) => prev.totalSold > curr.totalSold ? prev : curr)
      : null;

    return {
      totalUsers: 0,
      totalOrders: orders.length,
      totalSales: orders.reduce(
        (acc, o) => (o.paymentStatus === "paid" ? acc + o.total : acc),
        0
      ),
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      topProduct: topProduct ? {
        name: topProduct.name,
        image: topProduct.image,
        sold: topProduct.totalSold,
      } : undefined,
    };
  },

  // SALES TRENDS
  getSalesTrends: async (days = 30): Promise<SalesData[]> => {
    await delay(500);

    return Array.from({ length: days }).map((_, i) => ({
      date: new Date(
        Date.now() - (days - i) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      sales: 0,
      revenue: 0,
      refunds: 0,
    }));
  },

  // RECENT ORDERS
  getRecentOrders: async (limit = 10): Promise<Order[]> => {
    await delay(500);

    return [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  // USERS
  getUsers: async (
    page = 1,
    limit = 20
  ): Promise<{ data: User[]; total: number }> => {
    await delay(600);

    return {
      data: [],
      total: 0,
    };
  },

  // PRODUCTS
  getProducts: async (): Promise<Product[]> => {
    await delay(500);
    return [...products];
  },

  getProduct: async (id: string): Promise<Product | undefined> => {
    await delay(300);
    return products.find((p) => p.id === id);
  },

  getCategories: async (): Promise<string[]> => {
    await delay(200);
    return [...categories];
  },

  createProduct: async (
    data: Omit<Product, "id" | "totalSold" | "totalRevenue" | "createdAt">
  ): Promise<Product> => {
    await delay(800);

    const newProduct: Product = {
      id: Math.random().toString(36).substring(2, 9),
      ...data,
      totalSold: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString(),
    };

    products.unshift(newProduct);

    if (!categories.includes(data.category)) {
      categories.push(data.category);
    }

    return newProduct;
  },

  updateProduct: async (
    id: string,
    data: Partial<Product>
  ): Promise<Product> => {
    await delay(800);

    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    products[index] = { ...products[index], ...data };

    if (data.category && !categories.includes(data.category)) {
      categories.push(data.category);
    }

    return products[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(500);
    products = products.filter((p) => p.id !== id);
  },

  // ORDERS
  getOrders: async (): Promise<Order[]> => {
    await delay(600);

    return [...orders].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  getOrder: async (id: string): Promise<Order | undefined> => {
    await delay(400);
    return orders.find((o) => o.id === id);
  },

  updateOrderStatus: async (
    id: string,
    status: Order["status"]
  ): Promise<Order> => {
    await delay(600);

    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Order not found");

    orders[index] = { ...orders[index], status };

    return orders[index];
  },

  deleteOrder: async (id: string): Promise<void> => {
    await delay(500);
    orders = orders.filter((o) => o.id !== id);
  },
};
