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

const dogwoodRooms = [
  { id: '102A', roomNumber: '102A', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '102B', roomNumber: '102B', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '102C', roomNumber: '102C', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '102D', roomNumber: '102D', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107A', roomNumber: '107A', floor: '1', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '107B', roomNumber: '107B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109A', roomNumber: '109A', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109B', roomNumber: '109B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109C', roomNumber: '109C', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109D', roomNumber: '109D', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109E', roomNumber: '109E', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113A', roomNumber: '113A', floor: '1', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '113B', roomNumber: '113B', floor: '1', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '113C', roomNumber: '113C', floor: '1', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '120A', roomNumber: '120A', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '120B', roomNumber: '120B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '120C', roomNumber: '120C', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '120D', roomNumber: '120D', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '120E', roomNumber: '120E', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '124A', roomNumber: '124A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '124B', roomNumber: '124B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125A', roomNumber: '125A', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125B', roomNumber: '125B', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125C', roomNumber: '125C', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125D', roomNumber: '125D', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '126A', roomNumber: '126A', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '126B', roomNumber: '126B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '126C', roomNumber: '126C', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201A', roomNumber: '201A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201B', roomNumber: '201B', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201C', roomNumber: '201C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201D', roomNumber: '201D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202A', roomNumber: '202A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202B', roomNumber: '202B', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202C', roomNumber: '202C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202D', roomNumber: '202D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202E', roomNumber: '202E', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205', roomNumber: '205', floor: '2', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '207A', roomNumber: '207A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207B', roomNumber: '207B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209A', roomNumber: '209A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209B', roomNumber: '209B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209C', roomNumber: '209C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209D', roomNumber: '209D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209E', roomNumber: '209E', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214A', roomNumber: '214A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214B', roomNumber: '214B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215A', roomNumber: '215A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215B', roomNumber: '215B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '216A', roomNumber: '216A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '216B', roomNumber: '216B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '217A', roomNumber: '217A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '217B', roomNumber: '217B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '218', roomNumber: '218', floor: '2', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '220A', roomNumber: '220A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '220B', roomNumber: '220B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '220C', roomNumber: '220C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '220D', roomNumber: '220D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '220E', roomNumber: '220E', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '224A', roomNumber: '224A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '224B', roomNumber: '224B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225A', roomNumber: '225A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225B', roomNumber: '225B', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225C', roomNumber: '225C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225D', roomNumber: '225D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '226A', roomNumber: '226A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '226B', roomNumber: '226B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '226C', roomNumber: '226C', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301A', roomNumber: '301A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301B', roomNumber: '301B', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301C', roomNumber: '301C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301D', roomNumber: '301D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302A', roomNumber: '302A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302B', roomNumber: '302B', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302C', roomNumber: '302C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302D', roomNumber: '302D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302E', roomNumber: '302E', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '305', roomNumber: '305', floor: '3', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '307A', roomNumber: '307A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307B', roomNumber: '307B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309A', roomNumber: '309A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309B', roomNumber: '309B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309C', roomNumber: '309C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309D', roomNumber: '309D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309E', roomNumber: '309E', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314A', roomNumber: '314A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314B', roomNumber: '314B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315A', roomNumber: '315A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315B', roomNumber: '315B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '316A', roomNumber: '316A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '316B', roomNumber: '316B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '317A', roomNumber: '317A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '317B', roomNumber: '317B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '318', roomNumber: '318', floor: '3', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '320A', roomNumber: '320A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320B', roomNumber: '320B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320C', roomNumber: '320C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320D', roomNumber: '320D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320E', roomNumber: '320E', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '324A', roomNumber: '324A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '324B', roomNumber: '324B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '325A', roomNumber: '325A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '325B', roomNumber: '325B', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '325C', roomNumber: '325C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '325D', roomNumber: '325D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '326A', roomNumber: '326A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '326B', roomNumber: '326B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '326C', roomNumber: '326C', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401A', roomNumber: '401A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401B', roomNumber: '401B', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401C', roomNumber: '401C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401D', roomNumber: '401D', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402A', roomNumber: '402A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402B', roomNumber: '402B', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402C', roomNumber: '402C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402D', roomNumber: '402D', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402E', roomNumber: '402E', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405', roomNumber: '405', floor: '4', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '407A', roomNumber: '407A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '407B', roomNumber: '407B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409A', roomNumber: '409A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409B', roomNumber: '409B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409C', roomNumber: '409C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409D', roomNumber: '409D', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409E', roomNumber: '409E', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '414A', roomNumber: '414A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '414B', roomNumber: '414B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '415A', roomNumber: '415A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '415B', roomNumber: '415B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '416A', roomNumber: '416A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '416B', roomNumber: '416B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '417A', roomNumber: '417A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '417B', roomNumber: '417B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '418', roomNumber: '418', floor: '4', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '420A', roomNumber: '420A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '420B', roomNumber: '420B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '420C', roomNumber: '420C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '420D', roomNumber: '420D', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '420E', roomNumber: '420E', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '424A', roomNumber: '424A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '424B', roomNumber: '424B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '425A', roomNumber: '425A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '425B', roomNumber: '425B', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '425C', roomNumber: '425C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '425D', roomNumber: '425D', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '426A', roomNumber: '426A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '426B', roomNumber: '426B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '426C', roomNumber: '426C', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];

const magnoliaRooms = [
  { id: '102A', roomNumber: '102A', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '102B', roomNumber: '102B', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '102C', roomNumber: '102C', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '102D', roomNumber: '102D', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107A', roomNumber: '107A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107B', roomNumber: '107B', floor: '1', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '113A', roomNumber: '113A', floor: '1', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '113B', roomNumber: '113B', floor: '1', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '120A', roomNumber: '120A', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '120B', roomNumber: '120B', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '120C', roomNumber: '120C', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '120D', roomNumber: '120D', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '120E', roomNumber: '120E', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '124A', roomNumber: '124A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '124B', roomNumber: '124B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125A', roomNumber: '125A', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125B', roomNumber: '125B', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125C', roomNumber: '125C', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125D', roomNumber: '125D', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '126A', roomNumber: '126A', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '126B', roomNumber: '126B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '126C', roomNumber: '126C', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201A', roomNumber: '201A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201B', roomNumber: '201B', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201C', roomNumber: '201C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201D', roomNumber: '201D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202A', roomNumber: '202A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202B', roomNumber: '202B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202C', roomNumber: '202C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202D', roomNumber: '202D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202E', roomNumber: '202E', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205', roomNumber: '205', floor: '2', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '207A', roomNumber: '207A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207B', roomNumber: '207B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209A', roomNumber: '209A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209B', roomNumber: '209B', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209C', roomNumber: '209C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209D', roomNumber: '209D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209E', roomNumber: '209E', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214A', roomNumber: '214A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214B', roomNumber: '214B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215A', roomNumber: '215A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215B', roomNumber: '215B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '216A', roomNumber: '216A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '216B', roomNumber: '216B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '217A', roomNumber: '217A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '217B', roomNumber: '217B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '218', roomNumber: '218', floor: '2', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '220A', roomNumber: '220A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '220B', roomNumber: '220B', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '220C', roomNumber: '220C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '220D', roomNumber: '220D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '220E', roomNumber: '220E', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '224A', roomNumber: '224A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '224B', roomNumber: '224B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225A', roomNumber: '225A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225B', roomNumber: '225B', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225C', roomNumber: '225C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225D', roomNumber: '225D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '226A', roomNumber: '226A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '226B', roomNumber: '226B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '226C', roomNumber: '226C', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301A', roomNumber: '301A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301B', roomNumber: '301B', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301C', roomNumber: '301C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301D', roomNumber: '301D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302A', roomNumber: '302A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302B', roomNumber: '302B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302C', roomNumber: '302C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302D', roomNumber: '302D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302E', roomNumber: '302E', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '305', roomNumber: '305', floor: '3', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '307A', roomNumber: '307A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307B', roomNumber: '307B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309A', roomNumber: '309A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309B', roomNumber: '309B', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309C', roomNumber: '309C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309D', roomNumber: '309D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309E', roomNumber: '309E', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314A', roomNumber: '314A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314B', roomNumber: '314B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315A', roomNumber: '315A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315B', roomNumber: '315B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '316A', roomNumber: '316A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '316B', roomNumber: '316B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '317A', roomNumber: '317A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '317B', roomNumber: '317B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '318', roomNumber: '318', floor: '3', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '320A', roomNumber: '320A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320B', roomNumber: '320B', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320C', roomNumber: '320C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320D', roomNumber: '320D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320E', roomNumber: '320E', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '324A', roomNumber: '324A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '324B', roomNumber: '324B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '325A', roomNumber: '325A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '325B', roomNumber: '325B', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '325C', roomNumber: '325C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '325D', roomNumber: '325D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '326A', roomNumber: '326A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '326B', roomNumber: '326B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '326C', roomNumber: '326C', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401A', roomNumber: '401A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401B', roomNumber: '401B', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401C', roomNumber: '401C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401D', roomNumber: '401D', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402A', roomNumber: '402A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402B', roomNumber: '402B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402C', roomNumber: '402C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402D', roomNumber: '402D', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402E', roomNumber: '402E', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405', roomNumber: '405', floor: '4', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '407A', roomNumber: '407A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '407B', roomNumber: '407B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409A', roomNumber: '409A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409B', roomNumber: '409B', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409C', roomNumber: '409C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409D', roomNumber: '409D', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '409E', roomNumber: '409E', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '414A', roomNumber: '414A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '414B', roomNumber: '414B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '415A', roomNumber: '415A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '415B', roomNumber: '415B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '416A', roomNumber: '416A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '416B', roomNumber: '416B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '417A', roomNumber: '417A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '417B', roomNumber: '417B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '418', roomNumber: '418', floor: '4', type: 'staff', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'staff', occupants: [], createdAt: new Date().toISOString() },
  { id: '420A', roomNumber: '420A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '420B', roomNumber: '420B', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '420C', roomNumber: '420C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '420D', roomNumber: '420D', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '420E', roomNumber: '420E', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '424A', roomNumber: '424A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '424B', roomNumber: '424B', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '425A', roomNumber: '425A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '425B', roomNumber: '425B', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '425C', roomNumber: '425C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '425D', roomNumber: '425D', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '426A', roomNumber: '426A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '426B', roomNumber: '426B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '426C', roomNumber: '426C', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];

const studentApartmentsARooms = [
  { id: 'A101A', roomNumber: 'A101A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A101B', roomNumber: 'A101B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A102A', roomNumber: 'A102A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A102B', roomNumber: 'A102B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A103A', roomNumber: 'A103A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A103B', roomNumber: 'A103B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A104A', roomNumber: 'A104A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A104B', roomNumber: 'A104B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A105A', roomNumber: 'A105A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A105B', roomNumber: 'A105B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A106A', roomNumber: 'A106A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A106B', roomNumber: 'A106B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A107A', roomNumber: 'A107A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A107B', roomNumber: 'A107B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A108A', roomNumber: 'A108A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A108B', roomNumber: 'A108B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A109A', roomNumber: 'A109A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A109B', roomNumber: 'A109B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A110A', roomNumber: 'A110A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A111A', roomNumber: 'A111A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A111B', roomNumber: 'A111B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A112A', roomNumber: 'A112A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A112B', roomNumber: 'A112B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A113A', roomNumber: 'A113A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A113B', roomNumber: 'A113B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A114A', roomNumber: 'A114A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A114B', roomNumber: 'A114B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A201A', roomNumber: 'A201A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A201B', roomNumber: 'A201B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A202A', roomNumber: 'A202A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A202B', roomNumber: 'A202B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A203A', roomNumber: 'A203A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A203B', roomNumber: 'A203B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A204A', roomNumber: 'A204A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A204B', roomNumber: 'A204B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A205A', roomNumber: 'A205A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A205B', roomNumber: 'A205B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A206A', roomNumber: 'A206A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A206B', roomNumber: 'A206B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A207A', roomNumber: 'A207A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A207B', roomNumber: 'A207B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A208A', roomNumber: 'A208A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A208B', roomNumber: 'A208B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A209A', roomNumber: 'A209A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A209B', roomNumber: 'A209B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A210A', roomNumber: 'A210A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A210B', roomNumber: 'A210B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A211A', roomNumber: 'A211A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A211B', roomNumber: 'A211B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A212A', roomNumber: 'A212A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A212B', roomNumber: 'A212B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A213A', roomNumber: 'A213A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A213B', roomNumber: 'A213B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A214A', roomNumber: 'A214A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'A214B', roomNumber: 'A214B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];

const studentApartmentsBRooms = [
  { id: 'B101A', roomNumber: 'B101A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B101B', roomNumber: 'B101B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B102A', roomNumber: 'B102A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B102B', roomNumber: 'B102B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B103A', roomNumber: 'B103A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B103B', roomNumber: 'B103B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B104A', roomNumber: 'B104A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B104B', roomNumber: 'B104B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B105A', roomNumber: 'B105A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B105B', roomNumber: 'B105B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B106A', roomNumber: 'B106A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B106B', roomNumber: 'B106B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B107A', roomNumber: 'B107A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B107B', roomNumber: 'B107B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B108A', roomNumber: 'B108A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B108B', roomNumber: 'B108B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B109A', roomNumber: 'B109A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B109B', roomNumber: 'B109B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B110A', roomNumber: 'B110A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B111A', roomNumber: 'B111A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B111B', roomNumber: 'B111B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B112A', roomNumber: 'B112A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B112B', roomNumber: 'B112B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B113A', roomNumber: 'B113A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B113B', roomNumber: 'B113B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B114A', roomNumber: 'B114A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B114B', roomNumber: 'B114B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B201A', roomNumber: 'B201A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B201B', roomNumber: 'B201B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B202A', roomNumber: 'B202A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B202B', roomNumber: 'B202B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B203A', roomNumber: 'B203A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B203B', roomNumber: 'B203B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B204A', roomNumber: 'B204A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B204B', roomNumber: 'B204B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B205A', roomNumber: 'B205A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B205B', roomNumber: 'B205B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B206A', roomNumber: 'B206A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B206B', roomNumber: 'B206B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B207A', roomNumber: 'B207A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B207B', roomNumber: 'B207B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B208A', roomNumber: 'B208A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B208B', roomNumber: 'B208B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B209A', roomNumber: 'B209A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B209B', roomNumber: 'B209B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B210A', roomNumber: 'B210A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B210B', roomNumber: 'B210B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B211A', roomNumber: 'B211A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B211B', roomNumber: 'B211B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B212A', roomNumber: 'B212A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B212B', roomNumber: 'B212B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B213A', roomNumber: 'B213A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B213B', roomNumber: 'B213B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B214A', roomNumber: 'B214A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: 'B214B', roomNumber: 'B214B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: true, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];

const davisRooms = [
  { id: '007A', roomNumber: '007A', floor: '0', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '007B', roomNumber: '007B', floor: '0', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '007C', roomNumber: '007C', floor: '0', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '009A', roomNumber: '009A', floor: '0', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '009B', roomNumber: '009B', floor: '0', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '009C', roomNumber: '009C', floor: '0', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '012A', roomNumber: '012A', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '012B', roomNumber: '012B', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '012C', roomNumber: '012C', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '014A', roomNumber: '014A', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '014B', roomNumber: '014B', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '014C', roomNumber: '014C', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '105A', roomNumber: '105A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '105B', roomNumber: '105B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '105C', roomNumber: '105C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106A', roomNumber: '106A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106B', roomNumber: '106B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107A', roomNumber: '107A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107B', roomNumber: '107B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107C', roomNumber: '107C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109A', roomNumber: '109A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109B', roomNumber: '109B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109C', roomNumber: '109C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110A', roomNumber: '110A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110B', roomNumber: '110B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110C', roomNumber: '110C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111A', roomNumber: '111A', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111B', roomNumber: '111B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111B', roomNumber: '111B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111C', roomNumber: '111C', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111D', roomNumber: '111D', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111E', roomNumber: '111E', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112A', roomNumber: '112A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112B', roomNumber: '112B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112C', roomNumber: '112C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112D', roomNumber: '112D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113A', roomNumber: '113A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113C', roomNumber: '113C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113D', roomNumber: '113D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114A', roomNumber: '114A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114B', roomNumber: '114B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114C', roomNumber: '114C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114D', roomNumber: '114D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115A', roomNumber: '115A', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115B', roomNumber: '115B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115C', roomNumber: '115C', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115D', roomNumber: '115D', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115E', roomNumber: '115E', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115F', roomNumber: '115F', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115G', roomNumber: '115G', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205A', roomNumber: '205A', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205B', roomNumber: '205B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205C', roomNumber: '205C', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205D', roomNumber: '205D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205E', roomNumber: '205E', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206A', roomNumber: '206A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206B', roomNumber: '206B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206C', roomNumber: '206C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206D', roomNumber: '206D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207A', roomNumber: '207A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207C', roomNumber: '207C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207D', roomNumber: '207D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209A', roomNumber: '209A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209B', roomNumber: '209B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209C', roomNumber: '209C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209D', roomNumber: '209D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210A', roomNumber: '210A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210B', roomNumber: '210B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210C', roomNumber: '210C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210D', roomNumber: '210D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211A', roomNumber: '211A', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211B', roomNumber: '211B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211C', roomNumber: '211C', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211D', roomNumber: '211D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211E', roomNumber: '211E', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212A', roomNumber: '212A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212B', roomNumber: '212B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212C', roomNumber: '212C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212D', roomNumber: '212D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213A', roomNumber: '213A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213C', roomNumber: '213C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213D', roomNumber: '213D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214A', roomNumber: '214A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214B', roomNumber: '214B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214C', roomNumber: '214C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214D', roomNumber: '214D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215A', roomNumber: '215A', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215B', roomNumber: '215B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215C', roomNumber: '215C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215D', roomNumber: '215D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215E', roomNumber: '215E', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215F', roomNumber: '215F', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215G', roomNumber: '215G', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301A', roomNumber: '301A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301B', roomNumber: '301B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301C', roomNumber: '301C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301D', roomNumber: '301D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301E', roomNumber: '301E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301F', roomNumber: '301F', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301G', roomNumber: '301G', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302A', roomNumber: '302A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302B', roomNumber: '302B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302C', roomNumber: '302C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302D', roomNumber: '302D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303A', roomNumber: '303A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303C', roomNumber: '303C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303D', roomNumber: '303D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304A', roomNumber: '304A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304B', roomNumber: '304B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304C', roomNumber: '304C', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304D', roomNumber: '304D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304E', roomNumber: '304E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306A', roomNumber: '306A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306B', roomNumber: '306B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306C', roomNumber: '306C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306D', roomNumber: '306D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307A', roomNumber: '307A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307B', roomNumber: '307B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307C', roomNumber: '307C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307D', roomNumber: '307D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309A', roomNumber: '309A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309B', roomNumber: '309B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309C', roomNumber: '309C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309D', roomNumber: '309D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310A', roomNumber: '310A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310B', roomNumber: '310B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310C', roomNumber: '310C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310D', roomNumber: '310D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311A', roomNumber: '311A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311B', roomNumber: '311B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311C', roomNumber: '311C', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311D', roomNumber: '311D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312A', roomNumber: '312A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312B', roomNumber: '312B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312C', roomNumber: '312C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312D', roomNumber: '312D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313A', roomNumber: '313A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313C', roomNumber: '313C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313D', roomNumber: '313D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314A', roomNumber: '314A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314B', roomNumber: '314B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314C', roomNumber: '314C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314D', roomNumber: '314D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315A', roomNumber: '315A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315B', roomNumber: '315B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315C', roomNumber: '315C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315D', roomNumber: '315D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315E', roomNumber: '315E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315F', roomNumber: '315F', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315G', roomNumber: '315G', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401A', roomNumber: '401A', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401B', roomNumber: '401B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401C', roomNumber: '401C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401D', roomNumber: '401D', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401E', roomNumber: '401E', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401F', roomNumber: '401F', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401G', roomNumber: '401G', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402A', roomNumber: '402A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402B', roomNumber: '402B', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402C', roomNumber: '402C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402D', roomNumber: '402D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403A', roomNumber: '403A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403C', roomNumber: '403C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403D', roomNumber: '403D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404A', roomNumber: '404A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404B', roomNumber: '404B', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404C', roomNumber: '404C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404D', roomNumber: '404D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405B', roomNumber: '405B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405C', roomNumber: '405C', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405D', roomNumber: '405D', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405E', roomNumber: '405E', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];

const taylorRooms = [
  { id: '012A', roomNumber: '012A', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '012B', roomNumber: '012B', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '012C', roomNumber: '012C', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '014A', roomNumber: '014A', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '014B', roomNumber: '014B', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '014C', roomNumber: '014C', floor: '0', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106B', roomNumber: '106B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106C', roomNumber: '106C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107A', roomNumber: '107A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107B', roomNumber: '107B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107C', roomNumber: '107C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109A', roomNumber: '109A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109B', roomNumber: '109B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109C', roomNumber: '109C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110A', roomNumber: '110A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110B', roomNumber: '110B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110C', roomNumber: '110C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111A', roomNumber: '111A', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111B', roomNumber: '111B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111C', roomNumber: '111C', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111D', roomNumber: '111D', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111E', roomNumber: '111E', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112A', roomNumber: '112A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112B', roomNumber: '112B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112C', roomNumber: '112C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113B', roomNumber: '113B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113C', roomNumber: '113C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114A', roomNumber: '114A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114B', roomNumber: '114B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114C', roomNumber: '114C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115A', roomNumber: '115A', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115B', roomNumber: '115B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115C', roomNumber: '115C', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115D', roomNumber: '115D', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115E', roomNumber: '115E', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115F', roomNumber: '115F', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '115G', roomNumber: '115G', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206A', roomNumber: '206A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206B', roomNumber: '206B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206C', roomNumber: '206C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206D', roomNumber: '206D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207A', roomNumber: '207A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207C', roomNumber: '207C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207D', roomNumber: '207D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209A', roomNumber: '209A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209B', roomNumber: '209B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209C', roomNumber: '209C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209D', roomNumber: '209D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210A', roomNumber: '210A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210B', roomNumber: '210B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210C', roomNumber: '210C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210D', roomNumber: '210D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211A', roomNumber: '211A', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211B', roomNumber: '211B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211C', roomNumber: '211C', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211D', roomNumber: '211D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211E', roomNumber: '211E', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212A', roomNumber: '212A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212B', roomNumber: '212B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212C', roomNumber: '212C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212D', roomNumber: '212D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213A', roomNumber: '213A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213C', roomNumber: '213C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213D', roomNumber: '213D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214A', roomNumber: '214A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214B', roomNumber: '214B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214C', roomNumber: '214C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214D', roomNumber: '214D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215A', roomNumber: '215A', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215B', roomNumber: '215B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215C', roomNumber: '215C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215D', roomNumber: '215D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215E', roomNumber: '215E', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215F', roomNumber: '215F', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215G', roomNumber: '215G', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301A', roomNumber: '301A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301B', roomNumber: '301B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301C', roomNumber: '301C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301D', roomNumber: '301D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301E', roomNumber: '301E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301F', roomNumber: '301F', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301G', roomNumber: '301G', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302A', roomNumber: '302A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302B', roomNumber: '302B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302C', roomNumber: '302C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302D', roomNumber: '302D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303A', roomNumber: '303A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303C', roomNumber: '303C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303D', roomNumber: '303D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304A', roomNumber: '304A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304B', roomNumber: '304B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304C', roomNumber: '304C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304D', roomNumber: '304D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306A', roomNumber: '306A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306B', roomNumber: '306B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306C', roomNumber: '306C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306D', roomNumber: '306D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307A', roomNumber: '307A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307C', roomNumber: '307C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307D', roomNumber: '307D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309A', roomNumber: '309A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309B', roomNumber: '309B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309C', roomNumber: '309C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309D', roomNumber: '309D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310A', roomNumber: '310A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310B', roomNumber: '310B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310C', roomNumber: '310C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310D', roomNumber: '310D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311B', roomNumber: '311B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311C', roomNumber: '311C', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311D', roomNumber: '311D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311E', roomNumber: '311E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312A', roomNumber: '312A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312B', roomNumber: '312B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312C', roomNumber: '312C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312D', roomNumber: '312D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313A', roomNumber: '313A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313C', roomNumber: '313C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313D', roomNumber: '313D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314A', roomNumber: '314A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314B', roomNumber: '314B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314C', roomNumber: '314C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314D', roomNumber: '314D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315A', roomNumber: '315A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315B', roomNumber: '315B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315C', roomNumber: '315C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315D', roomNumber: '315D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315E', roomNumber: '315E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315F', roomNumber: '315F', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315G', roomNumber: '315G', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401A', roomNumber: '401A', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401B', roomNumber: '401B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401C', roomNumber: '401C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401D', roomNumber: '401D', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401E', roomNumber: '401E', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401F', roomNumber: '401F', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401G', roomNumber: '401G', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402A', roomNumber: '402A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402B', roomNumber: '402B', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402C', roomNumber: '402C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402D', roomNumber: '402D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403A', roomNumber: '403A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403C', roomNumber: '403C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403D', roomNumber: '403D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404A', roomNumber: '404A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404B', roomNumber: '404B', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404C', roomNumber: '404C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404D', roomNumber: '404D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];

const kitchinRooms = [
  { id: '009A', roomNumber: '009A', floor: '0', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '009B', roomNumber: '009B', floor: '0', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '009C', roomNumber: '009C', floor: '0', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '105A', roomNumber: '105A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '105B', roomNumber: '105B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '105C', roomNumber: '105C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106A', roomNumber: '106A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106B', roomNumber: '106B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106C', roomNumber: '106C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107A', roomNumber: '107A', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107C', roomNumber: '107C', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109A', roomNumber: '109A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109B', roomNumber: '109B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109C', roomNumber: '109C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109D', roomNumber: '109D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110A', roomNumber: '110A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110B', roomNumber: '110B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110C', roomNumber: '110C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110D', roomNumber: '110D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111A', roomNumber: '111A', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111B', roomNumber: '111B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111C', roomNumber: '111C', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111D', roomNumber: '111D', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111E', roomNumber: '111E', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112A', roomNumber: '112A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112B', roomNumber: '112B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112C', roomNumber: '112C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112D', roomNumber: '112D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113A', roomNumber: '113A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113C', roomNumber: '113C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113D', roomNumber: '113D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114A', roomNumber: '114A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114B', roomNumber: '114B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114C', roomNumber: '114C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114D', roomNumber: '114D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201A', roomNumber: '201A', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201B', roomNumber: '201B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201C', roomNumber: '201C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201D', roomNumber: '201D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201E', roomNumber: '201E', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201F', roomNumber: '201F', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201G', roomNumber: '201G', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205B', roomNumber: '205B', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205C', roomNumber: '205C', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205D', roomNumber: '205D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205E', roomNumber: '205E', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206A', roomNumber: '206A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206B', roomNumber: '206B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206C', roomNumber: '206C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206D', roomNumber: '206D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207A', roomNumber: '207A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207C', roomNumber: '207C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207D', roomNumber: '207D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209A', roomNumber: '209A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209B', roomNumber: '209B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209C', roomNumber: '209C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209D', roomNumber: '209D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210A', roomNumber: '210A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210B', roomNumber: '210B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210C', roomNumber: '210C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210D', roomNumber: '210D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211A', roomNumber: '211A', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211B', roomNumber: '211B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211C', roomNumber: '211C', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211D', roomNumber: '211D', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211E', roomNumber: '211E', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212A', roomNumber: '212A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212B', roomNumber: '212B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212C', roomNumber: '212C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212D', roomNumber: '212D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213A', roomNumber: '213A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213C', roomNumber: '213C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213D', roomNumber: '213D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214A', roomNumber: '214A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214B', roomNumber: '214B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214C', roomNumber: '214C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214D', roomNumber: '214D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215A', roomNumber: '215A', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215B', roomNumber: '215B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215C', roomNumber: '215C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215D', roomNumber: '215D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215E', roomNumber: '215E', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215F', roomNumber: '215F', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215G', roomNumber: '215G', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301A', roomNumber: '301A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301B', roomNumber: '301B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301C', roomNumber: '301C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301D', roomNumber: '301D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301E', roomNumber: '301E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301F', roomNumber: '301F', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301G', roomNumber: '301G', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302A', roomNumber: '302A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302B', roomNumber: '302B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302C', roomNumber: '302C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302D', roomNumber: '302D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303A', roomNumber: '303A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303C', roomNumber: '303C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303D', roomNumber: '303D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304A', roomNumber: '304A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304B', roomNumber: '304B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304C', roomNumber: '304C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304D', roomNumber: '304D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '305A', roomNumber: '305A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '305B', roomNumber: '305B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '305C', roomNumber: '305C', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '305D', roomNumber: '305D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '305E', roomNumber: '305E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306A', roomNumber: '306A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306B', roomNumber: '306B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306C', roomNumber: '306C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306D', roomNumber: '306D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307A', roomNumber: '307A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307B', roomNumber: '307B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307C', roomNumber: '307C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307D', roomNumber: '307D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309A', roomNumber: '309A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309B', roomNumber: '309B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309C', roomNumber: '309C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309D', roomNumber: '309D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310A', roomNumber: '310A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310B', roomNumber: '310B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310C', roomNumber: '310C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310D', roomNumber: '310D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311A', roomNumber: '311A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311B', roomNumber: '311B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311C', roomNumber: '311C', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311D', roomNumber: '311D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312A', roomNumber: '312A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312B', roomNumber: '312B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312C', roomNumber: '312C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312D', roomNumber: '312D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313A', roomNumber: '313A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313C', roomNumber: '313C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313D', roomNumber: '313D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314A', roomNumber: '314A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314B', roomNumber: '314B', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314C', roomNumber: '314C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314D', roomNumber: '314D', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315A', roomNumber: '315A', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315B', roomNumber: '315B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315C', roomNumber: '315C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315D', roomNumber: '315D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315E', roomNumber: '315E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315F', roomNumber: '315F', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315G', roomNumber: '315G', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401A', roomNumber: '401A', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401B', roomNumber: '401B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401C', roomNumber: '401C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401D', roomNumber: '401D', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401E', roomNumber: '401E', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401F', roomNumber: '401F', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401G', roomNumber: '401G', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402A', roomNumber: '402A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402B', roomNumber: '402B', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402C', roomNumber: '402C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402D', roomNumber: '402D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403A', roomNumber: '403A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403C', roomNumber: '403C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403D', roomNumber: '403D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404A', roomNumber: '404A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404B', roomNumber: '404B', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404C', roomNumber: '404C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404D', roomNumber: '404D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405A', roomNumber: '405A', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405B', roomNumber: '405B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405C', roomNumber: '405C', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '405D', roomNumber: '405D', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];

const poteatRooms = [
  { id: '106A', roomNumber: '106A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106B', roomNumber: '106B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107A', roomNumber: '107A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107B', roomNumber: '107B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107C', roomNumber: '107C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107A', roomNumber: '107A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107B', roomNumber: '107B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107C', roomNumber: '107C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109A', roomNumber: '109A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109B', roomNumber: '109B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109C', roomNumber: '109C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110A', roomNumber: '110A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110B', roomNumber: '110B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '110C', roomNumber: '110C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111A', roomNumber: '111A', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111B', roomNumber: '111B', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111C', roomNumber: '111C', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111D', roomNumber: '111D', floor: '1', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111E', roomNumber: '111E', floor: '1', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112A', roomNumber: '112A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112C', roomNumber: '112C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '112D', roomNumber: '112D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113A', roomNumber: '113A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113B', roomNumber: '113B', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '113C', roomNumber: '113C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114A', roomNumber: '114A', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114B', roomNumber: '114B', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114C', roomNumber: '114C', floor: '1', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '114D', roomNumber: '114D', floor: '1', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201A', roomNumber: '201A', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201B', roomNumber: '201B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201C', roomNumber: '201C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201D', roomNumber: '201D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201E', roomNumber: '201E', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201F', roomNumber: '201F', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201G', roomNumber: '201G', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206A', roomNumber: '206A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206B', roomNumber: '206B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206C', roomNumber: '206C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206D', roomNumber: '206D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207A', roomNumber: '207A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207C', roomNumber: '207C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207D', roomNumber: '207D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209A', roomNumber: '209A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209B', roomNumber: '209B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '290C', roomNumber: '290C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209D', roomNumber: '209D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210A', roomNumber: '210A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210B', roomNumber: '210B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210C', roomNumber: '210C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '210D', roomNumber: '210D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211A', roomNumber: '211A', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211B', roomNumber: '211B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211C', roomNumber: '211C', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211D', roomNumber: '211D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211E', roomNumber: '211E', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212A', roomNumber: '212A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212B', roomNumber: '212B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212C', roomNumber: '212C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '212D', roomNumber: '212D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213A', roomNumber: '213A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213C', roomNumber: '213C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '213D', roomNumber: '213D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214A', roomNumber: '214A', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214B', roomNumber: '214B', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214C', roomNumber: '214C', floor: '2', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '214D', roomNumber: '214D', floor: '2', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215A', roomNumber: '215A', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215B', roomNumber: '215B', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215C', roomNumber: '215C', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215D', roomNumber: '215D', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215E', roomNumber: '215E', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215F', roomNumber: '215F', floor: '2', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '215G', roomNumber: '215G', floor: '2', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301A', roomNumber: '301A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301B', roomNumber: '301B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301C', roomNumber: '301C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301D', roomNumber: '301D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301E', roomNumber: '301E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301F', roomNumber: '301F', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301G', roomNumber: '301G', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302A', roomNumber: '302A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302B', roomNumber: '302B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302C', roomNumber: '302C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302D', roomNumber: '302D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303A', roomNumber: '303A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303C', roomNumber: '303C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303D', roomNumber: '303D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304A', roomNumber: '304A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304B', roomNumber: '304B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304C', roomNumber: '304C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304D', roomNumber: '304D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306A', roomNumber: '306A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306B', roomNumber: '306B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306C', roomNumber: '306C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '306D', roomNumber: '306D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307A', roomNumber: '307A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307C', roomNumber: '307C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '307D', roomNumber: '307D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309A', roomNumber: '309A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309B', roomNumber: '309B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309C', roomNumber: '309C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '309D', roomNumber: '309D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310A', roomNumber: '310A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310B', roomNumber: '310B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310C', roomNumber: '310C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '310D', roomNumber: '310D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311A', roomNumber: '311A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311B', roomNumber: '311B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311C', roomNumber: '311C', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311D', roomNumber: '311D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '311E', roomNumber: '311E', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312A', roomNumber: '312A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312B', roomNumber: '312B', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '312C', roomNumber: '312C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313A', roomNumber: '313A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313C', roomNumber: '313C', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '313D', roomNumber: '313D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314A', roomNumber: '314A', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314B', roomNumber: '314B', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314C', roomNumber: '314C', floor: '3', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '314D', roomNumber: '314D', floor: '3', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315A', roomNumber: '315A', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315B', roomNumber: '315B', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315C', roomNumber: '315C', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315D', roomNumber: '315D', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315E', roomNumber: '315E', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315F', roomNumber: '315F', floor: '3', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '315G', roomNumber: '315G', floor: '3', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401A', roomNumber: '401A', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401B', roomNumber: '401B', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401C', roomNumber: '401C', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401D', roomNumber: '401D', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401E', roomNumber: '401E', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401F', roomNumber: '401F', floor: '4', type: 'double', capacity: 2, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '401G', roomNumber: '401G', floor: '4', type: 'single', capacity: 1, bathrooms: 2, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402A', roomNumber: '402A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402B', roomNumber: '402B', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402C', roomNumber: '402C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '402D', roomNumber: '402D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403A', roomNumber: '403A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403C', roomNumber: '403C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '403D', roomNumber: '403D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404A', roomNumber: '404A', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404B', roomNumber: '404B', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404C', roomNumber: '404C', floor: '4', type: 'single', capacity: 1, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '404D', roomNumber: '404D', floor: '4', type: 'double', capacity: 2, bathrooms: 1, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];

const huffmanRooms = [
  { id: '1', roomNumber: '1', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '2', roomNumber: '2', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '3', roomNumber: '3', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '4', roomNumber: '4', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '5', roomNumber: '5', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '6', roomNumber: '6', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '7', roomNumber: '7', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '8', roomNumber: '8', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '9', roomNumber: '9', floor: '0', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '10', roomNumber: '10', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '11', roomNumber: '11', floor: '0', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '12', roomNumber: '12', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '13', roomNumber: '13', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '14', roomNumber: '14', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '15', roomNumber: '15', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '16', roomNumber: '16', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '17', roomNumber: '17', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '18', roomNumber: '18', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '19', roomNumber: '19', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '20', roomNumber: '20', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '21', roomNumber: '21', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '22', roomNumber: '22', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '23', roomNumber: '23', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '24', roomNumber: '24', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '25', roomNumber: '25', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '26', roomNumber: '26', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '27', roomNumber: '27', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '105', roomNumber: '105', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106', roomNumber: '106', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107', roomNumber: '107', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109', roomNumber: '109', floor: '1', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111', roomNumber: '111', floor: '1', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '124', roomNumber: '124', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125', roomNumber: '125', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '126', roomNumber: '126', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '127', roomNumber: '127', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '129', roomNumber: '129', floor: '1', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201', roomNumber: '201', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202', roomNumber: '202', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '203', roomNumber: '203', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '204', roomNumber: '204', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205', roomNumber: '205', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206', roomNumber: '206', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207', roomNumber: '207', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209', roomNumber: '209', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211', roomNumber: '211', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '221', roomNumber: '221', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '222', roomNumber: '222', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '223', roomNumber: '223', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '224', roomNumber: '224', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225', roomNumber: '225', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '226', roomNumber: '226', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '227', roomNumber: '227', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '229', roomNumber: '229', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '231', roomNumber: '231', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '234', roomNumber: '234', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '236', roomNumber: '236', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '241', roomNumber: '241', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301', roomNumber: '301', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302', roomNumber: '302', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303', roomNumber: '303', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304', roomNumber: '304', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320', roomNumber: '320', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '322', roomNumber: '322', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '321', roomNumber: '321', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '323', roomNumber: '323', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '324', roomNumber: '324', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '334', roomNumber: '334', floor: '3', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '336', roomNumber: '336', floor: '3', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '341', roomNumber: '341', floor: '3', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];

const efirdRooms = [
  { id: '1', roomNumber: '1', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '2', roomNumber: '2', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '3', roomNumber: '3', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '4', roomNumber: '4', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '5', roomNumber: '5', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '6', roomNumber: '6', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '7', roomNumber: '7', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '9', roomNumber: '9', floor: '0', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '11', roomNumber: '11', floor: '0', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '21', roomNumber: '21', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '22', roomNumber: '22', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '23', roomNumber: '23', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '24', roomNumber: '24', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '25', roomNumber: '25', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '26', roomNumber: '26', floor: '0', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '29', roomNumber: '29', floor: '0', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '31', roomNumber: '31', floor: '0', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '105', roomNumber: '105', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '106', roomNumber: '106', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '107', roomNumber: '107', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '109', roomNumber: '109', floor: '1', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '111', roomNumber: '111', floor: '1', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '121', roomNumber: '121', floor: '1', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '124', roomNumber: '124', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '125', roomNumber: '125', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '126', roomNumber: '126', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '127', roomNumber: '127', floor: '1', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '129', roomNumber: '129', floor: '1', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '131', roomNumber: '131', floor: '1', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '201', roomNumber: '201', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '202', roomNumber: '202', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '203', roomNumber: '203', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '204', roomNumber: '204', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '205', roomNumber: '205', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '206', roomNumber: '206', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '207', roomNumber: '207', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '209', roomNumber: '209', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '211', roomNumber: '211', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '221', roomNumber: '221', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '222', roomNumber: '222', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '223', roomNumber: '223', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '224', roomNumber: '224', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '225', roomNumber: '225', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '226', roomNumber: '226', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '227', roomNumber: '227', floor: '2', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '229', roomNumber: '229', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '231', roomNumber: '231', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '234', roomNumber: '234', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '236', roomNumber: '236', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '241', roomNumber: '241', floor: '2', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '301', roomNumber: '301', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '302', roomNumber: '302', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '303', roomNumber: '303', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '304', roomNumber: '304', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '320', roomNumber: '320', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '321', roomNumber: '321', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '322', roomNumber: '322', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '323', roomNumber: '323', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '324', roomNumber: '324', floor: '3', type: 'single', capacity: 1, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '334', roomNumber: '334', floor: '3', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '336', roomNumber: '336', floor: '3', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() },
  { id: '341', roomNumber: '341', floor: '3', type: 'double', capacity: 2, bathrooms: 0, sharedLiving: false, occupancyStatus: 'available', occupants: [], createdAt: new Date().toISOString() }
];