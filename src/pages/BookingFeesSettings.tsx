import { useState, useEffect } from 'react';
import { DollarSign, Save, RefreshCw, Loader, Plus, Trash2, Building2 } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import api from '../lib/api';

interface FeeConfig {
    id: string;
    feeType: 'service_fee' | 'tax' | 'platform_fee' | 'agency_fee' | 'damage_fee';
    valueType: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
    description?: string;
    propertyType?: 'rent' | 'sale' | 'shortlet' | 'hotel' | null;
}

const FEE_TYPE_LABELS = {
    service_fee: 'AWARI Service Fee',
    tax: 'Tax',
    platform_fee: 'Platform Fee',
    agency_fee: 'Agency Fee',
    damage_fee: 'Damage/Security Fee',
};

const PROPERTY_TYPE_LABELS = {
    rent: 'Rental Properties',
    sale: 'Properties for Sale',
    shortlet: 'Short-let Properties',
    hotel: 'Hotel Bookings',
};

const BookingFeesSettings = () => {
    const [fees, setFees] = useState<FeeConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // New fee form state
    const [newFee, setNewFee] = useState({
        feeType: 'service_fee' as FeeConfig['feeType'],
        valueType: 'percentage' as 'percentage' | 'fixed',
        value: 0,
        propertyType: null as 'rent' | 'sale' | 'shortlet' | 'hotel' | null,
        description: '',
    });

    // Fetch fees on mount
    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.get('/booking-fees/all');
            const fetchedFees = response.data.data || [];
            setFees(fetchedFees);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch booking fees');
            console.error('Error fetching fees:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const createFee = async () => {
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/booking-fees', {
                feeType: newFee.feeType,
                valueType: newFee.valueType,
                value: newFee.value,
                propertyType: newFee.propertyType,
                isActive: true,
                description: newFee.description || `${FEE_TYPE_LABELS[newFee.feeType]} - ${newFee.valueType === 'percentage' ? `${newFee.value}%` : `₦${newFee.value}`}`,
            });

            setSuccess('Fee configuration created successfully!');
            setShowCreateModal(false);
            setNewFee({
                feeType: 'service_fee',
                valueType: 'percentage',
                value: 0,
                propertyType: null,
                description: '',
            });
            await fetchFees();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create fee configuration');
            console.error('Error creating fee:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const updateFee = async (feeId: string, updates: Partial<FeeConfig>) => {
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.put(`/booking-fees/${feeId}`, updates);
            setSuccess('Fee updated successfully!');
            await fetchFees();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update fee');
            console.error('Error updating fee:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const deleteFee = async (feeId: string) => {
        if (!confirm('Are you sure you want to delete this fee configuration?')) return;

        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.delete(`/booking-fees/${feeId}`);
            setSuccess('Fee deleted successfully!');
            await fetchFees();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete fee');
            console.error('Error deleting fee:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleFeeStatus = async (feeId: string, currentStatus: boolean) => {
        await updateFee(feeId, { isActive: !currentStatus });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Booking Fees Configuration</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Manage platform fees, agency fees, and other charges for different property types
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <ActionButton
                            variant="secondary"
                            label="Refresh"
                            startIcon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
                            onClick={fetchFees}
                            disabled={isLoading}
                        />
                        <ActionButton
                            label="Add New Fee"
                            startIcon={<Plus className="h-4 w-4" />}
                            onClick={() => setShowCreateModal(true)}
                        />
                    </div>
                </div>
            </header>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-200">
                    {success}
                </div>
            )}

            {/* Fee Configurations Table */}
            <section className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Active Fee Configurations</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Manage fees for different property types and booking scenarios
                            </p>
                        </div>
                        <DollarSign className="h-5 w-5 text-indigo-500" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Fee Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Property Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Value
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {fees.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                        No fee configurations found. Click "Add New Fee" to create one.
                                    </td>
                                </tr>
                            ) : (
                                fees.map((fee) => (
                                    <tr key={fee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Building2 className="h-4 w-4 text-slate-400 mr-2" />
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {FEE_TYPE_LABELS[fee.feeType]}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                {fee.propertyType ? PROPERTY_TYPE_LABELS[fee.propertyType] : 'All Properties'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-slate-900 dark:text-white font-semibold">
                                                {fee.valueType === 'percentage' ? `${fee.value}%` : `₦${Number(fee.value).toLocaleString()}`}
                                            </span>
                                            <span className="text-xs text-slate-500 ml-1">
                                                ({fee.valueType})
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleFeeStatus(fee.id, fee.isActive)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    fee.isActive
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                }`}
                                            >
                                                {fee.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {fee.description || 'No description'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => deleteFee(fee.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                disabled={isSaving}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Create Fee Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Fee Configuration</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Add a new fee that will be applied to bookings
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Fee Type *
                                    </label>
                                    <select
                                        value={newFee.feeType}
                                        onChange={(e) => setNewFee({ ...newFee, feeType: e.target.value as FeeConfig['feeType'] })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    >
                                        <option value="service_fee">AWARI Service Fee</option>
                                        <option value="agency_fee">Agency Fee</option>
                                        <option value="damage_fee">Damage/Security Fee</option>
                                        <option value="tax">Tax</option>
                                        <option value="platform_fee">Platform Fee</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Property Type
                                    </label>
                                    <select
                                        value={newFee.propertyType || ''}
                                        onChange={(e) => setNewFee({ ...newFee, propertyType: e.target.value as any || null })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    >
                                        <option value="">All Property Types</option>
                                        <option value="rent">Rental Properties</option>
                                        <option value="sale">Properties for Sale</option>
                                        <option value="shortlet">Short-let Properties</option>
                                        <option value="hotel">Hotel Bookings</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Value Type *
                                    </label>
                                    <select
                                        value={newFee.valueType}
                                        onChange={(e) => setNewFee({ ...newFee, valueType: e.target.value as 'percentage' | 'fixed' })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₦)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Value *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={newFee.valueType === 'percentage' ? 100 : undefined}
                                        step={newFee.valueType === 'percentage' ? 0.1 : 1}
                                        value={newFee.value}
                                        onChange={(e) => setNewFee({ ...newFee, value: Number(e.target.value) })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                        placeholder={newFee.valueType === 'percentage' ? '10' : '5000'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={newFee.description}
                                    onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    placeholder="Additional details about this fee..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <ActionButton
                                label={isSaving ? 'Creating...' : 'Create Fee'}
                                startIcon={isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                onClick={createFee}
                                disabled={isSaving || newFee.value <= 0}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingFeesSettings;
