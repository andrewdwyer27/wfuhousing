import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Head from 'next/head';
import TimeSlotAdmin from '../../components/TimeSlotAdmin';
import { useRouter } from 'next/router';

const TimeSlotAdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          // Check if user is admin
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true);
          } else {
            // Not an admin, redirect to dashboard
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Not logged in, redirect to login
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Router will redirect, don't render anything
  }

  return (
    <>
      <Head>
        <title>Time Slot Administration | WakeRooms</title>
        <meta name="description" content="Administrator tools for managing room selection time slots" />
      </Head>
      
      <TimeSlotAdmin />
    </>
  );
};

export default TimeSlotAdminPage;