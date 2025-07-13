import axiosInstance from './axiosInstance';

export const getUserOrders = async () => {
  const response = await axiosInstance.get('/customer/orders');
  return response.data;
};

export const placeOrder = async (orderData) => {
  const response = await axiosInstance.post('/customer/orders', orderData);
  return response.data;
};

export const modifyOrder = async (orderData) => {
  const response = await axiosInstance.put('/customer/orders', orderData);
  return response.data;
}; 