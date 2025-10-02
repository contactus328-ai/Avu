import React from 'react';
import type { Screen } from '../App';

interface Event {
  id: string;
  college: string;
  eventName: string;
  location: string;
  dates: string;
  type: string;
  competition: string;
  color: string;
  createdAt: number;
  events?: Array<{
    name: string;
    type: string;
    competition: string;
    groupType: string;
    date: string;
    time: string;
    participants: string;
    rules: string[];
    contact?: string;
    entryFees?: string;
    deadline?: string;
    otse?: string;
  }>;
}

interface MyParticipatingEventsProps {
  navigate: (screen: Screen, eventId?: string, editEvent?: any, isNewFromDashboard?: boolean, subEventIndex?: number) => void;
  events: Event[];
  registeredEvents: string[];
  onWithdrawParticipation: (registrationKey: string) => void;
}

export function MyParticipatingEvents({ navigate, events, registeredEvents, onWithdrawParticipation }: MyParticipatingEventsProps) {
  // Parse registrations to extract event and sub-event information
  const getParticipatingSubEvents = () => {
    const participatingSubEvents: Array<{
      eventId: string;
      subEventIndex: number;
      event: Event;
      subEvent: any;
      registrationKey: string;
    }> = [];

    registeredEvents.forEach(registrationKey => {
      // Parse composite key "eventId:subEventIndex"
      const parts = registrationKey.split(':');
      if (parts.length === 2) {
        const eventId = parts[0];
        const subEventIndex = parseInt(parts[1]);
        
        const event = events.find(e => e.id === eventId);
        if (event && event.events && event.events[subEventIndex]) {
          participatingSubEvents.push({
            eventId,
            subEventIndex,
            event,
            subEvent: event.events[subEventIndex],
            registrationKey
          });
        }
      } else {
        // Handle legacy registrations (whole event registrations)
        const event = events.find(e => e.id === registrationKey);
        if (event) {
          participatingSubEvents.push({
            eventId: registrationKey,
            subEventIndex: -1,
            event,
            subEvent: null,
            registrationKey
          });
        }
      }
    });

    return participatingSubEvents;
  };

  const participatingSubEvents = getParticipatingSubEvents();

  const handleWithdraw = (registrationKey: string, subEventName?: string, isDelete: boolean = false) => {
    const action = isDelete ? 'delete' : 'withdraw your participation from';
    const eventName = subEventName ? `"${subEventName}"` : 'this event';
    if (confirm(`Are you sure you want to ${action} ${eventName}?`)) {
      onWithdrawParticipation(registrationKey);
    }
  };

  const handleEventClick = (eventId: string, subEventIndex?: number) => {
    navigate('event_detail', eventId, undefined, undefined, subEventIndex);
  };

  // Extract location without city (everything after the comma, or the whole string if no comma)
  const getLocationOnly = (location: string) => {
    const parts = location.split(', ');
    return parts.length > 1 ? parts[1] : parts[0];
  };

  // Format participants - show single number if min/max are equal
  const formatParticipants = (participants: string) => {
    if (participants.includes('–')) {
      const [min, max] = participants.split('–');
      if (min.trim() === max.trim()) {
        return min.trim();
      }
    }
    return participants;
  };

  // Check if event has ended to determine button type
  const hasEventEnded = (eventDate: string) => {
    try {
      const today = new Date();
      const eventEndDate = new Date(eventDate);
      today.setHours(0, 0, 0, 0);
      eventEndDate.setHours(23, 59, 59, 999); // End of event day
      return today > eventEndDate;
    } catch (error) {
      return false; // Default to not ended if date parsing fails
    }
  };

  // Remove event number prefix (e.g., "Event 1" -> just the type)
  const cleanEventName = (eventName: string) => {
    // Remove patterns like "Event 1", "Event 2", etc.
    return eventName.replace(/^Event\s+\d+$/i, '').trim();
  };

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-base font-bold text-black mb-4">My Participating Events</h1>
      

      {/* Participating sub-events list */}
      <div className="space-y-4">
        {participatingSubEvents.length === 0 ? (
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">No participating events found</p>
            <p className="text-xs text-gray-400 mt-1">Register for events to see them here</p>
          </div>
        ) : (
          participatingSubEvents.map((participation, index) => (
            <div key={participation.registrationKey} className="w-full border border-gray-300 rounded-lg p-3">
              <div className="flex justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => handleEventClick(participation.eventId, participation.subEventIndex >= 0 ? participation.subEventIndex : undefined)}>
                  {/* Main Event Info */}
                  <div className="text-sm text-black mb-1">
                    <span className="font-medium">{participation.event.eventName}</span>
                    <span className="text-gray-500 ml-1">({participation.event.college})</span>
                  </div>
                  
                  {/* Sub-event specific info */}
                  {participation.subEvent ? (
                    <div className="text-sm text-black mb-1">
                      <span className="font-medium text-black">
                        {cleanEventName(participation.subEvent.name) || participation.subEvent.type}
                      </span>
                      {cleanEventName(participation.subEvent.name) && (
                        <span className="ml-1">- {participation.subEvent.type}</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-black mb-1">
                      <span className="font-medium text-black">Full Event</span> - 
                      <span className="ml-1">{participation.event.type}</span>
                    </div>
                  )}
                  
                  {/* Location and Event Date */}
                  <div className="text-xs text-gray-600 mb-1">
                    <span>{getLocationOnly(participation.event.location)}</span> • 
                    <span className="ml-1">
                      {participation.subEvent ? participation.subEvent.date : participation.event.dates}
                    </span>
                  </div>
                  
                  {/* Additional sub-event details */}
                  {participation.subEvent && (
                    <div className="text-xs text-gray-500">
                      {participation.subEvent.groupType} • {participation.subEvent.time} • 
                      Participants: {formatParticipants(participation.subEvent.participants)}
                    </div>
                  )}
                </div>
                
                {(() => {
                  const eventDate = participation.subEvent ? participation.subEvent.date : participation.event.dates;
                  const isEventEnded = hasEventEnded(eventDate);
                  
                  return (
                    <button 
                      onClick={() => handleWithdraw(
                        participation.registrationKey, 
                        participation.subEvent?.name || participation.event.eventName,
                        isEventEnded
                      )}
                      className={`px-2 py-1.5 border border-gray-300 rounded-lg text-xs transition-colors self-start leading-none min-w-[70px] ${
                        isEventEnded 
                          ? 'bg-white text-gray-600 hover:bg-gray-50' 
                          : 'bg-gray-100 text-red-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-center">
                        {isEventEnded ? (
                          <div className="text-[10px]">Delete</div>
                        ) : (
                          <>
                            <div className="text-[10px]">Withdraw</div>
                            <div className="text-[10px]">Participation</div>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })()}
              </div>
            </div>
          ))
        )}
      </div>

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