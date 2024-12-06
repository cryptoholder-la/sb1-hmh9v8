import React, { useState } from 'react';
import { Building2, Database } from 'lucide-react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SearchBar from './components/SearchBar';
import PropertyCard from './components/PropertyCard';
import ResourcesList from './components/ResourcesList';
import { searchProperties } from './utils/propertySearch';
import { Property, SearchFilters } from './types/property';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleSearch = async (
    query: string, 
    filters: SearchFilters, 
    searchType: 'address' | 'parcel' | 'coordinates'
  ) => {
    setLoading(true);
    try {
      const results = await searchProperties(query, filters, searchType);
      setProperties(results);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">OSINT Real Estate Framework</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
          <TabList className="flex space-x-4 border-b mb-8">
            <Tab 
              className={`px-4 py-2 cursor-pointer ${
                activeTab === 0 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Search Properties
            </Tab>
            <Tab 
              className={`px-4 py-2 cursor-pointer flex items-center gap-2 ${
                activeTab === 1 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Database className="h-4 w-4" />
              Data Sources
            </Tab>
          </TabList>

          <TabPanel>
            <SearchBar onSearch={handleSearch} />

            {loading ? (
              <div className="mt-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {!loading && properties.length === 0 && (
              <div className="mt-8 text-center text-gray-600">
                <p>Enter an address, parcel number, or GPS coordinates to start searching</p>
              </div>
            )}
          </TabPanel>

          <TabPanel>
            <ResourcesList />
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
}

export default App;