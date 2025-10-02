import React from 'react';
import type { Screen } from '../App';

interface ResultsProps {
  navigate: (screen: Screen) => void;
}

const mockResults = [
  {
    position: '1st Prize',
    name: 'Arjun Patel',
    college: 'Pandurang College',
    phone: '9876543210',
    email: 'arjun@example.com'
  },
  {
    position: '2nd Prize',
    name: 'Priya Sharma',
    college: 'Sindhu College',
    phone: '9876543211',
    email: 'priya@example.com'
  },
  {
    position: '3rd Prize',
    name: 'Rahul Kumar',
    college: 'ABV College',
    phone: '9876543212',
    email: 'rahul@example.com'
  }
];

export function Results({ navigate }: ResultsProps) {
  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-lg font-bold text-black mb-6">Results</h1>
      
      <div className="space-y-2">
        {mockResults.map((result, index) => (
          <p key={index} className="text-sm text-black">
            {result.position} — {result.name} • {result.college} • {result.phone} • {result.email}
          </p>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('home')}
        className="mt-6 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}