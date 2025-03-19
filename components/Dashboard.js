import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AnnouncementsList from '../components/AnnouncementsList';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeSlotActive, setTimeSlotActive] = useState(false);
    const [timeSlotInfo, setTimeSlotInfo] = useState(null);
    const router = useRouter();

    // Helper function to check if preferences are completely filled out
    const hasCompletePreferences = (user) => {
        // Check if preferences object exists
        if (!user?.preferences) return false;

        // Check if required preference fields have values
        const { floorPreference, roomType } = user.preferences;

        // Check if the specific preference fields have actual values
        return floorPreference && roomType &&
            typeof floorPreference === 'string' && floorPreference.trim() !== '' &&
            typeof roomType === 'string' && roomType.trim() !== '';
    };

    // Check if the current time is within the user's time slot
    const checkTimeSlot = (timeSlot) => {
        if (!timeSlot) return false;

        const now = new Date();
        const startTime = new Date(timeSlot.startTime);
        const endTime = new Date(timeSlot.endTime);

        return now >= startTime && now <= endTime;
    };

    // Calculate time remaining in time slot
    const getTimeRemaining = (endTime) => {
        const now = new Date();
        const end = new Date(endTime);
        const diffMs = end - now;

        if (diffMs <= 0) return "Time slot expired";

        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${diffHrs} hr${diffHrs !== 1 ? 's' : ''} ${diffMins} min${diffMins !== 1 ? 's' : ''} remaining`;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                // Get user data from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', authUser.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            uid: authUser.uid,
                            email: authUser.email,
                            ...userData
                        });

                        // Check if user has an active time slot
                        if (userData.timeSlot) {
                            const isActive = checkTimeSlot(userData.timeSlot);
                            setTimeSlotActive(isActive);
                            setTimeSlotInfo(userData.timeSlot);
                        }
                    } else {
                        setUser({
                            uid: authUser.uid,
                            email: authUser.email
                        });
                    }
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                }
            } else {
                // User is signed out, redirect to login
                router.push('/login');
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Check if user has admin access
    const isAdmin = user?.role === 'admin';

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-3xl font-bold text-yellow-600 mb-4">WakeRooms</h1>
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-center items-center">
                        <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="ml-3 text-gray-700">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-black text-white py-4 shadow-md">
                <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-yellow-500">WakeRooms</h1>
                    <div className="flex items-center space-x-4">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="text-white hover:text-yellow-400 transition duration-200"
                            >
                                Admin Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium py-1 px-4 rounded transition duration-200"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 pt-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome, {user?.firstName + " " + user?.lastName || 'Student'}</h2>
                    <p className="mb-6 text-gray-700">Use the links below to navigate the housing selection process.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/dorm-selection"
                            className="bg-black hover:bg-gray-900 text-yellow-500 p-5 rounded-lg shadow-md text-center font-semibold transition duration-200 flex flex-col items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Select Housing
                        </Link>
                        <Link
                            href="/roommate-finder"
                            className="bg-yellow-600 hover:bg-yellow-700 text-black p-5 rounded-lg shadow-md text-center font-semibold transition duration-200 flex flex-col items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Find Roommates
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Combined Housing Status & Time Slot Card */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Housing Status
                        </h2>

                        {/* Housing Status */}
                        {user?.selectedRoom ? (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-green-800 font-medium">You have selected a room:</p>
                                        <p className="text-green-700 mt-1 font-semibold">{user.selectedRoom.roomNumber} in {user.selectedRoom.dormName}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p className="text-yellow-800 font-medium">You have not selected a room yet.</p>
                                        <p className="text-yellow-700 text-sm mt-1">Click on "Select Housing" above to view available dorms and rooms.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Time Slot Section */}
                        <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Room Selection Time Slot
                        </h3>

                        {timeSlotInfo ? (
                            timeSlotActive ? (
                                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-green-800 font-medium mb-2">Your time slot is active! ({getTimeRemaining(timeSlotInfo.endTime)})</p>
                                            <p className="text-gray-700">
                                                <span className="font-semibold">
                                                    {new Date(timeSlotInfo.startTime).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })} at {new Date(timeSlotInfo.startTime).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} - {new Date(timeSlotInfo.endTime).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })} at {new Date(timeSlotInfo.endTime).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                new Date(timeSlotInfo.startTime) > new Date() ? (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                        <div className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-yellow-800 font-medium mb-2">Your time slot has not started yet.</p>
                                                <p className="text-yellow-700 text-sm mt-1">
                                                    <span>
                                                        {new Date(timeSlotInfo.startTime).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })} at {new Date(timeSlotInfo.startTime).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })} - {new Date(timeSlotInfo.endTime).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })} at {new Date(timeSlotInfo.endTime).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <div className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-red-800 font-medium mb-2">Your time slot has expired.</p>
                                                <p className="text-red-700 text-sm">
                                                    <span>
                                                        {new Date(timeSlotInfo.startTime).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })} at {new Date(timeSlotInfo.startTime).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })} - {new Date(timeSlotInfo.endTime).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })} at {new Date(timeSlotInfo.endTime).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p className="text-yellow-800 font-medium">You have not been assigned a room selection time slot yet.</p>
                                        <p className="text-yellow-700 text-sm mt-1">Please check back later or contact housing services.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Standalone Roommate Status Card */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Roommate Status
                        </h2>

                        {user?.roommateConnections && user.roommateConnections.length > 0 ? (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-green-800 font-medium">You have {user.roommateConnections.length} roommate{user.roommateConnections.length > 1 ? 's' : ''}.</p>
                                        <p className="text-green-700 text-sm mt-1">View details in the Find Roommates section above.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p className="text-yellow-800 font-medium">You have not selected any roommates yet.</p>
                                        <p className="text-yellow-700 text-sm mt-1">Click on "Find Roommates" above to connect with potential roommates.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Roommate Preferences Status - FIXED */}
                        <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Roommate Preferences
                        </h3>

                        {hasCompletePreferences(user) ? (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-green-800 font-medium">You completed your preferences.</p>
                                        <p className="text-green-700 text-sm mt-1">Update your preferences in the Find Roommates section if needed.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p className="text-yellow-800 font-medium">You have not completed your roommate preferences yet.</p>
                                        <p className="text-yellow-700 text-sm mt-1">Complete your preferences in the Find Roommates section to find better matches.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Housing News/Announcements Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        Announcements
                    </h2>

                    {/* Dynamic Announcements */}
                    <AnnouncementsList limit={3} />
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black text-white mt-8 py-6">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-yellow-500 font-semibold mb-2">WakeRooms</p>
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} Wake Forest University Housing. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;