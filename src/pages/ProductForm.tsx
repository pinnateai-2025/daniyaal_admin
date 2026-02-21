import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (isEdit) {
      apiClient.get(`/product/${id}`).then(({ data }) => {
        setName(data.name);
        setPrice(data.price);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { name, price: Number(price) };

    if (isEdit) {
      await apiClient.put(`/product/${id}`, payload);
    } else {
      await apiClient.post("/product", payload);
    }

    navigate("/products");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
      />
      <button type="submit">
        {isEdit ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}