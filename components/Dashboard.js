import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Get user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          
          if (userDoc.exists()) {
            setUser({
              uid: authUser.uid,
              email: authUser.email,
              ...userDoc.data()
            });
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">WakeRooms</h1>
        <div className="p-6 bg-white rounded-md shadow-sm border border-gray-200">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">WakeRooms</h1>
        <button 
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded"
        >
          Log out
        </button>
      </div>
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstName || 'Student'}</h2>
        <p className="mb-6">Use the links below to navigate the housing selection process.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/dorm-selection" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded text-center"
          >
            Select Housing
          </Link>
          <Link 
            href="/roommate-finder" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded text-center"
          >
            Find Roommates
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Housing Selection Timeline</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Application Open: March 1, 2025</li>
          <li>Application Deadline: March 15, 2025</li>
          <li>Room Selection Period: April 1-10, 2025</li>
        </ul>
      </div>
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Housing Status</h2>
        {user?.selectedRoom ? (
          <div>
            <p className="mb-2">You have selected a room:</p>
            <p className="font-semibold">{user.selectedRoom.roomNumber} in {user.selectedRoom.buildingId}</p>
          </div>
        ) : (
          <p>You have not selected a room yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;