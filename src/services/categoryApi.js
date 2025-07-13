import axiosInstance from './axiosInstance';

export const getCategories = async () => {
  const response = await axiosInstance.get('/categories'); // Adjust endpoint if needed
  return response.data;
};

export const getCategoryById = async (categoryId) => {
  const response = await axiosInstance.get(`/categories/${categoryId}`); // Adjust endpoint if needed
  return response.data;
}; 