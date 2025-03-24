import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminAnnouncementForm from '../../components/AdminAnnouncementForm';
import AnnouncementsList from '../../components/AnnouncementsList';
import TimeSlotAdmin from '../../components/TimeSlotAdmin';
import HousingManagement from '../../components/HousingManagement';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState('announcements'); // Default tab
    const router = useRouter();

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
                        
                        // Check if user is an admin
                        if (userData.role === 'admin') {
                            setIsAdmin(true);
                        } else {
                            // Redirect non-admin users
                            router.push('/dashboard');
                        }
                    } else {
                        // No user data found
                        router.push('/dashboard');
                    }
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                    router.push('/dashboard');
                }
            } else {
                // User is signed out, redirect to login
                router.push('/login');
            }
        });

        // Set active tab based on URL query param if present
        if (router.query.tab) {
            setActiveTab(router.query.tab);
        }

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

    const changeTab = (tab) => {
        setActiveTab(tab);
        router.push({
            pathname: router.pathname,
            query: { tab }
        }, undefined, { shallow: true });
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Head>
                    <title>Admin Dashboard | WakeRooms</title>
                </Head>
                <h1 className="text-3xl font-bold text-yellow-600 mb-4">WakeRooms Admin</h1>
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-center items-center">
                        <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="ml-3 text-gray-700">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If not admin and not loading, this should be caught by the useEffect, but just in case
    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Admin Dashboard | WakeRooms</title>
                <meta name="description" content="WakeRooms administrator dashboard for managing announcements and time slots" />
            </Head>
            
            {/* Header */}
            <div className="bg-black text-white py-4 shadow-md">
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-3xl font-bold text-yellow-500">WakeRooms</h1>
                        <span className="ml-2 bg-yellow-600 text-black px-2 py-0.5 rounded-md text-xs font-medium">ADMIN</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/dashboard"
                            className="text-white hover:text-yellow-400 transition duration-200"
                        >
                            User Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium py-1 px-4 rounded transition duration-200"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 pt-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Administrator Dashboard</h2>
                    <p className="mb-6 text-gray-700">Manage housing information, announcements, and time slots.</p>

                    {/* Tab navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex space-x-8">
                            <button
                                onClick={() => changeTab('announcements')}
                                className={`pb-4 font-medium text-sm ${
                                    activeTab === 'announcements'
                                        ? 'border-b-2 border-yellow-500 text-yellow-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Announcements
                            </button>
                            <button
                                onClick={() => changeTab('timeslots')}
                                className={`pb-4 font-medium text-sm ${
                                    activeTab === 'timeslots'
                                        ? 'border-b-2 border-yellow-500 text-yellow-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Time Slots
                            </button>
                            <button
                                onClick={() => changeTab('housing')}
                                className={`pb-4 font-medium text-sm ${
                                    activeTab === 'housing'
                                        ? 'border-b-2 border-yellow-500 text-yellow-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Housing Management
                            </button>
                        </div>
                    </div>

                    {/* Tab content */}
                    {activeTab === 'announcements' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Announcements Management</h3>
                            <div className="mb-8">
                                <AdminAnnouncementForm />
                            </div>
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                <h4 className="text-lg font-bold mb-4 text-gray-900">Current Announcements</h4>
                                <AnnouncementsList isAdmin={true} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'timeslots' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Time Slot Management</h3>
                            <TimeSlotAdmin />
                        </div>
                    )}

                    {activeTab === 'housing' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Housing Management</h3>
                            <HousingManagement />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black text-white mt-8 py-6">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-yellow-500 font-semibold mb-2">WakeRooms Admin</p>
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} Wake Forest University Housing. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;