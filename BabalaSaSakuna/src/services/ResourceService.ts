import { Resource, ResourceType } from '../types';
import { RESOURCES } from '../data/resources';
import { locationService, Coordinates } from './LocationService';

export class ResourceService {
  private static instance: ResourceService;

  private constructor() {}

  static getInstance(): ResourceService {
    if (!ResourceService.instance) {
      ResourceService.instance = new ResourceService();
    }
    return ResourceService.instance;
  }

  /**
   * Get all resources
   */
  getAllResources(): Resource[] {
    return RESOURCES;
  }

  /**
   * Get resources by type
   */
  getResourcesByType(type: ResourceType): Resource[] {
    return RESOURCES.filter(resource => resource.type === type);
  }

  /**
   * Get resource by ID
   */
  getResourceById(id: string): Resource | undefined {
    return RESOURCES.find(resource => resource.id === id);
  }

  /**
   * Search resources by name or address
   */
  searchResources(query: string): Resource[] {
    const lowerQuery = query.toLowerCase();
    return RESOURCES.filter(
      resource =>
        resource.name.toLowerCase().includes(lowerQuery) ||
        resource.address.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Calculate distance using LocationService
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    return locationService.calculateDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
  }

  /**
   * Get distance to a resource from user's location
   */
  async getDistanceToResource(resourceId: string): Promise<number | null> {
    const resource = this.getResourceById(resourceId);
    if (!resource) return null;

    const userLocation = await locationService.getCurrentLocation();
    if (!userLocation) return null;

    return this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      resource.coordinates.latitude,
      resource.coordinates.longitude
    );
  }

  /**
   * Get nearest resources to a location
   */
  getNearestResources(
    latitude: number,
    longitude: number,
    limit: number = 5
  ): Array<Resource & { distance: number }> {
    return locationService
      .sortByDistance({ latitude, longitude }, RESOURCES)
      .slice(0, limit);
  }

  /**
   * Get nearest resources from user's current location
   */
  async getNearestResourcesFromUser(limit: number = 5): Promise<Array<Resource & { distance: number }>> {
    const userLocation = await locationService.getCurrentLocation();
    if (!userLocation) {
      // Return resources without distance sorting
      return RESOURCES.slice(0, limit).map(r => ({ ...r, distance: 0 }));
    }

    return this.getNearestResources(
      userLocation.latitude,
      userLocation.longitude,
      limit
    );
  }

  /**
   * Get nearest resources of specific type
   */
  getNearestResourcesByType(
    type: ResourceType,
    latitude: number,
    longitude: number,
    limit: number = 3
  ): Array<Resource & { distance: number }> {
    const resourcesOfType = this.getResourcesByType(type);
    return locationService
      .sortByDistance({ latitude, longitude }, resourcesOfType)
      .slice(0, limit);
  }

  /**
   * Get nearest resources of specific type from user location
   */
  async getNearestResourcesByTypeFromUser(
    type: ResourceType,
    limit: number = 3
  ): Promise<Array<Resource & { distance: number }>> {
    const userLocation = await locationService.getCurrentLocation();
    if (!userLocation) {
      const resourcesOfType = this.getResourcesByType(type);
      return resourcesOfType.slice(0, limit).map(r => ({ ...r, distance: 0 }));
    }

    return this.getNearestResourcesByType(
      type,
      userLocation.latitude,
      userLocation.longitude,
      limit
    );
  }

  /**
   * Get operational resources (24/7 or currently open)
   */
  getOperationalResources(): Resource[] {
    return RESOURCES.filter(
      resource => resource.operational24_7 || resource.operational24_7 === undefined
    );
  }

  /**
   * Get resources with availability
   */
  getAvailableResources(): Resource[] {
    return RESOURCES.filter(
      resource => !resource.capacity || resource.capacity > 0
    );
  }

  /**
   * Get resources with specific service
   */
  getResourcesWithService(service: string): Resource[] {
    const lowerService = service.toLowerCase();
    return RESOURCES.filter(resource =>
      resource.services?.some(s => s.toLowerCase().includes(lowerService))
    );
  }

  /**
   * Format phone number for calling
   */
  formatPhoneForCall(phone: string): string {
    // Remove all non-digit characters except +
    return phone.replace(/[^\d+]/g, '');
  }

  /**
   * Get all unique resource types
   */
  getResourceTypes(): ResourceType[] {
    return ['shelter', 'evacuation_center', 'hospital', 'fire_station', 'police_station'];
  }

  /**
   * Get resource type display name
   */
  getResourceTypeLabel(type: ResourceType): string {
    const labels: Record<ResourceType, string> = {
      shelter: 'Shelter',
      evacuation_center: 'Evacuation Center',
      hospital: 'Hospital',
      fire_station: 'Fire Station',
      police_station: 'Police Station',
    };
    return labels[type];
  }
}

export const resourceService = ResourceService.getInstance();
