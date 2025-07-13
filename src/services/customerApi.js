import axiosInstance from './axiosInstance';

export const getCustomerDetails = async () => {
  // Create FormData to match the backend's MULTIPART_FORM_DATA expectation
  const formData = new FormData();
  // Send empty form data since we're just getting details, not updating
  console.log('Sending getCustomerDetails request with FormData');
  const response = await axiosInstance.post('/customer/details', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('getCustomerDetails response:', response.data);
  return response.data;
};

export const updateCustomerDetails = async (customerData, profilePic = null) => {
  const formData = new FormData();
  
  if (customerData) {
    // Create a Customer object with camelCase field names to match Java model
    const customerObject = {
      firstName: customerData.first_name,
      lastName: customerData.last_name,
      email: customerData.email,
      phone: customerData.phone
    };
    
    console.log('Customer object being sent:', customerObject);
    console.log('JSON string being sent:', JSON.stringify(customerObject));
    
    // Send as JSON blob since backend expects Customer object
    formData.append('update', new Blob([JSON.stringify(customerObject)], {
      type: 'application/json'
    }));
  }
  
  if (profilePic) {
    formData.append('profilePic', profilePic);
  }
  
  console.log('Sending updateCustomerDetails request with data:', customerData);
  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
    if (value instanceof Blob) {
      console.log(`${key} (Blob):`, value.type, value.size, 'bytes');
    }
  }
  
  const response = await axiosInstance.post('/customer/details', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('updateCustomerDetails response:', response.data);
  return response.data;
};

// Get all addresses (no body needed)
export const getUserAddresses = async () => {
  const response = await axiosInstance.get('/customer/address');
  return response.data; // This is the address list
}; 

// Helper to map frontend form to backend AddressDTO
const mapToAddressDTO = (form) => ({
  id: form.id,
  addressName: form.addressName || '',
  street: form.address, // assuming 'address' in form is 'street' in backend
  city: form.city,
  state: form.state || '',
  pincode: form.zipCode || '',
  country: form.country || '',
  latitude: form.latitude || null,
  longitude: form.longitude || null,
});

// Add a new address
export const addAddress = async (addressForm) => {
  const addressData = mapToAddressDTO(addressForm);
  const response = await axiosInstance.post('/customer/address', addressData);
  return response.data; // This is the updated address list
};

// Edit an existing address
export const editAddress = async (addressForm) => {
  const addressData = mapToAddressDTO(addressForm);
  const response = await axiosInstance.put('/customer/address', addressData);
  return response.data; // This is the updated address list
};

// Delete an address
export const deleteAddress = async (addressId) => {
  const response = await axiosInstance.delete('/customer/address', { data: { id: addressId } });
  return response.data; // This is the updated address list
}; 