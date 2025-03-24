import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Link from 'next/link';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
            setEmail(''); // Clear the email field after successful submission
        } catch (err) {
            let errorMessage = 'Failed to send reset email';

            // Customize error messages based on Firebase error codes
            if (err.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please try again later.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-yellow-900">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white">WakeRooms</h1>
            </div>

            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Your Password</h2>
                <p className="text-center text-gray-600 mb-8">Enter your email and we'll send you instructions to reset your password.</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Remember your password?{' '}
                        <Link href="/login" className="text-yellow-600 hover:text-yellow-800 font-medium">
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full max-w-md text-center mt-6">
                <p className="text-yellow-100 text-sm">
                    &copy; {new Date().getFullYear()} WakeRooms | <a href="/privacy-policy" className="text-yellow-200 hover:text-white">Privacy Policy</a> | <a href="/terms-of-service" className="text-yellow-200 hover:text-white">Terms of Service</a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;