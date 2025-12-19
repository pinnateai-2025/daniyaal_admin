import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { mockApi } from "../api/mock";
import { DashboardStats, SalesData } from "../types";
import { formatCurrency } from "../lib/utils";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboard = await mockApi.getDashboardStats();
        const trends = await mockApi.getSalesTrends();

        setStats(dashboard);
        setSalesData(trends ?? []);
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!stats) {
    return <div className="p-8 text-gray-500">No dashboard data</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h2>
        <p className="text-gray-500">
          Overview of your store's performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalSales ?? 0)}
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={(stats.totalOrders ?? 0).toString()}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Users"
          value={(stats.totalUsers ?? 0).toString()}
          icon={Users}
        />
        <StatCard
          title="Pending Orders"
          value={(stats.pendingOrders ?? 0).toString()}
          icon={Clock}
          trendColor="text-red-600"
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            {salesData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                No sales data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e7b008" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e7b008" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#e7b008"
                    fill="url(#salesColor)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Product */}
      {stats.topProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Top Product</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center gap-4">
            <img
              src={stats.topProduct.image}
              alt={stats.topProduct.name}
              className="h-32 w-32 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-semibold">{stats.topProduct.name}</h4>
              <p className="text-sm text-gray-500">
                {stats.topProduct.sold} units sold
              </p>
            </div>
            <Badge variant="success">Best Seller</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ---------- Stat Card ---------- */

function StatCard({
  title,
  value,
  icon: Icon,
  trendColor = "text-[#e7b008]",
}: any) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-sm text-gray-500">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs mt-1 ${trendColor} flex items-center`}>
          <TrendingUp className="h-3 w-3 mr-1" />
          Updated
        </p>
      </CardContent>
    </Card>
  );
}
