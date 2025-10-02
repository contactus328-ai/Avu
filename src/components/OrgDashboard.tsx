import React from 'react';
import type { Screen } from '../App';

interface OrgDashboardProps {
  navigate: (screen: Screen, eventId?: string, editEvent?: any, isNewFromDashboard?: boolean) => void;
}

export function OrgDashboard({ navigate }: OrgDashboardProps) {
  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-lg font-bold text-black mb-6">Dashboard</h1>
      
      <div className="space-y-4">
        {/* My Organised Events */}
        <button
          onClick={() => navigate('my_org')}
          className="w-full h-12 bg-gray-100 border border-gray-300 rounded-lg flex items-center px-4 text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
        >
          My Organised Events
        </button>

        {/* Add Event */}
        <button
          onClick={() => navigate('add_event', undefined, undefined, true)}
          className="w-full h-12 bg-gray-100 border border-gray-300 rounded-lg flex items-center px-4 text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
        >
          Add New Event
        </button>

        {/* My Participating Events */}
        <button
          onClick={() => navigate('my_part')}
          className="w-full h-12 bg-gray-100 border border-gray-300 rounded-lg flex items-center px-4 text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
        >
          My Participating Events
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('profile')}
          className="w-full h-12 bg-gray-100 border border-gray-300 rounded-lg flex items-center px-4 text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
        >
          Account / Profile
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('home')}
        className="mt-6 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
      >
        ← Back to Home
      </button>
    </div>
  );
}