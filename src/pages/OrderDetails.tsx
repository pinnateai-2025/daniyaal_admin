import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../api/mock';
import { Order } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { ArrowLeft, Truck, MapPin, User, CreditCard, Printer } from 'lucide-react';

export function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      mockApi.getOrder(id).then((data) => {
        setOrder(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const updatedOrder = await mockApi.updateOrderStatus(order.id, newStatus as Order['status']);
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8">Loading order details...</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/orders')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 truncate">Order #{order.id}</h2>
            <p className="text-gray-500 text-xs md:text-sm">
              Placed on {formatDate(order.date)}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => window.print()} className="w-full sm:w-auto order-2 sm:order-1">
            <Printer className="mr-2 h-4 w-4" /> Print Invoice
          </Button>
          <div className="w-full sm:w-48 order-1 sm:order-2">
            <Select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className={
                order.status === 'delivered' ? 'border-green-200 bg-green-50 text-green-700' :
                  order.status === 'cancelled' ? 'border-red-200 bg-red-50 text-red-700' : ''
              }
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-6 transition-colors hover:bg-gray-50/50">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 mx-auto sm:mx-0">
                      <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{item.productName}</h4>
                      <p className="text-xs text-gray-500">ID: {item.productId.substring(0, 8)}</p>
                    </div>
                    <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto gap-2">
                      <div className="text-left sm:text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(item.price)}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right font-bold text-gray-900 sm:w-24 border-l sm:border-l-0 pl-4 sm:pl-0">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span className="text-emerald-700">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-gray-900">{order.customer.name}</p>
                <p className="text-sm text-emerald-600">{order.items.length} orders</p>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{order.customer.email}</p>
                <p>{order.customer.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <address className="text-sm text-gray-600 not-italic space-y-1">
                <p>{order.customer.address}</p>
                <p>{order.customer.city}</p>
                <p>{order.customer.zip}</p>
                <p className="mt-2 font-medium text-gray-900">India</p>
              </address>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" /> Payment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Method</span>
                <span className="text-sm font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
