export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  parcelNumber?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  lastSold?: {
    date: string;
    price: number;
  };
  taxInfo?: {
    assessedValue: number;
    taxAmount: number;
    taxYear: number;
  };
  ownerHistory?: OwnerRecord[];
  permitHistory?: PermitRecord[];
  mortgageInfo?: MortgageRecord[];
}

export interface OwnerRecord {
  name: string;
  dateAcquired: string;
  dateSold?: string;
  purchasePrice: number;
}

export interface PermitRecord {
  id: string;
  type: string;
  description: string;
  issueDate: string;
  status: string;
  estimatedCost: number;
}

export interface MortgageRecord {
  lender: string;
  amount: number;
  date: string;
  type: string;
  term: number;
  rate?: number;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
}

export interface DataSource {
  name: string;
  url: string;
  description: string;
  category: 'public' | 'private' | 'government';
  dataTypes: string[];
  coverage: string;
  accessType: 'free' | 'paid' | 'subscription';
  apiAvailable: boolean;
}