import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Hotel,
  ArrowLeft,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Star,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  Globe,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  getAmadeusHotelDetails,
  updateAmadeusHotel,
  addAmadeusHotelImage,
  deleteAmadeusHotelImage,
  setPrimaryImage,
  refreshAmadeusHotelImages,
  type AmadeusHotel,
  type UpdateAmadeusHotelData
} from '../services/amadeusAdmin';

const AmadeusHotelEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState<AmadeusHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [addingImage, setAddingImage] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'details' | 'images'>('details');
  
  const [formData, setFormData] = useState<UpdateAmadeusHotelData>({
    title: '',
    description: '',
    price: 0,
    currency: 'NGN',
    bedrooms: 0,
    bathrooms: 0,
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    status: 'pending'
  });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const result = await getAmadeusHotelDetails(id!);
      if (result.success && result.data) {
        const data = result.data;
        setHotel(data);
        
        // Set form data with proper fallbacks
        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: typeof data.price === 'number' ? data.price : 0,
          currency: data.currency || 'NGN',
          bedrooms: typeof data.bedrooms === 'number' ? data.bedrooms : 0,
          bathrooms: typeof data.bathrooms === 'number' ? data.bathrooms : 0,
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || 'Nigeria',
          status: data.status || 'pending'
        });
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to fetch hotel details' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to fetch hotel details' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await updateAmadeusHotel(id!, formData);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Hotel updated successfully' });
        fetchHotelDetails();
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to update hotel' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to update hotel' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return;
    
    try {
      setAddingImage(true);
      const result = await addAmadeusHotelImage(id!, { url: newImageUrl });
      if (result.success) {
        setFeedback({ type: 'success', message: 'Image added successfully' });
        setNewImageUrl('');
        fetchHotelDetails();
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to add image' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to add image' });
    } finally {
      setAddingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const result = await deleteAmadeusHotelImage(id!, imageId);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Image deleted successfully' });
        fetchHotelDetails();
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to delete image' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to delete image' });
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      const result = await setPrimaryImage(id!, imageId);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Primary image set successfully' });
        fetchHotelDetails();
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to set primary image' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to set primary image' });
    }
  };

  const handleRefreshImages = async () => {
    try {
      setRefreshing(true);
      const result = await refreshAmadeusHotelImages(id!);
      if (result.success) {
        setFeedback({ type: 'success', message: `Refreshed ${result.data.addedCount} images from Google Places` });
        fetchHotelDetails();
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to refresh images' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to refresh images' });
    } finally {
      setRefreshing(false);
    }
  };

  const formatPrice = (price: number) => {
    if (!price || price <= 0) return '₦0';
    return `₦${price.toLocaleString('en-NG')}`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      inactive: 'bg-slate-100 text-slate-800 border-slate-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      draft: 'bg-blue-100 text-blue-800 border-blue-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-slate-500">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Hotel className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Hotel Not Found</h3>
          <p className="text-slate-500 mb-6">The hotel you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/amadeus-hotels')}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <ArrowLeft size={18} />
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/amadeus-hotels')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors mt-1"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{hotel.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(hotel.status)}`}>
                  {hotel.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {hotel.city}, {hotel.state}
                </span>
                <span className="flex items-center gap-1">
                  <Globe size={14} />
                  ID: {hotel.externalId}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={14} className="text-emerald-600" />
                  <span className="font-medium text-slate-900">{formatPrice(hotel.price)}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(`/property-details?id=${hotel.id}`, '_blank')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink size={16} />
              View on Site
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {feedback.message}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Hotel Details
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'images'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Images
            <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs text-slate-600">
              {hotel.media?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Hotel size={20} className="text-indigo-600" />
                Basic Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hotel Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="Enter hotel name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                    placeholder="Describe the hotel..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price (NGN)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms || ''}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms || ''}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-indigo-600" />
                Location
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Status</h3>
              <div className="space-y-3">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                  <option value="rejected">Rejected</option>
                </select>
                <p className="text-xs text-slate-500">
                  Current status affects visibility on the platform
                </p>
              </div>
            </div>

            {/* Info Card */}
            {hotel.externalData && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Amadeus Data</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      External ID: <span className="font-mono">{hotel.externalId}</span>
                    </p>
                    <details>
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Raw Data
                      </summary>
                      <pre className="mt-3 p-3 bg-white/70 rounded-lg overflow-auto max-h-48 text-xs text-slate-700">
                        {JSON.stringify(hotel.externalData, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('images')}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ImageIcon size={16} />
                  Manage Images
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          {/* Add Image Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600" />
                Add New Image
              </h2>
              <button
                onClick={handleRefreshImages}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {refreshing ? 'Refreshing...' : 'Refresh from Google'}
              </button>
            </div>
            
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                onClick={handleAddImage}
                disabled={addingImage || !newImageUrl.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {addingImage ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Add Image
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Enter a direct URL to an image, or use "Refresh from Google" to fetch images from Google Places
            </p>
          </div>

          {/* Images Grid */}
          {hotel.media && hotel.media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hotel.media.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                    image.isPrimary 
                      ? 'border-amber-400 shadow-lg' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="aspect-square bg-slate-100">
                    {image.url.startsWith('gplaces://') ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon size={48} />
                      </div>
                    ) : (
                      <img
                        src={image.url}
                        alt={`Hotel image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-hotel.jpg';
                        }}
                      />
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">
                        {image.source === 'google_places' ? 'Google Places' : 'Manual Upload'}
                      </span>
                      <div className="flex items-center gap-1">
                        {!image.isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(image.id)}
                            className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                            title="Set as primary"
                          >
                            <Star size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm">
                      <Star size={12} />
                      PRIMARY
                    </div>
                  )}

                  {/* Order Badge */}
                  <div className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Images Yet</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                Add images manually by entering URLs, or click "Refresh from Google" to fetch images from Google Places
              </p>
              <button
                onClick={handleRefreshImages}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                Refresh from Google
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AmadeusHotelEditPage;
