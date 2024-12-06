import axios from 'axios';
import { API_KEYS } from '../config/apiKeys';
import { OwnerRecord, PermitRecord, MortgageRecord } from '../types/property';

// Mock data for development
const mockOwnerHistory: OwnerRecord[] = [
  {
    name: 'John Doe',
    dateAcquired: '2020-06-15',
    dateSold: '2023-01-20',
    purchasePrice: 285000
  }
];

const mockPermitHistory: PermitRecord[] = [
  {
    id: 'PERMIT-2021-001',
    type: 'Renovation',
    description: 'Kitchen remodel',
    issueDate: '2021-03-15',
    status: 'Completed',
    estimatedCost: 25000
  }
];

const mockMortgageHistory: MortgageRecord[] = [
  {
    lender: 'First National Bank',
    amount: 250000,
    date: '2020-06-15',
    type: 'Conventional',
    term: 30,
    rate: 3.25
  }
];

export async function getPropertyHistory(propertyId: string): Promise<{
  owners: OwnerRecord[];
  permits: PermitRecord[];
  mortgages: MortgageRecord[];
}> {
  try {
    // Use mock data if no API key is provided
    if (API_KEYS.ATTOM_API_KEY === 'your_attom_api_key') {
      return {
        owners: mockOwnerHistory,
        permits: mockPermitHistory,
        mortgages: mockMortgageHistory
      };
    }

    const [ownerHistory, permitHistory, mortgageHistory] = await Promise.all([
      getOwnerHistory(propertyId),
      getPermitHistory(propertyId),
      getMortgageHistory(propertyId)
    ]);

    return {
      owners: ownerHistory,
      permits: permitHistory,
      mortgages: mortgageHistory
    };
  } catch (error) {
    console.error('Error fetching property history:', error);
    return {
      owners: mockOwnerHistory,
      permits: mockPermitHistory,
      mortgages: mockMortgageHistory
    };
  }
}

async function getOwnerHistory(propertyId: string): Promise<OwnerRecord[]> {
  try {
    const response = await axios.get(`/api/property/${propertyId}/owners`, {
      headers: { 'apikey': API_KEYS.ATTOM_API_KEY }
    });

    return response.data.saleHistory.map((sale: any) => ({
      name: String(sale.buyer || ''),
      dateAcquired: String(sale.recordingDate || ''),
      dateSold: sale.saleDate ? String(sale.saleDate) : undefined,
      purchasePrice: Number(sale.amount || 0)
    }));
  } catch (error) {
    console.error('Error fetching owner history:', error);
    return mockOwnerHistory;
  }
}

async function getPermitHistory(propertyId: string): Promise<PermitRecord[]> {
  try {
    const response = await axios.get(`/api/property/${propertyId}/permits`, {
      headers: { 'apikey': API_KEYS.ATTOM_API_KEY }
    });

    return response.data.permits.map((permit: any) => ({
      id: String(permit.permitNumber || ''),
      type: String(permit.permitType || ''),
      description: String(permit.description || ''),
      issueDate: String(permit.issueDate || ''),
      status: String(permit.status || ''),
      estimatedCost: Number(permit.estimatedCost || 0)
    }));
  } catch (error) {
    console.error('Error fetching permit history:', error);
    return mockPermitHistory;
  }
}

async function getMortgageHistory(propertyId: string): Promise<MortgageRecord[]> {
  try {
    const response = await axios.get(`/api/property/${propertyId}/mortgages`, {
      headers: { 'apikey': API_KEYS.ATTOM_API_KEY }
    });

    return response.data.mortgages.map((mortgage: any) => ({
      lender: String(mortgage.lenderName || ''),
      amount: Number(mortgage.amount || 0),
      date: String(mortgage.recordingDate || ''),
      type: String(mortgage.mortgageType || ''),
      term: Number(mortgage.term || 0),
      rate: mortgage.interestRate ? Number(mortgage.interestRate) : undefined
    }));
  } catch (error) {
    console.error('Error fetching mortgage history:', error);
    return mockMortgageHistory;
  }
}