import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  phone: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export function OTPVerification({ email, phone, onVerificationComplete, onBack }: OTPVerificationProps) {
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Start countdown for resend button
  useEffect(() => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOTPChange = (value: string) => {
    // Only allow numeric input and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setOTP(numericValue);
    if (error && numericValue.length > 0) {
      setError('');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate OTP verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, accept "123456" as valid OTP
    if (otp === '123456') {
      onVerificationComplete();
    } else {
      setError('Invalid OTP. Please try again.');
    }
    
    setIsVerifying(false);
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');
    
    // Simulate resend delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsResending(false);
    setResendCooldown(30);
    
    // Restart countdown
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show success message
    alert('OTP sent successfully!');
  };

  const maskedPhone = phone.slice(0, 2) + 'XXXX' + phone.slice(-2);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="text-black p-4 flex items-center">
        <button 
          onClick={onBack}
          className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">OTP Verification</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
          <p className="text-gray-600">
            We've sent a 6-digit code to
          </p>
          <p className="font-semibold text-gray-900">+91 {maskedPhone}</p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => handleOTPChange(e.target.value)}
              className={`w-48 h-14 text-center text-2xl font-bold bg-gray-50 border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg tracking-widest placeholder-black`}
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          {/* Demo Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-800 text-sm text-center">
              <strong>Demo:</strong> Use <span className="font-mono font-bold">123456</span> as OTP
            </p>
          </div>

          {/* Verify Button */}
          <div className="flex justify-center">
            <button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || isVerifying}
              className={`px-6 py-2 rounded-lg font-medium transition-colors text-sm ${
                otp.length === 6 && !isVerifying
                  ? 'bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
              }`}
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>
        </div>

        {/* Resend Section */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
          
          {resendCooldown > 0 ? (
            <p className="text-gray-500 text-sm">
              Resend OTP in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}