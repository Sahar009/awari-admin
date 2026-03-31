import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hotel,
  Search,
  RefreshCw,
  Edit3,
  Eye,
  MapPin,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Building2,
  Loader2,
  DollarSign
} from 'lucide-react';
import {
  getAmadeusHotels,
  refreshAmadeusHotelImages,
  updateAmadeusHotelPrice,
  type AmadeusHotel
} from '../services/amadeusAdmin';

const PAGE_SIZE = 20;

interface FiltersState {
  search: string;
  city: string;
  status: string;
}

const defaultFilters: FiltersState = {
  search: '',
  city: '',
  status: ''
};

const AmadeusHotelsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [page, setPage] = useState(1);
  const [hotels, setHotels] = useState<AmadeusHotel[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: PAGE_SIZE,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [updatingPriceId, setUpdatingPriceId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page,
      limit: PAGE_SIZE
    };
    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.city) params.city = filters.city;
    if (filters.status) params.status = filters.status;
    return params;
  }, [filters, page]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const result = await getAmadeusHotels(queryParams);
      if (result.success) {
        setHotels(result.data.hotels);
        setPagination(result.data.pagination);
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to fetch hotels' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to fetch hotels' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [queryParams]);

  const handleFilterChange = (partial: Partial<FiltersState>) => {
    setFilters(prev => ({ ...prev, ...partial }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleRefreshImages = async (hotelId: string) => {
    try {
      setRefreshingId(hotelId);
      const result = await refreshAmadeusHotelImages(hotelId);
      if (result.success) {
        setFeedback({
          type: 'success',
          message: `Refreshed ${result.data.addedCount} images from Google Places`
        });
        fetchHotels();
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to refresh images' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to refresh images' });
    } finally {
      setRefreshingId(null);
    }
  };

  const handleRefreshPrice = async (hotelId: string) => {
    try {
      setUpdatingPriceId(hotelId);
      const result = await updateAmadeusHotelPrice(hotelId);
      if (result.success) {
        setFeedback({
          type: 'success',
          message: `Price updated to ₦${result.data?.newPrice.toLocaleString()} (${result.data?.offersFound} offers found)`
        });
        fetchHotels();
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to update price' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to update price from Amadeus' });
    } finally {
      setUpdatingPriceId(null);
    }
  };

  const formatNGN = (amount: number) => {
    if (!amount || amount <= 0) return '₦0';
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const getStatusBadgeClass = (status: string) => {
    const configs: Record<string, string> = {
      active: 'bg-emerald-500/15 text-emerald-600',
      inactive: 'bg-slate-500/15 text-slate-600',
      pending: 'bg-amber-500/15 text-amber-600',
      draft: 'bg-blue-500/15 text-blue-600',
      rejected: 'bg-red-500/15 text-red-600'
    };
    return configs[status] || 'bg-slate-500/15 text-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Amadeus Hotels</h1>
          <p className="text-slate-500">Manage imported hotels from Amadeus API</p>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange({ city: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Cities</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Port Harcourt">Port Harcourt</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
          
          <button
            onClick={handleResetFilters}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-12">
            <Hotel className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Hotels Found</h3>
            <p className="text-slate-500">No Amadeus hotels match your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Hotel</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Images</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {hotels.map((hotel) => (
                    <tr key={hotel.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Building2 className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{hotel.title}</p>
                            <p className="text-sm text-slate-500">ID: {hotel.externalId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-600 text-sm">
                          <MapPin size={14} />
                          <span>{hotel.city}, {hotel.state}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-900 font-medium text-sm">
                          <span className="text-emerald-600">₦</span>
                          {formatNGN(hotel.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(hotel.status)}`}>
                          {hotel.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <ImageIcon size={16} className="text-slate-400" />
                          <span>{hotel.imageCount || 0} images</span>
                          {hotel.hasPrimaryImage && (
                            <span className="text-emerald-600 text-xs">(primary)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/amadeus-hotels/${hotel.id}/edit`)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => window.open(`/property-details?id=${hotel.id}`, '_blank')}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleRefreshPrice(hotel.id)}
                            disabled={updatingPriceId === hotel.id}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh price from Amadeus"
                          >
                            <DollarSign size={18} className={updatingPriceId === hotel.id ? 'animate-spin' : ''} />
                          </button>
                          <button
                            onClick={() => handleRefreshImages(hotel.id)}
                            disabled={refreshingId === hotel.id}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh images from Google Places"
                          >
                            <RefreshCw size={18} className={refreshingId === hotel.id ? 'animate-spin' : ''} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} hotels
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!pagination.hasNextPage}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AmadeusHotelsPage;
