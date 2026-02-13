import { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader, Plus, Trash2, Clock, ToggleLeft, ToggleRight, Settings2 } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import bookingConfigService, { type BookingConfigItem } from '../services/bookingConfigService';

const CONFIG_LABELS: Record<string, { label: string; description: string; unit?: string; type: 'number' | 'text' | 'boolean' }> = {
    auto_cancel_hours: {
        label: 'Auto-Cancel Timeout',
        description: 'Number of hours after which an unconfirmed booking (pending/in-progress) is automatically cancelled and refunded.',
        unit: 'hours',
        type: 'number',
    },
};

const BookingConfigPage = () => {
    const [configs, setConfigs] = useState<BookingConfigItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editValues, setEditValues] = useState<Record<string, string>>({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newConfig, setNewConfig] = useState({ key: '', value: '', description: '' });

    useEffect(() => {
        fetchConfigs();
    }, []);

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => { setSuccess(''); setError(''); }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const fetchConfigs = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await bookingConfigService.list();
            setConfigs(data);
            const values: Record<string, string> = {};
            data.forEach((c) => { values[c.key] = c.value; });
            setEditValues(values);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch configurations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (key: string) => {
        setSavingKey(key);
        setError('');
        setSuccess('');
        try {
            const existing = configs.find((c) => c.key === key);
            await bookingConfigService.update(key, {
                value: editValues[key],
                description: existing?.description || undefined,
            });
            setSuccess(`"${getLabel(key)}" updated successfully`);
            await fetchConfigs();
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to update "${key}"`);
        } finally {
            setSavingKey(null);
        }
    };

    const handleToggleActive = async (config: BookingConfigItem) => {
        setSavingKey(config.key);
        setError('');
        try {
            await bookingConfigService.update(config.key, {
                value: config.value,
                isActive: !config.isActive,
            });
            setSuccess(`"${getLabel(config.key)}" ${config.isActive ? 'disabled' : 'enabled'}`);
            await fetchConfigs();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to toggle config');
        } finally {
            setSavingKey(null);
        }
    };

    const handleDelete = async (key: string) => {
        if (!confirm(`Are you sure you want to delete the "${key}" configuration?`)) return;
        setSavingKey(key);
        setError('');
        try {
            await bookingConfigService.remove(key);
            setSuccess(`"${key}" deleted`);
            await fetchConfigs();
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to delete "${key}"`);
        } finally {
            setSavingKey(null);
        }
    };

    const handleAddConfig = async () => {
        if (!newConfig.key || !newConfig.value) {
            setError('Key and value are required');
            return;
        }
        setSavingKey(newConfig.key);
        setError('');
        try {
            await bookingConfigService.update(newConfig.key, {
                value: newConfig.value,
                description: newConfig.description || undefined,
            });
            setSuccess(`"${newConfig.key}" created successfully`);
            setNewConfig({ key: '', value: '', description: '' });
            setShowAddForm(false);
            await fetchConfigs();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create configuration');
        } finally {
            setSavingKey(null);
        }
    };

    const getLabel = (key: string) => CONFIG_LABELS[key]?.label || key;
    const getMeta = (key: string) => CONFIG_LABELS[key] || null;

    const hasChanged = (key: string) => {
        const original = configs.find((c) => c.key === key);
        return original ? original.value !== editValues[key] : false;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Booking Configuration
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Manage platform-wide booking settings like auto-cancel timeouts and policies.
                    </p>
                </div>
                <div className="flex gap-2">
                    <ActionButton
                        startIcon={<RefreshCw className="h-4 w-4" />}
                        label="Refresh"
                        onClick={fetchConfigs}
                        variant="secondary"
                    />
                    <ActionButton
                        startIcon={<Plus className="h-4 w-4" />}
                        label="Add Config"
                        onClick={() => setShowAddForm(!showAddForm)}
                        variant="primary"
                    />
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                    {error}
                </div>
            )}
            {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                    {success}
                </div>
            )}

            {/* Add New Config Form */}
            {showAddForm && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-800 dark:bg-indigo-900/10">
                    <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Add New Configuration</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Key</label>
                            <input
                                type="text"
                                placeholder="e.g. max_pending_bookings"
                                value={newConfig.key}
                                onChange={(e) => setNewConfig({ ...newConfig, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Value</label>
                            <input
                                type="text"
                                placeholder="e.g. 24"
                                value={newConfig.value}
                                onChange={(e) => setNewConfig({ ...newConfig, value: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Description</label>
                            <input
                                type="text"
                                placeholder="Optional description"
                                value={newConfig.description}
                                onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <ActionButton
                            startIcon={<Save className="h-4 w-4" />}
                            label={savingKey === newConfig.key ? 'Saving...' : 'Create'}
                            onClick={handleAddConfig}
                            variant="primary"
                            disabled={savingKey === newConfig.key}
                        />
                        <ActionButton
                            startIcon={<RefreshCw className="h-4 w-4" />}
                            label="Cancel"
                            onClick={() => { setShowAddForm(false); setNewConfig({ key: '', value: '', description: '' }); }}
                            variant="secondary"
                        />
                    </div>
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader className="h-6 w-6 animate-spin text-indigo-500" />
                    <span className="ml-2 text-sm text-slate-500">Loading configurations...</span>
                </div>
            ) : configs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                    <Settings2 className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        No booking configurations found. Click "Add Config" to create one.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {configs.map((config) => {
                        const meta = getMeta(config.key);
                        const isEdited = hasChanged(config.key);
                        const isSaving = savingKey === config.key;

                        return (
                            <div
                                key={config.id}
                                className={`rounded-2xl border bg-white p-6 transition-all dark:bg-slate-900 ${
                                    config.isActive
                                        ? 'border-slate-200 dark:border-slate-800'
                                        : 'border-amber-200 bg-amber-50/30 dark:border-amber-800/50 dark:bg-amber-900/10'
                                }`}
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    {/* Left: Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-indigo-500" />
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {meta?.label || config.key}
                                            </h3>
                                            {!config.isActive && (
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    Disabled
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {meta?.description || config.description || `Configuration key: ${config.key}`}
                                        </p>
                                        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                                            Key: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">{config.key}</code>
                                            {' · '}Last updated: {new Date(config.updatedAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Right: Value + Actions */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <input
                                                type={meta?.type === 'number' ? 'number' : 'text'}
                                                min={meta?.type === 'number' ? 0 : undefined}
                                                value={editValues[config.key] ?? config.value}
                                                onChange={(e) =>
                                                    setEditValues((prev) => ({ ...prev, [config.key]: e.target.value }))
                                                }
                                                className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                            {meta?.unit && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{meta.unit}</span>
                                            )}
                                        </div>

                                        <ActionButton
                                            startIcon={<Save className="h-4 w-4" />}
                                            label={isSaving ? '...' : 'Save'}
                                            onClick={() => handleSave(config.key)}
                                            variant="primary"
                                            disabled={!isEdited || isSaving}
                                        />

                                        <button
                                            onClick={() => handleToggleActive(config)}
                                            disabled={isSaving}
                                            title={config.isActive ? 'Disable this config' : 'Enable this config'}
                                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                                        >
                                            {config.isActive ? (
                                                <ToggleRight className="h-5 w-5 text-emerald-500" />
                                            ) : (
                                                <ToggleLeft className="h-5 w-5 text-slate-400" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(config.key)}
                                            disabled={isSaving}
                                            title="Delete this config"
                                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-800/40">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">How Auto-Cancel Works</h3>
                <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                        <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        A cron job runs <strong>every hour</strong> and checks for bookings still in "pending" or "in-progress" status.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        If a booking was created more than <strong>auto_cancel_hours</strong> ago and hasn't been confirmed, it is automatically cancelled.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        If the booking was paid for, the guest receives a <strong>full refund to their AWARI wallet</strong> and the landlord's pending balance is debited.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        Both the guest and property owner receive email notifications about the cancellation.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        Blocked dates are released so the property becomes available again.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default BookingConfigPage;
