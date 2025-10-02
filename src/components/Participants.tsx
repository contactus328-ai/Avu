import React from 'react';
import type { Screen } from '../App';
import { MessageCircle, Mail, Clock, CheckCircle, FileText } from 'lucide-react';

interface ParticipantsProps {
  navigate: (screen: Screen) => void;
  event?: any;
  profileEmail?: string;
  emailSent?: boolean;
  participantData: {[registrationKey: string]: {
    name: string;
    college: string;
    phone: string;
    email: string;
    registrationDate: string;
  }};
  selectedEventId: string;
}

// Mock data for demonstration
const mockParticipants = [
  {
    name: 'Arjun Patel',
    college: 'Pandurang College',
    phone: '9876543210',
    email: 'arjun@example.com'
  },
  {
    name: 'Priya Sharma',
    college: 'Sindhu College',
    phone: '9876543211',
    email: 'priya@example.com'
  }
];

export function Participants({ navigate, event, profileEmail, emailSent, participantData, selectedEventId }: ParticipantsProps) {
  const eventName = event?.eventName || 'Event';
  
  // Get participants grouped by sub-event
  const getParticipantsBySubEvent = () => {
    const participantsBySubEvent: {[subEventIndex: number]: Array<{
      name: string;
      college: string;
      phone: string;
      email: string;
      registrationDate?: string;
    }>} = {};
    
    if (!event?.events) return participantsBySubEvent;
    
    // Initialize arrays for each sub-event
    event.events.forEach((_: any, index: number) => {
      participantsBySubEvent[index] = [];
    });
    
    // Populate participants for each sub-event
    Object.entries(participantData).forEach(([registrationKey, details]) => {
      if (registrationKey.startsWith(selectedEventId + ':')) {
        const subEventIndex = parseInt(registrationKey.split(':')[1]);
        if (!isNaN(subEventIndex) && participantsBySubEvent[subEventIndex]) {
          participantsBySubEvent[subEventIndex].push({
            name: details.name,
            college: details.college,
            phone: details.phone,
            email: details.email,
            registrationDate: details.registrationDate
          });
        }
      }
    });
    
    return participantsBySubEvent;
  };

  // Get all participants for this event across all sub-events
  const getAllEventParticipants = () => {
    const participants: Array<{
      name: string;
      college: string;
      phone: string;
      email: string;
      subEventName: string;
      registrationDate?: string;
    }> = [];

    Object.entries(participantData).forEach(([registrationKey, details]) => {
      if (registrationKey.includes(':') && registrationKey.startsWith(selectedEventId + ':')) {
        // Sub-event registration with format "eventId:subEventIndex"
        const subEventIndex = parseInt(registrationKey.split(':')[1]);
        if (!isNaN(subEventIndex) && event?.events && event.events[subEventIndex]) {
          const subEventName = event.events[subEventIndex].name;
          participants.push({
            name: details.name,
            college: details.college,
            phone: details.phone,
            email: details.email,
            subEventName,
            registrationDate: details.registrationDate
          });
        }
      } else if (registrationKey === selectedEventId) {
        // Legacy whole-event registration
        participants.push({
          name: details.name,
          college: details.college,
          phone: details.phone,
          email: details.email,
          subEventName: 'Full Event',
          registrationDate: details.registrationDate
        });
      }
    });

    return participants;
  };

  const participantsBySubEvent = getParticipantsBySubEvent();
  const actualParticipants = getAllEventParticipants();
  
  // Get participant count
  const participantCount = actualParticipants.length;

  // Sub-event specific communication functions
  const sendWhatsAppToSubEvent = (subEventIndex: number, subEventName: string) => {
    const subEventParticipants = participantsBySubEvent[subEventIndex] || [];
    if (subEventParticipants.length === 0) {
      alert('No participants registered for this sub-event yet.');
      return;
    }

    const subEventMessage = `Hello! Important update regarding ${subEventName} from ${eventName}. `;
    const encodedMessage = encodeURIComponent(subEventMessage);
    
    subEventParticipants.forEach((participant, index) => {
      // Clean phone number (remove any non-digits except +)
      const cleanPhone = participant.phone.replace(/[^\\d+]/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      
      // Open each WhatsApp chat in a new tab with a small delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, index * 500); // 500ms delay between each message
    });
    
    // Show success message
    alert(`Message will be sent to all ${subEventParticipants.length} participants of ${subEventName}. WhatsApp chats will open automatically with your message pre-filled. Just click 'Send' in each chat!`);
  };

  const sendEmailToSubEventParticipants = (subEventIndex: number, subEventName: string) => {
    const subEventParticipants = participantsBySubEvent[subEventIndex] || [];
    if (subEventParticipants.length === 0) {
      alert('No participants registered for this sub-event yet.');
      return;
    }

    if (!profileEmail) {
      alert('Please set your email in Profile first!');
      return;
    }
    
    // Get sub-event participant emails for BCC
    const participantEmails = subEventParticipants.map(p => p.email).join(';');
    
    // Get organizing committee emails for CC (excluding the first member which is the sender)
    let ccEmails = '';
    if (event?.organizingCommittee && event.organizingCommittee.length > 1) {
      const organizingCommitteeEmails = event.organizingCommittee
        .slice(1) // Skip first member (sender)
        .filter(member => member.email && member.email.trim() !== '')
        .map(member => member.email);
      ccEmails = organizingCommitteeEmails.join(';');
    }
    
    const subEventEmailSubject = `${subEventName} by ${event?.college || 'College'}`;
    const subEventEmailMessage = `Dear Participant,\\\\n\\\\nI hope this email finds you well.\\\\n\\\\nI am writing to share an important update regarding ${subEventName} from ${eventName}.\\\\n\\\\n\\\\n\\\\nBest regards,\\\\nEvent Organizer`;
    
    // Create mailto URL with organizer as TO, organizing committee in CC, and participants in BCC for privacy
    let mailtoUrl = `mailto:${profileEmail}?bcc=${participantEmails}&subject=${encodeURIComponent(subEventEmailSubject)}&body=${encodeURIComponent(subEventEmailMessage)}`;
    
    // Add CC if there are organizing committee members
    if (ccEmails) {
      mailtoUrl += `&cc=${ccEmails}`;
    }
    
    // Open email client
    window.open(mailtoUrl, '_blank');
    
    // Show success message
    const organizingCommitteeCount = event?.organizingCommittee ? event.organizingCommittee.length - 1 : 0;
    const ccMessage = organizingCommitteeCount > 0 ? ` with ${organizingCommitteeCount} organizing committee members in CC` : '';
    alert(`Email client opened with your email (${profileEmail}) as sender${ccMessage} and all ${subEventParticipants.length} participants of ${subEventName} in BCC for privacy. Participants won't see each other's email addresses.`);
  };

  // Function to send specific sub-event participants list to organizer
  const sendSubEventParticipantsListToOrganizer = (subEventIndex: number, subEventName: string) => {
    const subEventParticipants = participantsBySubEvent[subEventIndex] || [];
    
    if (subEventParticipants.length === 0) {
      alert(`No participants registered for ${subEventName} yet.`);
      return;
    }

    if (!profileEmail) {
      alert('Please set your email in Profile first!');
      return;
    }
    
    // Generate Excel CSV format data for this sub-event's participants
    const csvHeaders = ['Name', 'College Name', 'Phone No.', 'Email id.'];
    const csvData = subEventParticipants.map((participant) => [
      participant.name,
      participant.college,
      participant.phone,
      participant.email
    ]);
    
    // Convert to CSV format with proper line breaks
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create blob and download link with proper CSV headers
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${eventName}_${subEventName}_Participants_List.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Create email with instructions
    const emailSubject = `${subEventName} - Participant List (Excel Format)`;
    const emailBody = `Dear Organizer,

Please find the participant list for "${subEventName}" from "${eventName}" attached as an Excel CSV file.

Sub-Event Details:
- Sub-Event Name: ${subEventName}
- Main Event: ${eventName}
- College: ${event?.college || 'N/A'}
- Total Participants: ${subEventParticipants.length}

The file "${eventName}_${subEventName}_Participants_List.csv" has been downloaded to your device. Please attach this file to share the participant list in Excel format.

File Contents:
- Participant Name
- College Name
- Phone Number
- Email Address

Best regards,
Avu Event Management System`;
    
    // Open email client with the participant list email
    const mailtoUrl = `mailto:${profileEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
    
    // Show success message
    alert(`📧 Excel file "${eventName}_${subEventName}_Participants_List.csv" has been downloaded!\\n\\nEmail client opened to send to ${profileEmail}. Please attach the downloaded file to complete sending the ${subEventName} participant list in Excel format.`);
  };
  
  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-base font-bold text-black mb-3">Registered Participants: {participantCount} — {eventName}</h1>
      
      {/* Column headers - shown once globally */}
      <div className="text-sm text-black mb-4">Name • College Name • Phone No. • Email id</div>

      {/* Check if we have any participants */}
      {actualParticipants.length === 0 ? (
        <div className="w-full bg-white border border-gray-300 rounded-lg p-4 mb-4">
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No participants registered yet</p>
            <p className="text-xs text-gray-400 mt-1">Participant details will appear here when users register for sub-events</p>
          </div>
        </div>
      ) : (
        <>
          {/* Check if we have sub-events to display */}
          {event?.events && event.events.length > 0 ? (
            // Display each sub-event in its own separate container
            <>
              {event.events.map((subEvent, subEventIndex) => {
                const subEventParticipants = participantsBySubEvent[subEventIndex] || [];
                
                return (
                  <div key={subEventIndex} className="w-full bg-white border border-gray-300 rounded-lg p-4 mb-4">
                    {/* Sub-event header */}
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-black">
                        {subEvent.name} ({subEvent.type}) - {subEventParticipants.length} Participant{subEventParticipants.length !== 1 ? 's' : ''}
                      </h3>
                      <div className="text-xs text-gray-600 mb-2">
                        {subEvent.competition} • {subEvent.groupType} • {subEvent.date} • {subEvent.time}
                      </div>
                    </div>
                    
                    {/* Participants for this sub-event */}
                    <div className="space-y-2 mb-4">
                      {subEventParticipants.length === 0 ? (
                        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500">No participants registered for this sub-event</p>
                        </div>
                      ) : (
                        subEventParticipants.map((participant, participantIndex) => (
                          <div key={participantIndex} className="w-full min-h-12 bg-transparent border border-gray-300 rounded px-3 py-2 text-sm text-black">
                            <div className="flex">
                              <span className="font-bold mr-2">{participantIndex + 1}.</span>
                              <div className="flex-1 leading-relaxed">
                                <span className="font-bold">{participant.name}</span> • {participant.college} • {participant.phone} • {participant.email}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Sub-event specific communication buttons */}
                    {subEventParticipants.length > 0 && (
                      <>
                        <div className="flex gap-2 mb-2">
                          <button
                            onClick={() => sendWhatsAppToSubEvent(subEventIndex, subEvent.name)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs font-medium text-black hover:bg-gray-200 transition-colors"
                          >
                            <MessageCircle size={12} />
                            WhatsApp Participants
                          </button>
                          <button
                            onClick={() => sendEmailToSubEventParticipants(subEventIndex, subEvent.name)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs font-medium text-black hover:bg-gray-200 transition-colors"
                          >
                            <Mail size={12} />
                            Email - All Participants
                          </button>
                        </div>
                        
                        {/* Sub-event specific Email Participant List button */}
                        <button
                          onClick={() => sendSubEventParticipantsListToOrganizer(subEventIndex, subEvent.name)}
                          className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-transparent border border-gray-300 text-black rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                        >
                          <FileText size={12} />
                          Email Participant List to Organiser
                        </button>
                      </>
                    )}
                  </div>
                );
              })}

            </>
          ) : (
            // Fallback for events without sub-events structure
            <div className="w-full bg-white border border-gray-300 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                {actualParticipants.map((participant, index) => (
                  <div key={index} className="w-full min-h-12 bg-transparent border border-gray-300 rounded px-3 py-2 text-sm text-black">
                    <div className="flex">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      <div className="flex-1 leading-relaxed">
                        <span className="font-bold">{participant.name}</span> • {participant.college} • {participant.phone} • {participant.email} • {participant.subEventName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate('my_org')}
        className="mt-6 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
      >
        ← Back to My Organised Events
      </button>
    </div>
  );
}