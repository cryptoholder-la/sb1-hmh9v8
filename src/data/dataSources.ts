import { DataSource } from '../types/property';

export const dataSources: DataSource[] = [
  {
    name: 'County Assessor Records',
    url: 'https://example.com',
    description: 'Official property tax and assessment records from county offices',
    category: 'government',
    dataTypes: ['tax records', 'property details', 'ownership history'],
    coverage: 'County-level',
    accessType: 'free',
    apiAvailable: false
  },
  {
    name: 'FEMA Flood Maps',
    url: 'https://msc.fema.gov/portal/home',
    description: 'Official flood hazard maps and risk assessment data',
    category: 'government',
    dataTypes: ['flood zones', 'risk assessment'],
    coverage: 'National',
    accessType: 'free',
    apiAvailable: true
  },
  {
    name: 'Property Shark',
    url: 'https://www.propertyshark.com',
    description: 'Comprehensive property research platform',
    category: 'private',
    dataTypes: ['property data', 'ownership', 'permits', 'liens'],
    coverage: 'National',
    accessType: 'paid',
    apiAvailable: true
  },
  {
    name: 'Zillow',
    url: 'https://www.zillow.com',
    description: 'Real estate marketplace and data provider',
    category: 'private',
    dataTypes: ['market values', 'sales history', 'property details'],
    coverage: 'National',
    accessType: 'free',
    apiAvailable: true
  }
];

export const dataCategories = [
  {
    name: 'Property Information',
    sources: ['County Assessor Records', 'Property Shark', 'Zillow']
  },
  {
    name: 'Financial Data',
    sources: ['County Recorder', 'HMDA', 'Property Shark']
  },
  {
    name: 'Environmental Data',
    sources: ['FEMA Flood Maps', 'EPA', 'USGS']
  },
  {
    name: 'Market Analysis',
    sources: ['Zillow', 'Redfin', 'Realtor.com']
  }
];