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
  address?: string;
  contact?: string;
  entryFees?: string;
  deadline?: string;
  otse?: string;
  // Individual college fields from Add Main Event
  collegeName?: string;
  collegeAddress?: string;
  collegeLocality?: string;
  city?: string;
  pinCode?: string;
  organizingCommittee?: Array<{
    name: string;
    designation: string;
    phone: string;
    email: string;
    otpSent?: boolean;
    otpVerified?: boolean;
    isFirstMember?: boolean;
  }>;
  subEventsDetail?: Array<{
    id: string;
    eventType: string;
    performanceDurationMin: string;
    performanceDurationMax: string;
    timeLimitNotApplicable: boolean;
  }>;
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

interface EventDetailProps {
  navigate: (screen: Screen, eventId?: string, editEvent?: any, isNewFromDashboard?: boolean, subEventIndex?: number) => void;
  event: Event;
  onRegister: (eventId: string, subEventIndex?: number, participantDetails?: {
    name: string;
    college: string;
    phone: string;
    email: string;
  }) => void;
  registeredEvents: string[];
  setCurrentLiveStream?: (eventId: string, eventName: string) => void;
  selectedSubEvent?: number | null;
  userProfile?: {
    name: string;
    email: string;
    phone: string;
    profileData: {
      collegeName: string;
      collegeAddress: string;
      collegeLocality: string;
      city: string;
      pincode: string;
      academicYear: string;
      stream: string;
    };
  };
}

export function EventDetail({ navigate, event, onRegister, registeredEvents, setCurrentLiveStream, selectedSubEvent, userProfile }: EventDetailProps) {
  // Handle Results button click
  const handleResultsClick = () => {
    alert('Final results will be displayed, only if events team decide to to release it here, on event day.');
  };

  // Handle Live button click
  const handleLiveClick = (subEventIndex: number) => {
    // Generate a unique sub-event ID similar to AddEvent
    const subEventId = `sub-event-${subEventIndex + 1}`;
    
    // Check if there's an active live stream for this sub-event
    const streamInfo = localStorage.getItem(`zhevents_live_stream_${subEventId}`);
    
    if (streamInfo) {
      try {
        const info = JSON.parse(streamInfo);
        if (info.activated) {
          // Navigate to live stream
          if (setCurrentLiveStream) {
            setCurrentLiveStream(subEventId, event.eventName);
          }
          navigate('liveStream');
          return;
        }
      } catch (error) {
        console.error('Error parsing stream info:', error);
      }
    }
    
    // No active stream found
    alert('Live feed on event day, if the event is streamed live here.');
  };
  // Format the date range for top right display
  const formatDateRange = (dates: string) => {
    return dates.replace(/(\d+)(?:st|nd|rd|th)?\s+to\s+(\d+)(?:st|nd|rd|th)?/, '$1–$2');
  };

  // Format participants display
  const formatParticipants = (participants: string) => {
    // Check if it's a range like "6–8" or "1"
    if (participants.includes('–')) {
      const [min, max] = participants.split('–');
      if (min.trim() === max.trim()) {
        return `${min.trim()} max`;
      }
      return `${participants} max`;
    }
    // For single participant events (like "1"), don't add "max"
    if (participants === '1') {
      return participants;
    }
    // For other single numbers, add "max"
    return `${participants} max`;
  };

  // Format time by adding space before am/pm
  const formatTime = (time: string) => {
    if (!time) return time;
    // Add space before am/pm if not already present
    return time.replace(/(\d+)(am|pm)/gi, '$1 $2');
  };

  // Format deadline text by adding space before am/pm
  const formatDeadline = (deadline: string) => {
    if (!deadline || deadline === 'TBD') return deadline;
    // Add space before am/pm in deadline text and remove brackets from "or until slots are available"
    return deadline
      .replace(/(\d+)(am|pm)/gi, '$1 $2')
      .replace(/\(or until slots are available\)/gi, 'or until slots are available');
  };

  // Format performance duration from sub-event details
  const formatPerformanceDuration = (subEventIndex: number) => {
    // Get performance duration from subEventsDetail if available
    if (event.subEventsDetail && event.subEventsDetail[subEventIndex]) {
      const subEvent = event.subEventsDetail[subEventIndex];
      
      if (subEvent.timeLimitNotApplicable) {
        return 'N.A.';
      }
      
      const hours = parseInt(subEvent.performanceDurationMin || '0');
      const minutes = parseInt(subEvent.performanceDurationMax || '0');
      
      let result = '';
      
      // Handle hours
      if (hours > 0) {
        if (hours === 1) {
          result += '1 hr';
        } else {
          result += `${hours} hrs`;
        }
      }
      
      // Handle minutes
      if (minutes > 0) {
        if (result) result += ' '; // Add space if we already have hours
        
        if (minutes === 1) {
          result += '1 min';
        } else {
          result += `${minutes} mins`;
        }
      }
      
      // If both hours and minutes are 0, show default
      if (hours === 0 && minutes === 0) {
        return '00 hrs 00 mins';
      }
      
      return result;
    }
    
    // Default if no performance duration data available
    return '00 hrs 00 mins';
  };

  const isSubEventRegistered = (subEventIndex: number) => {
    const registrationKey = `${event.id}:${subEventIndex}`;
    return registeredEvents.includes(registrationKey);
  };

  // Check if registration deadline has passed
  const isRegistrationDeadlinePassed = (subEventIndex: number) => {
    const eventItem = event.events?.[subEventIndex];
    const deadline = eventItem?.deadline || event.deadline;
    
    if (!deadline || deadline === 'TBD') {
      return false; // No deadline specified, allow registration
    }
    
    try {
      const now = new Date();
      let deadlineDate;
      
      // Parse deadline format like "11 Dec 2025 at 10:00 pm"
      if (deadline.includes('at')) {
        const parts = deadline.split('at');
        const datePart = parts[0].trim();
        const timePart = parts[1].trim();
        
        // Handle time part (remove extra text like "or until slots are available")
        const timeMatch = timePart.match(/(\d+):(\d+)\s*(am|pm)/i);
        if (timeMatch) {
          const [, hours, minutes, ampm] = timeMatch;
          let hour24 = parseInt(hours);
          
          // Convert to 24-hour format
          if (ampm.toLowerCase() === 'pm' && hour24 !== 12) {
            hour24 += 12;
          } else if (ampm.toLowerCase() === 'am' && hour24 === 12) {
            hour24 = 0;
          }
          
          // Parse date part like "11 Dec 2025"
          deadlineDate = new Date(datePart);
          deadlineDate.setHours(hour24, parseInt(minutes), 0, 0);
        } else {
          // Fallback: just parse the date part
          deadlineDate = new Date(datePart);
          deadlineDate.setHours(23, 59, 59, 999); // End of day
        }
      } else {
        // Simple date format
        deadlineDate = new Date(deadline);
        deadlineDate.setHours(23, 59, 59, 999); // End of day
      }
      
      return now > deadlineDate;
    } catch (error) {
      console.warn('Could not parse deadline:', deadline, error);
      return false; // If parsing fails, allow registration
    }
  };

  const handleSubEventRegister = (subEventIndex: number) => {
    if (isSubEventRegistered(subEventIndex)) {
      return; // Already registered
    }
    
    // Check if deadline has passed
    if (isRegistrationDeadlinePassed(subEventIndex)) {
      alert('We regret to inform you that the registration deadline has passed. Request you to check with the event team for OTSE');
      return;
    }
    
    // Prepare participant details from user profile
    const participantDetails = userProfile ? {
      name: userProfile.name || 'Unknown',
      college: userProfile.profileData?.collegeName || 'Unknown College',
      phone: userProfile.phone || '0000000000',
      email: userProfile.email || 'unknown@example.com'
    } : undefined;
    
    // Proceed with registration if deadline hasn't passed
    onRegister(event.id, subEventIndex, participantDetails);
  };

  return (
    <div className="w-full min-h-screen bg-white p-4">
      {/* Header section */}
      <div className="mb-6">
        {/* Centered college, presents, event name */}
        <div className="text-center">
          {/* College Name from Add Main Event */}
          <p className="text-sm text-black">{event.collegeName || event.college}</p>
          <p className="text-sm text-black">Presents</p>
          <h1 className="text-xl font-extrabold text-black">{event.eventName}</h1>
          
          {/* Address, Location, City and Pin Code all in the same line */}
          {(event.collegeAddress || event.collegeLocality || event.city || event.pinCode) && (
            <p className="text-sm text-black">
              {[event.collegeAddress, event.collegeLocality, event.city, event.pinCode].filter(Boolean).join(', ')}
            </p>
          )}
          
          {/* Fallback to original address if individual fields are not available */}
          {!event.collegeAddress && !event.collegeLocality && !event.city && !event.pinCode && event.address && (
            <p className="text-sm text-black">{event.address}</p>
          )}
          
          {/* Competition type with separator and date */}
          <p className="text-sm text-black">{event.competition}<span className="font-bold">.</span> {formatDateRange(event.dates)}</p>
        </div>
      </div>

      {/* Event Details - No "Results" heading */}
      {event.events && event.events.length > 0 && (
        <div className="mb-6">
          {event.events.map((eventItem, index) => {
            // If selectedSubEvent is specified, only show that specific sub-event
            if (selectedSubEvent !== null && selectedSubEvent !== undefined && index !== selectedSubEvent) {
              return null;
            }
            
            return (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-black">
                  <strong>{eventItem.name}</strong>
                  <br />
                  Event Type: {eventItem.type}
                  <br />
                  Competition: {eventItem.competition}
                  <br />
                  Group/Single: {eventItem.groupType}
                  <br />
                  Date: {eventItem.date}
                  <br />
                  Time: {formatTime(eventItem.time)}
                  <br />
                  Performance Duration: {formatPerformanceDuration(index)}
                  <br />
                  Participants: {formatParticipants(eventItem.participants)}
                </div>
                
                {/* Live button on extreme right */}
                <button 
                  onClick={() => handleLiveClick(index)}
                  className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-sm text-black ml-4 shrink-0 hover:bg-gray-300 transition-colors"
                >
                  Live
                </button>
              </div>

              <div className="text-sm text-black mb-6">
                {eventItem.rules && eventItem.rules.length > 0 ? (
                  <>
                    <strong>Rules:</strong>
                    <ol className="list-decimal list-inside">
                      {eventItem.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex}>{rule}</li>
                      ))}
                    </ol>
                  </>
                ) : (
                  <div><strong>Rules:</strong> No rules specified.</div>
                )}
              </div>

              {/* Event Information - Below Rules for each sub-event */}
              <div className="text-sm text-black mb-6">
                Contact Person: {(() => {
                  const contact = eventItem.contact || event.contact || 'TBD';
                  if (contact === 'TBD') return 'TBD';
                  // Extract just the name part from contact string like "Akhat • 9834672322"
                  const namePart = contact.split('•')[0].trim();
                  return namePart || contact;
                })()}
                <br />
                Contact No.: {(() => {
                  const contact = eventItem.contact || event.contact || 'TBD';
                  if (contact === 'TBD') return 'TBD';
                  // Extract phone number from contact string like "Akhat • 9834672322"
                  const parts = contact.split('•');
                  if (parts.length > 1) {
                    const phonePart = parts[1].trim();
                    // Extract 10-digit phone number
                    const phoneMatch = phonePart.match(/\d{10}/);
                    return phoneMatch ? phoneMatch[0] : 'TBD';
                  }
                  return 'TBD';
                })()}
                <br />
                Entry Fees: {eventItem.entryFees || event.entryFees || 'TBD'}
                <br />
                Registration Deadline: {formatDeadline(eventItem.deadline || event.deadline || 'TBD')}
                <br />
                OTSE: {eventItem.otse || event.otse || 'TBD'}
              </div>

              {/* Action Buttons for this specific sub-event */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => handleSubEventRegister(index)}
                  disabled={isSubEventRegistered(index)}
                  className={`flex-1 h-10 ${isSubEventRegistered(index) ? 'bg-gray-200 border border-gray-400 text-black' : 'bg-gray-200 border border-gray-400 text-black hover:bg-gray-300'} rounded-lg font-semibold text-sm transition-colors flex justify-center items-center`}
                >
                  {isSubEventRegistered(index) ? 'Registered ✓' : 'Register'}
                </button>
                <button
                  onClick={handleResultsClick}
                  className="flex-1 h-10 bg-gray-200 border border-gray-400 rounded-lg font-semibold text-sm text-black hover:bg-gray-300 transition-colors flex justify-center items-center"
                >
                  Results
                </button>
              </div>

              {/* Disclaimer after every sub-event */}
              <div className="mb-6">
                <p className="text-xs text-black mb-4">
                  Event details are subject to change. Please check here periodically for updates.
                </p>
                
                {/* Separator line after disclaimer */}
                <div className="border-t border-gray-300 pt-4">
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Organizing Committee - Appears once at the end of all sub-events */}
      {event.organizingCommittee && event.organizingCommittee.length > 1 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-black text-right mb-1">Event Team</p>
          {event.organizingCommittee.map((member, index) => (
            <p key={index} className="text-xs text-black text-right">
              {member.name}. {member.designation || 'Not specified'}. {member.phone}
            </p>
          ))}
        </div>
      )}

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