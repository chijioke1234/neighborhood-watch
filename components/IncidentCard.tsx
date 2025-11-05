import React from 'react';
import { Incident, IncidentSeverity } from '../types';
import { MapPinIcon } from './MapPinIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface IncidentCardProps {
  incident: Incident;
}

const severityConfig = {
  [IncidentSeverity.HIGH]: {
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-alert-high',
    textColor: 'text-alert-high',
    iconColor: 'text-alert-high'
  },
  [IncidentSeverity.MEDIUM]: {
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-alert-medium',
    textColor: 'text-alert-medium',
    iconColor: 'text-alert-medium'
  },
  [IncidentSeverity.LOW]: {
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-alert-low',
    textColor: 'text-alert-low',
    iconColor: 'text-alert-low'
  },
  [IncidentSeverity.UNKNOWN]: {
    bgColor: 'bg-gray-50 dark:bg-gray-800/20',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-500 dark:text-gray-400',
    iconColor: 'text-gray-400'
  }
};

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  const config = severityConfig[incident.severity];

  return (
    <div className={`rounded-lg shadow-md overflow-hidden border-l-4 ${config.borderColor} ${config.bgColor} transition-shadow hover:shadow-lg`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.textColor} ${config.bgColor} border ${config.borderColor}`}>
              {incident.category}
            </span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {incident.timestamp.toLocaleString()}
            </p>
          </div>
          <div className={`flex items-center space-x-1 font-bold ${config.textColor}`}>
            <AlertTriangleIcon className={`h-5 w-5 ${config.iconColor}`} />
            <span>{incident.severity}</span>
          </div>
        </div>

        <p className="mt-3 text-lg font-semibold text-gray-800 dark:text-gray-200">{incident.summary}</p>
        <p className="mt-1 text-gray-600 dark:text-gray-300">{incident.description}</p>
        
        {incident.photo && (
          <div className="mt-4">
            <img src={incident.photo} alt="Incident" className="rounded-lg max-h-64 w-full object-cover" />
          </div>
        )}

        {incident.location && (
          <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPinIcon className="h-4 w-4 mr-1.5" />
            <span>Location: {incident.location.latitude.toFixed(4)}, {incident.location.longitude.toFixed(4)}</span>
          </div>
        )}
      </div>
    </div>
  );
};