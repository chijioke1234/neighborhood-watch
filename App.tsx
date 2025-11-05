import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ReportIncidentForm } from './components/ReportIncidentForm';
import { IncidentCard } from './components/IncidentCard';
import { SafetyTipCard } from './components/SafetyTipCard';
import { Incident, IncidentSeverity } from './types';
import { analyzeIncident, generateSafetyTip } from './services/geminiService';
import { ClipboardListIcon } from './components/icons/ClipboardListIcon';

const App: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [safetyTip, setSafetyTip] = useState('');
    const [isTipLoading, setIsTipLoading] = useState(false);
    const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'all'>('all');

    const fetchSafetyTip = useCallback(async () => {
        setIsTipLoading(true);
        const tip = await generateSafetyTip();
        setSafetyTip(tip);
        setIsTipLoading(false);
    }, []);

    useEffect(() => {
        fetchSafetyTip();
    }, [fetchSafetyTip]);

    const handleReportSubmit = async (data: { userDescription: string; photo?: string; location?: { latitude: number; longitude: number; } }) => {
        setIsLoading(true);

        const analysis = await analyzeIncident(data.userDescription);

        const newIncident: Incident = {
            id: new Date().toISOString(),
            description: data.userDescription,
            photo: data.photo,
            location: data.location,
            timestamp: new Date(),
            ...analysis
        };

        setIncidents(prevIncidents => [newIncident, ...prevIncidents]);
        setIsLoading(false);
        setIsFormVisible(false);
    };

    const filteredIncidents = useMemo(() => {
        return incidents
            .filter(incident => severityFilter === 'all' || incident.severity === severityFilter)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [incidents, severityFilter]);

    const renderFilterControls = () => (
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by severity:</h3>
                <div className="flex flex-wrap gap-2">
                    {(['all', ...Object.values(IncidentSeverity).filter(v => v !== IncidentSeverity.UNKNOWN)] as const).map((severity) => {
                        const capitalizedSeverity = severity.charAt(0).toUpperCase() + severity.slice(1);
                        const isActive = severityFilter === severity;
                        const baseClasses = "px-3 py-1 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-light";
                        const activeClasses = "bg-brand-primary text-white";
                        const inactiveClasses = "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600";
                        return (
                            <button
                                key={severity}
                                onClick={() => setSeverityFilter(severity)}
                                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            >
                                {capitalizedSeverity}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <SafetyTipCard tip={safetyTip} onRefresh={fetchSafetyTip} isLoading={isTipLoading}/>
                
                <h2 className="text-2xl font-bold my-4 text-gray-800 dark:text-gray-200">Community Feed</h2>
                
                {renderFilterControls()}

                {incidents.length === 0 ? (
                    <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center">
                        <ClipboardListIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">All Clear!</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">There are no incidents to show. Report one to get started.</p>
                    </div>
                ) : filteredIncidents.length === 0 ? (
                     <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center">
                        <ClipboardListIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Matching Incidents</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your filters to see more reports.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredIncidents.map(incident => (
                            <IncidentCard key={incident.id} incident={incident} />
                        ))}
                    </div>
                )}
            </main>

            {isFormVisible && (
                <ReportIncidentForm 
                    onSubmit={handleReportSubmit} 
                    onClose={() => setIsFormVisible(false)}
                    isLoading={isLoading}
                />
            )}

            <button
                onClick={() => setIsFormVisible(true)}
                className="fixed bottom-6 right-6 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-brand-light focus:ring-opacity-50"
                aria-label="Report new incident"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </button>
        </div>
    );
};

export default App;
