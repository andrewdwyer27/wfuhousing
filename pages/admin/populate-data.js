import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/router';
import FirestorePopulator from '../../components/FirestorePopulator';
import Head from 'next/head';

const PopulateDataPage = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setAuthenticated(true);
                setLoading(false);
            } else {
                // User is signed out, redirect to login
                router.push('/login');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
            </div>
        );
    }

    if (!authenticated) {
        return null; // Router will redirect, don't render anything
    }

    return (
        <>
            <Head>
                <title>Populate Database | WakeRooms Admin</title>
                <meta name="description" content="Admin tool to populate the WakeRooms database with sample data" />
            </Head>

            <div className="min-h-screen bg-gray-50 py-8">
                <FirestorePopulator />

                <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded-md shadow border border-gray-200">
                    <h2 className="text-xl font-bold mb-2">Instructions</h2>
                    <p className="mb-4">This tool will populate your Firestore database with sample data for testing the WakeRooms application. Here's what each button does:</p>

                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Populate Dorms & Rooms</strong>: Creates dorm buildings (Magnolia, Taylor, Collins, Bostwick) and adds room data for each.</li>
                        <li><strong>Populate User Data</strong>: Creates 5 sample users with different roommate preferences.</li>
                        <li><strong>Add Roommate Requests</strong>: Creates sample roommate requests between users.</li>
                        <li><strong>Populate All Data</strong>: Runs all of the above operations in sequence.</li>
                    </ul>

                    <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                        <p className="text-sm"><strong>Warning:</strong> This tool will overwrite any existing data with the same IDs. Use with caution on production databases.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PopulateDataPage;