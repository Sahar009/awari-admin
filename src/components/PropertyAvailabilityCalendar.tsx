import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Calendar, X, Loader } from 'lucide-react';

interface PropertyAvailability {
    id: string;
    propertyId: string;
    date: string;
    reason: 'booking' | 'maintenance' | 'owner_blocked' | 'admin_blocked' | 'unavailable';
    bookingId: string | null;
    notes: string | null;
    isActive: boolean;
    booking?: {
        id: string;
        guestName: string;
        bookingType: string;
    };
}

interface PropertyAvailabilityCalendarProps {
    propertyId: string;
    propertyTitle: string;
    onClose: () => void;
}

export default function PropertyAvailabilityCalendar({
    propertyId,
    propertyTitle,
    onClose
}: PropertyAvailabilityCalendarProps) {
    const [availability, setAvailability] = useState<PropertyAvailability[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetchAvailability();
    }, [propertyId, currentMonth]);

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

            const response = await api.get(`/properties/${propertyId}/availability`, {
                params: {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                }
            });

            if (response.data.success) {
                setAvailability(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const getAvailabilityForDate = (day: number) => {
        const dateStr = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        ).toISOString().split('T')[0];

        return availability.find(a => a.date === dateStr && a.isActive);
    };

    const getDateClassName = (day: number | null) => {
        if (!day) return 'bg-gray-50';

        const today = new Date();
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        const avail = getAvailabilityForDate(day);

        let className = 'min-h-20 p-2 border border-gray-200 ';

        if (isPast) {
            className += 'bg-gray-50 text-gray-400 ';
        } else if (avail) {
            switch (avail.reason) {
                case 'booking':
                    className += 'bg-red-50 border-red-300 ';
                    break;
                case 'maintenance':
                    className += 'bg-yellow-50 border-yellow-300 ';
                    break;
                case 'owner_blocked':
                case 'admin_blocked':
                    className += 'bg-orange-50 border-orange-300 ';
                    break;
                default:
                    className += 'bg-gray-100 border-gray-300 ';
            }
        } else {
            className += 'bg-white hover:bg-green-50 ';
        }

        if (isToday) {
            className += 'ring-2 ring-blue-500 ';
        }

        return className;
    };

    const getReasonLabel = (reason: string) => {
        const labels: Record<string, { text: string; color: string }> = {
            booking: { text: 'Booked', color: 'text-red-700' },
            maintenance: { text: 'Maintenance', color: 'text-yellow-700' },
            owner_blocked: { text: 'Owner Blocked', color: 'text-orange-700' },
            admin_blocked: { text: 'Admin Blocked', color: 'text-orange-700' },
            unavailable: { text: 'Unavailable', color: 'text-gray-700' }
        };
        return labels[reason] || { text: reason, color: 'text-gray-700' };
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Calendar className="w-6 h-6 mr-2" />
                            Property Availability Calendar
                        </h2>
                        <p className="text-sm text-gray-600">{propertyTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Calendar Controls */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={previousMonth}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            ← Previous
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900">{monthYear}</h3>
                        <button
                            onClick={nextMonth}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Next →
                        </button>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-50 border border-red-300 mr-2"></div>
                            <span>Booked</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-yellow-50 border border-yellow-300 mr-2"></div>
                            <span>Maintenance</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-orange-50 border border-orange-300 mr-2"></div>
                            <span>Blocked</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-gray-50 border border-gray-300 mr-2"></div>
                            <span>Past</span>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-blue-500" />
                            <span className="ml-2 text-gray-600">Loading calendar...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-1">
                            {/* Day headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center font-semibold text-gray-700 py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {getDaysInMonth().map((day, index) => {
                                const avail = day ? getAvailabilityForDate(day) : null;
                                const reasonInfo = avail ? getReasonLabel(avail.reason) : null;

                                return (
                                    <div key={index} className={getDateClassName(day)}>
                                        {day && (
                                            <>
                                                <div className="font-semibold text-sm mb-1">{day}</div>
                                                {avail && (
                                                    <div className="text-xs">
                                                        <div className={`font-medium ${reasonInfo?.color}`}>
                                                            {reasonInfo?.text}
                                                        </div>
                                                        {avail.booking && (
                                                            <div className="text-gray-600 mt-1 truncate">
                                                                {avail.booking.guestName}
                                                            </div>
                                                        )}
                                                        {avail.notes && (
                                                            <div className="text-gray-500 mt-1 truncate" title={avail.notes}>
                                                                {avail.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
