import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, Clock, CheckCircle, XCircle, Calendar, CreditCard, Smartphone } from 'lucide-react';
import { useLocation } from "react-router-dom";



const OrdersPage = () => {
  const location = useLocation();
  const latestOrder = location.state?.order;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getUserOrders();
      // If latestOrder exists and not already in the list, add it to the top
      if (latestOrder && !data.find(o => o.id === latestOrder.id)) {
        setOrders([latestOrder, ...data]);
      } else {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const header = "Order ID,Date,Status,Total,Payment Method,Items\n";
    const rows = orders.map(order =>
      `${order.id},"${order.orderDate}",${order.status},${order.total},${order.paymentMethod},"${order.items.map(i => i.name + ' x ' + i.quantity).join('; ')}"`
    );
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">Your orders will appear here after you place them.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        <input
          type="text"
          placeholder="Search by restaurant or status..."
          className="mb-4 px-3 py-2 border rounded w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded" onClick={exportCSV}>
          Export Orders as CSV
        </button>
        <div className="space-y-6">
          {orders
            .filter(order =>
              order.restaurant?.toLowerCase().includes(search.toLowerCase()) ||
              order.status?.toLowerCase().includes(search.toLowerCase())
            )
            .map(order => (
              <Card key={order.id} className="p-6 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{new Date(order.orderDate).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status === "confirmed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {order.status === "delivered" && <CheckCircle className="h-5 w-5 text-green-700" />}
                    {order.status === "preparing" && <Clock className="h-5 w-5 text-yellow-500" />}
                    {order.status === "cancelled" && <XCircle className="h-5 w-5 text-red-500" />}
                    <span className="font-semibold capitalize">{order.status}</span>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-900">Total: </span>
                  <span className="text-orange-600 font-bold">₹{order.total}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-900">Payment: </span>
                  <span className="text-gray-700">{order.paymentMethod}</span>
                  {order.paymentStatus && (
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${order.paymentStatus === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {order.paymentStatus}
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-900">Address: </span>
                  <span className="text-gray-700">
                    {order.address?.type}, {order.address?.address}, {order.address?.city} - {order.address?.zipCode}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Items:</span>
                  <ul className="list-disc ml-6 mt-1 text-gray-700">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} x {item.quantity} <span className="text-gray-500">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="mt-3 px-3 py-1 bg-orange-500 text-white rounded"
                  onClick={e => {
                    e.stopPropagation();
                    localStorage.setItem("cart", JSON.stringify(order.items)); // Use "cart" to match your CartPage
                    alert("Items added to cart! Go to Cart to review.");
                  }}
                >
                  Reorder
                </button>
              </Card>
            ))}
        </div>
      </div>
      {selectedOrder && (
        <Modal onClose={() => setSelectedOrder(null)}>
          <h2 className="text-xl font-bold mb-2">Order #{selectedOrder.id}</h2>
          <div>
            <strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}
          </div>
          <div>
            <strong>Status:</strong> {selectedOrder.status}
          </div>
          <div>
            <strong>Payment:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
          </div>
          <div>
            <strong>Address:</strong> {selectedOrder.address?.type}, {selectedOrder.address?.address}, {selectedOrder.address?.city} - {selectedOrder.address?.zipCode}
          </div>
          <div>
            <strong>Items:</strong>
            <ul>
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>{item.name} x {item.quantity} (₹{item.price * item.quantity})</li>
              ))}
            </ul>
          </div>
          <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded" onClick={() => setSelectedOrder(null)}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default OrdersPage;