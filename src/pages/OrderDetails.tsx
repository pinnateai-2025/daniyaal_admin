import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios";
import { Order } from "../types";

export function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await apiClient.get(`/order/${id}`);
      setOrder(data);
    };
    if (id) fetchOrder();
  }, [id]);

  const updateStatus = async (status: string) => {
    await apiClient.put(`/order/${id}`, { status });
    const { data } = await apiClient.get(`/order/${id}`);
    setOrder(data);
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h2>Order #{order.id}</h2>

      <select
        value={order.status}
        onChange={(e) => updateStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <div>Total: {order.total}</div>
    </div>
  );
}