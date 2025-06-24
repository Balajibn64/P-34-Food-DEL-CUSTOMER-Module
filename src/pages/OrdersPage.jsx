import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, Clock, CheckCircle, XCircle, Calendar, CreditCard, Smartphone } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'confirmed':
      case 'preparing':
      case 'on_the_way':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'on_the_way':
        return 'On the way';
      default:
        return 'Unknown';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'confirmed':
      case 'preparing':
      case 'on_the_way':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return 'text-green-600 bg-green-100';
      case 'Failed':
        return 'text-red-600 bg-red-100';
      case 'Refunded':
        return 'text-blue-600 bg-blue-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="h-4 w-4" />;
      case 'Credit Card':
      case 'Debit Card':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600">When you place your first order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(order.orderDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
                    <p className="text-sm text-gray-600">{order.restaurant}</p>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(order.paymentMethod)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.paymentMethod}</p>
                        <p className="text-xs text-gray-600">Payment Method</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.paymentId}</p>
                      <p className="text-xs text-gray-600">Payment ID</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">Payment Status</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Items Ordered:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">{item.quantity}x</span>
                          <span className="text-gray-900">{item.name}</span>
                        </div>
                        <span className="text-gray-600">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm text-gray-600">
                      {order.status === 'delivered' ? 'Order delivered successfully' :
                       order.status === 'cancelled' ? 'Order was cancelled' :
                       'Order is being processed'}
                    </span>
                  </div>
                  
                  {order.status === 'delivered' && (
                    <button className="text-orange-600 hover:text-orange-500 text-sm font-medium">
                      Reorder
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;