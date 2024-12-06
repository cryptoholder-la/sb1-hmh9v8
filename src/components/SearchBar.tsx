import React, { useState } from 'react';
import { Search, MapPin, Hash } from 'lucide-react';
import { SearchFilters } from '../types/property';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters, searchType: 'address' | 'parcel' | 'coordinates') => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'address' | 'parcel' | 'coordinates'>('address');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters, searchType);
  };

  const getPlaceholder = () => {
    switch (searchType) {
      case 'address':
        return 'Enter street address...';
      case 'parcel':
        return 'Enter parcel number...';
      case 'coordinates':
        return 'Enter GPS coordinates (lat, lng)...';
      default:
        return 'Search...';
    }
  };

  const getIcon = () => {
    switch (searchType) {
      case 'address':
        return <Search className="h-5 w-5 text-gray-400" />;
      case 'parcel':
        return <Hash className="h-5 w-5 text-gray-400" />;
      case 'coordinates':
        return <MapPin className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute left-3 top-2.5">
              {getIcon()}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'address' | 'parcel' | 'coordinates')}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="address">Address</option>
          <option value="parcel">Parcel #</option>
          <option value="coordinates">GPS</option>
        </select>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Filters
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {showFilters && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Price</label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Beds</label>
              <input
                type="number"
                value={filters.minBeds || ''}
                onChange={(e) => setFilters({ ...filters, minBeds: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}