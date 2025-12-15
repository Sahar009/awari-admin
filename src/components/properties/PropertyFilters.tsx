import { Search } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';

export interface PropertyFiltersState {
  search: string;
  status: string;
  listingType: string;
  propertyType: string;
  featuredOnly: boolean;
}

interface PropertyFiltersProps {
  filters: PropertyFiltersState;
  onChange: (filters: Partial<PropertyFiltersState>) => void;
  onReset: () => void;
}

const statusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Archived', value: 'archived' },
  { label: 'Sold', value: 'sold' },
  { label: 'Rented', value: 'rented' }
];

const listingOptions = [
  { label: 'All listing types', value: '' },
  { label: 'Rent', value: 'rent' },
  { label: 'Sale', value: 'sale' },
  { label: 'Shortlet', value: 'shortlet' }
];

const propertyTypeOptions = [
  'apartment',
  'house',
  'villa',
  'condo',
  'studio',
  'penthouse',
  'townhouse',
  'duplex',
  'bungalow',
  'land',
  'commercial',
  'office',
  'shop',
  'warehouse'
];

export const PropertyFilters = ({ filters, onChange, onReset }: PropertyFiltersProps) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Property management</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Audit listings, approve submissions, and keep the marketplace tidy.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <label className="relative inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
            checked={filters.featuredOnly}
            onChange={(event) => onChange({ featuredOnly: event.target.checked })}
          />
          Featured only
        </label>
        <ActionButton variant="outline" label="Reset" onClick={onReset} />
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title, address or owner"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
        />
      </div>

      <select
        value={filters.status}
        onChange={(event) => onChange({ status: event.target.value })}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.listingType}
        onChange={(event) => onChange({ listingType: event.target.value })}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
      >
        {listingOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.propertyType}
        onChange={(event) => onChange({ propertyType: event.target.value })}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
      >
        <option value="">All property types</option>
        {propertyTypeOptions.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default PropertyFilters;


















