import api from '../lib/api';

export interface AmadeusHotelMedia {
  id: string;
  url: string;
  mediaType: string;
  isPrimary: boolean;
  order: number;
  source: string;
  createdAt: string;
}

export interface AmadeusHotelOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AmadeusHotel {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  state: string;
  country: string;
  externalId: string;
  source: string;
  status: string;
  isActive: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  media?: AmadeusHotelMedia[];
  owner?: AmadeusHotelOwner;
  externalData?: Record<string, unknown>;
  imageCount?: number;
  hasPrimaryImage?: boolean;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AmadeusHotelsResponse {
  success: boolean;
  data: {
    hotels: AmadeusHotel[];
    pagination: PaginationMeta;
  };
  message?: string;
}

export interface AmadeusHotelDetailResponse {
  success: boolean;
  data: AmadeusHotel;
  message?: string;
}

export interface UpdateAmadeusHotelData {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: string;
  isActive?: boolean;
}

export interface AddImageData {
  url: string;
  isPrimary?: boolean;
}

export interface ReorderImagesData {
  imageOrders: Array<{
    imageId: string;
    order: number;
  }>;
}

// Get list of Amadeus hotels
export const getAmadeusHotels = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  status?: string;
} = {}): Promise<AmadeusHotelsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.city) queryParams.append('city', params.city);
  if (params.status) queryParams.append('status', params.status);
  
  const queryString = queryParams.toString();
  const url = `/admin/dashboard/amadeus-hotels${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);
  return response.data;
};

// Get single hotel details
export const getAmadeusHotelDetails = async (hotelId: string): Promise<AmadeusHotelDetailResponse> => {
  const response = await api.get(`/admin/dashboard/amadeus-hotels/${hotelId}`);
  return response.data;
};

// Update hotel
export const updateAmadeusHotel = async (
  hotelId: string,
  data: UpdateAmadeusHotelData
): Promise<AmadeusHotelDetailResponse> => {
  const response = await api.put(`/admin/dashboard/amadeus-hotels/${hotelId}`, data);
  return response.data;
};

// Add image
export const addAmadeusHotelImage = async (
  hotelId: string,
  data: AddImageData
): Promise<{ success: boolean; data: { media: AmadeusHotelMedia }; message?: string }> => {
  const response = await api.post(`/admin/dashboard/amadeus-hotels/${hotelId}/images`, data);
  return response.data;
};

// Delete image
export const deleteAmadeusHotelImage = async (
  hotelId: string,
  imageId: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete(`/admin/dashboard/amadeus-hotels/${hotelId}/images/${imageId}`);
  return response.data;
};

// Set primary image
export const setPrimaryImage = async (
  hotelId: string,
  imageId: string
): Promise<{ success: boolean; data: { media: AmadeusHotelMedia }; message?: string }> => {
  const response = await api.put(`/admin/dashboard/amadeus-hotels/${hotelId}/images/${imageId}/primary`);
  return response.data;
};

// Reorder images
export const reorderAmadeusHotelImages = async (
  hotelId: string,
  data: ReorderImagesData
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.put(`/admin/dashboard/amadeus-hotels/${hotelId}/images/reorder`, data);
  return response.data;
};

// Refresh images from Google Places
export const refreshAmadeusHotelImages = async (
  hotelId: string
): Promise<{ success: boolean; data: { addedCount: number; images: AmadeusHotelMedia[] }; message?: string }> => {
  const response = await api.post(`/admin/dashboard/amadeus-hotels/${hotelId}/refresh-images`);
  return response.data;
};

// Get real-time hotel offers from Amadeus
export const getAmadeusHotelOffers = async (
  hotelId: string,
  checkInDate?: string,
  checkOutDate?: string,
  adults?: number
): Promise<{
  success: boolean;
  data: {
    hotelId: string;
    hotelName: string;
    externalId: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    offersFound: number;
    bestPrice: number | null;
    bestCurrency: string;
    offers: Array<{
      offerId: string;
      checkInDate: string;
      checkOutDate: string;
      roomType: string;
      roomDescription: string;
      boardType: string;
      guests: number;
      price: {
        total: string;
        currency: string;
        base?: string;
        taxes?: Array<{ amount: string; currency: string; code?: string }>;
        variations?: {
          average?: { base?: string; total?: string };
          changes?: Array<{ startDate: string; endDate: string; total: string; base?: string }>;
        };
      };
      cancellationPolicy: string;
      paymentType: string;
      available: boolean;
    }>;
    isMock: boolean;
  };
  message?: string;
}> => {
  const params = new URLSearchParams();
  if (checkInDate) params.append('checkInDate', checkInDate);
  if (checkOutDate) params.append('checkOutDate', checkOutDate);
  if (adults) params.append('adults', adults.toString());
  
  const queryString = params.toString();
  const url = `/admin/dashboard/amadeus-hotels/${hotelId}/offers${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);
  return response.data;
};

// Update hotel price from Amadeus offers
export const updateAmadeusHotelPrice = async (
  hotelId: string,
  checkInDate?: string,
  checkOutDate?: string
): Promise<{
  success: boolean;
  data?: {
    hotelId: string;
    previousPrice?: number;
    newPrice: number;
    currency: string;
    offersFound: number;
  };
  message?: string;
}> => {
  const response = await api.post(`/admin/dashboard/amadeus-hotels/${hotelId}/update-price`, {
    checkInDate,
    checkOutDate
  });
  return response.data;
};

// Exchange Rate Management
export const getExchangeRates = async (): Promise<{
  success: boolean;
  data: {
    USD: number;
    EUR: number;
    GBP: number;
    NGN: number;
  };
  message?: string;
}> => {
  const response = await api.get('/admin/dashboard/exchange-rates');
  return response.data;
};

export const updateExchangeRates = async (rates: {
  USD?: number;
  EUR?: number;
  GBP?: number;
  NGN?: number;
}): Promise<{
  success: boolean;
  data: {
    USD: number;
    EUR: number;
    GBP: number;
    NGN: number;
  };
  message?: string;
}> => {
  const response = await api.put('/admin/dashboard/exchange-rates', { rates });
  return response.data;
};
