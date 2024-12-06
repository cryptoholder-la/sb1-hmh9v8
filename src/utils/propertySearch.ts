import { Property, SearchFilters } from '../types/property';
import { searchByAddress, searchByParcel, searchByCoordinates } from '../services/propertyApi';
import { getPropertyHistory } from '../services/propertyHistory';
import { getFloodZoneData } from '../services/environmentalApi';

export async function searchProperties(
  query: string,
  filters: SearchFilters = {},
  searchType: 'address' | 'parcel' | 'coordinates' = 'address'
): Promise<Property[]> {
  try {
    let properties: Property[] = [];

    // Initial property search
    switch (searchType) {
      case 'address':
        properties = await searchByAddress(query);
        break;
      case 'parcel':
        properties = await searchByParcel(query);
        break;
      case 'coordinates': {
        const [lat, lng] = query.split(',').map(n => Number(n) || 0);
        properties = await searchByCoordinates(lat, lng);
        break;
      }
    }

    // Enrich properties one by one to avoid serialization issues
    const enrichedProperties: Property[] = [];
    
    for (const property of properties) {
      try {
        // Get additional property history
        const history = await getPropertyHistory(property.id);
        
        // Get flood zone data if coordinates are available
        let floodData = null;
        if (property.coordinates?.latitude && property.coordinates?.longitude) {
          floodData = await getFloodZoneData(
            property.coordinates.latitude,
            property.coordinates.longitude
          );
        }

        // Create a new object with all the data
        const enrichedProperty: Property = {
          ...property,
          ownerHistory: history.owners,
          permitHistory: history.permits,
          mortgageInfo: history.mortgages,
          floodZone: floodData
        };

        // Ensure all numbers are properly converted
        enrichedProperty.price = Number(enrichedProperty.price) || 0;
        enrichedProperty.sqft = Number(enrichedProperty.sqft) || 0;
        enrichedProperty.bedrooms = Number(enrichedProperty.bedrooms) || 0;
        enrichedProperty.bathrooms = Number(enrichedProperty.bathrooms) || 0;
        enrichedProperty.yearBuilt = Number(enrichedProperty.yearBuilt) || 0;

        if (enrichedProperty.coordinates) {
          enrichedProperty.coordinates.latitude = Number(enrichedProperty.coordinates.latitude) || 0;
          enrichedProperty.coordinates.longitude = Number(enrichedProperty.coordinates.longitude) || 0;
        }

        enrichedProperties.push(enrichedProperty);
      } catch (error) {
        console.error('Error enriching property:', error);
        enrichedProperties.push(property);
      }
    }

    // Apply filters
    return enrichedProperties.filter((property) => {
      const meetsFilters = 
        (!filters.minPrice || property.price >= filters.minPrice) &&
        (!filters.maxPrice || property.price <= filters.maxPrice) &&
        (!filters.minBeds || property.bedrooms >= filters.minBeds) &&
        (!filters.minBaths || property.bathrooms >= filters.minBaths) &&
        (!filters.minSqft || property.sqft >= filters.minSqft) &&
        (!filters.yearBuiltMin || property.yearBuilt >= filters.yearBuiltMin) &&
        (!filters.yearBuiltMax || property.yearBuilt <= filters.yearBuiltMax);

      return meetsFilters;
    });
  } catch (error) {
    console.error('Error in property search:', error);
    return [];
  }
}