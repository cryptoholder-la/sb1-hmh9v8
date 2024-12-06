import React from 'react';
import { Property } from '../types/property';
import { Home, Ruler, Bed, Bath, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video bg-gray-200 relative">
        <img
          src={`https://source.unsplash.com/800x600/?house,property&random=${property.id}`}
          alt={property.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full">
          {formatPrice(property.price)}
        </div>
        {property.floodZone?.floodRisk === 'High' && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Flood Risk
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{property.address}</h3>
        <p className="text-gray-600 mb-4">{`${property.city}, ${property.state} ${property.zipCode}`}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-gray-400" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-gray-400" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-5 w-5 text-gray-400" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span>Built {property.yearBuilt}</span>
          </div>
        </div>

        {property.taxInfo && (
          <div className="mb-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-5 w-5" />
              <span>Tax Assessment: {formatPrice(property.taxInfo.assessedValue)}</span>
            </div>
          </div>
        )}
        
        {property.ownerHistory?.[0] && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              Last sold on {formatDate(property.ownerHistory[0].dateAcquired)} for {formatPrice(property.ownerHistory[0].purchasePrice)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}