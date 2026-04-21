import React, { useState } from 'react';
import { X, Loader, Upload, Trash2 } from 'lucide-react';
import { useCreatePropertyForUserMutation } from '../../hooks/useAdminUsers';
import { locationApiService } from '../../services/locationApi';

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const CreatePropertyModal: React.FC<CreatePropertyModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName
}) => {
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    shortDescription: '',
    propertyType: 'apartment',
    listingType: 'rent',

    // Pricing
    price: '',
    originalPrice: '',
    currency: 'NGN',
    pricePeriod: '',
    negotiable: false,

    // Fee fields
    cautionFee: '',
    agencyFee: '',
    legalFee: '',
    serviceCharge: '',

    // Location
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
    neighborhood: '',
    landmark: '',

    // Property Details
    bedrooms: '',
    bathrooms: '',
    toilets: '',
    parkingSpaces: '',
    floorArea: '',
    landArea: '',
    floorNumber: '',
    totalFloors: '',
    yearBuilt: '',
    conditionStatus: '',

    // Boolean fields
    petFriendly: false,
    smokingAllowed: false,
    furnished: false,

    // Availability
    availableFrom: '',
    availableUntil: '',
    minLeasePeriod: '',
    maxLeasePeriod: '',
    minStayNights: '',
    maxStayNights: '',
    instantBooking: false,
    cancellationPolicy: 'moderate',

    // SEO
    featured: false,
    featuredUntil: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Location states
  const [nigerianStates] = useState(locationApiService.getAllStates());
  const [cities, setCities] = useState<string[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  const createPropertyMutation = useCreatePropertyForUserMutation();

  // Handle state change to populate cities
  const handleStateChange = (stateName: string) => {
    setFormData({ ...formData, state: stateName, city: '' });
    const stateCities = locationApiService.getCitiesByState(stateName);
    setCities(stateCities);
  };

  // Handle address input to show suggestions
  const handleAddressChange = (value: string) => {
    setFormData({ ...formData, address: value });
    if (value.length >= 2) {
      const suggestions = locationApiService.getAddressSuggestions(value, formData.city, formData.state);
      setAddressSuggestions(suggestions.map(s => s.fullAddress));
      setShowAddressSuggestions(true);
    } else {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  };

  // Handle address suggestion selection
  const handleAddressSuggestionSelect = (suggestion: string) => {
    setFormData({ ...formData, address: suggestion });
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setError('Please select valid image files');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.price || !formData.address) {
      setError('Title, price, and address are required');
      return;
    }

    createPropertyMutation.mutate(
      {
        userId,
        propertyData: {
          // Basic Info
          title: formData.title,
          description: formData.description || formData.shortDescription || 'Property created by admin',
          shortDescription: formData.shortDescription,
          propertyType: formData.propertyType,
          listingType: formData.listingType,

          // Pricing
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          currency: formData.currency,
          pricePeriod: formData.pricePeriod || null,
          negotiable: formData.negotiable,

          // Fee fields
          cautionFee: formData.cautionFee ? parseFloat(formData.cautionFee) : null,
          agencyFee: formData.agencyFee ? parseFloat(formData.agencyFee) : null,
          legalFee: formData.legalFee ? parseFloat(formData.legalFee) : null,
          serviceCharge: formData.serviceCharge ? parseFloat(formData.serviceCharge) : null,

          // Location
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode || null,
          neighborhood: formData.neighborhood || null,
          landmark: formData.landmark || null,

          // Property Details
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          toilets: formData.toilets ? parseInt(formData.toilets) : null,
          parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : null,
          floorArea: formData.floorArea ? parseFloat(formData.floorArea) : null,
          landArea: formData.landArea ? parseFloat(formData.landArea) : null,
          floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : null,
          totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
          yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
          conditionStatus: formData.conditionStatus || null,

          // Boolean fields
          petFriendly: formData.petFriendly,
          smokingAllowed: formData.smokingAllowed,
          furnished: formData.furnished,

          // Availability
          availableFrom: formData.availableFrom || null,
          availableUntil: formData.availableUntil || null,
          minLeasePeriod: formData.minLeasePeriod ? parseInt(formData.minLeasePeriod) : null,
          maxLeasePeriod: formData.maxLeasePeriod ? parseInt(formData.maxLeasePeriod) : null,
          minStayNights: formData.minStayNights ? parseInt(formData.minStayNights) : null,
          maxStayNights: formData.maxStayNights ? parseInt(formData.maxStayNights) : null,
          instantBooking: formData.instantBooking,
          cancellationPolicy: formData.cancellationPolicy,

          // SEO
          featured: formData.featured,
          featuredUntil: formData.featuredUntil || null,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : null,
          seoTitle: formData.seoTitle || null,
          seoDescription: formData.seoDescription || null,
          seoKeywords: formData.seoKeywords ? formData.seoKeywords.split(',').map(t => t.trim()) : null
        },
        images
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Failed to create property');
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Property for {userName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            disabled={createPropertyMutation.isPending}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Beautiful Apartment in Lagos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Detailed description of the property"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Images (Max 8 images)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                id="property-images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={createPropertyMutation.isPending}
              />
              <label
                htmlFor="property-images"
                className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click to upload images
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  PNG, JPG, WEBP up to 50MB each
                </p>
              </label>
            </div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      disabled={createPropertyMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Short Description
            </label>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of the property"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Type *
              </label>
              <select
                required
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="studio">Studio</option>
                <option value="penthouse">Penthouse</option>
                <option value="townhouse">Townhouse</option>
                <option value="duplex">Duplex</option>
                <option value="bungalow">Bungalow</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Listing Type *
              </label>
              <select
                required
                value={formData.listingType}
                onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
                <option value="shortlet">Shortlet</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency *
              </label>
              <select
                required
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="NGN">NGN</option>
              
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Original Price
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="60000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Period
              </label>
              <select
                value={formData.pricePeriod}
                onChange={(e) => setFormData({ ...formData, pricePeriod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select period</option>
                <option value="per_night">Per Night</option>
                <option value="per_month">Per Month</option>
                <option value="per_year">Per Year</option>
                <option value="one_time">One Time</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.negotiable}
                  onChange={(e) => setFormData({ ...formData, negotiable: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Negotiable
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fee Fields (Optional - for rent/sale properties)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Caution Fee
                </label>
                <input
                  type="number"
                  value={formData.cautionFee}
                  onChange={(e) => setFormData({ ...formData, cautionFee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Agency Fee
                </label>
                <input
                  type="number"
                  value={formData.agencyFee}
                  onChange={(e) => setFormData({ ...formData, agencyFee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Legal Fee
                </label>
                <input
                  type="number"
                  value={formData.legalFee}
                  onChange={(e) => setFormData({ ...formData, legalFee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Service Charge
                </label>
                <input
                  type="number"
                  value={formData.serviceCharge}
                  onChange={(e) => setFormData({ ...formData, serviceCharge: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="123 Main Street"
              />
              {showAddressSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {addressSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleAddressSuggestionSelect(suggestion)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City *
              </label>
              <select
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!formData.state}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State *
              </label>
              <select
                required
                value={formData.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select State</option>
                {nigerianStates.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Nigeria"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="100001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Neighborhood
              </label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Ikeja"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Landmark
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Near shopping mall"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Toilets
              </label>
              <input
                type="number"
                value={formData.toilets}
                onChange={(e) => setFormData({ ...formData, toilets: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parking Spaces
              </label>
              <input
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Floor Area (sqm)
              </label>
              <input
                type="number"
                value={formData.floorArea}
                onChange={(e) => setFormData({ ...formData, floorArea: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="120"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Land Area (sqm)
              </label>
              <input
                type="number"
                value={formData.landArea}
                onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Floor Number
              </label>
              <input
                type="number"
                value={formData.floorNumber}
                onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Floors
              </label>
              <input
                type="number"
                value={formData.totalFloors}
                onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year Built
              </label>
              <input
                type="number"
                value={formData.yearBuilt}
                onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="2020"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condition Status
              </label>
              <select
                value={formData.conditionStatus}
                onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="needs_renovation">Needs Renovation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property Features
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.petFriendly}
                  onChange={(e) => setFormData({ ...formData, petFriendly: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Pet Friendly
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.smokingAllowed}
                  onChange={(e) => setFormData({ ...formData, smokingAllowed: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Smoking Allowed
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.furnished}
                  onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Furnished
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Availability
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Available From
                </label>
                <input
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Available Until
                </label>
                <input
                  type="date"
                  value={formData.availableUntil}
                  onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Min Lease Period (months)
                </label>
                <input
                  type="number"
                  value={formData.minLeasePeriod}
                  onChange={(e) => setFormData({ ...formData, minLeasePeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="6"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Max Lease Period (months)
                </label>
                <input
                  type="number"
                  value={formData.maxLeasePeriod}
                  onChange={(e) => setFormData({ ...formData, maxLeasePeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Min Stay Nights
                </label>
                <input
                  type="number"
                  value={formData.minStayNights}
                  onChange={(e) => setFormData({ ...formData, minStayNights: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Max Stay Nights
                </label>
                <input
                  type="number"
                  value={formData.maxStayNights}
                  onChange={(e) => setFormData({ ...formData, maxStayNights: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.instantBooking}
                    onChange={(e) => setFormData({ ...formData, instantBooking: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Instant Booking
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Cancellation Policy
                </label>
                <select
                  value={formData.cancellationPolicy}
                  onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="flexible">Flexible</option>
                  <option value="moderate">Moderate</option>
                  <option value="strict">Strict</option>
                  <option value="super_strict">Super Strict</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SEO & Marketing
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Featured Property
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Featured Until
                </label>
                <input
                  type="date"
                  value={formData.featuredUntil}
                  onChange={(e) => setFormData({ ...formData, featuredUntil: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="luxury, modern, prime location"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  SEO Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="apartment, lagos, rent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Beautiful Apartment in Lagos"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  SEO Description
                </label>
                <input
                  type="text"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Short description for search engines"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={createPropertyMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={createPropertyMutation.isPending}
            >
              {createPropertyMutation.isPending ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePropertyModal;
