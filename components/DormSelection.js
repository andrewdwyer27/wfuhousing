import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DormSelection = () => {
    const [dorms, setDorms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Check authentication and fetch dorms
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);

                // Fetch dorms data
                try {
                    const dormCollection = collection(db, 'dorms');
                    const dormSnapshot = await getDocs(dormCollection);
                    const dormList = dormSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    if (dormList.length > 0) {
                        setDorms(dormList);
                    } else {
                        // Use demo data if no dorms in Firestore
                        setDorms([
                            {
                                id: 'magnolia',
                                name: 'Magnolia Residence Hall',
                                description: 'Modern suite-style residence hall with a variety of room configurations.',
                                totalRooms: 175,
                                availableRooms: 87
                            },
                            {
                                id: 'taylor',
                                name: 'Taylor Residence Hall',
                                description: 'Traditional style residence hall centrally located on campus.',
                                totalRooms: 120,
                                availableRooms: 52
                            },
                            {
                                id: 'collins',
                                name: 'Collins Residence Hall',
                                description: 'Apartment-style living for upperclassmen with private kitchens and bathrooms.',
                                totalRooms: 90,
                                availableRooms: 41
                            },
                            {
                                id: 'bostwick',
                                name: 'Bostwick Residence Hall',
                                description: 'Historic residence hall with traditional double rooms.',
                                totalRooms: 110,
                                availableRooms: 65
                            }
                        ]);
                    }

                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching dorms:', error);
                    setLoading(false);
                }
            } else {
                // User is signed out, redirect to login
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-black text-white py-4 shadow-md">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl font-bold text-yellow-500">WakeRooms</h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 pt-6">
                    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 flex justify-center items-center">
                        <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="ml-3 text-gray-700">Loading residence halls...</p>
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
                    <Link
                        href="/dashboard"
                        className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium py-1 px-4 rounded transition duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 pt-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Select a Residence Hall</h2>
                    <p className="mb-6 text-gray-700">Click on a residence hall to view available rooms and make your selection.</p>

                    <div className="space-y-4">
                        {dorms.map(dorm => {
                            // Calculate availability percentage for progress bar
                            const availabilityPercentage = Math.round((dorm.availableRooms / dorm.totalRooms) * 100);

                            // Determine color based on availability
                            let availabilityColor = "bg-green-500";
                            if (availabilityPercentage < 30) {
                                availabilityColor = "bg-red-500";
                            } else if (availabilityPercentage < 60) {
                                availabilityColor = "bg-yellow-500";
                            }

                            return (
                                <div key={dorm.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-200">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{dorm.name}</h3>
                                    <p className="mb-3 text-gray-700">{dorm.description}</p>

                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Availability</span>
                                            <span>{dorm.availableRooms} of {dorm.totalRooms} rooms</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className={`${availabilityColor} h-2.5 rounded-full`}
                                                style={{ width: `${availabilityPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Link
                                            href={`/room-selection/${dorm.id}`}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-medium transition duration-200 flex items-center"
                                        >
                                            View Rooms
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Quick Help
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700 text-sm">Select a residence hall to view individual rooms and floor plans.</span>
                            </li>
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700 text-sm">Room selection is final once confirmed, so choose carefully.</span>
                            </li>
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700 text-sm">Need to find a roommate first? Return to the dashboard and use the roommate finder.</span>
                            </li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">Have questions? <a href="#" className="text-yellow-600 hover:text-yellow-800 font-medium">Contact Housing Services</a></p>
                        </div>
                    </div>
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

export default DormSelection;