import { useState, useEffect } from 'react';
import { DollarSign, Save, RefreshCw, Loader, Percent } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import api from '../lib/api';

interface FeeConfig {
    id: string;
    feeType: 'service_fee' | 'tax' | 'platform_fee';
    valueType: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
    description?: string;
}

const FEE_TYPE_LABELS = {
    service_fee: 'Service Fee',
    tax: 'Tax',
    platform_fee: 'Platform Fee',
};

const BookingFeesSettings = () => {
    const [fees, setFees] = useState<FeeConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state for each fee type
    const [serviceFee, setServiceFee] = useState({ value: 10, valueType: 'percentage' as 'percentage' | 'fixed' });
    const [tax, setTax] = useState({ value: 5, valueType: 'percentage' as 'percentage' | 'fixed' });
    const [platformFee, setPlatformFee] = useState({ value: 0, valueType: 'percentage' as 'percentage' | 'fixed' });

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

            // Populate form with current active fees
            fetchedFees.forEach((fee: FeeConfig) => {
                if (fee.isActive) {
                    if (fee.feeType === 'service_fee') {
                        setServiceFee({ value: Number(fee.value), valueType: fee.valueType });
                    } else if (fee.feeType === 'tax') {
                        setTax({ value: Number(fee.value), valueType: fee.valueType });
                    } else if (fee.feeType === 'platform_fee') {
                        setPlatformFee({ value: Number(fee.value), valueType: fee.valueType });
                    }
                }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch booking fees');
            console.error('Error fetching fees:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateFee = async (feeType: 'service_fee' | 'tax' | 'platform_fee', value: number, valueType: 'percentage' | 'fixed') => {
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            // Find existing active fee of this type
            const existingFee = fees.find(f => f.feeType === feeType && f.isActive);

            if (existingFee) {
                // Update existing fee
                await api.put(`/booking-fees/${existingFee.id}`, {
                    value,
                    valueType,
                    isActive: true,
                });
            } else {
                // Create new fee
                await api.post('/booking-fees', {
                    feeType,
                    valueType,
                    value,
                    isActive: true,
                    description: `${FEE_TYPE_LABELS[feeType]} - ${valueType === 'percentage' ? `${value}%` : `₦${value}`}`,
                });
            }

            setSuccess(`${FEE_TYPE_LABELS[feeType]} updated successfully!`);
            await fetchFees(); // Refresh fees
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to update ${FEE_TYPE_LABELS[feeType]}`);
            console.error('Error updating fee:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            // Update all fees sequentially
            await updateFee('service_fee', serviceFee.value, serviceFee.valueType);
            await updateFee('tax', tax.value, tax.valueType);
            await updateFee('platform_fee', platformFee.value, platformFee.valueType);

            setSuccess('All booking fees updated successfully!');
        } catch (err: any) {
            setError('Failed to update all fees. Some changes may have been saved.');
        } finally {
            setIsSaving(false);
        }
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
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Booking Fees Settings</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Configure service fees, taxes, and platform fees for all bookings
                        </p>
                    </div>
                    <ActionButton
                        variant="secondary"
                        label="Refresh"
                        startIcon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
                        onClick={fetchFees}
                        disabled={isLoading}
                    />
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

            <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Fee Configuration</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Set the fees that will be applied to all new bookings. Changes take effect immediately.
                        </p>
                    </div>
                    <DollarSign className="h-5 w-5 text-indigo-500" />
                </div>

                <div className="space-y-6">
                    {/* Service Fee */}
                    <div className="space-y-4 p-4 border border-slate-200 rounded-xl dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Service Fee</label>
                            <ActionButton
                                label="Save"
                                startIcon={isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                onClick={() => updateFee('service_fee', serviceFee.value, serviceFee.valueType)}
                                disabled={isSaving}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm text-slate-500 dark:text-slate-400">Value</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={serviceFee.valueType === 'percentage' ? 100 : undefined}
                                    step={serviceFee.valueType === 'percentage' ? 0.1 : 1}
                                    value={serviceFee.value}
                                    onChange={(e) => setServiceFee({ ...serviceFee, value: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm text-slate-500 dark:text-slate-400">Type</label>
                                <select
                                    value={serviceFee.valueType}
                                    onChange={(e) => setServiceFee({ ...serviceFee, valueType: e.target.value as 'percentage' | 'fixed' })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₦)</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {serviceFee.valueType === 'percentage'
                                ? `Customers will be charged ${serviceFee.value}% of the base price`
                                : `Customers will be charged a flat ₦${serviceFee.value.toLocaleString()}`
                            }
                        </div>
                    </div>

                    {/* Tax */}
                    <div className="space-y-4 p-4 border border-slate-200 rounded-xl dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Tax</label>
                            <ActionButton
                                label="Save"
                                startIcon={isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                onClick={() => updateFee('tax', tax.value, tax.valueType)}
                                disabled={isSaving}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm text-slate-500 dark:text-slate-400">Value</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={tax.valueType === 'percentage' ? 100 : undefined}
                                    step={tax.valueType === 'percentage' ? 0.1 : 1}
                                    value={tax.value}
                                    onChange={(e) => setTax({ ...tax, value: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm text-slate-500 dark:text-slate-400">Type</label>
                                <select
                                    value={tax.valueType}
                                    onChange={(e) => setTax({ ...tax, valueType: e.target.value as 'percentage' | 'fixed' })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₦)</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {tax.valueType === 'percentage'
                                ? `Customers will be charged ${tax.value}% of the base price`
                                : `Customers will be charged a flat ₦${tax.value.toLocaleString()}`
                            }
                        </div>
                    </div>

                    {/* Platform Fee */}
                    <div className="space-y-4 p-4 border border-slate-200 rounded-xl dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Platform Fee</label>
                            <ActionButton
                                label="Save"
                                startIcon={isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                onClick={() => updateFee('platform_fee', platformFee.value, platformFee.valueType)}
                                disabled={isSaving}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm text-slate-500 dark:text-slate-400">Value</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={platformFee.valueType === 'percentage' ? 100 : undefined}
                                    step={platformFee.valueType === 'percentage' ? 0.1 : 1}
                                    value={platformFee.value}
                                    onChange={(e) => setPlatformFee({ ...platformFee, value: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm text-slate-500 dark:text-slate-400">Type</label>
                                <select
                                    value={platformFee.valueType}
                                    onChange={(e) => setPlatformFee({ ...platformFee, valueType: e.target.value as 'percentage' | 'fixed' })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₦)</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {platformFee.valueType === 'percentage'
                                ? `Customers will be charged ${platformFee.value}% of the base price`
                                : `Customers will be charged a flat ₦${platformFee.value.toLocaleString()}`
                            }
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <ActionButton
                            label={isSaving ? 'Saving All Fees...' : 'Save All Changes'}
                            startIcon={isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            onClick={handleSaveAll}
                            disabled={isSaving}
                            className="w-full"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Preview</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Example calculation for a ₦100,000 booking</p>
                    </div>
                    <Percent className="h-5 w-5 text-indigo-500" />
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Base Price:</span>
                        <span className="font-medium text-slate-900 dark:text-white">₦100,000</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Service Fee ({serviceFee.valueType === 'percentage' ? `${serviceFee.value}%` : `₦${serviceFee.value}`}):</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            ₦{(serviceFee.valueType === 'percentage' ? 100000 * (serviceFee.value / 100) : serviceFee.value).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Tax ({tax.valueType === 'percentage' ? `${tax.value}%` : `₦${tax.value}`}):</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            ₦{(tax.valueType === 'percentage' ? 100000 * (tax.value / 100) : tax.value).toLocaleString()}
                        </span>
                    </div>
                    {platformFee.value > 0 && (
                        <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Platform Fee ({platformFee.valueType === 'percentage' ? `${platformFee.value}%` : `₦${platformFee.value}`}):</span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                ₦{(platformFee.valueType === 'percentage' ? 100000 * (platformFee.value / 100) : platformFee.value).toLocaleString()}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-base dark:border-slate-700">
                        <span className="text-slate-900 dark:text-white">Total:</span>
                        <span className="text-slate-900 dark:text-white">
                            ₦{(
                                100000 +
                                (serviceFee.valueType === 'percentage' ? 100000 * (serviceFee.value / 100) : serviceFee.value) +
                                (tax.valueType === 'percentage' ? 100000 * (tax.value / 100) : tax.value) +
                                (platformFee.valueType === 'percentage' ? 100000 * (platformFee.value / 100) : platformFee.value)
                            ).toLocaleString()}
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BookingFeesSettings;
