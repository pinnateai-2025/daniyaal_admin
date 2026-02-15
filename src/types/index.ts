export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'support' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  isVerified: boolean;
  createdAt: string;
  avatar?: string;
}

export interface ProductPerformance {
  productId: string;
  name: string;
  image: string;
  category: string;
  totalSold: number;
  revenue: number;
  stock: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  mrp?: number; // Maximum Retail Price (Fake Price for discount display)
  stock: number;
  totalSold: number;
  totalRevenue: number;
  category: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  paymentMethod: string;
  date: string;
  trackingNumber?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  topProduct?: {
    name: string;
    image: string;
    sold: number;
  };
}

export interface SalesData {
  date: string;
  sales: number;
  revenue?: number;
  refunds?: number;
}
