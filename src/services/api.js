// Mock API service for food delivery app
import axios from "axios";

export const mockCategories = [
  {
    id: 1,
    name: 'Biryani',
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=1'
  },
  {
    id: 2,
    name: 'Pizza',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=1'
  },
  {
    id: 3,
    name: 'Burgers',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=1'
  },
  {
    id: 4,
    name: 'Chinese',
    image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=1'
  },
  {
    id: 5,
    name: 'Desserts',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=1'
  },
  {
    id: 6,
    name: 'South Indian',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=1'
  }
];

export const mockRestaurants = [
  {
    id: 1,
    name: 'Spice Garden',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    rating: 4.5,
    distance: '1.2 km',
    deliveryTime: '25-30 min',
    cuisines: ['Indian', 'North Indian', 'Biryani'],
    categories: [1, 6], // Biryani, South Indian
    dishes: [
      {
        id: 1,
        name: 'Chicken Biryani',
        price: 299,
        description: 'Aromatic basmati rice with tender chicken pieces',
        image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'non-veg',
        rating: 4.6,
        categoryId: 1
      },
      {
        id: 2,
        name: 'Paneer Butter Masala',
        price: 249,
        description: 'Creamy tomato-based curry with cottage cheese',
        image: 'https://images.pexels.com/photos/8629263/pexels-photo-8629263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'veg',
        rating: 4.4,
        categoryId: 6
      },
      {
        id: 3,
        name: 'Garlic Naan',
        price: 89,
        description: 'Soft Indian bread with garlic and herbs',
        image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'veg',
        rating: 4.3,
        categoryId: 6
      },
      {
        id: 8,
        name: 'Mutton Biryani',
        price: 349,
        description: 'Tender mutton pieces with fragrant basmati rice',
        image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'non-veg',
        rating: 4.7,
        categoryId: 1
      }
    ]
  },
  {
    id: 2,
    name: 'Pizza Palace',
    image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    rating: 4.2,
    distance: '2.1 km',
    deliveryTime: '20-25 min',
    cuisines: ['Italian', 'Pizza', 'Pasta'],
    categories: [2], // Pizza
    dishes: [
      {
        id: 4,
        name: 'Margherita Pizza',
        price: 399,
        description: 'Classic pizza with fresh mozzarella and basil',
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'veg',
        rating: 4.5,
        categoryId: 2
      },
      {
        id: 5,
        name: 'Chicken Pepperoni',
        price: 549,
        description: 'Loaded with chicken pepperoni and cheese',
        image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'non-veg',
        rating: 4.7,
        categoryId: 2
      },
      {
        id: 9,
        name: 'Veggie Supreme Pizza',
        price: 449,
        description: 'Loaded with fresh vegetables and cheese',
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'veg',
        rating: 4.3,
        categoryId: 2
      }
    ]
  },
  {
    id: 3,
    name: 'Burger Junction',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    rating: 4.0,
    distance: '0.8 km',
    deliveryTime: '15-20 min',
    cuisines: ['American', 'Burgers', 'Fast Food'],
    categories: [3], // Burgers
    dishes: [
      {
        id: 6,
        name: 'Classic Beef Burger',
        price: 299,
        description: 'Juicy beef patty with fresh vegetables',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'non-veg',
        rating: 4.2,
        categoryId: 3
      },
      {
        id: 7,
        name: 'Veggie Delight',
        price: 249,
        description: 'Grilled vegetables with special sauce',
        image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'veg',
        rating: 4.0,
        categoryId: 3
      }
    ]
  },
  {
    id: 4,
    name: 'Dragon Wok',
    image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    rating: 4.3,
    distance: '1.5 km',
    deliveryTime: '30-35 min',
    cuisines: ['Chinese', 'Asian', 'Noodles'],
    categories: [4], // Chinese
    dishes: [
      {
        id: 10,
        name: 'Chicken Fried Rice',
        price: 199,
        description: 'Wok-tossed rice with chicken and vegetables',
        image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'non-veg',
        rating: 4.4,
        categoryId: 4
      },
      {
        id: 11,
        name: 'Veg Hakka Noodles',
        price: 179,
        description: 'Stir-fried noodles with fresh vegetables',
        image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'veg',
        rating: 4.2,
        categoryId: 4
      }
    ]
  },
  {
    id: 5,
    name: 'Sweet Treats',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    rating: 4.6,
    distance: '0.5 km',
    deliveryTime: '10-15 min',
    cuisines: ['Desserts', 'Bakery', 'Ice Cream'],
    categories: [5], // Desserts
    dishes: [
      {
        id: 12,
        name: 'Chocolate Cake',
        price: 299,
        description: 'Rich chocolate cake with cream frosting',
        image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'veg',
        rating: 4.8,
        categoryId: 5
      },
      {
        id: 13,
        name: 'Vanilla Ice Cream',
        price: 149,
        description: 'Creamy vanilla ice cream scoop',
        image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        type: 'veg',
        rating: 4.5,
        categoryId: 5
      }
    ]
  }
];

export const mockAddresses = [
  {
    id: 1,
    type: 'Home',
    address: 'BTM Layout, 16th Main, 1st Sector',
    city: 'Bengaluru',
    zipCode: '560001',
    isDefault: true
  },
  {
    id: 2,
    type: 'Office',
    address: 'Anna Nagar, 1st Street',
    city: 'Chennai',
    zipCode: '600001',
    isDefault: false
  }
];

export const mockOrders = [
  {
    id: 1,
    orderDate: '2024-01-15T10:30:00Z',
    status: 'delivered',
    total: 549,
    restaurant: 'Spice Garden',
    paymentMethod: 'UPI',
    paymentId: 'UPI123456789',
    paymentStatus: 'Success',
    items: [
      { name: 'Chicken Biryani', quantity: 1, price: 299 },
      { name: 'Paneer Butter Masala', quantity: 1, price: 249 }
    ]
  },
  {
    id: 2,
    orderDate: '2024-01-14T19:45:00Z',
    status: 'cancelled',
    total: 399,
    restaurant: 'Pizza Palace',
    paymentMethod: 'Credit Card',
    paymentId: 'CC987654321',
    paymentStatus: 'Refunded',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 399 }
    ]
  },
  {
    id: 3,
    orderDate: '2024-01-13T14:20:00Z',
    status: 'delivered',
    total: 548,
    restaurant: 'Burger Junction',
    paymentMethod: 'Debit Card',
    paymentId: 'DC456789123',
    paymentStatus: 'Success',
    items: [
      { name: 'Classic Beef Burger', quantity: 1, price: 299 },
      { name: 'Veggie Delight', quantity: 1, price: 249 }
    ]
  },
  {
    id: 4,
    orderDate: '2024-01-12T12:15:00Z',
    status: 'preparing',
    total: 378,
    restaurant: 'Dragon Wok',
    paymentMethod: 'UPI',
    paymentId: 'UPI789123456',
    paymentStatus: 'Success',
    items: [
      { name: 'Chicken Fried Rice', quantity: 1, price: 199 },
      { name: 'Veg Hakka Noodles', quantity: 1, price: 179 }
    ]
  },
  {
    id: 5,
    orderDate: '2024-01-11T16:00:00Z',
    status: 'delivered',
    total: 448,
    restaurant: 'Jaya Kothi Resto',
    paymentMethod: 'Cash on Delivery',
    paymentId: 'COD123456789',
    paymentStatus: 'Success',
    items: [
      { name: 'Chocolate Cake', quantity: 1, price: 299 },
      { name: 'Vanilla Ice Cream', quantity: 1, price: 149 }
    ]
  }
];

// API Functions
export const getCategories = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockCategories;
};

export const getRestaurantsByCategory = async (categoryId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockRestaurants.filter(restaurant => 
    restaurant.categories.includes(parseInt(categoryId))
  );
};

export const getCategoryById = async (categoryId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockCategories.find(category => category.id === parseInt(categoryId));
};

export const searchRestaurants = async (query, location) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query) return mockRestaurants;
  
  return mockRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
    restaurant.cuisines.some(cuisine => 
      cuisine.toLowerCase().includes(query.toLowerCase())
    )
  );
};

export const getRestaurantById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockRestaurants.find(restaurant => restaurant.id === parseInt(id));
};

export const getRestaurantByIdWithCategory = async (id, categoryId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const restaurant = mockRestaurants.find(restaurant => restaurant.id === parseInt(id));
  
  if (restaurant && categoryId) {
    // Filter dishes by category
    const filteredDishes = restaurant.dishes.filter(dish => 
      dish.categoryId === parseInt(categoryId)
    );
    return { ...restaurant, dishes: filteredDishes };
  }
  
  return restaurant;
};

export const getUserAddresses = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockAddresses;
};

export const getUserOrders = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  // Get orders from localStorage, fallback to mockOrders if empty
  const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
  return localOrders.length > 0 ? localOrders : mockOrders;
};

export const placeOrder = async (orderData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newOrder = { ...orderData, id: Date.now(), orderDate: new Date().toISOString(), status: "confirmed" };

  // Get existing orders from localStorage
  const existing = JSON.parse(localStorage.getItem("orders") || "[]");
  // Add new order
  localStorage.setItem("orders", JSON.stringify([newOrder, ...existing]));

  return { success: true, order: newOrder };
};
