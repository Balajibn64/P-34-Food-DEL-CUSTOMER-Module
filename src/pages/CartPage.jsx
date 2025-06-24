import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getUserAddresses, placeOrder } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Minus, Trash2, MapPin, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    selectedAddress,
    setSelectedAddress,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount
  } = useCart();
  
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  
  useEffect(() => {
    loadAddresses();
  }, []);
  
  const loadAddresses = async () => {
    try {
      const data = await getUserAddresses();
      setAddresses(data);
      // Set default address
      const defaultAddress = data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuantityChange = (dishId, newQuantity) => {
    updateQuantity(dishId, newQuantity);
  };
  
  const handleRemoveItem = (dishId) => {
    removeFromCart(dishId);
  };
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    
    setProcessingOrder(true);
    
    try {
      const orderData = {
        items: cartItems,
        address: selectedAddress,
        total: getTotalAmount() + 50 + 25 // Adding delivery fee and taxes
      };
      
      const result = await placeOrder(orderData);
      
      if (result.success) {
        clearCart();
        alert('Order placed successfully!');
        navigate('/orders');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started</p>
          <Button onClick={() => navigate('/')}>
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }
  
  const deliveryFee = 50;
  const taxes = 25;
  const subtotal = getTotalAmount();
  const total = subtotal + deliveryFee + taxes;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAddress?.id === address.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{address.type}</p>
                        <p className="text-sm text-gray-600">{address.address}</p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Order Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">₹{taxes}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{total}</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handlePlaceOrder}
                loading={processingOrder}
                className="w-full mt-6"
                disabled={!selectedAddress}
              >
                Proceed to Pay
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;