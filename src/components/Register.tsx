import React, { useState } from 'react';
import type { Screen } from '../App';

interface RegisterProps {
  navigate: (screen: Screen) => void;
}

export function Register({ navigate }: RegisterProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    collegeName: '',
    eventName: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState({
    phone: false
  });

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      // Only allow numbers and limit to 10 digits
      const numbersOnly = value.replace(/[^0-9]/g, '');
      const limitedValue = numbersOnly.slice(0, 10);
      
      setFormData(prev => ({
        ...prev,
        [field]: limitedValue
      }));
      
      // Clear phone error if user starts typing
      if (errors.phone) {
        setErrors(prev => ({
          ...prev,
          phone: false
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = () => {
    // Validate phone number
    if (formData.phone.length < 10) {
      setErrors(prev => ({
        ...prev,
        phone: true
      }));
      return;
    }
    
    // Here you would typically submit to a backend
    alert('Registration submitted successfully!');
    navigate('home');
  };

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-lg font-bold text-black mb-6">Register (Participation)</h1>
      
      <div className="space-y-4">
        {/* Full Name */}
        <div className="w-full h-11 bg-gray-100 border border-gray-300 rounded-lg px-3 flex items-center">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full bg-transparent text-sm text-black outline-none"
          />
        </div>

        {/* College Name */}
        <div className="w-full h-11 bg-gray-100 border border-gray-300 rounded-lg px-3 flex items-center">
          <input
            type="text"
            placeholder="College Name"
            value={formData.collegeName}
            onChange={(e) => handleInputChange('collegeName', e.target.value)}
            className="w-full bg-transparent text-sm text-black outline-none"
          />
        </div>

        {/* Event Name */}
        <div className="w-full h-11 bg-gray-100 border border-gray-300 rounded-lg px-3 flex items-center">
          <input
            type="text"
            placeholder="Event Name"
            value={formData.eventName}
            onChange={(e) => handleInputChange('eventName', e.target.value)}
            className="w-full bg-transparent text-sm text-black outline-none"
          />
        </div>

        {/* Mobile Number */}
        <div className={`w-full h-11 bg-gray-100 border rounded-lg px-3 flex items-center ${
          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}>
          <input
            type="tel"
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full bg-transparent text-sm text-black outline-none placeholder-black"
            maxLength={10}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">Mobile number must be exactly 10 digits</p>
        )}

        {/* Email */}
        <div className="w-full h-11 bg-gray-100 border border-gray-300 rounded-lg px-3 flex items-center">
          <input
            type="email"
            placeholder="E‑mail id (confirmation will be sent)"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full bg-transparent text-sm text-black outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full h-11 bg-gray-200 border border-gray-400 rounded-lg font-semibold text-sm text-black hover:bg-gray-300 transition-colors"
        >
          Submit Registration
        </button>
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