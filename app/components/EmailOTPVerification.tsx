import React, { useState } from 'react';
import { useOkto, type OktoContextType } from 'okto-sdk-react';

interface EmailOTPVerificationProps {
  onVerificationSuccess?: () => void;
  onVerificationError?: (error: Error) => void;
}

export const EmailOTPVerification: React.FC<EmailOTPVerificationProps> = ({
  onVerificationSuccess,
  onVerificationError,
}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const { sendEmailOTP, verifyEmailOTP } = useOkto() as OktoContextType;

  const validateEmail = (e: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  };

  const handleSendOTP = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await sendEmailOTP(email);
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
      const success = await verifyEmailOTP(
        email,
        otp,
        otpToken!,
      );
      if (success) {
        onVerificationSuccess?.();
        alert('Email verified successfully');
        setStep('email');
      } else {
        alert('Invalid OTP');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(errorMessage);
      onVerificationError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      {step === 'email' ? (
        <>
          <input
            className="h-12 w-full border border-gray-300 rounded-lg px-4 mb-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            type="email"
            disabled={loading}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            className={`h-12 w-full rounded-lg justify-center items-center mt-2 text-white font-semibold
              ${loading || !email ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-600'}`}
            onClick={handleSendOTP}
            disabled={loading || !email}
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
              setOtp(e.target.value);
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
              setStep('email');
              setOtp('');
              setError(null);
            }}
          >
            Change Email / Resend OTP
          </button>
        </>
      )}
    </div>
  );
};