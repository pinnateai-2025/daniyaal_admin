import { faker } from "@faker-js/faker";
import { DashboardStats, Order, Product, SalesData, User } from "../types";

// Utility delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- IN-MEMORY STORE (MOCK DATABASE) ---

let products: Product[] = Array.from({ length: 20 }).map(() => {
  const price = parseFloat(
    faker.commerce.price({ min: 1000, max: 50000 })
  );

  const mrp = parseFloat(
    (price * (1 + faker.number.float({ min: 0.1, max: 0.4 }))).toFixed(2)
  );

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: faker.image.urlLoremFlickr({ category: "furniture" }),
    price,
    mrp: faker.datatype.boolean() ? mrp : undefined,
    stock: faker.number.int({ min: 0, max: 100 }),
    totalSold: faker.number.int({ min: 10, max: 1000 }),
    totalRevenue: faker.number.float({ min: 10000, max: 500000 }),
    category: faker.commerce.department(),
    createdAt: faker.date.past().toISOString(),
  };
});

let categories = Array.from(new Set(products.map((p) => p.category)));

let orders: Order[] = Array.from({ length: 50 }).map(() => {
  const itemsCount = faker.number.int({ min: 1, max: 4 });

  const orderItems = Array.from({ length: itemsCount }).map(() => {
    const product: Product = (faker.helpers as any).arrayElement(products);

    return {
      productId: product.id,
      productName: product.name,
      quantity: faker.number.int({ min: 1, max: 3 }),
      price: product.price,
      image: product.image,
    };
  });

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;

  return {
    id: faker.string.nanoid(8).toUpperCase(),
    customer: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
    },
    items: orderItems,
    subtotal,
    tax,
    total: subtotal + tax,
    status: (faker.helpers as any).arrayElement([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        ]),

    paymentStatus: (faker.helpers as any).arrayElement(["paid", "paid", "unpaid"]),
    paymentMethod: (faker.helpers as any).arrayElement(["Credit Card", "UPI", "Net Banking"]),
    role: (faker.helpers as any).arrayElement(["customer", "customer", "admin"]),
    date: faker.date.recent({ days: 30 }).toISOString(),
    trackingNumber: faker.datatype.boolean()
    ? faker.string.alphanumeric(12).toUpperCase()
    : undefined,
  };
});

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

    const topProduct = products.reduce((prev, curr) =>
      prev.totalSold > curr.totalSold ? prev : curr
    );

    return {
      totalUsers: faker.number.int({ min: 1000, max: 5000 }),
      totalOrders: orders.length,
      totalSales: orders.reduce(
        (acc, o) => (o.paymentStatus === "paid" ? acc + o.total : acc),
        0
      ),
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      topProduct: {
        name: topProduct.name,
        image: topProduct.image,
        sold: topProduct.totalSold,
      },
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
      sales: faker.number.int({ min: 10, max: 100 }),
      revenue: faker.number.int({ min: 20000, max: 100000 }),
      refunds: faker.number.int({ min: 0, max: 5000 }),
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
      data: Array.from({ length: limit }).map(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: (faker.helpers as any).arrayElement([
          "customer",
          "customer",
          "admin",
        ]),
        isVerified: faker.datatype.boolean(),
        createdAt: faker.date.past().toISOString(),
        avatar: faker.image.avatar(),
      })),
      total: 100,
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
      id: faker.string.uuid(),
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
