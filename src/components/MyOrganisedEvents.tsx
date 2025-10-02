import React, { useState } from 'react';
import type { Screen } from '../App';
import { Trash2 } from 'lucide-react';

interface MyOrganisedEventsProps {
  navigate: (screen: Screen, eventId?: string, editEvent?: any) => void;
  events: any[]; // Receive events as a prop
  deleteEvent: (eventId: string) => void;
}

// Get organized events - show events created by the user and demo events from specific colleges
const getOrganisedEvents = (allEvents: any[]) => {
  return allEvents.filter(event => 
    // Show events created by the user
    event.createdByUser || 
    // For demo purposes, also show events from colleges containing "Trinit" or "Xavier"
    event.college.toLowerCase().includes('trinit') || 
    event.college.toLowerCase().includes('xavier')
  ).map(event => ({
    id: event.id,
    name: event.eventName,
    college: event.college,
    fullEvent: event // Keep reference to full event data for editing
  }));
};

export function MyOrganisedEvents({ navigate, events, deleteEvent }: MyOrganisedEventsProps) {
  const organisedEvents = getOrganisedEvents(events);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{eventId: string, eventName: string, show: boolean}>({eventId: '', eventName: '', show: false});

  const handleDeleteClick = (eventId: string, eventName: string) => {
    setDeleteConfirmation({eventId, eventName, show: true});
  };

  const confirmDelete = () => {
    deleteEvent(deleteConfirmation.eventId);
    setDeleteConfirmation({eventId: '', eventName: '', show: false});
  };

  const cancelDelete = () => {
    setDeleteConfirmation({eventId: '', eventName: '', show: false});
  };

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-base font-bold text-black mb-6">My Organized Events</h1>
      
      <div className="space-y-4">
        {organisedEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No organized events found.</p>
            <button
              onClick={() => navigate('add_event')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          organisedEvents.map((event) => (
            <div key={event.id} className="w-full border border-gray-300 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-black mb-1">{event.name}</div>
                  <div 
                    className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" 
                    onClick={() => navigate('add_event', undefined, event.fullEvent)}
                  >
                    Edit
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('participants', event.id)}
                    className="px-3 py-1 bg-gray-200 border border-gray-400 rounded-lg text-sm font-semibold text-black transition-colors"
                  >
                    Participants
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(event.id, event.name);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-bold text-black mb-4">Delete Event</h3>
            <p className="text-sm text-gray-700 mb-4">
              Deleting "{deleteConfirmation.eventName}" will also permanently remove all participants and linked sub-events. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate('org_dashboard')}
        className="mt-6 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}