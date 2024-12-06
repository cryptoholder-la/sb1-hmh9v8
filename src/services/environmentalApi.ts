import axios from 'axios';
import { API_KEYS } from '../config/apiKeys';

const femaApi = axios.create({
  baseURL: 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28',
  params: {
    'f': 'json',
    'token': API_KEYS.FEMA_API_KEY
  }
});

export interface FloodZoneData {
  zoneId: string;
  floodRisk: 'High' | 'Moderate' | 'Low' | 'Unknown';
  description: string;
}

export async function getFloodZoneData(lat: number, lng: number): Promise<FloodZoneData> {
  try {
    const response = await femaApi.get('/query', {
      params: {
        geometry: `${lng},${lat}`,
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'FLD_ZONE,ZONE_SUBTY'
      }
    });

    if (response.data.features?.length > 0) {
      const feature = response.data.features[0];
      return {
        zoneId: feature.attributes.FLD_ZONE,
        floodRisk: getFloodRisk(feature.attributes.FLD_ZONE),
        description: getZoneDescription(feature.attributes.FLD_ZONE)
      };
    }

    return {
      zoneId: 'Unknown',
      floodRisk: 'Unknown',
      description: 'No flood zone data available for this location'
    };
  } catch (error) {
    console.error('Error fetching flood zone data:', error);
    throw error;
  }
}

function getFloodRisk(zoneId: string): 'High' | 'Moderate' | 'Low' | 'Unknown' {
  const highRiskZones = ['A', 'AE', 'AH', 'AO', 'AR', 'V', 'VE'];
  const moderateRiskZones = ['B', 'X SHADED'];
  const lowRiskZones = ['C', 'X UNSHADED'];

  if (highRiskZones.includes(zoneId)) return 'High';
  if (moderateRiskZones.includes(zoneId)) return 'Moderate';
  if (lowRiskZones.includes(zoneId)) return 'Low';
  return 'Unknown';
}

function getZoneDescription(zoneId: string): string {
  const descriptions: Record<string, string> = {
    'A': 'High-risk area with 1% annual chance of flooding',
    'AE': 'High-risk area with detailed flood elevation data',
    'X': 'Area of minimal flood hazard',
    // Add more descriptions as needed
  };

  return descriptions[zoneId] || 'No description available';
}