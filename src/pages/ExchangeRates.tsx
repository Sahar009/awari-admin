import { useEffect, useState } from 'react';
import { RefreshCw, Save, Globe, TrendingUp, AlertCircle } from 'lucide-react';
import { getExchangeRates, updateExchangeRates } from '../services/amadeusAdmin';

interface ExchangeRates {
  USD: number;
  EUR: number;
  GBP: number;
  NGN: number;
}

const defaultRates: ExchangeRates = {
  USD: 1550,
  EUR: 1680,
  GBP: 1950,
  NGN: 1
};

const ExchangeRatesPage = () => {
  const [rates, setRates] = useState<ExchangeRates>(defaultRates);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const result = await getExchangeRates();
      if (result.success) {
        setRates(result.data);
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to fetch exchange rates' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to fetch exchange rates' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleRateChange = (currency: keyof ExchangeRates, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return;
    
    setRates(prev => ({
      ...prev,
      [currency]: numValue
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await updateExchangeRates({
        USD: rates.USD,
        EUR: rates.EUR,
        GBP: rates.GBP
      });
      
      if (result.success) {
        setFeedback({ type: 'success', message: 'Exchange rates updated successfully' });
        setRates(result.data);
      } else {
        setFeedback({ type: 'error', message: result.message || 'Failed to update exchange rates' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to update exchange rates' });
    } finally {
      setSaving(false);
    }
  };

  const formatRate = (rate: number) => {
    return rate.toLocaleString('en-NG');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Exchange Rates</h1>
          <p className="text-slate-500">Manage currency conversion rates for Amadeus hotel pricing</p>
        </div>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
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

      {/* Info Card */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">About Exchange Rates</h3>
            <p className="text-sm text-blue-700 mt-1">
              These rates are used to convert Amadeus hotel prices from foreign currencies (USD, EUR, GBP) to Nigerian Naira (₦). 
              All prices displayed to users will be in NGN. Rates are manually configured and should be updated periodically 
              to reflect current market conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Exchange Rates Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Currency Rates (per 1 unit to NGN)</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* USD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-semibold text-slate-700">
                  USD
                </div>
                <div>
                  <p className="font-medium text-slate-900">US Dollar</p>
                  <p className="text-sm text-slate-500">$1 = ₦{formatRate(rates.USD)}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rate (₦ per $1)
                </label>
                <input
                  type="number"
                  value={rates.USD}
                  onChange={(e) => handleRateChange('USD', e.target.value)}
                  min="1"
                  step="1"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* EUR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-semibold text-slate-700">
                  EUR
                </div>
                <div>
                  <p className="font-medium text-slate-900">Euro</p>
                  <p className="text-sm text-slate-500">€1 = ₦{formatRate(rates.EUR)}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rate (₦ per €1)
                </label>
                <input
                  type="number"
                  value={rates.EUR}
                  onChange={(e) => handleRateChange('EUR', e.target.value)}
                  min="1"
                  step="1"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* GBP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-semibold text-slate-700">
                  GBP
                </div>
                <div>
                  <p className="font-medium text-slate-900">British Pound</p>
                  <p className="text-sm text-slate-500">£1 = ₦{formatRate(rates.GBP)}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rate (₦ per £1)
                </label>
                <input
                  type="number"
                  value={rates.GBP}
                  onChange={(e) => handleRateChange('GBP', e.target.value)}
                  min="1"
                  step="1"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* NGN - Read Only */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-emerald-100 rounded flex items-center justify-center font-semibold text-emerald-700">
                  NGN
                </div>
                <div>
                  <p className="font-medium text-slate-900">Nigerian Naira</p>
                  <p className="text-sm text-slate-500">Base currency</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rate (fixed)
                </label>
                <input
                  type="number"
                  value={rates.NGN}
                  disabled
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm bg-slate-50"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-900">Conversion Preview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">$100 USD</p>
            <p className="text-lg font-semibold text-slate-900">₦{(100 * rates.USD).toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">€100 EUR</p>
            <p className="text-lg font-semibold text-slate-900">₦{(100 * rates.EUR).toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">£100 GBP</p>
            <p className="text-lg font-semibold text-slate-900">₦{(100 * rates.GBP).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRatesPage;
