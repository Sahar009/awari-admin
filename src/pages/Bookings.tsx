
import { useState, useEffect } from 'react';
import api from '../lib/api';
import PropertyAvailabilityCalendar from '../components/PropertyAvailabilityCalendar';
import {
    Calendar,
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    User,
    Phone,
    Mail,
    Copy,
    CreditCard,
    Wallet,
    Loader,
    Home,
    Users,
    FileText
} from 'lucide-react';

// Enhanced Booking Interface with all fields
interface Booking {
    id: string;
    propertyId: string;
    userId: string;
    ownerId: string;
    bookingType: 'sale_inspection' | 'shortlet' | 'hotel';
    status: string;
    checkInDate: string | null;
    checkOutDate: string | null;
    inspectionDate: string | null;
    inspectionTime: string | null;
    numberOfNights: number | null;
    numberOfGuests: number;
    basePrice: string;
    totalPrice: string;
    currency: string;
    serviceFee: string;
    taxAmount: string;
    discountAmount: string;
    paymentStatus: string;
    paymentMethod: string | null;
    transactionId: string | null;
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    specialRequests: string | null;
    cancellationReason: string | null;
    cancelledBy: string | null;
    cancelledAt: string | null;
    ownerNotes: string | null;
    adminNotes: string | null;
    walletStatus: string;
    walletTransactionId: string | null;
    walletReleaseDate: string | null;
    externalBookingId: string | null;
    externalStatus: string | null;
    createdAt: string;
    updatedAt: string;
    property: {
        id: string;
        title: string;
        propertyType: string;
        address: string;
        city: string;
        state: string;
    };
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
    };
    owner: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
    };
}

interface Statistics {
    totalBookings: number;
    bookingsByStatus: Record<string, number>;
    bookingsByPaymentStatus: Record<string, number>;
    revenue: {
        total: number;
        serviceFees: number;
        tax: number;
        average: number;
    };
}

// Utility Functions
const formatCurrency = (amount: string | number, currency: string = 'NGN') => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(num);
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getTimeToEvent = (booking: Booking): { text: string; urgency: 'critical' | 'warning' | 'normal' | 'future' } => {
    let eventDate: Date | null = null;

    if (booking.bookingType === 'sale_inspection' && booking.inspectionDate) {
        const dateTime = `${booking.inspectionDate.split('T')[0]}T${booking.inspectionTime || '00:00:00'} `;
        eventDate = new Date(dateTime);
    } else if (booking.checkInDate) {
        eventDate = new Date(booking.checkInDate);
    }

    if (!eventDate) return { text: 'No date set', urgency: 'normal' };

    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffMs < 0) {
        return { text: 'Past', urgency: 'normal' };
    } else if (diffHours < 24) {
        return { text: `${Math.floor(diffHours)} h`, urgency: 'critical' };
    } else if (diffHours < 48) {
        return { text: `${Math.floor(diffHours)} h`, urgency: 'warning' };
    } else if (diffDays < 7) {
        return { text: `${Math.floor(diffDays)} d`, urgency: 'warning' };
    } else {
        return { text: `${Math.floor(diffDays)} d`, urgency: 'future' };
    }
};

const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showAvailabilityCalendar, setShowAvailabilityCalendar] = useState(false);
    const [paymentData, setPaymentData] = useState({
        paymentMethod: '',
        transactionId: ''
    });

    const [actionLoading, setActionLoading] = useState({
        confirm: false,
        cancel: false,
        reject: false,
        approve: false
    });

    // State for cancellation modal
    const [cancelModal, setCancelModal] = useState({
        isOpen: false,
        bookingId: '',
        reason: ''
    });

    const [filters, setFilters] = useState({
        status: '',
        paymentStatus: '',
        bookingType: '',
        search: '',
        page: 1,
        limit: 20
    });

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1
    });

    useEffect(() => {
        fetchBookings();
        fetchStatistics();
    }, [filters]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const params: Record<string, any> = {
                page: filters.page,
                limit: filters.limit
            };

            if (filters.status) params.status = filters.status;
            if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
            if (filters.bookingType) params.bookingType = filters.bookingType;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/bookings', { params });

            if (response.data.success) {
                setBookings(response.data.data.bookings);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/admin/bookings/statistics');

            if (response.data.success) {
                setStatistics(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleApprove = async (bookingId: string) => {
        if (!confirm('Are you sure you want to approve this booking?')) return;

        try {
            const response = await api.post(`/ admin / bookings / ${bookingId}/approve`);

            if (response.data.success) {
                alert('Booking approved successfully');
                fetchBookings();
            } else {
                alert(response.data.message || 'Failed to approve booking');
            }
        } catch (error: any) {
            console.error('Error approving booking:', error);
            alert(error.response?.data?.message || 'Failed to approve booking');
        }
    };

    const handleReject = async (bookingId: string) => {
        const reason = prompt('Please enter rejection reason:');
        if (!reason) return;

        try {
            const response = await api.post(`/admin/bookings/${bookingId}/reject`, { reason });

            if (response.data.success) {
                alert('Booking rejected successfully');
                fetchBookings();
            } else {
                alert(response.data.message || 'Failed to reject booking');
            }
        } catch (error: any) {
            console.error('Error rejecting booking:', error);
            alert(error.response?.data?.message || 'Failed to reject booking');
        }
    };

    const handleConfirm = async (bookingId: string) => {
        if (!confirm('Are you sure you want to confirm this booking?')) return;

        try {
            setActionLoading(prev => ({ ...prev, confirm: true }));
            const response = await api.post(`/admin/bookings/${bookingId}/confirm`);

            if (response.data.success) {
                alert('Booking confirmed successfully');
                fetchBookings();
                setShowDetailsModal(false);
            } else {
                alert(response.data.message || 'Failed to confirm booking');
            }
        } catch (error: any) {
            console.error('Error confirming booking:', error);
            alert(error.response?.data?.message || 'Failed to confirm booking');
        } finally {
            setActionLoading(prev => ({ ...prev, confirm: false }));
        }
    };

    const handleCancel = (bookingId: string) => {
        setCancelModal({
            isOpen: true,
            bookingId,
            reason: ''
        });
    };

    const handleConfirmCancel = async () => {
        if (!cancelModal.reason.trim()) {
            alert('Please enter a cancellation reason');
            return;
        }

        try {
            setActionLoading(prev => ({ ...prev, cancel: true }));
            const response = await api.post(`/admin/bookings/${cancelModal.bookingId}/cancel`, { 
                cancellationReason: cancelModal.reason 
            });

            if (response.data.success) {
                alert('Booking cancelled successfully');
                setCancelModal({ isOpen: false, bookingId: '', reason: '' });
                fetchBookings();
                setShowDetailsModal(false);
            } else {
                alert(response.data.message || 'Failed to cancel booking');
            }
        } catch (error: any) {
            console.error('Error cancelling booking:', error);
            alert(error.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setActionLoading(prev => ({ ...prev, cancel: false }));
        }
    };

    const handleCloseCancelModal = () => {
        setCancelModal({ isOpen: false, bookingId: '', reason: '' });
    };

    const handleMarkAsPaid = async () => {
        if (!selectedBooking) return;
        if (!paymentData.paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        try {
            const response = await api.post(`/admin/bookings/${selectedBooking.id}/mark-paid`, paymentData);

            if (response.data.success) {
                alert('Payment marked as completed');
                setShowPaymentModal(false);
                setShowDetailsModal(false);
                fetchBookings();
            } else {
                alert(response.data.message || 'Failed to mark as paid');
            }
        } catch (error: any) {
            console.error('Error marking as paid:', error);
            alert(error.response?.data?.message || 'Failed to mark as paid');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
            rejected: 'bg-gray-100 text-gray-800',
            in_progress: 'bg-purple-100 text-purple-800'
        };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    const getPaymentBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-blue-100 text-blue-800'
        };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const getBookingTypeBadge = (type: string) => {
        const styles: Record<string, string> = {
            sale_inspection: 'bg-purple-100 text-purple-800',
            shortlet: 'bg-blue-100 text-blue-800',
            hotel: 'bg-indigo-100 text-indigo-800'
        };

        const labels: Record<string, string> = {
            sale_inspection: 'Inspection',
            shortlet: 'Shortlet',
            hotel: 'Hotel'
        };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
                {labels[type] || type}
            </span>
        );
    };

    const getUrgencyColor = (urgency: string) => {
        const colors: Record<string, string> = {
            critical: 'bg-red-50 border-l-4 border-red-500',
            warning: 'bg-orange-50 border-l-4 border-orange-500',
            normal: '',
            future: ''
        };
        return colors[urgency] || '';
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
                <p className="text-gray-600">Manage all property bookings and inspections</p>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.totalBookings}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(statistics.revenue.total)}
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.bookingsByStatus.pending || 0}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Confirmed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.bookingsByStatus.confirmed || 0}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={filters.bookingType}
                            onChange={(e) => setFilters({ ...filters, bookingType: e.target.value, page: 1 })}
                        >
                            <option value="">All Types</option>
                            <option value="sale_inspection">Inspection</option>
                            <option value="shortlet">Shortlet</option>
                            <option value="hotel">Hotel</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={filters.paymentStatus}
                            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value, page: 1 })}
                        >
                            <option value="">All Payments</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ status: '', paymentStatus: '', bookingType: '', search: '', page: 1, limit: 20 })}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Property
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guest
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date/Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time to Event
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                                        Loading bookings...
                                    </td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                                        No bookings found
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => {
                                    const timeToEvent = getTimeToEvent(booking);
                                    return (
                                        <tr key={booking.id} className={`hover:bg-gray-50 ${getUrgencyColor(timeToEvent.urgency)}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => copyToClipboard(booking.id, 'Booking ID')}
                                                        className="text-xs text-blue-600 hover:text-blue-800 font-mono"
                                                    >
                                                        {booking.id.substring(0, 8)}...
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getBookingTypeBadge(booking.bookingType)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{booking.property.title}</div>
                                                <div className="text-sm text-gray-500">{booking.property.propertyType}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {booking.user.avatarUrl ? (
                                                        <img src={booking.user.avatarUrl} alt="" className="w-8 h-8 rounded-full mr-2" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                                            <User className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {booking.user.firstName} {booking.user.lastName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{booking.user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {booking.owner.avatarUrl ? (
                                                        <img src={booking.owner.avatarUrl} alt="" className="w-8 h-8 rounded-full mr-2" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                                            <User className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {booking.owner.firstName} {booking.owner.lastName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{booking.owner.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {booking.bookingType === 'sale_inspection' ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {formatDate(booking.inspectionDate)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{booking.inspectionTime}</div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {formatDate(booking.checkInDate)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {booking.numberOfNights} night{booking.numberOfNights !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${timeToEvent.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                                                    timeToEvent.urgency === 'warning' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {timeToEvent.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {booking.bookingType === 'sale_inspection' ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-blue-600">Free</div>
                                                        <div className="text-xs text-gray-500">No charge</div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {formatCurrency(booking.totalPrice, booking.currency)}
                                                        </div>
                                                        {booking.paymentMethod && (
                                                            <div className="text-xs text-gray-500">{booking.paymentMethod}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getPaymentBadge(booking.paymentStatus)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                            disabled={filters.page === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, page: Math.min(pagination.totalPages, filters.page + 1) })}
                            disabled={filters.page === pagination.totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(filters.page * filters.limit, pagination.total)}
                                </span>{' '}
                                of <span className="font-medium">{pagination.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                                    disabled={filters.page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    Page {filters.page} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setFilters({ ...filters, page: Math.min(pagination.totalPages, filters.page + 1) })}
                                    disabled={filters.page === pagination.totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>


            {/* Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
                    <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                                <p className="text-sm text-gray-500">ID: {selectedBooking.id}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => copyToClipboard(selectedBooking.id, 'Booking ID')}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-3">
                                {getBookingTypeBadge(selectedBooking.bookingType)}
                                {getStatusBadge(selectedBooking.status)}
                                {getPaymentBadge(selectedBooking.paymentStatus)}
                                {selectedBooking.walletStatus !== 'none' && (
                                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 flex items-center">
                                        <Wallet className="w-4 h-4 mr-1" />
                                        {selectedBooking.walletStatus}
                                    </span>
                                )}
                            </div>

                            {/* Property Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Home className="w-5 h-5 mr-2" />
                                        Property Information
                                    </h3>
                                    <button
                                        onClick={() => setShowAvailabilityCalendar(true)}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                    >
                                        <Calendar className="w-4 h-4 mr-1" />
                                        View Availability
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Property</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.property.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Type</p>
                                        <p className="font-medium text-gray-900 capitalize">{selectedBooking.property.propertyType}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-medium text-gray-900">
                                            {selectedBooking.property.address}, {selectedBooking.property.city}, {selectedBooking.property.state}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Guest & Owner Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Guest Info */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <User className="w-5 h-5 mr-2" />
                                        Guest Information
                                    </h3>
                                    <div className="flex items-center mb-3">
                                        {selectedBooking.user.avatarUrl ? (
                                            <img src={selectedBooking.user.avatarUrl} alt="" className="w-12 h-12 rounded-full mr-3" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                <User className="w-6 h-6 text-gray-500" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {selectedBooking.user.firstName} {selectedBooking.user.lastName}
                                            </p>
                                            <p className="text-sm text-gray-600">{selectedBooking.numberOfGuests} guest(s)</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm">
                                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                            <span className="text-gray-900">{selectedBooking.user.email}</span>
                                            <button
                                                onClick={() => copyToClipboard(selectedBooking.user.email, 'Email')}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                        {selectedBooking.user.phone && (
                                            <div className="flex items-center text-sm">
                                                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="text-gray-900">{selectedBooking.user.phone}</span>
                                                <button
                                                    onClick={() => copyToClipboard(selectedBooking.user.phone!, 'Phone')}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Owner Info */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <Users className="w-5 h-5 mr-2" />
                                        Property Owner
                                    </h3>
                                    <div className="flex items-center mb-3">
                                        {selectedBooking.owner.avatarUrl ? (
                                            <img src={selectedBooking.owner.avatarUrl} alt="" className="w-12 h-12 rounded-full mr-3" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                <User className="w-6 h-6 text-gray-500" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {selectedBooking.owner.firstName} {selectedBooking.owner.lastName}
                                            </p>
                                            <p className="text-sm text-gray-600">Owner</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm">
                                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                            <span className="text-gray-900">{selectedBooking.owner.email}</span>
                                            <button
                                                onClick={() => copyToClipboard(selectedBooking.owner.email, 'Email')}
                                                className="ml-2 text-green-600 hover:text-green-800"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                        {selectedBooking.owner.phone && (
                                            <div className="flex items-center text-sm">
                                                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="text-gray-900">{selectedBooking.owner.phone}</span>
                                                <button
                                                    onClick={() => copyToClipboard(selectedBooking.owner.phone!, 'Phone')}
                                                    className="ml-2 text-green-600 hover:text-green-800"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Booking Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedBooking.bookingType === 'sale_inspection' ? (
                                        <>
                                            <div>
                                                <p className="text-sm text-gray-600">Inspection Date</p>
                                                <p className="font-medium text-gray-900">{formatDate(selectedBooking.inspectionDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Inspection Time</p>
                                                <p className="font-medium text-gray-900">{selectedBooking.inspectionTime}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Time Until Inspection</p>
                                                <p className="font-medium text-gray-900">{getTimeToEvent(selectedBooking).text}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="text-sm text-gray-600">Check-In Date</p>
                                                <p className="font-medium text-gray-900">{formatDate(selectedBooking.checkInDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Check-Out Date</p>
                                                <p className="font-medium text-gray-900">{formatDate(selectedBooking.checkOutDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Number of Nights</p>
                                                <p className="font-medium text-gray-900">{selectedBooking.numberOfNights}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Time Until Check-In</p>
                                                <p className="font-medium text-gray-900">{getTimeToEvent(selectedBooking).text}</p>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-600">Booking Created</p>
                                        <p className="font-medium text-gray-900">{formatDateTime(selectedBooking.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Updated</p>
                                        <p className="font-medium text-gray-900">{formatDateTime(selectedBooking.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details */}
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2" />
                                    Payment Details
                                </h3>

                                {selectedBooking.bookingType === 'sale_inspection' ? (
                                    <div className="space-y-3">
                                        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                                            <div className="flex items-center mb-2">
                                                <span className="text-2xl mr-2">🆓</span>
                                                <p className="text-lg font-bold text-blue-900">Free Inspection</p>
                                            </div>
                                            <p className="text-sm text-blue-700">
                                                Property inspections are complimentary. No payment required from the guest.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="bg-white p-3 rounded border-l-4 border-green-500">
                                            <p className="text-sm text-gray-600 mb-1">Amount Paid by Guest</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(selectedBooking.totalPrice, selectedBooking.currency)}
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                                            <p className="flex items-center">
                                                <span className="mr-1">ℹ️</span>
                                                Platform commission is deducted when crediting the property owner
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {/* Payment Information */}
                                <div className="mt-4 pt-4 border-t border-gray-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Payment Status</p>
                                            <div className="mt-1">{getPaymentBadge(selectedBooking.paymentStatus)}</div>
                                        </div>
                                        {selectedBooking.paymentMethod && (
                                            <div>
                                                <p className="text-sm text-gray-600">Payment Method</p>
                                                <p className="font-medium text-gray-900 capitalize">{selectedBooking.paymentMethod.replace('_', ' ')}</p>
                                            </div>
                                        )}
                                        {selectedBooking.transactionId && (
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-gray-600">Transaction ID</p>
                                                <div className="flex items-center">
                                                    <p className="font-mono text-sm text-gray-900">{selectedBooking.transactionId}</p>
                                                    <button
                                                        onClick={() => copyToClipboard(selectedBooking.transactionId!, 'Transaction ID')}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Wallet & External Info */}
                            {(selectedBooking.walletStatus !== 'none' || selectedBooking.externalBookingId) && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <Wallet className="w-5 h-5 mr-2" />
                                        Additional Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedBooking.walletStatus !== 'none' && (
                                            <>
                                                <div>
                                                    <p className="text-sm text-gray-600">Wallet Status</p>
                                                    <p className="font-medium text-gray-900 capitalize">{selectedBooking.walletStatus}</p>
                                                </div>
                                                {selectedBooking.walletTransactionId && (
                                                    <div>
                                                        <p className="text-sm text-gray-600">Wallet Transaction ID</p>
                                                        <p className="font-mono text-sm text-gray-900">{selectedBooking.walletTransactionId}</p>
                                                    </div>
                                                )}
                                                {selectedBooking.walletReleaseDate && (
                                                    <div>
                                                        <p className="text-sm text-gray-600">Wallet Release Date</p>
                                                        <p className="font-medium text-gray-900">{formatDate(selectedBooking.walletReleaseDate)}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {selectedBooking.externalBookingId && (
                                            <>
                                                <div>
                                                    <p className="text-sm text-gray-600">External Booking ID</p>
                                                    <p className="font-mono text-sm text-gray-900">{selectedBooking.externalBookingId}</p>
                                                </div>
                                                {selectedBooking.externalStatus && (
                                                    <div>
                                                        <p className="text-sm text-gray-600">External Status</p>
                                                        <p className="font-medium text-gray-900">{selectedBooking.externalStatus}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Special Requests & Notes */}
                            {(selectedBooking.specialRequests || selectedBooking.adminNotes || selectedBooking.ownerNotes || selectedBooking.cancellationReason) && (
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <FileText className="w-5 h-5 mr-2" />
                                        Notes & Requests
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedBooking.specialRequests && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Special Requests</p>
                                                <p className="text-sm text-gray-900 mt-1">{selectedBooking.specialRequests}</p>
                                            </div>
                                        )}
                                        {selectedBooking.adminNotes && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Admin Notes</p>
                                                <p className="text-sm text-gray-900 mt-1">{selectedBooking.adminNotes}</p>
                                            </div>
                                        )}
                                        {selectedBooking.ownerNotes && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Owner Notes</p>
                                                <p className="text-sm text-gray-900 mt-1">{selectedBooking.ownerNotes}</p>
                                            </div>
                                        )}
                                        {selectedBooking.cancellationReason && (
                                            <div>
                                                <p className="text-sm font-medium text-red-700">Cancellation Reason</p>
                                                <p className="text-sm text-gray-900 mt-1">{selectedBooking.cancellationReason}</p>
                                                {selectedBooking.cancelledAt && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Cancelled on {formatDateTime(selectedBooking.cancelledAt)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Admin Actions */}
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                {selectedBooking.paymentStatus === 'pending' && (
                                    <button
                                        onClick={() => setShowPaymentModal(true)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                                    >
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Mark as Paid
                                    </button>
                                )}
                                {selectedBooking.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(selectedBooking.id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve Booking
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedBooking.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject Booking
                                        </button>
                                    </>
                                )}
                                {selectedBooking.status === 'in_progress' && (
                                    <>
                                        <button
                                            onClick={() => handleConfirm(selectedBooking.id)}
                                            disabled={actionLoading.confirm}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading.confirm ? (
                                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                            )}
                                            {actionLoading.confirm ? 'Confirming...' : 'Confirm Booking'}
                                        </button>
                                        <button
                                            onClick={() => handleCancel(selectedBooking.id)}
                                            disabled={actionLoading.cancel}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading.cancel ? (
                                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <XCircle className="w-4 h-4 mr-2" />
                                            )}
                                            {actionLoading.cancel ? 'Cancelling...' : 'Cancel Booking'}
                                        </button>
                                    </>
                                )}
                                {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'completed') && (
                                    <button
                                        onClick={() => handleCancel(selectedBooking.id)}
                                        disabled={actionLoading.cancel}
                                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading.cancel ? (
                                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <XCircle className="w-4 h-4 mr-2" />
                                        )}
                                        {actionLoading.cancel ? 'Cancelling...' : 'Cancel Booking'}
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Mark Payment as Completed</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={paymentData.paymentMethod}
                                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                                >
                                    <option value="">Select payment method</option>
                                    <option value="card">Card</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="cash">Cash</option>
                                    <option value="wallet">Wallet</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter transaction ID"
                                    value={paymentData.transactionId}
                                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                                />
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-600">Amount to be marked as paid:</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(selectedBooking.totalPrice, selectedBooking.currency)}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleMarkAsPaid}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Confirm Payment
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPaymentData({ paymentMethod: '', transactionId: '' });
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Property Availability Calendar */}
            {showAvailabilityCalendar && selectedBooking && (
                <PropertyAvailabilityCalendar
                    propertyId={selectedBooking.propertyId}
                    propertyTitle={selectedBooking.property.title}
                    onClose={() => setShowAvailabilityCalendar(false)}
                />
            )}

            {/* Cancellation Modal */}
            {cancelModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Transparent background overlay */}
                    <div 
                        className="absolute inset-0 bg-transparent backdrop-blur-sm"
                        onClick={handleCloseCancelModal}
                    />
                    
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl border border-gray-200">
                        <div className="flex items-center mb-4">
                            <XCircle className="w-6 h-6 text-red-500 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Cancel Booking</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel this booking? Please provide a reason for the cancellation.
                        </p>
                        
                        <div className="mb-4">
                            <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
                                Cancellation Reason
                            </label>
                            <textarea
                                id="cancelReason"
                                value={cancelModal.reason}
                                onChange={(e) => setCancelModal(prev => ({ ...prev, reason: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                                placeholder="Please enter the reason for cancellation..."
                            />
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCloseCancelModal}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={actionLoading.cancel || !cancelModal.reason.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {actionLoading.cancel ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4" />
                                        Cancel Booking
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
