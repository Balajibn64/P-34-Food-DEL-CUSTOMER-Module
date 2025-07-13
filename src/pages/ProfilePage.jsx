import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateCustomerDetails, addAddress, editAddress, deleteAddress, getUserAddresses } from '../services/customerApi';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import AddressMapPicker from '../components/AddressMapPicker';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  // New state for profile image
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState('');
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || user.firstName || '',
        last_name: user.last_name || user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setProfileImgPreview(user.profilePic || user.profile_pic || '/default-avatar.png');
    }
  }, [user]);
  
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: 'BTM layout,16th Main Road',
      city: 'Bengaluru',
      zipCode: '590001',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      address: 'Anna Nagar, Guindy',
      city: 'Chennai',
      zipCode: '6000028',
      isDefault: false
    }
  ]);
  // Modal state for address add/edit
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    id: null,
    addressName: '',
    address: '', // street
    city: '',
    state: '',
    zipCode: '', // pincode
    country: '',
    latitude: '',
    longitude: '',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Open modal for add
  const handleAddAddressClick = () => {
    setAddressForm({ id: null, addressName: '', address: '', city: '', state: '', zipCode: '', country: '', latitude: '', longitude: '' });
    setIsEditingAddress(false);
    setShowAddressModal(true);
  };
  // Open modal for edit
  const handleEditAddressClick = (address) => {
    setAddressForm({
      id: address.id,
      addressName: address.addressName || '',
      address: address.street || address.address || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.pincode || address.zipCode || '',
      country: address.country || '',
      latitude: address.latitude || '',
      longitude: address.longitude || '',
    });
    setIsEditingAddress(true);
    setShowAddressModal(true);
  };
  // Handle address form change
  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  // Save address (add or edit)
  const handleAddressFormSave = async () => {
    try {
      let updatedAddresses;
      if (isEditingAddress) {
        updatedAddresses = await editAddress(addressForm);
      } else {
        updatedAddresses = await addAddress(addressForm);
      }
      setAddresses(updatedAddresses);
      setShowAddressModal(false);
    } catch (err) {
      alert('Failed to save address');
    }
  };
  // Delete address
  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const updatedAddresses = await deleteAddress(id);
      setAddresses(updatedAddresses);
    } catch (err) {
      alert('Failed to delete address');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image change
  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB. Please choose a smaller image.');
        return;
      }
      
      setProfileImg(file);
      setProfileImgPreview(URL.createObjectURL(file));
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = await updateCustomerDetails(formData, profileImg);
      updateProfile(updatedData);
      // Update preview to new image from backend if available (support both property names)
      if (updatedData.profilePic || updatedData.profile_pic) {
        setProfileImgPreview(updatedData.profilePic || updatedData.profile_pic);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || user?.firstName || '',
      last_name: user?.last_name || user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setProfileImg(null);
    setProfileImgPreview(user?.profile_pic || '/default-avatar.png');
    setIsEditing(false);
  };
  
  // Helper function to get display name
  const getDisplayName = () => {
    const firstName = user?.first_name || user?.firstName;
    const lastName = user?.last_name || user?.lastName;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else if (user?.username) {
      return user.username;
    } else {
      return 'User';
    }
  };
  
  useEffect(() => {
    getUserAddresses()
      .then((data) => {
        if (Array.isArray(data)) {
          setAddresses(data);
        } else {
          setAddresses([]); // fallback if backend returns non-array
        }
      })
      .catch((err) => {
        setAddresses([]); // fallback on error
        console.error('Failed to fetch addresses:', err);
      });
  }, [user]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Profile Info */}
          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="success"
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      className="flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20">
                    <img
                      src={profileImgPreview}
                      alt={getDisplayName()}
                      className="w-20 h-20 rounded-full object-cover bg-gray-200"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    {/* Edit overlay */}
                    {isEditing && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfileImgChange}
                        />
                        <Edit2 className="h-6 w-6 text-white opacity-80 group-hover:opacity-100" />
                      </label>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{getDisplayName()}</h3>
                    <p className="text-gray-600">{user?.email || 'No email'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                    <Input
                      name="first_name"
                      type="text"
                      label="First Name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="relative">
                    <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                    <Input
                      name="last_name"
                      type="text"
                      label="Last Name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                    <Input
                      name="email"
                      type="email"
                      label="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                    <Input
                      name="phone"
                      type="tel"
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
          

        </div>
        
        {/* Saved Addresses */}
        <Card className="p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
            <Button variant="outline" onClick={handleAddAddressClick}>Add New Address</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.isArray(addresses) && addresses.map((address) => (
              <div
                key={address.id}
                className="p-4 border rounded-lg hover:border-orange-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{address.type}</p>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditAddressClick(address)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteAddress(address.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
         {/* Address Modal */}
         {showAddressModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
             <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
               <h3 className="text-lg font-semibold mb-4">{isEditingAddress ? 'Edit Address' : 'Add Address'}</h3>
               <div className="space-y-3">
                 <Input label="Address Name" name="addressName" value={addressForm.addressName} onChange={handleAddressFormChange} />
                 <Input label="Street" name="address" value={addressForm.address} onChange={handleAddressFormChange} />
                 <Input label="City" name="city" value={addressForm.city} onChange={handleAddressFormChange} />
                 <Input label="State" name="state" value={addressForm.state} onChange={handleAddressFormChange} />
                 <Input label="Pincode" name="zipCode" value={addressForm.zipCode} onChange={handleAddressFormChange} />
                 <Input label="Country" name="country" value={addressForm.country} onChange={handleAddressFormChange} />
                 <Input label="Latitude" name="latitude" value={addressForm.latitude} onChange={handleAddressFormChange} type="number" />
                 <Input label="Longitude" name="longitude" value={addressForm.longitude} onChange={handleAddressFormChange} type="number" />
                 
                 {/* Map Picker Component */}
                 <AddressMapPicker
                   addressForm={addressForm}
                   setAddressForm={setAddressForm}
                   onAddressUpdate={(addressData) => {
                     console.log('Address auto-filled:', addressData);
                   }}
                 />
               </div>
               <div className="flex justify-end space-x-2 mt-6">
                 <Button variant="secondary" onClick={() => setShowAddressModal(false)}>Cancel</Button>
                 <Button variant="success" onClick={handleAddressFormSave}>{isEditingAddress ? 'Save' : 'Add'}</Button>
               </div>
             </div>
           </div>
         )}
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;