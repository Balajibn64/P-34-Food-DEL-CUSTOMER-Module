import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY, MAPS_CONFIG } from '../config/maps';

// Utility functions
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location obtained:', position.coords);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(new Error('Unable to retrieve your location.'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

// Reverse geocoding using Google Geocoding API
export const reverseGeocode = async (latitude, longitude, apiKey) => {
  try {
    console.log('Reverse geocoding for:', latitude, longitude);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    console.log('Geocoding response:', data);
    
    if (data.status !== 'OK') {
      throw new Error(`Geocoding error: ${data.status}`);
    }
    
    const result = data.results[0];
    const addressComponents = result.address_components;
    
    // Extract address components
    const street = addressComponents.find(comp => 
      comp.types.includes('route')
    )?.long_name || '';
    
    const city = addressComponents.find(comp => 
      comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
    )?.long_name || '';
    
    const state = addressComponents.find(comp => 
      comp.types.includes('administrative_area_level_1')
    )?.long_name || '';
    
    const zipCode = addressComponents.find(comp => 
      comp.types.includes('postal_code')
    )?.long_name || '';
    
    const country = addressComponents.find(comp => 
      comp.types.includes('country')
    )?.long_name || '';
    
    return {
      address: result.formatted_address,
      street,
      city,
      state,
      zipCode,
      country,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

const AddressMapPicker = ({ addressForm, setAddressForm, onAddressUpdate }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Initialize Google Maps with Places Autocomplete
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      const google = window.google;
      
      // If we have coordinates, use them
      const center = addressForm.latitude && addressForm.longitude 
        ? { lat: Number(addressForm.latitude), lng: Number(addressForm.longitude) }
        : MAPS_CONFIG.defaultCenter;

      const mapInstance = new google.maps.Map(mapContainerRef.current, {
        center,
        zoom: addressForm.latitude && addressForm.longitude ? MAPS_CONFIG.streetZoom : MAPS_CONFIG.defaultZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        ...MAPS_CONFIG.mapOptions,
      });

      setMap(mapInstance);

      // Initialize Places Autocomplete
      if (searchInputRef.current) {
        const autocompleteInstance = new google.maps.places.Autocomplete(searchInputRef.current, {
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'IN' }, // Restrict to India
        });

        // Handle place selection
        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace();
          
          if (!place.geometry || !place.geometry.location) {
            console.log('No location data for this place');
            return;
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          console.log('Place selected:', place.name, lat, lng);
          
          // Update form with new coordinates
          setAddressForm((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));

          // Update map center and zoom
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(MAPS_CONFIG.streetZoom);

          // Update or create marker
          if (marker) {
            marker.setPosition(place.geometry.location);
          } else {
            const newMarker = new google.maps.Marker({
              position: place.geometry.location,
              map: mapInstance,
              draggable: true,
            });
            setMarker(newMarker);

            // Add drag listener
            newMarker.addListener('dragend', (event) => {
              const newPosition = event.latLng;
              setAddressForm((prev) => ({
                ...prev,
                latitude: newPosition.lat(),
                longitude: newPosition.lng(),
              }));
            });
          }

          // Auto-fill address if available
          if (place.formatted_address) {
            setAddressForm((prev) => ({
              ...prev,
              address: place.formatted_address,
            }));
          }
        });

        setAutocomplete(autocompleteInstance);
      }

      // Add marker if coordinates exist
      if (addressForm.latitude && addressForm.longitude) {
        const markerInstance = new google.maps.Marker({
          position: { lat: Number(addressForm.latitude), lng: Number(addressForm.longitude) },
          map: mapInstance,
          draggable: true,
        });
        setMarker(markerInstance);

        // Add drag listener
        markerInstance.addListener('dragend', (event) => {
          const position = event.latLng;
          setAddressForm((prev) => ({
            ...prev,
            latitude: position.lat(),
            longitude: position.lng(),
          }));
        });
      }

      // Add click listener to map
      mapInstance.addListener('click', (event) => {
        const position = event.latLng;
        console.log('Map clicked at:', position.lat(), position.lng());
        
        setAddressForm((prev) => ({
          ...prev,
          latitude: position.lat(),
          longitude: position.lng(),
        }));

        // Update or create marker
        if (marker) {
          marker.setPosition(position);
        } else {
          const newMarker = new google.maps.Marker({
            position,
            map: mapInstance,
            draggable: true,
          });
          setMarker(newMarker);

          // Add drag listener
          newMarker.addListener('dragend', (event) => {
            const newPosition = event.latLng;
            setAddressForm((prev) => ({
              ...prev,
              latitude: newPosition.lat(),
              longitude: newPosition.lng(),
            }));
          });
        }
      });

    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
      setMapError('Failed to load Google Maps. Please check your API key.');
    });
  }, []);

  // Update map when coordinates change
  useEffect(() => {
    if (map && addressForm.latitude && addressForm.longitude) {
      const position = { 
        lat: Number(addressForm.latitude), 
        lng: Number(addressForm.longitude) 
      };
      
      map.setCenter(position);
      map.setZoom(MAPS_CONFIG.streetZoom);

      if (marker) {
        marker.setPosition(position);
      } else {
        const newMarker = new window.google.maps.Marker({
          position,
          map,
          draggable: true,
        });
        setMarker(newMarker);

        // Add drag listener
        newMarker.addListener('dragend', (event) => {
          const newPosition = event.latLng;
          setAddressForm((prev) => ({
            ...prev,
            latitude: newPosition.lat(),
            longitude: newPosition.lng(),
          }));
        });
      }
    }
  }, [addressForm.latitude, addressForm.longitude, map, marker]);

  // Handle "Use My Location" button
  const handleUseMyLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setMapError(null);
    try {
      const { latitude, longitude } = await getCurrentLocation();
      console.log('Setting location:', latitude, longitude);
      setAddressForm((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
    } catch (error) {
      console.error('Location error:', error);
      setMapError(error.message);
      alert(error.message);
    } finally {
      setIsLoadingLocation(false);
    }
  }, [setAddressForm]);

  // Handle reverse geocoding
  const handleReverseGeocode = useCallback(async () => {
    if (!addressForm.latitude || !addressForm.longitude) {
      alert('Please set a location first (click on map or use "Use My Location")');
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      alert('Please set up your Google Maps API key in the .env file to use reverse geocoding');
      return;
    }

    setIsGeocoding(true);
    setMapError(null);
    try {
      const addressData = await reverseGeocode(
        addressForm.latitude, 
        addressForm.longitude,
        GOOGLE_MAPS_API_KEY
      );
      
      console.log('Setting address data:', addressData);
      setAddressForm((prev) => ({
        ...prev,
        address: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        country: addressData.country,
      }));
      
      if (onAddressUpdate) {
        onAddressUpdate(addressData);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setMapError(error.message);
      alert('Failed to fetch address details. Please fill manually.');
    } finally {
      setIsGeocoding(false);
    }
  }, [addressForm.latitude, addressForm.longitude, setAddressForm, onAddressUpdate]);

  if (mapError) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Map Error:</p>
          <p>{mapError}</p>
          <button
            onClick={() => setMapError(null)}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* API Key Warning */}
      {!GOOGLE_MAPS_API_KEY && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p className="font-bold">Setup Required:</p>
          <p>Please add your Google Maps API key to the .env file as VITE_GOOGLE_MAPS_API_KEY to enable all features.</p>
        </div>
      )}

      {/* Search Location */}
      <div className="space-y-2">
        <label htmlFor="location-search" className="block text-sm font-medium text-gray-700">
          Search for a location
        </label>
        <input
          ref={searchInputRef}
          id="location-search"
          type="text"
          placeholder="Search for an address, place, or landmark..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Start typing to see suggestions from Google Places
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLoadingLocation}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoadingLocation ? 'Getting Location...' : 'Use My Location'}
        </button>
        
        <button
          type="button"
          onClick={handleReverseGeocode}
          disabled={isGeocoding || !addressForm.latitude || !addressForm.longitude}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isGeocoding ? 'Fetching Address...' : 'Auto-fill Address'}
        </button>
      </div>

      {/* Map */}
      <div className="border rounded-lg overflow-hidden">
        <div 
          ref={mapContainerRef}
          style={{ height: 300, width: '100%' }}
        />
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-600">
        <p>• Search for a location using the search box above</p>
        <p>• Click on the map to set location manually</p>
        <p>• Drag the marker to adjust position</p>
        <p>• Use "Use My Location" to get your current coordinates</p>
        <p>• Use "Auto-fill Address" to populate address fields from coordinates</p>
      </div>
    </div>
  );
};

export default AddressMapPicker; 