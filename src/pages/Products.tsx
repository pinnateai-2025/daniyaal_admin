import React, { useEffect, useState } from "react";
import apiClient from "../api/axios";
import { Product } from "../types";
import { useNavigate } from "react-router-dom";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await apiClient.get("/product");
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await apiClient.delete(`/product/${id}`);
      fetchProducts();
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading products...</div>;

  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Products</h2>
        <button
          onClick={() => navigate("/products/new")}
          style={{
            padding: "8px 14px",
            background: "#e7b008",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          + Add Product
        </button>
      </div>

      <table width="100%" cellPadding={12} style={{ borderCollapse: "collapse" }}>
        <thead style={{ background: "#f4f4f4" }}>
          <tr>
            <th align="left">Image</th>
            <th align="left">Name</th>
            <th align="left">Category</th>
            <th align="left">Price</th>
            <th align="left">Stock</th>
            <th align="left">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            const discount =
              p.mrp && p.mrp > p.price
                ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
                : 0;

            return (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    width={60}
                    style={{ borderRadius: 6 }}
                  />
                </td>

                <td>
                  <div style={{ fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {p.description?.slice(0, 60)}...
                  </div>
                </td>

                <td>{p.category?.name}</td>

                <td>
                  <div>
                    <strong>₹{p.price}</strong>
                  </div>

                  {discount > 0 && (
                    <div style={{ fontSize: 12 }}>
                      <span style={{ textDecoration: "line-through", color: "#999" }}>
                        ₹{p.mrp}
                      </span>{" "}
                      <span style={{ color: "green", fontWeight: 600 }}>
                        {discount}% OFF
                      </span>
                    </div>
                  )}
                </td>

                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: p.stock > 10 ? "#e6f4ea" : "#fdecea",
                      color: p.stock > 10 ? "#137333" : "#c5221f",
                      fontSize: 12
                    }}
                  >
                    {p.stock} in stock
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => navigate(`/products/${p.id}`)}
                    style={{ marginRight: 10 }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}