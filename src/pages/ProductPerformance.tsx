import React, { useEffect, useState } from 'react';
import { mockApi } from '../api/mock';
import { Product } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/utils';
import { ArrowUpDown, TrendingUp, DollarSign, Package, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ProductPerformancePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' }>({ key: 'totalRevenue', direction: 'desc' });

  useEffect(() => {
    const fetchData = async () => {
      const data = await mockApi.getProducts();
      // Initial sort by revenue
      setProducts(data.sort((a, b) => b.totalRevenue - a.totalRevenue));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...products].sort((a, b) => {
      // Handle undefined values safely if any
      const valA = a[key] ?? 0;
      const valB = b[key] ?? 0;

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setProducts(sorted);
  };

  if (loading) return <div className="p-8">Loading performance data...</div>;

  // Top 3 Products for Cards
  const topByRevenue = [...products].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  const topByVolume = [...products].sort((a, b) => b.totalSold - a.totalSold)[0];
  
  // Chart Data (Top 5)
  const chartData = products
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      revenue: p.totalRevenue,
      sales: p.totalSold
    }));

  // Max value for progress bars
  const maxRevenue = Math.max(...products.map(p => p.totalRevenue));

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Product Performance</h2>
        <p className="text-gray-500">Analyze sales volume, revenue, and inventory efficiency.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Top Earner</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img src={topByRevenue?.image} alt="" className="h-12 w-12 rounded-md object-cover border border-emerald-200" />
              <div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(topByRevenue?.totalRevenue || 0)}</div>
                <p className="text-xs text-gray-500 truncate w-32">{topByRevenue?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Best Seller (Volume)</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img src={topByVolume?.image} alt="" className="h-12 w-12 rounded-md object-cover border border-blue-200" />
              <div>
                <div className="text-lg font-bold text-gray-900">{topByVolume?.totalSold} units</div>
                <p className="text-xs text-gray-500 truncate w-32">{topByVolume?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(products.reduce((acc, p) => acc + (p.price * p.stock), 0))}
            </div>
            <p className="text-xs text-gray-500">Based on current stock & selling price</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Top 5 by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} interval={0} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} cursor={{fill: 'transparent'}} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : '#10b981'} fillOpacity={1 - (index * 0.15)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-1">Price <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('totalSold')}>
                      <div className="flex items-center gap-1">Sold <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('totalRevenue')}>
                      <div className="flex items-center gap-1">Revenue <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-6 py-4">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={product.image} alt="" className="h-10 w-10 rounded-md object-cover border border-gray-200" />
                            {index < 3 && sortConfig.key === 'totalRevenue' && sortConfig.direction === 'desc' && (
                              <div className={`absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                                index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                              }`}>
                                <Trophy className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <div className="max-w-[150px]">
                            <div className="font-medium text-gray-900 truncate">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4 font-medium">{product.totalSold}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(product.totalRevenue)}</td>
                      <td className="px-6 py-4 w-32">
                        <div className="flex flex-col gap-1">
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full" 
                              style={{ width: `${(product.totalRevenue / maxRevenue) * 100}%` }} 
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 text-right">
                            {Math.round((product.totalRevenue / maxRevenue) * 100)}% of top
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
