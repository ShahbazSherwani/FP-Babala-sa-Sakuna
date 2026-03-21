import { Alert, HazardCategory, SeverityLevel, FilterOption } from '../types';
import { mockAlerts, alertTranslations } from '../data/alerts';
import { localizationService } from './LocalizationService';

// Severity sort order (critical first)
const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

class AlertService {
  private alerts: Alert[] = mockAlerts;

  /**
   * Apply translations if current language is Tagalog
   */
  private localizeAlert(alert: Alert): Alert {
    if (localizationService.getLanguage() === 'tl') {
      const tl = alertTranslations[alert.id];
      if (tl) {
        return {
          ...alert,
          title: tl.title,
          description: tl.description,
          recommendedActions: tl.recommendedActions,
        };
      }
    }
    return alert;
  }

  /**
   * Get all active alerts, sorted by severity (most urgent first)
   */
  getAllAlerts(): Alert[] {
    return [...this.alerts]
      .filter((a) => a.isActive)
      .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
      .map((a) => this.localizeAlert(a));
  }

  /**
   * Get alerts filtered by hazard category
   */
  getAlertsByCategory(category: FilterOption): Alert[] {
    const all = this.getAllAlerts();
    if (category === 'all') return all;
    return all.filter((a) => a.category === category);
  }

  /**
   * Get a single alert by ID
   */
  getAlertById(id: string): Alert | undefined {
    const alert = this.alerts.find((a) => a.id === id);
    return alert ? this.localizeAlert(alert) : undefined;
  }

  /**
   * Get count of active alerts
   */
  getActiveAlertCount(): number {
    return this.alerts.filter((a) => a.isActive).length;
  }

  /**
   * Get count of alerts by severity
   */
  getAlertCountBySeverity(severity: SeverityLevel): number {
    return this.alerts.filter((a) => a.isActive && a.severity === severity).length;
  }

  /**
   * Simulate refreshing alerts (returns existing data for prototype)
   */
  async refreshAlerts(): Promise<Alert[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return this.getAllAlerts();
  }
}

export const alertService = new AlertService();
