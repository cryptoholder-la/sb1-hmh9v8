import axios from 'axios';
import { API_KEYS } from '../config/apiKeys';
import { Property } from '../types/property';

// Mock data for development without API keys
const mockProperties: Property[] = [
  {
    id: '1',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    price: 299000,
    sqft: 2200,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 1985,
    parcelNumber: 'ABC123',
    coordinates: {
      latitude: 39.78373,
      longitude: -89.65063
    },
    taxInfo: {
      assessedValue: 275000,
      taxAmount: 5500,
      taxYear: 2023
    }
  }
];

// ATTOM Property API
const attomApi = axios.create({
  baseURL: 'https://api.gateway.attomdata.com/propertyapi/v1.0.0',
  headers: {
    'apikey': API_KEYS.ATTOM_API_KEY,
    'Accept': 'application/json'
  }
});

export async function searchByAddress(address: string): Promise<Property[]> {
  try {
    // Use mock data if no API key is provided
    if (API_KEYS.ATTOM_API_KEY === 'your_attom_api_key') {
      return mockProperties;
    }

    const response = await attomApi.get('/property/detail', {
      params: { address }
    });
    
    return transformAttomData(response.data);
  } catch (error) {
    console.error('Error fetching from ATTOM:', error);
    return mockProperties;
  }
}

export async function searchByParcel(parcelNumber: string): Promise<Property[]> {
  try {
    if (API_KEYS.ATTOM_API_KEY === 'your_attom_api_key') {
      return mockProperties;
    }

    const response = await attomApi.get('/property/detail', {
      params: { apn: parcelNumber }
    });
    
    return transformAttomData(response.data);
  } catch (error) {
    console.error('Error fetching from ATTOM:', error);
    return mockProperties;
  }
}

export async function searchByCoordinates(lat: number, lng: number): Promise<Property[]> {
  try {
    if (API_KEYS.ATTOM_API_KEY === 'your_attom_api_key') {
      return mockProperties;
    }

    const response = await attomApi.get('/property/detail', {
      params: { latitude: lat, longitude: lng }
    });
    
    return transformAttomData(response.data);
  } catch (error) {
    console.error('Error fetching from ATTOM:', error);
    return mockProperties;
  }
}

function transformAttomData(data: any): Property[] {
  if (!data?.property) return [];
  
  return data.property.map((p: any) => ({
    id: String(p.identifier?.Id || Math.random()),
    address: p.address?.line1 || '',
    city: p.address?.locality || '',
    state: p.address?.countrySubd || '',
    zipCode: p.address?.postal1 || '',
    price: Number(p.assessment?.market?.price || 0),
    sqft: Number(p.building?.size?.universalsize || 0),
    bedrooms: Number(p.building?.rooms?.beds || 0),
    bathrooms: Number(p.building?.rooms?.bathstotal || 0),
    yearBuilt: Number(p.summary?.yearBuilt || 0),
    parcelNumber: p.identifier?.apn || '',
    coordinates: p.location ? {
      latitude: Number(p.location.latitude || 0),
      longitude: Number(p.location.longitude || 0)
    } : undefined,
    taxInfo: {
      assessedValue: Number(p.assessment?.assessed || 0),
      taxAmount: Number(p.assessment?.tax?.taxamt || 0),
      taxYear: Number(p.assessment?.tax?.taxyear || 0)
    }
  }));
}