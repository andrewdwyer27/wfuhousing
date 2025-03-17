import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RoomSelection from '../../components/RoomSelection';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function RoomSelectionPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const { dormId } = router.query;

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

  if (!dormId) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-4">Invalid Dorm Selection</h1>
          <p className="mb-4">No dorm was selected. Please return to the dorm selection page.</p>
          <button 
            onClick={() => router.push('/dorm-selection')}
            className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold"
          >
            Back to Dorm Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Room Selection - {dormId} | WakeRooms</title>
        <meta name="description" content={`Select a room in ${dormId} residence hall`} />
      </Head>
      
      <RoomSelection />
    </>
  );
}