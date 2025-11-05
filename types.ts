
export enum IncidentSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  UNKNOWN = 'Unknown'
}

export enum IncidentCategory {
  SUSPICIOUS_ACTIVITY = 'Suspicious Activity',
  THEFT = 'Theft',
  VANDALISM = 'Vandalism',
  TRAFFIC = 'Traffic Violation',
  LOST_PET = 'Lost Pet',
  OTHER = 'Other'
}

export interface Incident {
  id: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  summary: string;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  photo?: string; // base64 encoded image
}

export interface IncidentAnalysis {
    category: IncidentCategory;
    severity: IncidentSeverity;
    summary: string;
}
