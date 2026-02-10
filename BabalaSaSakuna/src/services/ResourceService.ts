import { Resource, ResourceType } from '../types';
import { RESOURCES } from '../data/resources';

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
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get nearest resources to a location
   */
  getNearestResources(
    latitude: number,
    longitude: number,
    limit: number = 5
  ): Array<Resource & { distance: number }> {
    const resourcesWithDistance = RESOURCES.map(resource => ({
      ...resource,
      distance: this.calculateDistance(
        latitude,
        longitude,
        resource.coordinates.latitude,
        resource.coordinates.longitude
      ),
    }));

    return resourcesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
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
    const resourcesWithDistance = resourcesOfType.map(resource => ({
      ...resource,
      distance: this.calculateDistance(
        latitude,
        longitude,
        resource.coordinates.latitude,
        resource.coordinates.longitude
      ),
    }));

    return resourcesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
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
