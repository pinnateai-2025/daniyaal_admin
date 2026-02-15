import apiClient from "./axios";
import { DashboardStats, SalesData, User, ProductPerformance } from "../types";

export const adminService = {
    // DASHBOARD
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await apiClient.get("/admin/dashboard");
        return response.data;
    },

    // USERS
    getUsers: async (page = 1, limit = 20): Promise<{ users: User[]; total: number; pages: number }> => {
        const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
        return response.data;
    },

    getUser: async (id: string): Promise<User> => {
        const response = await apiClient.get(`/admin/users/${id}`);
        return response.data;
    },

    updateUser: async (id: string, data: Partial<User>): Promise<User> => {
        const response = await apiClient.put(`/admin/users/${id}`, data);
        return response.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        await apiClient.delete(`/admin/users/${id}`);
    },

    // SALES
    getSalesSummary: async (period = "month"): Promise<any> => {
        const response = await apiClient.get(`/admin/sales/summary?period=${period}`);
        return response.data;
    },

    getSalesTrends: async (days = 30): Promise<SalesData[]> => {
        const response = await apiClient.get(`/admin/sales/trends?days=${days}`);
        return response.data;
    },

    // PRODUCTS
    getProductPerformance: async (limit = 20): Promise<ProductPerformance[]> => {
        const response = await apiClient.get(`/admin/products/performance?limit=${limit}`);
        return response.data;
    },
};
