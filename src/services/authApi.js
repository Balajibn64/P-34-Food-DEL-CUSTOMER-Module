import axiosInstance from './axiosInstance';

export const login = async (email, password, userType) => {
  const response = await axiosInstance.post('/auth/login', {
    username: email,
    password,
    userType,
  });
  return response.data;
};

export const register = async (role, data) => {
  const response = await axiosInstance.post(`/auth/register/${role}`, data);
  return response.data;
};

// Google login (frontend-only, as before)
export const loginWithGoogle = async (googleToken) => {
  localStorage.setItem('token', googleToken);
  return { token: googleToken };
}; 