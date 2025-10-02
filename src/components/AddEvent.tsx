import React, { useState, useEffect, useRef } from 'react';
import type { Screen } from '../App';
import { Plus, Users, Minus, ChevronDown, ChevronUp, Calendar, Trash2, Save, Trophy, Camera, ArrowLeft } from 'lucide-react';

interface AddEventProps {
  navigate: (screen: Screen) => void;
  addEvent: (event: any, isEdit?: boolean) => void;
  editingEvent?: any;
  isNewFromDashboard?: boolean;
  userProfile: {
    name: string;
    email: string;
    phone: string;
    profileData?: {
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

interface SubEvent {
  id: string;
  eventType: string;
  groupSingle: string;
  minParticipants: string;
  maxParticipants: string;
  startDate: string;
  endDate: string;
  isSingleDate: boolean;
  timeHour: string;
  timeMinute: string;
  timeAmPm: string;
  rules: string[];
  entryFees: string;
  registrationDeadlineDate: string;
  registrationDeadlineHour: string;
  registrationDeadlineMinute: string;
  registrationDeadlineAmPm: string;
  otse: string;
  performanceDurationMin: string;
  performanceDurationMax: string;
  timeLimitNotApplicable: boolean;
  activateLiveFeed: boolean;
  isActive: boolean;
}

interface OrganizingCommittee {
  name: string;
  designation: string;
  phone: string;
  email: string;
  otpSent: boolean;
  otpVerified: boolean;
  otp: string;
  isFirstMember: boolean;
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subEventId?: string;
  subEventName?: string;
  subEventStartDate?: string;
}

function ResultsModal({ isOpen, onClose, subEventId, subEventName, subEventStartDate }: ResultsModalProps) {
  const [results, setResults] = useState({
    first: '',
    second: '',
    third: ''
  });

  if (!isOpen) return null;

  // Check if current date is on or after the sub-event start date
  const canEnterResults = () => {
    if (!subEventStartDate) return false;
    const today = new Date();
    const eventDate = new Date(subEventStartDate);
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return today >= eventDate;
  };

  const handleInputChange = (field: string, value: string) => {
    if (!canEnterResults()) {
      alert(`Results can only be entered on or after the event start date (${new Date(subEventStartDate || '').toLocaleDateString()}).`);
      return;
    }
    setResults(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!canEnterResults()) {
      alert(`Results can only be entered on or after the event start date (${new Date(subEventStartDate || '').toLocaleDateString()}).`);
      return;
    }
    // Here you would save the results to your state/database
    alert('Results saved successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm mx-4 shadow-lg">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-black mb-2">Results - {subEventName}</h3>
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-sm text-black">1st Place:</label>
            <input
              type="text"
              value={results.first}
              onChange={(e) => handleInputChange('first', e.target.value)}
              className="w-full h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none mt-0.5"
              placeholder="Enter winner name"
            />
          </div>
          <div>
            <label className="text-sm text-black">2nd Place:</label>
            <input
              type="text"
              value={results.second}
              onChange={(e) => handleInputChange('second', e.target.value)}
              className="w-full h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none mt-0.5"
              placeholder="Enter runner-up name"
            />
          </div>
          <div>
            <label className="text-sm text-black">3rd Place:</label>
            <input
              type="text"
              value={results.third}
              onChange={(e) => handleInputChange('third', e.target.value)}
              className="w-full h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none mt-0.5"
              placeholder="Enter third place name"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Results
          </button>
        </div>
      </div>
    </div>
  );
}

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberIndex: number;
  onOTPSent: () => void;
}

function OTPModal({ isOpen, onClose, memberIndex, onOTPSent }: OTPModalProps) {
  const [step, setStep] = useState<'sending' | 'enter-otp'>('sending');
  const [otp, setOTP] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('sending');
      // Simulate sending OTP
      setTimeout(() => {
        setStep('enter-otp');
      }, 1000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = () => {
    if (otp === '123456') { // Mock OTP
      onOTPSent();
      onClose();
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm mx-4 shadow-lg">
        {step === 'sending' ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-black mb-2">Sending OTP</h3>
            <p className="text-sm text-gray-600 mb-4">
              To confirm Phone Number, a OTP is sent on registered mobile number
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-black mb-2">Enter OTP</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter the OTP sent to your mobile number
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full h-8 px-2 bg-gray-50 border border-gray-300 rounded text-sm text-black mb-4"
              placeholder="Enter OTP"
              maxLength={6}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AddEvent({ navigate, addEvent, editingEvent, isNewFromDashboard, userProfile }: AddEventProps) {
  // Get user registration details from profile data
  const userRegistrationDetails = {
    collegeName: userProfile.profileData?.collegeName || '',
    address: userProfile.profileData?.collegeAddress || '',
    locality: userProfile.profileData?.collegeLocality || '',
    city: userProfile.profileData?.city || '',
    pinCode: userProfile.profileData?.pincode || ''
  };

  const [eventData, setEventData] = useState({
    collegeName: userRegistrationDetails.collegeName,
    mainEventName: '',
    address: userRegistrationDetails.address,
    locality: userRegistrationDetails.locality,
    city: userRegistrationDetails.city,
    pinCode: userRegistrationDetails.pinCode,
    competitionType: '',
    startDate: '',
    endDate: '',
    isSingleDate: false
  });

  const [subEvents, setSubEvents] = useState<SubEvent[]>([
    {
      id: 'sub-event-1',
      eventType: '',
      groupSingle: '',
      minParticipants: '1',
      maxParticipants: '1',
      startDate: '',
      endDate: '',
      isSingleDate: false,
      timeHour: '10',
      timeMinute: '00',
      timeAmPm: 'am',
      rules: [''],
      entryFees: '',
      registrationDeadlineDate: '',
      registrationDeadlineHour: '11',
      registrationDeadlineMinute: '59',
      registrationDeadlineAmPm: 'pm',
      otse: '',
      performanceDurationMin: '',
      performanceDurationMax: '',
      timeLimitNotApplicable: false,
      activateLiveFeed: false,
      isActive: true  // Changed from false to true
    }
  ]);

  const [organizingCommittee, setOrganizingCommittee] = useState<OrganizingCommittee[]>([
    { 
      name: userProfile.name, 
      designation: '', 
      phone: userProfile.phone, 
      email: userProfile.email, 
      otpSent: false, 
      otpVerified: false, 
      otp: '',
      isFirstMember: true
    }
  ]);

  const [eventTypeSearch, setEventTypeSearch] = useState<{[key: string]: string}>({});
  const [showEventTypeDropdown, setShowEventTypeDropdown] = useState<{[key: string]: boolean}>({});
  const [entryFeesSearch, setEntryFeesSearch] = useState<{[key: string]: string}>({});
  const [showEntryFeesDropdown, setShowEntryFeesDropdown] = useState<{[key: string]: boolean}>({});
  const [collapsedSubEvents, setCollapsedSubEvents] = useState<Set<string>>(new Set());
  const [deleteConfirmation, setDeleteConfirmation] = useState<{eventId: string, show: boolean}>({eventId: '', show: false});
  const [memberDeleteConfirmation, setMemberDeleteConfirmation] = useState<{memberIndex: number, show: boolean}>({memberIndex: -1, show: false});
  const [ruleDeleteConfirmation, setRuleDeleteConfirmation] = useState<{subEventId: string, ruleIndex: number, show: boolean}>({subEventId: '', ruleIndex: -1, show: false});
  const [validationErrors, setValidationErrors] = useState<{[key: string]: boolean}>({});
  const [subEventErrors, setSubEventErrors] = useState<{[eventId: string]: {[key: string]: boolean}}>({});
  const [mainFormErrors, setMainFormErrors] = useState<{[key: string]: boolean}>({});
  const [resultsModal, setResultsModal] = useState<{isOpen: boolean, subEventId?: string, subEventName?: string}>({isOpen: false});
  const [otpModal, setOTPModal] = useState<{isOpen: boolean, memberIndex: number}>({isOpen: false, memberIndex: -1});
  const [cameraStreams, setCameraStreams] = useState<{[eventId: string]: MediaStream}>({});
  
  const eventTypeRef = useRef<HTMLDivElement>(null);
  const entryFeesRef = useRef<HTMLDivElement>(null);

  const eventTypes = ['Dancing', 'Singing', 'Acting', 'Treasure Hunt', 'Debate', 'Personality Contest'];
  const competitionTypes = ['Inter-collegiate', 'Intra-collegiate', 'Inter-school', 'Intra-school', 'Online', 'Others'];
  const entryFeesOptions = ['Free', '₹10', '₹20', '₹30', '₹40', '₹50', '₹60', '₹70', '₹80', '₹90', '₹100', '₹150', '₹200', '₹250', '₹300', '₹350', '₹400', '₹450', '₹500'];
  
  const getFilteredEventTypes = (subEventId: string) => {
    const searchTerm = eventTypeSearch[subEventId] || '';
    return eventTypes.filter(type => 
      type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // localStorage key for persistence
  const STORAGE_KEY = 'zhevents_add_event_form';



  // Handle editing mode - pre-fill form with existing event data
  useEffect(() => {
    if (editingEvent) {
      console.log('editingEvent in AddEvent:', editingEvent);
      console.log('editingEvent.dates:', editingEvent.dates);
      
      // Parse date range properly
      let startDateStr = '';
      let endDateStr = '';
      
      if (editingEvent.dates.includes(' to ')) {
        const parts = editingEvent.dates.split(' to ');
        const startPart = parts[0].trim(); // e.g., "12th"
        const endPart = parts[1].trim();   // e.g., "13th Dec 25"
        
        // Extract month and year from end part
        const endMatch = endPart.match(/(\d+\w*)\s+(.+)/); // e.g., ["13th Dec 25", "13th", "Dec 25"]
        if (endMatch) {
          const monthYear = endMatch[2]; // "Dec 25"
          startDateStr = `${startPart} ${monthYear}`; // "12th Dec 25"
          endDateStr = endPart; // "13th Dec 25"
        } else {
          // Fallback if parsing fails
          startDateStr = editingEvent.dates;
          endDateStr = editingEvent.dates;
        }
      } else {
        // Single date
        startDateStr = editingEvent.dates;
        endDateStr = editingEvent.dates;
      }
      
      console.log('startDateStr:', startDateStr);
      console.log('endDateStr:', endDateStr);
      
      // Pre-fill main event data
      setEventData({
        collegeName: editingEvent.college,
        mainEventName: editingEvent.eventName,
        address: editingEvent.collegeAddress || userRegistrationDetails.address,
        locality: editingEvent.collegeLocality || userRegistrationDetails.locality,
        city: editingEvent.city || userRegistrationDetails.city,
        pinCode: editingEvent.pinCode || userRegistrationDetails.pinCode,
        competitionType: editingEvent.competition,
        startDate: parseEventDate(startDateStr),
        endDate: parseEventDate(endDateStr),
        isSingleDate: !editingEvent.dates.includes(' to ')
      });

      // Pre-fill organizing committee with saved data when editing
      if (editingEvent.organizingCommittee && editingEvent.organizingCommittee.length > 0) {
        setOrganizingCommittee(editingEvent.organizingCommittee.map((member: any, index: number) => ({
          name: member.name || (index === 0 ? userProfile.name : ''),
          designation: member.designation || '',
          phone: member.phone || (index === 0 ? userProfile.phone : ''),
          email: member.email || (index === 0 ? userProfile.email : ''),
          otpSent: member.otpSent || false,
          otpVerified: member.otpVerified || (index === 0 ? true : false),
          otp: '',
          isFirstMember: index === 0
        })));
      }

      // Pre-fill sub-events - prioritize detailed data if available
      if (editingEvent.subEventsDetail && editingEvent.subEventsDetail.length > 0) {
        // Use the detailed sub-events data that preserves all fields including performance duration
        // Ensure the first sub-event is always active
        const updatedSubEvents = editingEvent.subEventsDetail.map((subEvent: any, index: number) => ({
          ...subEvent,
          isActive: index === 0 ? true : subEvent.isActive // First sub-event is always active
        }));
        setSubEvents(updatedSubEvents);
      } else if (editingEvent.events && editingEvent.events.length > 0) {
        // Fallback to mapping from basic events structure for older events
        const mappedSubEvents = editingEvent.events.map((event: any, index: number) => ({
          id: `sub-event-${index + 1}`,
          eventType: event.type || '',
          groupSingle: event.groupType || '',
          minParticipants: event.participants?.split('–')[0] || '0',
          maxParticipants: event.participants?.split('–')[1] || event.participants || '0',
          startDate: event.date || '',
          endDate: event.date || '',
          isSingleDate: true,
          timeHour: event.time?.split(':')[0] || '10',
          timeMinute: event.time?.split(':')[1]?.split('am')[0]?.split('pm')[0] || '00',
          timeAmPm: event.time?.includes('pm') ? 'pm' : 'am',
          rules: event.rules || [''],
          entryFees: event.entryFees || 'Free',
          registrationDeadlineDate: event.deadline?.split(' at ')[0] || '',
          registrationDeadlineHour: '11',
          registrationDeadlineMinute: '59',
          registrationDeadlineAmPm: 'pm',
          otse: event.otse || '',
          performanceDurationMin: '',
          performanceDurationMax: '',
          timeLimitNotApplicable: false,
          activateLiveFeed: false,
          isActive: true
        }));
        setSubEvents(mappedSubEvents);
      }

      // Don't load from localStorage when editing
      return;
    }
  }, [editingEvent]);

  // Load saved data on component mount
  useEffect(() => {
    // Don't load localStorage data if we're in editing mode
    if (editingEvent) return;
    
    // If this is a new event from dashboard, start with clean main event fields and sub-events
    if (isNewFromDashboard) {
      setEventData(prev => ({
        ...prev,
        mainEventName: '',
        competitionType: '',
        startDate: '',
        endDate: '',
        isSingleDate: false
      }));
      
      // Reset sub-events to clean state
      setSubEvents([{
        id: 'sub-event-1',
        eventType: '',              // ✅ Blank
        groupSingle: '',            // ✅ Blank
        minParticipants: '0',       // ✅ Shows "0"
        maxParticipants: '0',       // ✅ Shows "0"
        startDate: '',              // ✅ Blank
        endDate: '',                // ✅ Blank
        isSingleDate: false,
        timeHour: '10',
        timeMinute: '00',
        timeAmPm: 'am',
        rules: [''],                // ✅ Blank
        entryFees: '',
        registrationDeadlineDate: '', // ✅ Blank
        registrationDeadlineHour: '11',
        registrationDeadlineMinute: '59',
        registrationDeadlineAmPm: 'pm',
        otse: '',                   // ✅ Blank
        performanceDurationMin: '',
        performanceDurationMax: '',
        timeLimitNotApplicable: false,
        activateLiveFeed: false,
        isActive: true  // Changed from false to true - active by default
      }]);
      
      // Reset organizing committee to clean state  
      setOrganizingCommittee([{ 
        name: userProfile.name, 
        designation: '', 
        phone: userProfile.phone, 
        email: userProfile.email, 
        otpSent: false, 
        otpVerified: false, 
        otp: '',
        isFirstMember: true
      }]);
      
      // Clear all other form states
      setEventTypeSearch({});
      setShowEventTypeDropdown({});
      setEntryFeesSearch({});
      setShowEntryFeesDropdown({});
      setCollapsedSubEvents(new Set());
      setDeleteConfirmation({eventId: '', show: false});
      setMemberDeleteConfirmation({memberIndex: -1, show: false});
      setRuleDeleteConfirmation({subEventId: '', ruleIndex: -1, show: false});
      setValidationErrors({});
      setSubEventErrors({});
      setMainFormErrors({});
      
      // Clear localStorage for a fresh start
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.eventData) {
          setEventData(prev => ({
            ...prev,
            ...parsed.eventData,
            // Ensure all required properties exist
            isSingleDate: parsed.eventData.isSingleDate ?? false
          }));
        }
        if (parsed.subEvents && Array.isArray(parsed.subEvents)) {
          // Ensure the first sub-event is always active by default
          const updatedSubEvents = parsed.subEvents.map((subEvent, index) => ({
            ...subEvent,
            isActive: index === 0 ? true : subEvent.isActive // First sub-event is always active
          }));
          setSubEvents(updatedSubEvents);
        }
        if (parsed.organizingCommittee) {
          setOrganizingCommittee(parsed.organizingCommittee);
        }
      } catch (error) {
        console.error('Failed to load saved form data:', error);
      }
    }
  }, [isNewFromDashboard, editingEvent, userProfile.name, userProfile.phone, userProfile.email]);

  // Add effect to clear form when editingEvent changes from a value to null/undefined
  useEffect(() => {
    // If editingEvent changes from having a value to being null/undefined, clear the form
    if (!editingEvent && !isNewFromDashboard) {
      // This handles the case when user navigates to "Add New Event" from other screens
      setEventData({
        collegeName: userRegistrationDetails.collegeName,
        mainEventName: '',
        address: userRegistrationDetails.address,
        locality: userRegistrationDetails.locality,
        city: userRegistrationDetails.city,
        pinCode: userRegistrationDetails.pinCode,
        competitionType: '',
        startDate: '',
        endDate: '',
        isSingleDate: false
      });
      
      setSubEvents([{
        id: 'sub-event-1',
        eventType: '',
        groupSingle: '',
        minParticipants: '1',
        maxParticipants: '1',
        startDate: '',
        endDate: '',
        isSingleDate: false,
        timeHour: '10',
        timeMinute: '00',
        timeAmPm: 'am',
        rules: [''],
        entryFees: '',
        registrationDeadlineDate: '',
        registrationDeadlineHour: '11',
        registrationDeadlineMinute: '59',
        registrationDeadlineAmPm: 'pm',
        otse: '',
        performanceDurationMin: '',
        performanceDurationMax: '',
        timeLimitNotApplicable: false,
        activateLiveFeed: false,
        isActive: true
      }]);
      
      setOrganizingCommittee([{ 
        name: userProfile.name, 
        designation: '', 
        phone: userProfile.phone, 
        email: userProfile.email, 
        otpSent: false, 
        otpVerified: false, 
        otp: '',
        isFirstMember: true
      }]);
      
      // Clear all form states
      setEventTypeSearch({});
      setShowEventTypeDropdown({});
      setEntryFeesSearch({});
      setShowEntryFeesDropdown({});
      setCollapsedSubEvents(new Set());
      setDeleteConfirmation({eventId: '', show: false});
      setMemberDeleteConfirmation({memberIndex: -1, show: false});
      setRuleDeleteConfirmation({subEventId: '', ruleIndex: -1, show: false});
      setValidationErrors({});
      setSubEventErrors({});
      setMainFormErrors({});
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [editingEvent]);

  // Save data whenever form changes (but only if not in editing mode and there's actual content)
  useEffect(() => {
    // Don't save during editing mode or if the form is essentially empty
    if (editingEvent) return;
    
    // Only save if there's meaningful content (main event name or sub-events with content)
    const hasContent = eventData.mainEventName.trim() || 
                      subEvents.some(se => se.eventType.trim() || se.groupSingle.trim() || se.startDate.trim());
    
    if (hasContent) {
      const dataToSave = {
        eventData,
        subEvents,
        organizingCommittee,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [eventData, subEvents, organizingCommittee, editingEvent]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside all event type dropdowns
      const eventTypeDropdowns = document.querySelectorAll('.event-type-dropdown');
      const isOutsideAllEventTypeDropdowns = Array.from(eventTypeDropdowns).every(dropdown => 
        !dropdown.contains(event.target as Node)
      );
      
      if (isOutsideAllEventTypeDropdowns) {
        setShowEventTypeDropdown({});
      }
      
      if (entryFeesRef.current && !entryFeesRef.current.contains(event.target as Node)) {
        setShowEntryFeesDropdown({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup camera streams on unmount
  useEffect(() => {
    return () => {
      // Stop all camera streams when component unmounts
      Object.values(cameraStreams).forEach(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
    };
  }, [cameraStreams]);

  // Activate live feed function
  const activateLiveFeed = async (subEventId: string) => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access is not supported in this browser or environment.');
        return;
      }

      // Check current permission status first
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        if (permissionStatus.state === 'denied') {
          alert('Camera permission is blocked. Please:\n\n1. Click the camera/lock icon in your browser\'s address bar\n2. Select "Allow" for camera access\n3. Refresh the page and try again\n\nNote: Camera access requires HTTPS or localhost.');
          return;
        }
      } catch (permError) {
        // Permission API might not be supported, continue with getUserMedia
        console.log('Permission API not supported, proceeding with camera request');
      }

      // First check if cameras are available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      
      if (!hasCamera) {
        alert('No camera found on this device. Please connect a camera and try again.');
        return;
      }

      // Request camera access with user-friendly timeout
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }, 
          audio: true 
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Camera request timeout')), 10000)
        )
      ]);
      
      // Store the stream for this sub-event
      setCameraStreams(prev => ({
        ...prev,
        [subEventId]: stream as MediaStream
      }));

      // Update the sub-event to mark live feed as activated
      updateSubEvent(subEventId, 'activateLiveFeed', true);
      
      // Store live stream info in localStorage for persistence
      localStorage.setItem(`zhevents_live_stream_${subEventId}`, JSON.stringify({
        eventId: subEventId,
        activated: true,
        timestamp: Date.now()
      }));

      console.log(`Live feed activated for sub-event: ${subEventId}`);
      alert('✅ Live feed activated! Camera access granted successfully.');
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      // Handle different types of camera errors with more specific guidance
      if (error instanceof Error) {
        switch (error.name) {
          case 'NotAllowedError':
            alert('🚫 Camera Permission Denied\n\nTo enable camera access:\n\n📱 On Mobile:\n• Tap the camera icon in your browser\n• Select "Allow" for camera access\n• Refresh the page\n\n💻 On Desktop:\n• Click the camera icon in address bar\n• Select "Allow" for camera\n• Refresh the page\n\n⚠️ Note: Camera requires HTTPS or localhost');
            break;
          case 'NotFoundError':
            alert('📷 No Camera Found\n\nPlease check:\n• Camera is connected properly\n• No other app is using the camera\n• Camera drivers are installed\n• Try reconnecting your camera');
            break;
          case 'NotReadableError':
            alert('⚠️ Camera In Use\n\nThe camera is already being used by another application.\n\nPlease:\n• Close other apps using the camera\n• Close other browser tabs with camera access\n• Restart your browser and try again');
            break;
          case 'OverconstrainedError':
            alert('⚙️ Camera Settings Issue\n\nYour camera doesn\'t support the required settings.\n\nTrying with basic settings...');
            // Retry with basic settings
            try {
              const basicStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: false 
              });
              setCameraStreams(prev => ({
                ...prev,
                [subEventId]: basicStream
              }));
              updateSubEvent(subEventId, 'activateLiveFeed', true);
              alert('✅ Live feed activated with basic settings!');
              return;
            } catch (retryError) {
              alert('❌ Unable to access camera even with basic settings. Please check your camera configuration.');
            }
            break;
          case 'SecurityError':
            alert('🔒 Security Error\n\nCamera access is blocked for security reasons.\n\n• Make sure you\'re using HTTPS or localhost\n• Check if camera access is allowed in browser settings\n• Try using a different browser');
            break;
          default:
            if (error.message === 'Camera request timeout') {
              alert('⏱️ Camera Request Timeout\n\nThe camera request took too long.\n\nPlease:\n• Check your camera connection\n• Close other camera applications\n• Try again in a few moments');
            } else {
              alert(`❌ Camera Error: ${error.message}\n\nTroubleshooting:\n• Refresh the page and try again\n• Check camera permissions in browser settings\n• Ensure no other app is using the camera\n• Try using a different browser`);
            }
        }
      } else {
        alert('❌ Camera Access Failed\n\nPlease ensure:\n\n✅ Camera permissions are granted\n✅ No other app is using the camera\n✅ You\'re using HTTPS or localhost\n✅ Your browser supports camera access\n✅ Camera is properly connected\n\nTry refreshing the page and allowing camera access when prompted.');
      }
      
      // Don't update the sub-event state if camera access failed
      updateSubEvent(subEventId, 'activateLiveFeed', false);
    }
  };

  // Deactivate live feed function
  const deactivateLiveFeed = (subEventId: string) => {
    const stream = cameraStreams[subEventId];
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setCameraStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[subEventId];
        return newStreams;
      });
    }

    // Update the sub-event to mark live feed as deactivated
    updateSubEvent(subEventId, 'activateLiveFeed', false);
    
    // Remove from localStorage
    localStorage.removeItem(`zhevents_live_stream_${subEventId}`);

    console.log(`Live feed deactivated for sub-event: ${subEventId}`);
    alert('Live feed deactivated.');
  };

  // Update sub-event function - this was missing and causing the camera activation to fail
  const updateSubEvent = (subEventId: string, field: keyof SubEvent, value: any) => {
    setSubEvents(prev => prev.map(subEvent => 
      subEvent.id === subEventId 
        ? { ...subEvent, [field]: value }
        : subEvent
    ));
  };

  // Function to check and warn about registration deadline after sub-event date and time
  const checkRegistrationDeadlineWarning = (subEvent: SubEvent) => {
    // Only check if we have all necessary fields filled
    if (!subEvent.registrationDeadlineDate || !subEvent.startDate || 
        !subEvent.registrationDeadlineHour || !subEvent.registrationDeadlineMinute || 
        !subEvent.registrationDeadlineAmPm || !subEvent.timeHour || 
        !subEvent.timeMinute || !subEvent.timeAmPm) {
      return;
    }

    try {
      // Create date objects for comparison
      const regDeadlineDate = new Date(subEvent.registrationDeadlineDate);
      const subEventStartDate = new Date(subEvent.startDate);

      // Set registration deadline time
      const regDeadlineHour = parseInt(subEvent.registrationDeadlineHour);
      const regDeadlineHour24 = subEvent.registrationDeadlineAmPm === 'pm' && regDeadlineHour !== 12 
        ? regDeadlineHour + 12 
        : (subEvent.registrationDeadlineAmPm === 'am' && regDeadlineHour === 12 ? 0 : regDeadlineHour);
      
      regDeadlineDate.setHours(
        regDeadlineHour24,
        parseInt(subEvent.registrationDeadlineMinute),
        0,
        0
      );

      // Set sub-event start date and time
      const subEventHour = parseInt(subEvent.timeHour);
      const subEventHour24 = subEvent.timeAmPm === 'pm' && subEventHour !== 12 
        ? subEventHour + 12 
        : (subEvent.timeAmPm === 'am' && subEventHour === 12 ? 0 : subEventHour);
      
      subEventStartDate.setHours(
        subEventHour24,
        parseInt(subEvent.timeMinute),
        0,
        0
      );

      // Check if registration deadline is after sub-event start date and time
      if (regDeadlineDate > subEventStartDate) {
        const subEventIndex = subEvents.findIndex(se => se.id === subEvent.id) + 1;
        const subEventName = subEvent.eventType || `Sub Event-${subEventIndex}`;
        
        const regDeadlineFormatted = regDeadlineDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) + ' at ' + regDeadlineDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        });
        
        const subEventFormatted = subEventStartDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) + ' at ' + subEventStartDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        });

        // Show informational alert/recommendation
        const userChoice = confirm(
          `Registration Deadline Alert\n\n` +
          `Registration deadline is AFTER the event start time.\n` +
          `• OK: Keep current deadline\n` +
          `• Cancel: Reset deadline`
        );

        if (!userChoice) {
          // User chose to change the deadline - reset to blank/default values
          updateSubEvent(subEvent.id, 'registrationDeadlineDate', '');
          updateSubEvent(subEvent.id, 'registrationDeadlineHour', '11');
          updateSubEvent(subEvent.id, 'registrationDeadlineMinute', '59');
          updateSubEvent(subEvent.id, 'registrationDeadlineAmPm', 'pm');
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error('Error checking registration deadline:', error);
    }
    return true;
  };

  const generateNumberOptions = (start: number, end: number) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(i.toString());
    }
    return options;
  };

  const generateParticipantOptions = (start: number, end: number) => {
    const options = [];
    // Skip 0 - start from 1 or the specified start value
    for (let i = Math.max(start, 1); i <= end; i++) {
      options.push(i.toString());
    }
    return options;
  };

  const addRule = (subEventId?: string) => {
    if (subEventId) {
      setSubEvents(prev => prev.map(subEvent => 
        subEvent.id === subEventId && subEvent.rules.length < 5
          ? { ...subEvent, rules: [...subEvent.rules, ''] }
          : subEvent
      ));
    }
  };

  const removeRule = (subEventId: string, index: number) => {
    setSubEvents(prev => prev.map(subEvent => 
      subEvent.id === subEventId && subEvent.rules.length > 1
        ? { ...subEvent, rules: subEvent.rules.filter((_, i) => i !== index) }
        : subEvent
    ));
    // Close the confirmation modal
    setRuleDeleteConfirmation({subEventId: '', ruleIndex: -1, show: false});
  };

  const updateRule = (subEventId: string, index: number, value: string) => {
    if (value.length <= 250) {
      setSubEvents(prev => prev.map(subEvent => 
        subEvent.id === subEventId 
          ? { 
              ...subEvent, 
              rules: subEvent.rules.map((rule, i) => i === index ? value : rule)
            }
          : subEvent
      ));
    }
  };

  const handleEventTypeSelect = (type: string, subEventId?: string) => {
    if (subEventId) {
      updateSubEvent(subEventId, 'eventType', type);
      setEventTypeSearch(prev => ({ ...prev, [subEventId]: type }));
      setShowEventTypeDropdown(prev => ({ ...prev, [subEventId]: false }));
    }
  };

  const handleEntryFeesSelect = (fees: string, subEventId: string) => {
    updateSubEvent(subEventId, 'entryFees', fees);
    setShowEntryFeesDropdown({});
  };

  const getFilteredEntryFeesOptions = (subEventId: string) => {
    const searchTerm = entryFeesSearch[subEventId] || '';
    return entryFeesOptions.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const addCommitteeMember = () => {
    // Check if all existing non-first members have verified OTP
    const nonFirstMembers = organizingCommittee.filter(member => !member.isFirstMember);
    const hasUnverifiedMembers = nonFirstMembers.some(member => !member.otpVerified);
    
    if (hasUnverifiedMembers) {
      alert('Please verify OTP for all existing committee members before adding a new member.');
      return;
    }
    
    setOrganizingCommittee(prev => [...prev, { 
      name: '', 
      designation: '', 
      phone: '', 
      email: '', 
      otpSent: false, 
      otpVerified: false, 
      otp: '',
      isFirstMember: false
    }]);
  };

  const removeCommitteeMember = (index: number) => {
    if (organizingCommittee.length > 1 && !organizingCommittee[index].isFirstMember) {
      const newCommittee = organizingCommittee.filter((_, i) => i !== index);
      setOrganizingCommittee(newCommittee);
    }
  };

  const updateCommitteeMember = (index: number, field: keyof OrganizingCommittee, value: any) => {
    const newCommittee = [...organizingCommittee];
    
    // Special handling for phone field for non-first members - only allow exactly 10 digits
    if (field === 'phone' && !newCommittee[index].isFirstMember) {
      // Remove all non-numeric characters
      const numbersOnly = value.replace(/[^0-9]/g, '');
      // Limit to exactly 10 digits
      const limitedValue = numbersOnly.slice(0, 10);
      newCommittee[index] = { ...newCommittee[index], [field]: limitedValue };
    }
    // Special handling for email field for non-first members - require @ symbol
    else if (field === 'email' && !newCommittee[index].isFirstMember) {
      // Allow the value to be set but we'll validate it during OTP sending and form submission
      newCommittee[index] = { ...newCommittee[index], [field]: value };
    } else {
      newCommittee[index] = { ...newCommittee[index], [field]: value };
    }
    
    setOrganizingCommittee(newCommittee);
  };

  // Sub-event management functions
  const toggleSubEventActive = (subEventId: string) => {
    // Prevent the first sub-event from being deactivated
    if (subEventId === 'sub-event-1') {
      const currentState = subEvents.find(se => se.id === subEventId)?.isActive;
      if (currentState) {
        alert('The first sub-event cannot be deactivated. It must remain active.');
        return;
      }
    }
    updateSubEvent(subEventId, 'isActive', !subEvents.find(se => se.id === subEventId)?.isActive);
  };

  const toggleSubEventCollapse = (subEventId: string) => {
    setCollapsedSubEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subEventId)) {
        newSet.delete(subEventId);
      } else {
        newSet.add(subEventId);
      }
      return newSet;
    });
  };

  const sendOTP = (index: number) => {
    const member = organizingCommittee[index];
    if (!member.name || !member.designation || !member.phone || !member.email) {
      alert('Please fill all mandatory fields first');
      return;
    }
    
    // Check if phone number is exactly 10 digits for non-first members
    if (!member.isFirstMember && member.phone.length !== 10) {
      alert('Please enter a valid phone number');
      return;
    }
    
    // Check if email contains @ symbol for non-first members
    if (!member.isFirstMember && !member.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    setOTPModal({isOpen: true, memberIndex: index});
  };

  const handleOTPSent = () => {
    const newCommittee = [...organizingCommittee];
    newCommittee[otpModal.memberIndex] = { 
      ...newCommittee[otpModal.memberIndex], 
      otpSent: true,
      otpVerified: true
    };
    setOrganizingCommittee(newCommittee);
  };

  // Add sub-event function
  const addSubEvent = () => {
    const newSubEvent: SubEvent = {
      id: `sub-event-${subEvents.length + 1}`,
      eventType: '',
      groupSingle: '',
      // Use "0" participants if coming from dashboard, otherwise default to '1'
      minParticipants: isNewFromDashboard ? '0' : '1',
      maxParticipants: isNewFromDashboard ? '0' : '1',
      startDate: '',
      endDate: '',
      isSingleDate: false,
      timeHour: '10',
      timeMinute: '00',
      timeAmPm: 'am',
      rules: [''],
      entryFees: '',
      registrationDeadlineDate: '',
      registrationDeadlineHour: '11',
      registrationDeadlineMinute: '59',
      registrationDeadlineAmPm: 'pm',
      otse: '',
      performanceDurationMin: '',
      performanceDurationMax: '',
      timeLimitNotApplicable: false,
      activateLiveFeed: false,
      isActive: true
    };
    setSubEvents(prev => [...prev, newSubEvent]);
  };

  // Delete sub-event functions
  const showDeleteConfirmation = (eventId: string) => {
    setDeleteConfirmation({eventId, show: true});
  };

  const hideDeleteConfirmation = () => {
    setDeleteConfirmation({eventId: '', show: false});
  };

  const confirmDeleteSubEvent = () => {
    const eventId = deleteConfirmation.eventId;
    setSubEvents(prev => prev.filter(event => event.id !== eventId));
    setCollapsedSubEvents(prev => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
    hideDeleteConfirmation();
  };

  // Save individual sub-event function
  const saveSubEvent = (subEventId: string) => {
    const subEvent = subEvents.find(event => event.id === subEventId);
    if (!subEvent) return;
    
    // Special validation for Sub Event-1 (first sub event)
    if (subEventId === subEvents[0]?.id) {
      const validation = validateMainFormFields();
      if (!validation.isValid) {
        alert(`Please complete all mandatory fields first:\n\n${validation.missingFields.join('\n')}`);
        return;
      } else {
        // Clear all main form errors when validation passes
        setMainFormErrors({});
      }
    }
    
    // Validate this specific sub-event
    const subErrors: {[key: string]: boolean} = {};
    
    if (!subEvent.eventType.trim()) subErrors.eventType = true;
    if (!subEvent.groupSingle.trim()) subErrors.groupSingle = true;
    if (!subEvent.minParticipants || !subEvent.maxParticipants) subErrors.participants = true;
    if (!subEvent.startDate.trim() || (!subEvent.isSingleDate && !subEvent.endDate.trim())) subErrors.eventDates = true;
    if (!subEvent.timeHour.trim() || !subEvent.timeMinute?.trim() || !subEvent.timeAmPm.trim()) subErrors.time = true;
    if (!subEvent.entryFees.trim()) subErrors.entryFees = true;
    if (!subEvent.registrationDeadlineDate.trim() || !subEvent.registrationDeadlineHour.trim() || !subEvent.registrationDeadlineMinute.trim() || !subEvent.registrationDeadlineAmPm.trim()) subErrors.regDeadline = true;
    if (!subEvent.otse.trim()) subErrors.otse = true;
    // Perf. Duration is optional - user can set time values, check N.A., or leave empty
    // Allow cases where only minutes are selected (hours can be 0)
    const hasTimeValues = subEvent.performanceDurationMin !== '0' || subEvent.performanceDurationMax !== '0';
    const hasNotApplicable = subEvent.timeLimitNotApplicable;
    
    // Only validate if both N.A. and time values are set (conflicting selections)
    if (hasNotApplicable && hasTimeValues) {
      subErrors.duration = true;
    }
    
    if (Object.keys(subErrors).length > 0) {
      setSubEventErrors(prev => ({ ...prev, [subEventId]: subErrors }));
      alert('Please fill in all mandatory fields before saving.');
      return;
    }
    
    // Clear any previous errors for this sub-event
    setSubEventErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[subEventId];
      return newErrors;
    });
    
    alert('Sub Event saved successfully!');
  };

  // Helper function to parse date strings from existing events (e.g., "25th Nov 25" -> ISO date)
  const parseEventDate = (dateStr: string) => {
    console.log('parseEventDate called with:', dateStr);
    if (!dateStr) return '';
    
    // Remove ordinals (st, nd, rd, th)
    const cleanDate = dateStr.replace(/(\d+)(st|nd|rd|th)/gi, '$1');
    console.log('After removing ordinals:', cleanDate);
    
    // Parse the date components using regex
    const datePattern = /\b(\d{1,2})\s+(\w+)\s+(\d{2,4})\b/;
    const match = cleanDate.match(datePattern);
    
    if (match) {
      const [, day, monthStr, year] = match;
      
      // Convert 2-digit year to 4-digit
      const fullYear = year.length === 2 ? 
        (parseInt(year) <= 79 ? `20${year}` : `19${year}`) : 
        year;
      
      // Map month names to numbers
      const monthMap: {[key: string]: string} = {
        'jan': '01', 'january': '01',
        'feb': '02', 'february': '02', 
        'mar': '03', 'march': '03',
        'apr': '04', 'april': '04',
        'may': '05',
        'jun': '06', 'june': '06',
        'jul': '07', 'july': '07',
        'aug': '08', 'august': '08',
        'sep': '09', 'september': '09', 'sept': '09',
        'oct': '10', 'october': '10',
        'nov': '11', 'november': '11',
        'dec': '12', 'december': '12'
      };
      
      const monthNum = monthMap[monthStr.toLowerCase()];
      
      if (monthNum) {
        // Create ISO date format: YYYY-MM-DD
        const paddedDay = day.padStart(2, '0');
        const isoDate = `${fullYear}-${monthNum}-${paddedDay}`;
        
        console.log('Constructed ISO date:', isoDate);
        
        // Validate the constructed date
        const testDate = new Date(isoDate);
        if (!isNaN(testDate.getTime())) {
          console.log('Successfully parsed date:', testDate);
          return isoDate;
        }
      }
    }
    
    console.log('Date parsing failed, returning empty string');
    return '';
  };

  // Format date to dd-mm-yyyy for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  // Get current date in YYYY-MM-DD format for min date restriction
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Validate mandatory main form fields for Sub Event-1
  const validateMainFormFields = () => {
    const requiredFields = {
      collegeName: eventData.collegeName?.trim(),
      mainEventName: eventData.mainEventName?.trim(),
      address: eventData.address?.trim(),
      locality: eventData.locality?.trim(),
      city: eventData.city?.trim(),
      pinCode: eventData.pinCode?.trim(),
      competitionType: eventData.competitionType?.trim(),
      startDate: eventData.startDate?.trim(),
      endDate: eventData.endDate?.trim()
    };

    const missingFields = [];
    const errors: {[key: string]: boolean} = {};

    if (!requiredFields.collegeName) {
      missingFields.push('College Name');
      errors.collegeName = true;
    }
    if (!requiredFields.mainEventName) {
      missingFields.push('Main Event');
      errors.mainEventName = true;
    }
    if (!requiredFields.address) {
      missingFields.push('Address');
      errors.address = true;
    }
    if (!requiredFields.locality) {
      missingFields.push('Location');
      errors.locality = true;
    }
    if (!requiredFields.city) {
      missingFields.push('City');
      errors.city = true;
    }
    if (!requiredFields.pinCode) {
      missingFields.push('Pin Code');
      errors.pinCode = true;
    }
    if (!requiredFields.competitionType) {
      missingFields.push('Comp. Type');
      errors.competitionType = true;
    }
    if (!requiredFields.startDate) {
      missingFields.push('Main Event Start Date');
      errors.startDate = true;
    }
    if (!requiredFields.endDate) {
      missingFields.push('Main Event End Date');
      errors.endDate = true;
    }

    // Set the error highlighting
    setMainFormErrors(errors);

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  // Clear specific main form error when field is filled
  const clearMainFormError = (fieldName: string) => {
    setMainFormErrors(prev => {
      if (prev[fieldName]) {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      }
      return prev;
    });
  };

  // Validate mandatory sub event fields
  const validateSubEventFields = (subEventId: string) => {
    const subEvent = subEvents.find(event => event.id === subEventId);
    if (!subEvent) return { isValid: false, missingFields: [], errors: {} };

    const missingFields = [];
    const errors: {[key: string]: boolean} = {};

    if (!subEvent.eventType.trim()) {
      missingFields.push('Event Type');
      errors.eventType = true;
    }
    if (!subEvent.groupSingle.trim()) {
      missingFields.push('Group/Single');
      errors.groupSingle = true;
    }
    if (!subEvent.minParticipants || !subEvent.maxParticipants || 
        parseInt(subEvent.minParticipants) === 0 || parseInt(subEvent.maxParticipants) === 0) {
      missingFields.push('Number of Participants');
      errors.participants = true;
    }
    if (!subEvent.startDate.trim() || (!subEvent.isSingleDate && !subEvent.endDate.trim())) {
      missingFields.push('Event Dates');
      errors.eventDates = true;
    }
    if (!subEvent.timeHour.trim() || !subEvent.timeMinute?.trim() || !subEvent.timeAmPm.trim()) {
      missingFields.push('Event Time');
      errors.time = true;
    }
    if (!subEvent.entryFees.trim()) {
      missingFields.push('Entry Fees');
      errors.entryFees = true;
    }
    if (!subEvent.registrationDeadlineDate.trim() || !subEvent.registrationDeadlineHour.trim() || 
        !subEvent.registrationDeadlineMinute.trim() || !subEvent.registrationDeadlineAmPm.trim()) {
      missingFields.push('Registration Deadline');
      errors.regDeadline = true;
    }
    if (!subEvent.otse.trim()) {
      missingFields.push('On the Spot Entry (OTSE)');
      errors.otse = true;
    }
    if (!subEvent.timeLimitNotApplicable && 
        ((!subEvent.performanceDurationMin.trim() || subEvent.performanceDurationMin === '0') && 
         (!subEvent.performanceDurationMax.trim() || subEvent.performanceDurationMax === '0'))) {
      missingFields.push('Time Limit');
      errors.duration = true;
    }

    // Validate registration deadline is not beyond event end date
    if (subEvent.registrationDeadlineDate.trim() && subEvent.startDate.trim()) {
      const regDeadlineDate = new Date(subEvent.registrationDeadlineDate);
      const eventEndDate = subEvent.isSingleDate ? new Date(subEvent.startDate) : new Date(subEvent.endDate || subEvent.startDate);
      
      // Set time for proper comparison
      regDeadlineDate.setHours(
        parseInt(subEvent.registrationDeadlineHour) + (subEvent.registrationDeadlineAmPm === 'pm' && subEvent.registrationDeadlineHour !== '12' ? 12 : 0),
        parseInt(subEvent.registrationDeadlineMinute),
        0,
        0
      );
      
      eventEndDate.setHours(23, 59, 59, 999); // End of event day
      
      if (regDeadlineDate > eventEndDate) {
        missingFields.push('Registration Deadline cannot be beyond the event end date');
        errors.regDeadline = true;
      }
    }

    // Set the error highlighting for this sub event
    setSubEventErrors(prev => ({ ...prev, [subEventId]: errors }));

    return {
      isValid: missingFields.length === 0,
      missingFields,
      errors
    };
  };

  // Clear specific sub event field error when field is filled
  const clearSubEventError = (subEventId: string, fieldName: string) => {
    setSubEventErrors(prev => {
      if (prev[subEventId] && prev[subEventId][fieldName]) {
        const newErrors = { ...prev };
        const subEventErrors = { ...newErrors[subEventId] };
        delete subEventErrors[fieldName];
        
        // If no more errors for this sub event, remove the entire entry
        if (Object.keys(subEventErrors).length === 0) {
          delete newErrors[subEventId];
        } else {
          newErrors[subEventId] = subEventErrors;
        }
        
        return newErrors;
      }
      return prev;
    });
  };

  // Handle activate live feed - simplified for development
  const handleActivateLiveFeed = (subEventId: string) => {
    const subEvent = subEvents.find(se => se.id === subEventId);
    if (!subEvent) return;

    if (subEvent.activateLiveFeed) {
      // Deactivate live feed
      deactivateLiveFeed(subEventId);
    } else {
      // Activate live feed with real camera access
      activateLiveFeed(subEventId);
    }
  };

  const handleSave = () => {
    // Validate main form fields first
    const mainFormValidation = validateMainFormFields();
    if (!mainFormValidation.isValid) {
      alert(`Please complete all mandatory main form fields first:\n\n${mainFormValidation.missingFields.join('\n')}`);
      return;
    }

    // Check if at least one active sub-event is completed (all mandatory fields filled)
    const completedSubEvents = subEvents.filter(subEvent => {
      if (!subEvent.isActive) return false; // Only check active sub-events
      const validation = validateSubEventFields(subEvent.id);
      return validation.isValid;
    });

    if (completedSubEvents.length === 0) {
      alert('Please complete at least one sub-event with all mandatory fields before saving.');
      return;
    }

    // Additional validation: Check registration deadlines for active sub-events only
    const invalidDeadlineEvents = [];
    for (const subEvent of subEvents) {
      if (!subEvent.isActive) continue; // Only check active sub-events
      if (subEvent.registrationDeadlineDate.trim() && subEvent.startDate.trim()) {
        const regDeadlineDate = new Date(subEvent.registrationDeadlineDate);
        const eventEndDate = subEvent.isSingleDate ? new Date(subEvent.startDate) : new Date(subEvent.endDate || subEvent.startDate);
        
        // Set time for proper comparison
        regDeadlineDate.setHours(
          parseInt(subEvent.registrationDeadlineHour) + (subEvent.registrationDeadlineAmPm === 'pm' && subEvent.registrationDeadlineHour !== '12' ? 12 : 0),
          parseInt(subEvent.registrationDeadlineMinute),
          0,
          0
        );
        
        eventEndDate.setHours(23, 59, 59, 999); // End of event day
        
        if (regDeadlineDate > eventEndDate) {
          const subEventIndex = subEvents.findIndex(se => se.id === subEvent.id) + 1;
          invalidDeadlineEvents.push(`Sub Event ${subEventIndex}: Registration deadline (${regDeadlineDate.toLocaleDateString()}) is beyond event end date (${eventEndDate.toLocaleDateString()})`);
        }
      }
    }

    if (invalidDeadlineEvents.length > 0) {
      alert(`Please fix the following registration deadline issues:\\n\\n${invalidDeadlineEvents.join('\\n\\n')}`);
      return;
    }

    // Check organizing committee
    const missingPositions = organizingCommittee.filter(member => !member.designation?.trim());
    if (missingPositions.length > 0) {
      alert('Please fill in the Department field for all organizing committee members before saving.');
      return;
    }

    // Check email format for non-first members - must contain @ symbol
    const invalidEmails = organizingCommittee.filter(member => !member.isFirstMember && member.email && !member.email.includes('@'));
    if (invalidEmails.length > 0) {
      alert('Please enter valid email addresses with @ symbol for all organizing committee members before saving.');
      return;
    }

    // Check phone number format for non-first members - must be exactly 10 digits
    const invalidPhones = organizingCommittee.filter(member => !member.isFirstMember && member.phone && member.phone.length !== 10);
    if (invalidPhones.length > 0) {
      alert('Please enter a valid phone number for all organizing committee members before saving.');
      return;
    }

    // Check OTP verification for non-first members
    const unverifiedMembers = organizingCommittee.filter(member => !member.isFirstMember && !member.otpVerified);
    if (unverifiedMembers.length > 0) {
      alert('Please verify OTP for all organizing committee members (except the first member) before saving.');
      return;
    }

    // Get all sub-events (not just active ones) for saving
    const allSubEvents = subEvents;
    // Get only active sub-events for main event details
    const activeSubEvents = subEvents.filter(subEvent => subEvent.isActive);

    // Create the main event object
    const formatDateRange = (startDate: string, endDate: string) => {
      if (!startDate) {
        return '';
      }
      
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : start;
      
      // Check if dates are valid
      if (isNaN(start.getTime())) {
        return startDate; // Return original if can't parse
      }
      if (endDate && isNaN(end.getTime())) {
        return startDate; // Return start date if end date is invalid
      }
      
      const startDay = start.getDate();
      const endDay = end.getDate();
      const month = start.toLocaleDateString('en-US', { month: 'short' });
      const year = start.getFullYear().toString().slice(-2);
      
      const result = startDay === endDay 
        ? `${startDay}${getOrdinalSuffix(startDay)} ${month} ${year}`
        : `${startDay}${getOrdinalSuffix(startDay)} to ${endDay}${getOrdinalSuffix(endDay)} ${month} ${year}`;
      
      return result;
    };

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    // Generate a unique ID based on event name
    const eventId = eventData.mainEventName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) || 'event' + Date.now();
    
    // Determine the main event type (most common type from all sub-events)
    const eventTypes = allSubEvents.map(se => se.eventType).filter(type => type);
    const typeCount = eventTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});
    const mainEventType = eventTypes.length > 0 ? Object.keys(typeCount).reduce((a, b) => typeCount[a] > typeCount[b] ? a : b, 'Mixed') : 'Mixed';

    // Create event details for each sub-event
    const eventDetails = activeSubEvents.map((subEvent, index) => {
      // Format sub-event date range
      const formatSubEventDate = (startDate: string, endDate: string, isSingleDate: boolean) => {
        if (!startDate) return '';
        
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : start;
        
        // Check if dates are valid
        if (isNaN(start.getTime())) return startDate;
        if (endDate && isNaN(end.getTime())) return start.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        
        const startFormatted = start.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        
        // If single date or dates are the same, show single date
        if (isSingleDate || !endDate || start.toDateString() === end.toDateString()) {
          return startFormatted;
        }
        
        const endFormatted = end.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        
        // If same month and year, show "12 to 13 Dec 2025"
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
          const startDay = start.getDate();
          const endDay = end.getDate();
          const monthYear = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          return `${startDay} to ${endDay} ${monthYear}`;
        }
        
        // Different months or years, show full range
        return `${startFormatted} to ${endFormatted}`;
      };

      return {
        name: `Event ${index + 1}`,
        type: subEvent.eventType,
        competition: eventData.competitionType,
        groupType: subEvent.groupSingle,
        date: formatSubEventDate(subEvent.startDate, subEvent.endDate, subEvent.isSingleDate),
        time: `${subEvent.timeHour}:${subEvent.timeMinute}${subEvent.timeAmPm}`,
        participants: subEvent.groupSingle === 'Single' ? '1' : `${subEvent.minParticipants}–${subEvent.maxParticipants}`,
        rules: subEvent.rules.filter(rule => rule.trim() !== ''),
        contact: organizingCommittee[0] ? `${organizingCommittee[0].name} • ${organizingCommittee[0].phone}` : 'Contact info not available',
        entryFees: subEvent.entryFees,
        deadline: subEvent.registrationDeadlineDate ? 
          `${new Date(subEvent.registrationDeadlineDate).toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })} at ${subEvent.registrationDeadlineHour}:${subEvent.registrationDeadlineMinute}${subEvent.registrationDeadlineAmPm} (or until slots are available)` : 
          'TBD',
        otse: subEvent.otse || 'No'
      };
    });

    const newEvent = {
      id: eventId,
      college: eventData.collegeName,
      eventName: eventData.mainEventName,
      location: `${eventData.city}, ${eventData.locality}`,
      dates: formatDateRange(eventData.startDate, eventData.endDate),
      type: eventTypes.length > 1 ? 'Mixed' : mainEventType,
      competition: eventData.competitionType,
      color: 'bg-blue-200', // Default color for new events
      address: eventData.address, // Keep original address as entered, not concatenated
      contact: organizingCommittee[0] ? `${organizingCommittee[0].name} • ${organizingCommittee[0].phone}` : 'Contact info not available',
      entryFees: activeSubEvents[0]?.entryFees || 'TBD',
      deadline: activeSubEvents[0]?.registrationDeadlineDate ? 
        `${new Date(activeSubEvents[0].registrationDeadlineDate).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })} at ${activeSubEvents[0].registrationDeadlineHour}:${activeSubEvents[0].registrationDeadlineMinute}${activeSubEvents[0].registrationDeadlineAmPm} (or until slots are available)` : 
        'TBD',
      otse: activeSubEvents[0]?.otse || 'No',
      events: eventDetails,
      // Store the individual college fields from Add Main Event
      collegeName: eventData.collegeName,
      collegeAddress: eventData.address,
      collegeLocality: eventData.locality,
      city: eventData.city,
      pinCode: eventData.pinCode,
      // Store the detailed sub-events and organizing committee data for editing
      subEventsDetail: allSubEvents,
      organizingCommittee: organizingCommittee
    };

    // Add or update the event
    const isEdit = !!editingEvent;
    addEvent(newEvent, isEdit);
    
    // Clear local storage
    localStorage.removeItem('zhevents_add_event_form');
    
    alert(isEdit 
      ? 'Event updated successfully!' 
      : 'Event added successfully!\n\nYou can now continue adding more sub-events to this main event. Each sub-event will be automatically linked to your main event.');
    
    // For new events, set the newly created event as editingEvent so subsequent saves update it
    if (!isEdit) {
      // Navigate back to add_event with the newly created event as editingEvent
      // This enables seamless addition of more sub-events to the same main event
      navigate('add_event', undefined, newEvent, false);
    }
  };

  // Helper function to get input styling with error states
  const getInputClassName = (baseClassName: string, hasError: boolean) => {
    return hasError 
      ? baseClassName.replace('border-gray-300', 'border-red-300').replace('bg-gray-50', 'bg-red-50').replace('bg-white', 'bg-red-50')
      : baseClassName;
  };

  // Event details form component
  const renderEventDetails = (subEvent: SubEvent, subEventIndex: number) => {
    const currentErrors = subEventErrors[subEvent.id] || {};
    
    return (
      <div className="space-y-0.5">
        {/* Event Type with Search */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Category:</label>
          <div className="relative event-type-dropdown" ref={eventTypeRef}>
            <input
              type="text"
              value={subEvent.eventType || ''}
              onChange={(e) => {
                updateSubEvent(subEvent.id, 'eventType', e.target.value);
                setEventTypeSearch(prev => ({ ...prev, [subEvent.id]: e.target.value }));
                setShowEventTypeDropdown(prev => ({ ...prev, [subEvent.id]: true }));
              }}
              onFocus={() => setShowEventTypeDropdown(prev => ({ ...prev, [subEvent.id]: true }))}
              className={getInputClassName("w-full h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", currentErrors.eventType)}
              placeholder="Type or select event type"
            />
            {showEventTypeDropdown[subEvent.id] && getFilteredEventTypes(subEvent.id).length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-0.5 max-h-24 overflow-y-auto scrollbar-hide z-10">
                {getFilteredEventTypes(subEvent.id).map(type => (
                  <div
                    key={type}
                    onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       handleEventTypeSelect(type, subEvent.id);
                     }}
                    className="px-1 py-0.5 text-sm text-black hover:bg-gray-100 cursor-pointer"
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Group/Single */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Group/Single:</label>
          <select
            value={subEvent.groupSingle || ''}
            onChange={(e) => {
              updateSubEvent(subEvent.id, 'groupSingle', e.target.value);
              if (e.target.value === 'Single') {
                updateSubEvent(subEvent.id, 'minParticipants', '1');
                updateSubEvent(subEvent.id, 'maxParticipants', '1');
              } else if (e.target.value === 'Group') {
                // When switching to Group, ensure min starts from 2
                const currentMin = parseInt(subEvent.minParticipants) || 1;
                if (currentMin < 2) {
                  updateSubEvent(subEvent.id, 'minParticipants', '2');
                  updateSubEvent(subEvent.id, 'maxParticipants', '2');
                }
              }
            }}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", currentErrors.groupSingle)}
          >
            <option value="" disabled hidden></option>
            <option value="Group">Group</option>
            <option value="Single">Single</option>
          </select>
        </div>

        {/* Participants */}
        <div className="grid grid-cols-[85px_1fr] items-center mt-0.5">
          <label className="text-sm text-black">Participants:</label>
          <div className="flex gap-1 items-center">
            {subEvent.groupSingle === 'Single' ? (
              <>
                <div className="h-6 px-1 border border-gray-300 rounded text-sm text-black leading-none w-7 flex items-center justify-center">
                  1
                </div>
                <span className="text-xs ml-1">Min</span>
              </>
            ) : (
              <>
                <select
                  value={subEvent.minParticipants || '0'}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    const currentMax = parseInt(subEvent.maxParticipants) || 0;
                    updateSubEvent(subEvent.id, 'minParticipants', e.target.value);
                    // If current max is less than new min, reset max to match min
                    if (currentMax < newMin) {
                      updateSubEvent(subEvent.id, 'maxParticipants', e.target.value);
                    }
                  }}
                  className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-none w-7 scrollbar-hide", currentErrors.participants)}
                >
                  {generateParticipantOptions(
                    subEvent.groupSingle === 'Group' ? 2 : 1, 
                    20
                  ).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span className="text-xs ml-1">Min</span>
                <span className="text-xs mx-1">to</span>
                <select
                  value={subEvent.maxParticipants || '0'}
                  onChange={(e) => updateSubEvent(subEvent.id, 'maxParticipants', e.target.value)}
                  className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-none w-7 scrollbar-hide", currentErrors.participants)}
                >
                  {generateParticipantOptions(
                    parseInt(subEvent.minParticipants) || 1, 
                    20
                  ).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span className="text-xs ml-1">Max</span>

              </>
            )}
          </div>
        </div>

        {/* Sub Event Dt. */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Sub Event Dt.:</label>
          <div className="flex gap-1 items-center max-w-full">
            <input
              type="date"
              value={subEvent.startDate || ''}
              onChange={(e) => {
                const newStartDate = e.target.value;
                updateSubEvent(subEvent.id, 'startDate', newStartDate);
                // Auto-populate end date with start date
                if (newStartDate) {
                  updateSubEvent(subEvent.id, 'endDate', newStartDate);
                }
                // Check for registration deadline warning after a brief delay to allow state update
                setTimeout(() => {
                  const updatedSubEvent = { ...subEvent, startDate: newStartDate, endDate: newStartDate };
                  checkRegistrationDeadlineWarning(updatedSubEvent);
                }, 100);
              }}
              min={getCurrentDate()}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-black w-28", currentErrors.eventDates)}
              style={{ colorScheme: 'light' }}
              data-date={formatDateForDisplay(subEvent.startDate)}
            />
            <span className="text-xs flex-shrink-0">to</span>
            <input
              type="date"
              value={subEvent.endDate || ''}
              onChange={(e) => {
                updateSubEvent(subEvent.id, 'endDate', e.target.value);
                // Check for registration deadline warning after a brief delay to allow state update
                setTimeout(() => {
                  const updatedSubEvent = { ...subEvent, endDate: e.target.value };
                  checkRegistrationDeadlineWarning(updatedSubEvent);
                }, 100);
              }}
              min={subEvent.startDate || getCurrentDate()}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-black w-28", currentErrors.eventDates)}
              style={{ colorScheme: 'light' }}
              data-date={formatDateForDisplay(subEvent.endDate)}
            />
          </div>
        </div>

        {/* Time */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Time:</label>
          <div className="flex gap-1">
            <select
              value={subEvent.timeHour}
              onChange={(e) => {
                updateSubEvent(subEvent.id, 'timeHour', e.target.value);
                // Check for registration deadline warning after a brief delay to allow state update
                setTimeout(() => {
                  const updatedSubEvent = { ...subEvent, timeHour: e.target.value };
                  checkRegistrationDeadlineWarning(updatedSubEvent);
                }, 100);
              }}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-none w-7", currentErrors.time)}
            >
              {generateNumberOptions(1, 12).map(hour => (
                <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <span className="text-xs self-center">:</span>
            <select
              value={subEvent.timeMinute || '00'}
              onChange={(e) => {
                updateSubEvent(subEvent.id, 'timeMinute', e.target.value);
                // Check for registration deadline warning after a brief delay to allow state update
                setTimeout(() => {
                  const updatedSubEvent = { ...subEvent, timeMinute: e.target.value };
                  checkRegistrationDeadlineWarning(updatedSubEvent);
                }, 100);
              }}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-none w-7 scrollbar-hide", currentErrors.time)}
            >
              {generateNumberOptions(0, 59).map(minute => (
                <option key={minute} value={minute.toString().padStart(2, '0')}>{minute.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <select
              value={subEvent.timeAmPm}
              onChange={(e) => {
                updateSubEvent(subEvent.id, 'timeAmPm', e.target.value);
                // Check for registration deadline warning after a brief delay to allow state update
                setTimeout(() => {
                  const updatedSubEvent = { ...subEvent, timeAmPm: e.target.value };
                  checkRegistrationDeadlineWarning(updatedSubEvent);
                }, 100);
              }}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-none self-center", currentErrors.time)}
            >
              <option value="am">am</option>
              <option value="pm">pm</option>
            </select>
          </div>
        </div>

        {/* Perf. Duration */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Perform Dur.:</label>
          <div className="flex gap-1 items-center">
            <select
              value={subEvent.performanceDurationMin}
              onChange={(e) => {
                updateSubEvent(subEvent.id, 'performanceDurationMin', e.target.value);
                // Automatically uncheck N.A. when time value is selected
                if (e.target.value !== '0' && subEvent.timeLimitNotApplicable) {
                  updateSubEvent(subEvent.id, 'timeLimitNotApplicable', false);
                }
              }}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-none w-7", currentErrors.duration)}
              disabled={subEvent.timeLimitNotApplicable}
            >
              {generateNumberOptions(0, 12).map(hour => (
                <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <span className="text-xs text-[12px]">hrs</span>
            <select
              value={subEvent.performanceDurationMax}
              onChange={(e) => {
                updateSubEvent(subEvent.id, 'performanceDurationMax', e.target.value);
                // Automatically uncheck N.A. when time value is selected
                if (e.target.value !== '0' && subEvent.timeLimitNotApplicable) {
                  updateSubEvent(subEvent.id, 'timeLimitNotApplicable', false);
                }
              }}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal w-7 scrollbar-hide", currentErrors.duration)}
              disabled={subEvent.timeLimitNotApplicable}
            >
              {generateNumberOptions(0, 59).map(minute => (
                <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <span className="text-xs text-[12px]">mins</span>
            <label className="flex items-center gap-1 ml-1">
              <input
                type="checkbox"
                checked={subEvent.timeLimitNotApplicable}
                onChange={(e) => {
                  updateSubEvent(subEvent.id, 'timeLimitNotApplicable', e.target.checked);
                  // Reset duration values when N.A. is checked
                  if (e.target.checked) {
                    updateSubEvent(subEvent.id, 'performanceDurationMin', '0');
                    updateSubEvent(subEvent.id, 'performanceDurationMax', '0');
                  }
                }}
                className="h-3 w-3 appearance-none border border-gray-300 rounded-none bg-white checked:bg-gray-300 checked:border-gray-400 relative checked:after:content-['✓'] checked:after:text-black checked:after:text-xs checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:leading-none"
              />
              <span className="text-xs text-black text-[12px]">N.A.</span>
            </label>
          </div>
        </div>

        {/* Rules */}
        <div className="grid grid-cols-[85px_1fr] items-start">
          <label className="text-sm text-black">Rules:</label>
          <div className="space-y-0.5">
            {subEvent.rules.map((rule, ruleIndex) => (
              <div key={ruleIndex} className="flex gap-1 items-center">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => updateRule(subEvent.id, ruleIndex, e.target.value)}
                  className="flex-1 h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal"
                  placeholder="Upto 250 characters"
                  maxLength={250}
                />
                {subEvent.rules.length > 1 && (
                  <button
                    onClick={() => setRuleDeleteConfirmation({subEventId: subEvent.id, ruleIndex: ruleIndex, show: true})}
                    className="h-5 w-5 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Minus size={10} />
                  </button>
                )}
                {ruleIndex === subEvent.rules.length - 1 && subEvent.rules.length < 5 && (
                  <button
                    onClick={() => addRule(subEvent.id)}
                    className="h-5 w-5 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Plus size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Entry Fees */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Entry Fees:</label>
          <select
            value={subEvent.entryFees || ''}
            onChange={(e) => updateSubEvent(subEvent.id, 'entryFees', e.target.value)}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", currentErrors.entryFees)}
          >
            <option value="" disabled hidden></option>
            {entryFeesOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Reg. Deadline */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Reg. Deadline:</label>
          <div className="flex gap-1 items-center justify-between">
            <div className="flex gap-1 items-center">
              <input
                type="date"
                value={subEvent.registrationDeadlineDate}
                onChange={(e) => {
                  updateSubEvent(subEvent.id, 'registrationDeadlineDate', e.target.value);
                  // Check for registration deadline warning after a brief delay to allow state update
                  setTimeout(() => {
                    const updatedSubEvent = { ...subEvent, registrationDeadlineDate: e.target.value };
                    checkRegistrationDeadlineWarning(updatedSubEvent);
                  }, 100);
                }}
                min={getCurrentDate()}
                max={subEvent.isSingleDate ? subEvent.startDate : (subEvent.endDate || subEvent.startDate)}
                className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-black w-28", currentErrors.regDeadline)}
                style={{ colorScheme: 'light' }}
                data-date={formatDateForDisplay(subEvent.registrationDeadlineDate)}
              />
              <div className="w-1"></div>
              <select
                value={subEvent.registrationDeadlineHour}
                onChange={(e) => {
                  updateSubEvent(subEvent.id, 'registrationDeadlineHour', e.target.value);
                  // Check for registration deadline warning after a brief delay to allow state update
                  setTimeout(() => {
                    const updatedSubEvent = { ...subEvent, registrationDeadlineHour: e.target.value };
                    checkRegistrationDeadlineWarning(updatedSubEvent);
                  }, 100);
                }}
                className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-none w-7", currentErrors.regDeadline)}
              >
                {generateNumberOptions(1, 12).map(hour => (
                  <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <span className="text-xs">:</span>
              <select
                value={subEvent.registrationDeadlineMinute}
                onChange={(e) => {
                  updateSubEvent(subEvent.id, 'registrationDeadlineMinute', e.target.value);
                  // Check for registration deadline warning after a brief delay to allow state update
                  setTimeout(() => {
                    const updatedSubEvent = { ...subEvent, registrationDeadlineMinute: e.target.value };
                    checkRegistrationDeadlineWarning(updatedSubEvent);
                  }, 100);
                }}
                className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-none w-7 scrollbar-hide", currentErrors.regDeadline)}
              >
                {generateNumberOptions(0, 59).map(minute => (
                  <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <select
              value={subEvent.registrationDeadlineAmPm}
              onChange={(e) => {
                updateSubEvent(subEvent.id, 'registrationDeadlineAmPm', e.target.value);
                // Check for registration deadline warning after a brief delay to allow state update
                setTimeout(() => {
                  const updatedSubEvent = { ...subEvent, registrationDeadlineAmPm: e.target.value };
                  checkRegistrationDeadlineWarning(updatedSubEvent);
                }, 100);
              }}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-tight w-8", currentErrors.regDeadline)}
            >
              <option value="am">am</option>
              <option value="pm">pm</option>
            </select>
          </div>
        </div>

        {/* OTSE */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">OTSE:</label>
          <select
            value={subEvent.otse}
            onChange={(e) => updateSubEvent(subEvent.id, 'otse', e.target.value)}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", currentErrors.otse)}
          >
            <option value="" disabled hidden></option>
            <option value="" disabled>On The Spot Entry</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Live Feed */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Live Feed:</label>
          <div className="h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-none flex items-center justify-end">
            <button
              onClick={() => handleActivateLiveFeed(subEvent.id)}
              className={`flex items-center gap-0.5 px-1 rounded text-xs transition-colors ${
                subEvent.activateLiveFeed 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Camera size={10} />
              {subEvent.activateLiveFeed ? 'Live' : 'Activate'}
            </button>
          </div>
        </div>



        {/* Delete and Results Controls */}
        <div className="flex items-center justify-between mt-1">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this sub-event?')) {
                showDeleteConfirmation(subEvent.id);
              }
            }}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-50 transition-colors ml-1"
            title="Delete Event"
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={() => setResultsModal({isOpen: true, subEventId: subEvent.id, subEventName: subEvent.eventType || `Sub Event-${subEventIndex + 1}`})}
            className="flex items-center gap-1 h-6 px-3 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Results
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-lg font-bold text-black mb-3">Add Main Event</h1>
      
      <div className="space-y-0.5">
        {/* College Name */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">College Name:</label>
          <input
            type="text"
            value={eventData.collegeName || ''}
            onChange={(e) => {
              setEventData(prev => ({ ...prev, collegeName: e.target.value }));
              if (e.target.value.trim()) clearMainFormError('collegeName');
            }}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", mainFormErrors.collegeName)}
            placeholder="College name will be auto-populated"
          />
        </div>

        {/* Event Name */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Main Event:</label>
          <input
            type="text"
            value={eventData.mainEventName || ''}
            onChange={(e) => {
              setEventData(prev => ({ ...prev, mainEventName: e.target.value }));
              if (e.target.value.trim()) clearMainFormError('mainEventName');
            }}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", mainFormErrors.mainEventName)}
            placeholder="Enter Event Name"
          />
        </div>

        {/* Address */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Address:</label>
          <input
            type="text"
            value={eventData.address || ''}
            onChange={(e) => {
              setEventData(prev => ({ ...prev, address: e.target.value }));
              if (e.target.value.trim()) clearMainFormError('address');
            }}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", mainFormErrors.address)}
            placeholder="Address will be auto-populated"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Location:</label>
          <input
            type="text"
            value={eventData.locality || ''}
            onChange={(e) => {
              setEventData(prev => ({ ...prev, locality: e.target.value }));
              if (e.target.value.trim()) clearMainFormError('locality');
            }}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", mainFormErrors.locality)}
            placeholder="Location will be auto-populated"
          />
        </div>

        {/* City */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">City:</label>
          <input
            type="text"
            value={eventData.city || ''}
            onChange={(e) => {
              setEventData(prev => ({ ...prev, city: e.target.value }));
              if (e.target.value.trim()) clearMainFormError('city');
            }}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", mainFormErrors.city)}
            placeholder="Enter city"
          />
        </div>

        {/* Pin Code */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Pin Code:</label>
          <input
            type="text"
            value={eventData.pinCode || ''}
            onChange={(e) => {
              setEventData(prev => ({ ...prev, pinCode: e.target.value }));
              if (e.target.value.trim()) clearMainFormError('pinCode');
            }}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", mainFormErrors.pinCode)}
            placeholder="Enter pin code"
          />
        </div>

        {/* Comp. Type */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Comp. Type:</label>
          <select
            value={eventData.competitionType || ''}
            onChange={(e) => {
              setEventData(prev => ({ ...prev, competitionType: e.target.value }));
              if (e.target.value.trim()) clearMainFormError('competitionType');
            }}
            className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal", mainFormErrors.competitionType)}
          >
            <option value="" disabled hidden></option>
            {competitionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Event Dt. */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Event Dt.:</label>
          <div className="flex gap-1 items-center">
            <input
              type="date"
              value={eventData.startDate || ''}
              onChange={(e) => {
                const newStartDate = e.target.value;
                setEventData(prev => {
                  const updated = { ...prev, startDate: newStartDate };
                  // Auto-populate end date with start date
                  if (newStartDate) {
                    updated.endDate = newStartDate;
                  }
                  return updated;
                });
                if (e.target.value.trim()) clearMainFormError('startDate');
              }}
              min={getCurrentDate()}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-black flex-1", mainFormErrors.startDate)}
              style={{ colorScheme: 'light' }}
              data-date={formatDateForDisplay(eventData.startDate)}
            />
            <span className="text-xs flex-shrink-0">to</span>
            <input
              type="date"
              value={eventData.endDate || ''}
              onChange={(e) => {
                setEventData(prev => ({ ...prev, endDate: e.target.value }));
                if (e.target.value.trim()) clearMainFormError('endDate');
              }}
              min={eventData.startDate || getCurrentDate()}
              className={getInputClassName("h-6 px-1 bg-transparent border border-gray-300 rounded text-black flex-1", mainFormErrors.endDate)}
              style={{ colorScheme: 'light' }}
              data-date={formatDateForDisplay(eventData.endDate)}
            />
          </div>
        </div>

        {/* Add space before Sub Event-1 */}
        <div className="mt-2"></div>

        {/* Add Sub Event-1 button when no sub events exist */}
        {subEvents.length === 0 && (
          <div className="mt-1">
            <button
              onClick={() => {
                addSubEvent();
              }}
              className="flex items-center gap-1 h-6 px-2 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Plus size={12} />
              Add Sub Event 1
            </button>
          </div>
        )}

        {/* Sub Event-1 Details Section - Always show when it exists */}
        {subEvents.length > 0 && (
          <div className="border border-gray-300 rounded p-1 mt-1">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span className="text-sm font-semibold text-black">
                  {subEvents[0]?.eventType ? subEvents[0].eventType : 'Sub Event-1'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Active/Inactive Swipe Button */}
                <div className="flex items-center">
                  <button
                    onClick={() => toggleSubEventActive(subEvents[0].id)}
                    className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                      subEvents[0].isActive ? 'bg-gray-400' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        subEvents[0].isActive ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className="ml-1 text-xs text-gray-700">
                    {subEvents[0].isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  onClick={() => toggleSubEventCollapse(subEvents[0].id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {collapsedSubEvents.has(subEvents[0].id) ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                </button>
              </div>
            </div>

            {!collapsedSubEvents.has(subEvents[0].id) && renderEventDetails(subEvents[0], 0)}
          </div>
        )}

        {/* Add Sub Event-2 button - Only show when there's only 1 sub event */}
        {subEvents.length === 1 && (
          <div className="mt-1">
            <button
              onClick={addSubEvent}
              className="flex items-center gap-1 h-6 px-2 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Plus size={12} />
              Add Sub Event-2
            </button>
          </div>
        )}

        {/* Sub-events rendering (starting from Sub Event-2) */}
        {subEvents.slice(1).map((subEvent, subEventIndex) => (
          <div key={subEvent.id}>
            <div className="border border-gray-300 rounded p-1 mt-1">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span className="text-sm font-semibold text-black">
                    {subEvent.eventType ? subEvent.eventType : `Sub Event-${subEventIndex + 2}`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Active/Inactive Swipe Button */}
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleSubEventActive(subEvent.id)}
                      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                        subEvent.isActive ? 'bg-gray-400' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          subEvent.isActive ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className="ml-1 text-xs text-gray-700">
                      {subEvent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSubEventCollapse(subEvent.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {collapsedSubEvents.has(subEvent.id) ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  </button>
                </div>
              </div>

              {!collapsedSubEvents.has(subEvent.id) && renderEventDetails(subEvent, subEventIndex + 1)}
            </div>

            {/* Add Next Event Button */}
            {!collapsedSubEvents.has(subEvent.id) && subEventIndex === subEvents.slice(1).length - 1 && (
              <div className="mt-1">
                <button
                  onClick={addSubEvent}
                  className="flex items-center gap-1 h-6 px-2 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Plus size={12} />
                  Add Sub Event-{subEvents.length + 1}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Organizing Committee */}
        <div className="border border-gray-300 rounded px-0 py-1 mt-1">
          <div className="flex items-center gap-1 mb-0.5 px-0.5">
            <Users size={12} />
            <span className="text-sm font-semibold text-black">Organizing Committee</span>
          </div>

          <div className="space-y-1 px-0.5">
            {organizingCommittee.map((member, index) => (
              <div key={index} className="space-y-0.5">
                {/* 4 Single Lines with Labels */}
                <div className="space-y-0.5">
                  {/* Name */}
                  <div className="grid grid-cols-[85px_1fr] items-center">
                    <label className="text-sm text-black">Name:</label>
                    <input
                      type="text"
                      value={member.isFirstMember ? userProfile.name : (member.name || '')}
                      onChange={(e) => updateCommitteeMember(index, 'name', e.target.value)}
                      className="h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal"
                      placeholder={member.isFirstMember ? "" : "Enter name"}
                      disabled={member.isFirstMember}
                    />
                  </div>
                  
                  {/* Department */}
                  <div className="grid grid-cols-[85px_1fr] items-center">
                    <label className="text-sm text-black">Department:</label>
                    <select
                      value={member.designation || ''}
                      onChange={(e) => updateCommitteeMember(index, 'designation', e.target.value)}
                      className="h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal"
                      required
                    >
                      <option value="" disabled hidden></option>
                      <option value="Cultural">Cultural</option>
                      <option value="Events">Events</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Public Relations">Public Relations</option>
                      <option value="Sponsorship">Sponsorship</option>
                      <option value="Hospitality">Hospitality</option>
                    </select>
                  </div>
                  
                  {/* Phone No. */}
                  <div className="grid grid-cols-[85px_1fr] items-center">
                    <label className="text-sm text-black">Phone No.:</label>
                    <input
                      type="tel"
                      value={member.isFirstMember ? userProfile.phone : (member.phone || '')}
                      onChange={(e) => updateCommitteeMember(index, 'phone', e.target.value)}
                      className="h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal"
                      placeholder={member.isFirstMember ? "" : "Enter phone number"}
                      disabled={member.isFirstMember}
                    />
                  </div>
                  
                  {/* Email id */}
                  <div className="grid grid-cols-[85px_1fr] items-center">
                    <label className="text-sm text-black">Email id:</label>
                    <input
                      type="email"
                      value={member.isFirstMember ? userProfile.email : (member.email || '')}
                      onChange={(e) => updateCommitteeMember(index, 'email', e.target.value)}
                      className="h-6 px-1 bg-transparent border border-gray-300 rounded text-sm text-black leading-normal"
                      placeholder={member.isFirstMember ? "" : "Enter email address"}
                      disabled={member.isFirstMember}
                    />
                  </div>
                </div>

                {!member.isFirstMember && (
                  <div className="flex gap-1 justify-between items-center">
                    <button
                      onClick={() => sendOTP(index)}
                      disabled={member.otpVerified}
                      className={`h-6 px-2 rounded text-xs transition-colors ${
                        member.otpVerified
                          ? 'bg-green-100 border border-green-300 text-green-700'
                          : 'bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {member.otpVerified ? '✓ Verified' : 'Send OTP'}
                    </button>
                    {/* Delete button - only show if there are 2+ members and this is not the first member */}
                    {organizingCommittee.length >= 2 && !member.isFirstMember && (
                      <button
                        onClick={() => setMemberDeleteConfirmation({memberIndex: index, show: true})}
                        className="h-5 w-5 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <Minus size={10} />
                      </button>
                    )}
                  </div>
                )}

                {index < organizingCommittee.length - 1 && (
                  <div className="border-t border-gray-200 mt-1 pt-1" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-1 px-0.5">
            <button
              onClick={addCommitteeMember}
              className="flex items-center gap-1 h-6 px-2 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Plus size={12} />
              Add Member
            </button>
          </div>
        </div>

        {/* Save Button and Back to Home */}
        <div className="mt-3 flex flex-col items-center gap-2">
          <button
            onClick={handleSave}
            className="h-6 px-3 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center justify-center self-end"
          >
            Save
          </button>
          <button
            onClick={() => navigate('home')}
            className="mt-6 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition-colors self-start"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm mx-4 shadow-lg">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-black mb-2">Delete Event</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete this event? This action cannot be undone.</p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={hideDeleteConfirmation}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmDeleteSubEvent}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rule Delete Confirmation Modal */}
      {ruleDeleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm mx-4 shadow-lg">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-black mb-2">Delete Rule</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete this rule? This action cannot be undone.</p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRuleDeleteConfirmation({subEventId: '', ruleIndex: -1, show: false})}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => removeRule(ruleDeleteConfirmation.subEventId, ruleDeleteConfirmation.ruleIndex)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Delete Confirmation Modal */}
      {memberDeleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm mx-4 shadow-lg">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-black mb-2">Delete Member</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete this member? This action cannot be undone.</p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setMemberDeleteConfirmation({memberIndex: -1, show: false})}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  removeCommitteeMember(memberDeleteConfirmation.memberIndex);
                  setMemberDeleteConfirmation({memberIndex: -1, show: false});
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      <ResultsModal
        isOpen={resultsModal.isOpen}
        onClose={() => setResultsModal({isOpen: false})}
        subEventId={resultsModal.subEventId}
        subEventName={resultsModal.subEventName}
        subEventStartDate={resultsModal.subEventId ? subEvents.find(se => se.id === resultsModal.subEventId)?.startDate : undefined}
      />

      {/* OTP Modal */}
      <OTPModal
        isOpen={otpModal.isOpen}
        onClose={() => setOTPModal({isOpen: false, memberIndex: -1})}
        memberIndex={otpModal.memberIndex}
        onOTPSent={handleOTPSent}
      />
    </div>
  );
}

// Utility functions
const generateParticipantOptions = (start: number, end: number) => {
  const options = [];
  // Skip 0 - start from 1 or the specified start value
  for (let i = Math.max(start, 1); i <= end; i++) {
    options.push(i.toString());
  }
  return options;
};

const generateNumberOptions = (start: number, end: number) => {
  const options = [];
  for (let i = start; i <= end; i++) {
    options.push(i.toString());
  }
  return options;
};