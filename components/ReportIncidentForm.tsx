
import React, { useState, useCallback } from 'react';
import { Incident } from '../types';

interface ReportIncidentFormProps {
  // FIX: Add 'description' to Omit to resolve missing property error. The form uses `userDescription` which is then mapped to `description` in the parent.
  onSubmit: (data: Omit<Incident, 'id' | 'timestamp' | 'category' | 'severity' | 'summary' | 'description'> & { userDescription: string }) => void;
  onClose: () => void;
  isLoading: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ReportIncidentForm: React.FC<ReportIncidentFormProps> = ({ onSubmit, onClose, isLoading }) => {
  const [userDescription, setUserDescription] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();
  const [photoName, setPhotoName] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | undefined>();
  const [locationError, setLocationError] = useState<string>('');

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoName(file.name);
      const base64Photo = await fileToBase64(file);
      setPhoto(base64Photo);
    }
  };

  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError('');
        },
        (error) => {
          setLocationError(`Error: ${error.message}`);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDescription.trim()) {
      alert("Please provide a description of the incident.");
      return;
    }
    onSubmit({ userDescription, photo, location });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-full overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Report an Incident</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-brand-primary focus:ring-brand-primary"
              placeholder="Describe what you saw in detail..."
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add Photo</label>
            <div className="flex items-center space-x-2">
              <label htmlFor="photo-upload" className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Choose File
              </label>
              <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <span className="text-sm text-gray-500 truncate">{photoName || 'No file chosen'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tag Location</label>
            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
            >
              Get Current Location
            </button>
            {location && <p className="text-sm text-green-600 dark:text-green-400">Location tagged: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>}
            {locationError && <p className="text-sm text-red-600 dark:text-red-400">{locationError}</p>}
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};