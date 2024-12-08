import React, { useState } from 'react';
import { useOkto, type OktoContextType } from 'okto-sdk-react';

interface PhoneOTPVerificationProps {
  onVerificationSuccess?: () => void;
  onVerificationError?: (error: Error) => void;
}

export const PhoneOTPVerification: React.FC<PhoneOTPVerificationProps> = ({
  onVerificationSuccess,
  onVerificationError,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('IN'); // Default to India
  const [otp, setOtp] = useState('');
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const { sendPhoneOTP, verifyPhoneOTP } = useOkto() as OktoContextType;

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/; // Basic validation for 10 digits
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async () => {
    if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await sendPhoneOTP(phoneNumber, countryCode);
      setOtpToken(response.token);
      setStep('otp');
      alert('OTP sent successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
      console.error('Send OTP Error:', err);
      alert(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const success = await verifyPhoneOTP(
        phoneNumber,
        countryCode,
        otp,
        otpToken!
      );
      if (success) {
        onVerificationSuccess?.();
        alert('Phone number verified successfully');
        setStep('phone');
      } else {
        alert('Invalid OTP');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(errorMessage);
      onVerificationError?.(err instanceof Error ? err : new Error(errorMessage));
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      {step === 'phone' ? (
        <>
          <div className="flex gap-2 mb-2">
            <input
              className="h-12 w-20 border border-gray-300 rounded-lg px-4 text-base bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 uppercase"
              placeholder="IN"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              maxLength={2}
              type="text"
            />
            <input
              className="h-12 flex-1 border border-gray-300 rounded-lg px-4 text-base bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''));
                setError(null);
              }}
              type="tel"
              maxLength={10}
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            className={`h-12 w-full rounded-lg justify-center items-center mt-2 text-white font-semibold
              ${loading || !phoneNumber || !countryCode ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-600'}`}
            onClick={handleSendOTP}
            disabled={loading || !phoneNumber || !countryCode}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"/>
            ) : (
              'Send OTP'
            )}
          </button>
        </>
      ) : (
        <>
          <input
            className="h-12 w-full border border-gray-300 rounded-lg px-4 mb-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/[^0-9]/g, ''));
              setError(null);
            }}
            type="number"
            maxLength={6}
            disabled={loading}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            className={`h-12 w-full rounded-lg justify-center items-center mt-2 text-white font-semibold
              ${loading || !otp ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-600'}`}
            onClick={handleVerifyOTP}
            disabled={loading || !otp}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"/>
            ) : (
              'Verify OTP'
            )}
          </button>

          <button
            className="mt-4 p-2 w-full text-violet-500 text-sm font-medium hover:text-violet-600"
            onClick={() => {
              setStep('phone');
              setOtp('');
              setError(null);
            }}
          >
            Change Number / Resend OTP
          </button>
        </>
      )}
    </div>
  );
};