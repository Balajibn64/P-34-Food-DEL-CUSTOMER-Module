import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getRestaurantById, getRestaurantByIdWithCategory, getCategoryById } from '../services/api';
import { useCart } from '../context/CartContext';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Star, Clock, MapPin, Plus } from 'lucide-react';

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  
  useEffect(() => {
    loadRestaurant();
  }, [id, categoryId]);
  
  const loadRestaurant = async () => {
    setLoading(true);
    try {
      let restaurantData;
      if (categoryId) {
        restaurantData = await getRestaurantByIdWithCategory(id, categoryId);
        const categoryData = await getCategoryById(categoryId);
        setCategory(categoryData);
      } else {
        restaurantData = await getRestaurantById(id);
      }
      setRestaurant(restaurantData);
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = async (dish) => {
    setAddingToCart(dish.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToCart(dish, restaurant.id);
    setAddingToCart(null);
  };
  
  const getDishTypeIcon = (type) => {
    if (type === 'veg') {
      return <div className="w-4 h-4 border-2 border-green-500 flex items-center justify-center">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>;
    } else {
      return <div className="w-4 h-4 border-2 border-red-500 flex items-center justify-center">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      </div>;
    }
  };
  
  const handleBackClick = () => {
    if (categoryId) {
      navigate(`/category/${categoryId}`);
    } else {
      navigate('/');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h2>
          <Button onClick={handleBackClick}>
            Go back
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
              {category && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {category.name}
                </span>
              )}
            </div>
            <p className="text-lg mb-4">{restaurant.cuisines.join(', ')}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{restaurant.rating}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{restaurant.distance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? `${category.name} Menu` : 'Menu'}
          </h2>
          {restaurant.dishes.length > 0 && (
            <p className="text-gray-600">
              {restaurant.dishes.length} item{restaurant.dishes.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>
        
        {restaurant.dishes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {category ? `No ${category.name} items available at this restaurant` : 'No menu items available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurant.dishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
                    {getDishTypeIcon(dish.type)}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{dish.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {dish.rating}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{dish.price}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(dish)}
                    loading={addingToCart === dish.id}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;