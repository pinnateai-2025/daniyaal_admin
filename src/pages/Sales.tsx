import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { mockApi } from '../api/mock';
import { SalesData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';

export function SalesPage() {
  const [data, setData] = useState<SalesData[]>([]);

  useEffect(() => {
    mockApi.getSalesTrends(30).then(setData);
  }, []);

  const totalRevenue = data.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const totalRefunds = data.reduce((acc, curr) => acc + (curr.refunds || 0), 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Sales Analytics</h2>
        <p className="text-sm md:text-base text-gray-500">Detailed breakdown of revenue and trends.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-indigo-50/50 border-indigo-100 shadow-sm">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-indigo-900 uppercase tracking-wider">Total Revenue (30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-2xl md:text-3xl font-bold text-indigo-700">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card className="bg-rose-50/50 border-rose-100 shadow-sm">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-rose-900 uppercase tracking-wider">Total Refunds</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-2xl md:text-3xl font-bold text-rose-700">{formatCurrency(totalRefunds)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Revenue vs Sales Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                />
                <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={false} name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={false} name="Sales Count" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Daily Revenue Bar Chart</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
