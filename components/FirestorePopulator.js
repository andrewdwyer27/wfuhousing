import { useState } from 'react';
import { collection, doc, setDoc, writeBatch, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const FirestorePopulator = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const populateDormsData = async () => {
    setLoading(true);
    setStatus('Starting data population...');
    
    try {
      // Create dorms
      const dormsData = [
        {
          id: 'magnolia',
          name: 'Magnolia Residence Hall',
          description: 'Modern suite-style residence hall with a variety of room configurations.',
          features: ['Air conditioning', 'Elevator', 'Study lounges', 'Laundry facilities'],
          image: '/images/magnolia.jpg',
          totalRooms: 175,
          availableRooms: 175, // All rooms available
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'taylor',
          name: 'Taylor Residence Hall',
          description: 'Traditional style residence hall centrally located on campus.',
          features: ['Community bathrooms', 'Lounge spaces', 'Kitchen on each floor'],
          image: '/images/taylor.jpg',
          totalRooms: 120,
          availableRooms: 120, // All rooms available
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'collins',
          name: 'Collins Residence Hall',
          description: 'Apartment-style living for upperclassmen with private kitchens and bathrooms.',
          features: ['Full kitchens', 'Private bathrooms', 'Living room in each unit'],
          image: '/images/collins.jpg',
          totalRooms: 90,
          availableRooms: 90, // All rooms available
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'bostwick',
          name: 'Bostwick Residence Hall',
          description: 'Historic residence hall with traditional double rooms.',
          features: ['Community bathrooms', 'Historic architecture', 'Close to campus dining'],
          image: '/images/bostwick.jpg',
          totalRooms: 110,
          availableRooms: 110, // All rooms available
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      ];
      
      // Create a batch for dorms
      const dormBatch = writeBatch(db);
      
      // Add dorms to batch
      dormsData.forEach(dorm => {
        const dormRef = doc(db, 'dorms', dorm.id);
        dormBatch.set(dormRef, dorm);
      });
      
      // Commit the dorms batch
      await dormBatch.commit();
      setStatus('Dorms data added successfully. Adding rooms data...');
      
      // Populate rooms for Magnolia
      await populateMagnoliaRooms();
      
      // Populate rooms for other dorms (simplified)
      await populateOtherDorms(['taylor', 'collins', 'bostwick']);
      
      setStatus('All data populated successfully!');
    } catch (error) {
      console.error('Error populating data:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const populateMagnoliaRooms = async () => {
    // Create rooms data for Magnolia
    const magnoliaRooms = [
      // First Floor
      { id: '102A', roomNumber: '102A', floor: '1', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '102B', roomNumber: '102B', floor: '1', type: 'single', capacity: 1, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '102C', roomNumber: '102C', floor: '1', type: 'single', capacity: 1, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '102D', roomNumber: '102D', floor: '1', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '113A', roomNumber: '113A', floor: '1', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '113B', roomNumber: '113B', floor: '1', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      
      // Second Floor
      { id: '201A', roomNumber: '201A', floor: '2', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '201B', roomNumber: '201B', floor: '2', type: 'single', capacity: 1, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '201C', roomNumber: '201C', floor: '2', type: 'single', capacity: 1, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '202A', roomNumber: '202A', floor: '2', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '202B', roomNumber: '202B', floor: '2', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      
      // Third Floor
      { id: '301A', roomNumber: '301A', floor: '3', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '301B', roomNumber: '301B', floor: '3', type: 'single', capacity: 1, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '302A', roomNumber: '302A', floor: '3', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '302B', roomNumber: '302B', floor: '3', type: 'single', capacity: 1, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      
      // Fourth Floor
      { id: '401A', roomNumber: '401A', floor: '4', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '401B', roomNumber: '401B', floor: '4', type: 'single', capacity: 1, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '402A', roomNumber: '402A', floor: '4', type: 'double', capacity: 2, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
      { id: '402B', roomNumber: '402B', floor: '4', type: 'single', capacity: 1, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
    ];
    
    try {
      // Use a batch for efficient writes
      const batch = writeBatch(db);
      
      // Add all rooms to batch
      magnoliaRooms.forEach(room => {
        const roomRef = doc(db, 'dorms', 'magnolia', 'rooms', room.id);
        batch.set(roomRef, room);
      });
      
      // Commit the batch
      await batch.commit();
      setStatus('Magnolia rooms data added successfully.');
    } catch (error) {
      console.error('Error adding Magnolia rooms:', error);
      throw error;
    }
  };
  
  const populateOtherDorms = async (dormIds) => {
    try {
      for (const dormId of dormIds) {
        // Create simplified room data for other dorms
        const rooms = [];
        
        // Generate 10 rooms per floor, 3 floors per dorm
        for (let floor = 1; floor <= 3; floor++) {
          for (let roomNum = 1; roomNum <= 10; roomNum++) {
            const roomId = `${floor}${roomNum.toString().padStart(2, '0')}`;
            const roomType = roomNum % 3 === 0 ? 'single' : 'double';
            const capacity = roomType === 'single' ? 1 : 2;
            
            rooms.push({
              id: roomId,
              roomNumber: roomId,
              floor: floor.toString(),
              type: roomType,
              capacity: capacity,
              occupancyStatus: 'available',
              occupants: [],
              createdAt: new Date().toISOString()
            });
          }
        }
        
        // Use a batch for efficient writes
        const batch = writeBatch(db);
        
        // Add all rooms to batch
        rooms.forEach(room => {
          const roomRef = doc(db, 'dorms', dormId, 'rooms', room.id);
          batch.set(roomRef, room);
        });
        
        // Commit the batch
        await batch.commit();
        setStatus(`${dormId} rooms data added successfully.`);
      }
    } catch (error) {
      console.error('Error adding rooms for other dorms:', error);
      throw error;
    }
  };
  
  // Populate sample roommate request data
  const populateRoommateRequests = async () => {
    setLoading(true);
    setStatus('Creating sample roommate requests...');
    
    try {
      // Add incoming requests to user1
      await updateDoc(doc(db, 'users', 'user1'), {
        incomingRoommateRequests: ['user5']
      });
      
      // Add outgoing requests from user5 to user1
      await updateDoc(doc(db, 'users', 'user5'), {
        outgoingRoommateRequests: ['user1']
      });
      
      // Add outgoing requests from user2 to user5
      await updateDoc(doc(db, 'users', 'user2'), {
        outgoingRoommateRequests: ['user5']
      });
      
      // Add incoming requests to user5 from user2
      await updateDoc(doc(db, 'users', 'user5'), {
        incomingRoommateRequests: ['user2']
      });
      
      setStatus('Roommate request data added successfully!');
    } catch (error) {
      console.error('Error adding roommate request data:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const populateUserData = async () => {
    setLoading(true);
    setStatus('Creating sample user data...');
    
    try {
      // Create mock users
      const users = [
        {
          uid: 'user1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@wfu.edu',
          studentId: '12345678',
          role: 'student',
          createdAt: new Date().toISOString(),
          roommatePreferences: {
            studyHabits: 'quiet',
            sleepSchedule: 'early',
            cleanliness: 'veryNeat',
            visitors: 'rarely',
            interests: ['Sports', 'Fitness', 'Reading'],
            additionalInfo: 'I prefer a quiet environment for studying.'
          }
        },
        {
          uid: 'user2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@wfu.edu',
          studentId: '87654321',
          role: 'student',
          createdAt: new Date().toISOString(),
          roommatePreferences: {
            studyHabits: 'music',
            sleepSchedule: 'late',
            cleanliness: 'neat',
            visitors: 'sometimes',
            interests: ['Music', 'Art', 'Movies'],
            additionalInfo: 'I enjoy having friends over occasionally.'
          }
        },
        {
          uid: 'user3',
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex.johnson@wfu.edu',
          studentId: '23456789',
          role: 'student',
          createdAt: new Date().toISOString(),
          roommatePreferences: {
            studyHabits: 'anywhere',
            sleepSchedule: 'regular',
            cleanliness: 'casual',
            visitors: 'weekends',
            interests: ['Gaming', 'Technology', 'Movies'],
            additionalInfo: 'I like to keep things clean but not obsessively so.'
          },
          roommateConnections: ['user4']
        },
        {
          uid: 'user4',
          firstName: 'Morgan',
          lastName: 'Williams',
          email: 'morgan.williams@wfu.edu',
          studentId: '34567890',
          role: 'student',
          createdAt: new Date().toISOString(),
          roommatePreferences: {
            studyHabits: 'library',
            sleepSchedule: 'regular',
            cleanliness: 'neat',
            visitors: 'sometimes',
            interests: ['Reading', 'Cooking', 'Outdoor Activities'],
            additionalInfo: 'I enjoy cooking and sharing meals with roommates.'
          },
          roommateConnections: ['user3']
        },
        {
          uid: 'user5',
          firstName: 'Taylor',
          lastName: 'Brown',
          email: 'taylor.brown@wfu.edu',
          studentId: '45678901',
          role: 'student',
          createdAt: new Date().toISOString(),
          roommatePreferences: {
            studyHabits: 'music',
            sleepSchedule: 'late',
            cleanliness: 'casual',
            visitors: 'often',
            interests: ['Sports', 'Movies', 'Greek Life'],
            additionalInfo: 'I like to have an active social life.'
          }
        }
      ];
      
      // Use a batch for efficient writes
      const batch = writeBatch(db);
      
      // Add all users to batch
      users.forEach(user => {
        const userRef = doc(db, 'users', user.uid);
        batch.set(userRef, user);
      });
      
      // Commit the batch
      await batch.commit();
      setStatus('User data added successfully!');
    } catch (error) {
      console.error('Error adding user data:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Firestore Data Populator</h1>
      <p className="mb-6">Use the buttons below to populate your Firestore database with sample data.</p>
      
      <div className="space-y-4">
        <div className="mb-6">
          <button
            onClick={populateDormsData}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold mr-4"
          >
            Populate Dorms & Rooms
          </button>
          <p className="mt-2 text-sm text-gray-600">Creates dorm buildings and adds fully available room data with no occupants.</p>
        </div>
        
        <div className="mb-6">
          <button
            onClick={populateUserData}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold"
          >
            Populate User Data
          </button>
          <p className="mt-2 text-sm text-gray-600">Creates sample user accounts with roommate preferences (not assigned to any rooms).</p>
        </div>
        
        <div className="mb-6">
          <button
            onClick={populateRoommateRequests}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold"
          >
            Add Roommate Requests
          </button>
          <p className="mt-2 text-sm text-gray-600">Adds sample roommate requests between users.</p>
        </div>
        
        <div className="mb-6">
          <button
            onClick={() => {
              populateDormsData()
                .then(() => populateUserData())
                .then(() => populateRoommateRequests())
                .catch(err => console.error('Error in population sequence:', err));
            }}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold"
          >
            Populate All Data
          </button>
          <p className="mt-2 text-sm text-gray-600">Runs all population functions in sequence. All rooms will be created as fully available with no occupants.</p>
        </div>
      </div>
      
      {status && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p>{status}</p>
        </div>
      )}
      
      {loading && (
        <div className="mt-4 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-600 mr-2"></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default FirestorePopulator;