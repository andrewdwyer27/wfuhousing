import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RoommateFinder from '../components/RoommateFinder';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function RoommateFinderPage() {
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
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex justify-center items-center h-screen">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!authenticated) {
        return null; // Router will redirect, don't render anything
    }

    return (
        <>
            <Head>
                <title>Find Roommates | WakeRooms</title>
                <meta name="description" content="Find and connect with potential roommates at Wake Forest University" />
            </Head>

            <RoommateFinder />
        </>
    );
}