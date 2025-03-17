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
        <Link 
          href="/dashboard"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded"
        >
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Select a Residence Hall</h2>
        <p className="mb-6">Click on a residence hall to view available rooms.</p>
        
        <div className="space-y-4">
          {dorms.map(dorm => (
            <div key={dorm.id} className="border border-gray-200 rounded-md p-4">
              <h3 className="text-xl font-semibold mb-2">{dorm.name}</h3>
              <p className="mb-2">{dorm.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Available: {dorm.availableRooms} / {dorm.totalRooms} rooms</p>
                </div>
                <Link 
                  href={`/room-selection/${dorm.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  View Rooms
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Selection Information</h2>
        <p className="mb-2">Your selection time: <span className="font-semibold">April 3, 2025 at 10:00 AM</span></p>
        <p>You must select your room during your assigned time slot. If you miss your time slot, you can still select from remaining rooms afterward.</p>
      </div>
    </div>
  );
};

export default DormSelection;