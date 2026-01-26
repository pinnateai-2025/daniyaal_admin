import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockApi } from "../api/mock";
import { Product } from "../types";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { formatCurrency } from "../lib/utils";
import { ArrowUpDown, Search, Plus, Edit, Trash2 } from "lucide-react";

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  } | null>(null);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    mockApi.getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {

      await mockApi.deleteProduct(id);
      fetchProducts();
    }
  };

  // ✅ FIXED SORTING — no more TS errors
  const handleSort = (key: keyof Product) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sorted = [...products].sort((a, b) => {
      const aValue = (a[key] as any) ?? 0;
      const bValue = (b[key] as any) ?? 0;

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setProducts(sorted);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Products</h2>
          <p className="text-sm md:text-base text-gray-500">Manage your product catalog and inventory.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-full sm:w-64 
              focus:outline-none focus:ring-2 focus:ring-[#e7b008] focus:border-transparent transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button onClick={() => navigate("/products/new")} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>

                  <th
                    className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-1">
                      Price <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>

                  <th
                    className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center gap-1">
                      Stock <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>

                  <th
                    className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("totalSold")}
                  >
                    <div className="flex items-center gap-1">
                      Sold <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>

                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const discount = product.mrp
                      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                      : 0;

                    return (
                      <tr key={product.id} className="hover:bg-gray-50 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                              <img
                                src={product.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                {product.description?.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <Badge variant="neutral">{product.category}</Badge>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {formatCurrency(product.price)}
                            </span>

                            {product.mrp && product.mrp > product.price && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-gray-400 line-through">
                                  {formatCurrency(product.mrp)}
                                </span>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1 rounded">
                                  {discount}% OFF
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${product.stock < 10
                              ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10"
                              : "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/10"
                              }`}
                          >
                            {product.stock} in stock
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-600">{product.totalSold}</td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/products/${product.id}`)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-50 text-red-600"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No products found. Try adjusting your search or add a new product.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
