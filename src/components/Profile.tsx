import React, { useState, useEffect, useRef } from 'react';
import type { Screen } from '../App';
import { AISHECollegeDropdown } from './AISHECollegeDropdown';

interface ProfileProps {
  navigate: (screen: Screen) => void;
  onEmailUpdate?: (email: string) => void;
  onNameUpdate?: (name: string) => void;
  onPhoneUpdate?: (phone: string) => void;
  onProfileDataUpdate?: (profileData: {
    collegeName: string;
    collegeAddress: string;
    collegeLocality: string;
    city: string;
    pincode: string;
    academicYear: string;
    stream: string;
  }) => void;
  savedEmail?: string;
  savedName?: string;
  savedPhone?: string;
  savedProfileData?: {
    collegeName: string;
    collegeAddress: string;
    collegeLocality: string;
    city: string;
    pincode: string;
    academicYear: string;
    stream: string;
  };
  isInitialSetup?: boolean;
  onSetupComplete?: () => void;
  onSignOut?: () => void;
}

export function Profile({ 
  navigate, 
  onEmailUpdate, 
  onNameUpdate,
  onPhoneUpdate,
  onProfileDataUpdate,
  savedEmail, 
  savedName,
  savedPhone,
  savedProfileData,
  isInitialSetup = false,
  onSetupComplete,
  onSignOut
}: ProfileProps) {
  const [profileData, setProfileData] = useState({
    name: savedName || '',
    phone: savedPhone || '',
    collegeName: savedProfileData?.collegeName || '',
    collegeAddress: savedProfileData?.collegeAddress || '',
    collegeLocality: savedProfileData?.collegeLocality || '',
    city: savedProfileData?.city || '',
    pincode: savedProfileData?.pincode || '',
    academicYear: savedProfileData?.academicYear || '',
    stream: savedProfileData?.stream || '',
    email: savedEmail || ''
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    collegeName: '',
    collegeAddress: '',
    collegeLocality: '',
    city: '',
    pincode: '',
    academicYear: '',
    stream: '',
    email: ''
  });

  const [isAcademicDropdownOpen, setIsAcademicDropdownOpen] = useState(false);
  const [isStreamDropdownOpen, setIsStreamDropdownOpen] = useState(false);

  
  // OTP related states
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  const academicDropdownRef = useRef<HTMLDivElement>(null);
  const streamDropdownRef = useRef<HTMLDivElement>(null);


  const academicYearOptions = [
    '11th Std',
    '12th Std', 
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year',
    'Post Graduate',
    'Admin. Department',
    'Faculty'
  ];

  const streamOptions = [
    'Science',
    'Commerce',
    'Arts',
    'Engineering',
    'Media',
    'Management',
    'Hospitality',
    'Architecture',
    'Faculty'
  ];



  // OTP countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Generate and send OTP
  const generateAndSendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    setGeneratedOtp(newOtp);
    
    // Simulate SMS sending (in real app, this would call SMS API)
    console.log(`SMS sent to ${profileData.phone}: Your Zhevents OTP is ${newOtp}`);
    alert(`OTP sent to ${profileData.phone}: ${newOtp}\n(This is a demo - in real app, you'd receive actual SMS)`);
    
    setResendCountdown(30); // 30 second countdown for resend
  };

  // Validation functions
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Please enter a valid name';
        // Check for single word (no spaces in trimmed value)
        const trimmedName = value.trim();
        if (trimmedName.indexOf(' ') === -1) return 'Please enter your full name (first and last name)';
        return '';
        
      case 'phone':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^\d+$/.test(value)) return 'Only numbers are allowed';
        if (value.length !== 10) return 'Please enter a valid 10-digit number';
        // Check if all digits are the same (prevent single digit repetition)
        if (value.length === 10 && /^(\d)\1{9}$/.test(value)) {
          return 'Please enter a valid mobile number (cannot be all same digits)';
        }
        return '';
        
      case 'collegeName':
        if (!value.trim()) return 'College name is required';
        return '';
        
      case 'collegeAddress':
        if (!value.trim()) return 'Address is required';
        return '';
        
      case 'collegeLocality':
        if (!value.trim()) return 'College locality is required';
        return '';
        
      case 'city':
        if (!value.trim()) return 'City is required';
        return '';
        
      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        if (!/^\d{6}$/.test(value)) return 'Please enter a valid 6-digit pincode';
        return '';
        
      case 'academicYear':
        if (!value.trim()) return 'This field is required';
        return '';
        
      case 'stream':
        if (!value.trim()) return 'Please specify your stream or department';
        return '';
        
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!value.includes('@')) return 'Email must contain @ symbol';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email (e.g., name@example.com)';
        return '';
        
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Special handling for phone field - only allow numbers
    if (field === 'phone') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setProfileData(prev => ({ ...prev, [field]: numbersOnly }));
      
      // Real-time validation
      const error = validateField(field, numbersOnly);
      setErrors(prev => ({ ...prev, [field]: error }));
    } 
    // Special handling for pincode field - only allow numbers and limit to 6 digits
    else if (field === 'pincode') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      const limitedValue = numbersOnly.slice(0, 6);
      setProfileData(prev => ({ ...prev, [field]: limitedValue }));
      
      // Real-time validation
      const error = validateField(field, limitedValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    } 
    // Special handling for email field - require @ symbol
    else if (field === 'email') {
      setProfileData(prev => ({ ...prev, [field]: value }));
      
      // Real-time validation with @ requirement
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
      
      // Update email in parent component when email field changes
      if (onEmailUpdate) {
        onEmailUpdate(value);
      }
    }
    else {
      setProfileData(prev => ({ ...prev, [field]: value }));
      
      // Real-time validation
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleAcademicSelect = (value: string) => {
    handleInputChange('academicYear', value);
    setIsAcademicDropdownOpen(false);
  };

  const handleStreamSelect = (value: string) => {
    handleInputChange('stream', value);
    setIsStreamDropdownOpen(false);
  };



  const handleSubmit = () => {
    // Determine which fields to validate based on user state
    let fieldsToValidate;
    if (isInitialSetup) {
      // For initial setup, skip email and phone validation (already provided)
      fieldsToValidate = ['name', 'collegeName', 'collegeAddress', 'collegeLocality', 'city', 'pincode', 'academicYear', 'stream'];
    } else if (isExistingUserProfile) {
      // For existing users, skip phone and email validation (phone already verified, email read-only)
      fieldsToValidate = ['name', 'collegeName', 'collegeAddress', 'collegeLocality', 'city', 'pincode', 'academicYear', 'stream'];
    } else {
      // For new account registration, validate all fields
      fieldsToValidate = ['name', 'phone', 'collegeName', 'collegeAddress', 'collegeLocality', 'city', 'pincode', 'academicYear', 'stream', 'email'];
    }

    const newErrors: any = {};
    fieldsToValidate.forEach(field => {
      newErrors[field] = validateField(field, profileData[field as keyof typeof profileData]);
    });

    setErrors(prev => ({ ...prev, ...newErrors }));

    // Special case: Check for single word name and show specific popup
    const trimmedName = profileData.name.trim();
    if (trimmedName && trimmedName.indexOf(' ') === -1) {
      alert('Please enter your full name including both first and last name.\n\nExample: "John Smith" instead of just "John"');
      return;
    }

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      return; // Don't submit if there are errors
    }

    if (isInitialSetup) {
      // For initial setup, skip OTP and complete profile immediately
      completeProfileSetup();
    } else if (isExistingUserProfile) {
      // For existing users, update profile without OTP (phone already verified)
      completeProfileSetup();
      alert('Profile updated successfully!');
    } else {
      // For new account registration, generate and send OTP, then show OTP screen
      generateAndSendOtp();
      setShowOtpScreen(true);
    }
  };

  const handleOtpSubmit = () => {
    if (!otp.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }

    if (otp !== generatedOtp) {
      setOtpError('Invalid OTP. Please check and try again.');
      return;
    }

    // OTP verified successfully - complete registration
    setOtpError('');
    
    // Save email for auto-email functionality
    if (onEmailUpdate) {
      onEmailUpdate(profileData.email);
    }
    
    alert('Phone number verified successfully! Account registered. You will receive participant lists automatically after registration deadlines.');
    navigate('org_dashboard');
  };

  const completeProfileSetup = () => {
    // Update parent components
    if (onNameUpdate) {
      onNameUpdate(profileData.name);
    }
    if (onEmailUpdate) {
      onEmailUpdate(profileData.email);
    }
    if (onPhoneUpdate) {
      onPhoneUpdate(profileData.phone);
    }
    if (onProfileDataUpdate) {
      onProfileDataUpdate({
        collegeName: profileData.collegeName,
        collegeAddress: profileData.collegeAddress,
        collegeLocality: profileData.collegeLocality,
        city: profileData.city,
        pincode: profileData.pincode,
        academicYear: profileData.academicYear,
        stream: profileData.stream
      });
    }
    
    // Complete setup
    if (onSetupComplete) {
      onSetupComplete();
    }
  };

  const handleResendOtp = () => {
    if (resendCountdown > 0) return;
    
    setIsResendingOtp(true);
    setTimeout(() => {
      generateAndSendOtp();
      setIsResendingOtp(false);
      setOtp(''); // Clear current OTP input
      setOtpError(''); // Clear any error
    }, 1000);
  };

  const handleBackFromOtp = () => {
    setShowOtpScreen(false);
    setOtp('');
    setOtpError('');
    setGeneratedOtp('');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (academicDropdownRef.current && !academicDropdownRef.current.contains(event.target as Node)) {
        setIsAcademicDropdownOpen(false);
      }
      if (streamDropdownRef.current && !streamDropdownRef.current.contains(event.target as Node)) {
        setIsStreamDropdownOpen(false);
      }

    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Render OTP verification screen
  if (showOtpScreen) {
    return (
      <div className="w-full min-h-screen bg-white p-4">
        <h1 className="text-lg font-bold text-black mb-6">Phone Verification</h1>
        
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              We've sent a 6-digit OTP to <strong>{profileData.phone}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Please enter the OTP below to verify your phone number
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-4">
            <div className="w-full h-11 bg-gray-100 border border-gray-300 rounded-lg px-3 flex items-center">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only numbers
                  if (value.length <= 6) {
                    setOtp(value);
                    setOtpError(''); // Clear error when user types
                  }
                }}
                className="w-full bg-transparent text-sm text-black outline-none placeholder-black text-center tracking-widest"
                style={{ color: 'black' }}
                maxLength={6}
              />
            </div>
            {otpError && (
              <div className="text-red-500 text-xs mt-1 px-3">{otpError}</div>
            )}
          </div>

          {/* Verify Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleOtpSubmit}
              className="px-8 py-2 bg-green-500 border border-green-600 rounded-lg font-semibold text-sm text-white hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              Verify & Register
            </button>
          </div>

          {/* Resend OTP */}
          <div className="text-center mb-6">
            {resendCountdown > 0 ? (
              <p className="text-sm text-gray-600">
                Resend OTP in {resendCountdown}s
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isResendingOtp}
                className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
              >
                {isResendingOtp ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBackFromOtp}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
        >
          ← Back to Registration
        </button>
      </div>
    );
  }

  // Determine if this is an existing user viewing their profile
  const isExistingUserProfile = !isInitialSetup && savedEmail && savedName && savedPhone;
  
  // Render main registration form
  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-lg font-bold text-black mb-6">
        {isInitialSetup ? 'Complete Your Profile' : (isExistingUserProfile ? 'Account / Profile' : 'Account Registration')}
      </h1>
      
      <div className="space-y-4 mb-6">
        {/* Name */}
        <div>
          <div className={`w-full h-11 rounded-lg px-3 flex items-center ${
            errors.name ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
          }`}>
            <input
              type="text"
              placeholder="Full Name"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-transparent text-sm text-black outline-none placeholder-black"
              style={{ color: 'black' }}
            />
          </div>
        </div>

        {/* Phone Number - Only show if not initial setup AND not existing user viewing profile */}
        {!isInitialSetup && !isExistingUserProfile && (
          <div>
            <div className={`w-full h-11 rounded-lg px-3 flex items-center ${
              errors.phone ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
            }`}>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-transparent text-sm text-black outline-none placeholder-black"
                style={{ color: 'black' }}
                maxLength={10}
              />
            </div>
          </div>
        )}

        {/* College Name - AISHE Enhanced Dropdown */}
        <div>
          <AISHECollegeDropdown
            value={profileData.collegeName}
            onChange={(value) => handleInputChange('collegeName', value)}
            placeholder="College Name"
            error={errors.collegeName}
          />
        </div>

        {/* College Address */}
        <div>
          <div className={`w-full h-11 rounded-lg px-3 flex items-center ${
            errors.collegeAddress ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
          }`}>
            <input
              type="text"
              placeholder="College Address"
              value={profileData.collegeAddress}
              onChange={(e) => handleInputChange('collegeAddress', e.target.value)}
              className="w-full bg-transparent text-sm text-black outline-none placeholder-black"
              style={{ color: 'black' }}
            />
          </div>
        </div>

        {/* College Locality */}
        <div>
          <div className={`w-full h-11 rounded-lg px-3 flex items-center ${
            errors.collegeLocality ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
          }`}>
            <input
              type="text"
              placeholder="College Location/Area"
              value={profileData.collegeLocality}
              onChange={(e) => handleInputChange('collegeLocality', e.target.value)}
              className="w-full bg-transparent text-sm text-black outline-none placeholder-black"
              style={{ color: 'black' }}
            />
          </div>
        </div>

        {/* City */}
        <div>
          <div className={`w-full h-11 rounded-lg px-3 flex items-center ${
            errors.city ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
          }`}>
            <input
              type="text"
              placeholder="City of College"
              value={profileData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full bg-transparent text-sm text-black outline-none placeholder-black"
              style={{ color: 'black' }}
            />
          </div>
        </div>

        {/* Pincode */}
        <div>
          <div className={`w-full h-11 rounded-lg px-3 flex items-center ${
            errors.pincode ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
          }`}>
            <input
              type="text"
              placeholder="Pincode"
              value={profileData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              className="w-full bg-transparent text-sm text-black outline-none placeholder-black"
              style={{ color: 'black' }}
              maxLength={6}
            />
          </div>
        </div>

        {/* Academic Year / Admin Dept - Dropdown */}
        <div>
          <div className="relative" ref={academicDropdownRef}>
            <div 
              className={`w-full h-11 rounded-lg px-3 flex items-center cursor-pointer ${
                errors.academicYear ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
              }`}
              onClick={() => setIsAcademicDropdownOpen(!isAcademicDropdownOpen)}
            >
              <span className={`text-sm ${profileData.academicYear ? 'text-black' : 'text-black opacity-70'}`}>
                {profileData.academicYear || 'Academic year / Admi. Department'}
              </span>
            </div>
            {isAcademicDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-80 overflow-hidden">
                {academicYearOptions.map((option, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAcademicSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Academic Stream - Dropdown with custom input */}
        <div>
          <div className="relative" ref={streamDropdownRef}>
            <div className={`w-full h-11 rounded-lg px-3 flex items-center ${
              errors.stream ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
            }`}>
              <input
                type="text"
                placeholder="Academic Stream"
                value={profileData.stream}
                onChange={(e) => handleInputChange('stream', e.target.value)}
                onFocus={() => setIsStreamDropdownOpen(true)}
                className="w-full bg-transparent text-sm text-black outline-none placeholder-black"
                style={{ color: 'black' }}
              />
            </div>
            {isStreamDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-hidden">
                {streamOptions.map((option, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStreamSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email - Show if not initial setup, read-only for existing users */}
        {!isInitialSetup && (
          <div>
            <div className={`w-full h-11 rounded-lg px-3 flex items-center ${
              errors.email ? 'bg-transparent border border-red-300' : 'bg-transparent border border-gray-300'
            }`}>
              <input
                type="email"
                placeholder="Email-id"
                value={profileData.email}
                onChange={isExistingUserProfile ? undefined : (e) => handleInputChange('email', e.target.value)}
                readOnly={isExistingUserProfile}
                className={`w-full bg-transparent text-sm text-black outline-none placeholder-black ${
                  isExistingUserProfile ? 'cursor-not-allowed opacity-75' : ''
                }`}
                style={{ color: 'black' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button - Smaller and centered */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleSubmit}
          className={`px-8 py-2 border rounded-lg font-semibold text-sm transition-colors flex items-center justify-center ${
            isInitialSetup 
              ? 'bg-gray-200 text-black border-gray-300 hover:bg-gray-300'
              : isExistingUserProfile
              ? 'bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-200'
              : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
          }`}
        >
          {isInitialSetup ? 'Complete Setup' : isExistingUserProfile ? 'Update Profile' : 'Submit'}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Back Button - Different behavior for initial setup */}
        {!isInitialSetup && (
          <button
            onClick={() => navigate('org_dashboard')}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
          >
            ← Back to Dashboard
          </button>
        )}
        
        {/* Sign Out Button */}
        {onSignOut && (
          <div className="flex justify-center">
            <button
              onClick={onSignOut}
              className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-xs"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}