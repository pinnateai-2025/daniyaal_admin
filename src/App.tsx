import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UsersPage } from './pages/Users';
import { ProductsPage } from './pages/Products';
import { ProductForm } from './pages/ProductForm';
import { ProductPerformancePage } from './pages/ProductPerformance';
import { SalesPage } from './pages/Sales';
import { OrdersPage } from './pages/Orders';
import { OrderDetailsPage } from './pages/OrderDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />

            {/* Product Routes */}
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id" element={<ProductForm />} />
            <Route path="performance" element={<ProductPerformancePage />} /> {/* Added Route */}

            {/* Order Routes */}
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />

            <Route path="sales" element={<SalesPage />} />
            <Route path="trends" element={<SalesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
