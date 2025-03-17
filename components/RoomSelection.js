import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';

const RoomSelection = () => {
  const [dorm, setDorm] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeRoommates, setActiveRoommates] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('1');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [groupSelection, setGroupSelection] = useState(false);
  const [filters, setFilters] = useState({
    roomType: '',
    availability: 'available'
  });
  const [hasExistingRoom, setHasExistingRoom] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();
  const { dormId } = router.query;

  // Check authentication and fetch dorm and rooms data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          // Get user data
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: authUser.uid,
              ...userData
            });
            
            // Check if user already has a room selected
            if (userData.selectedRoom) {
              setHasExistingRoom(true);
            }
            
            // Get active roommate connections
            if (userData.roommateConnections && userData.roommateConnections.length > 0) {
              // Fetch user details for each connection
              const roommateDetails = await Promise.all(
                userData.roommateConnections.map(async (uid) => {
                  const roommateDoc = await getDoc(doc(db, 'users', uid));
                  if (roommateDoc.exists()) {
                    return {
                      uid: uid,
                      ...roommateDoc.data()
                    };
                  }
                  return null;
                })
              );
              
              const validRoommates = roommateDetails.filter(roommate => roommate !== null);
              setActiveRoommates(validRoommates);
              
              // Check if we should be in "group selection" mode
              setGroupSelection(validRoommates.length > 0);
              
              // Check if any roommate already has a room
              const roommateWithRoom = validRoommates.find(roommate => roommate.selectedRoom);
              if (roommateWithRoom) {
                setHasExistingRoom(true);
              }
            }

            // Get dorm data from Firestore
            if (dormId) {
              const dormDoc = await getDoc(doc(db, 'dorms', dormId));
              if (dormDoc.exists()) {
                setDorm({
                  id: dormId,
                  ...dormDoc.data()
                });
              } else {
                console.error('Dorm not found in Firestore');
                setLoading(false);
                return;
              }

              // Fetch rooms data from Firestore
              const roomsCollectionRef = collection(db, 'dorms', dormId, 'rooms');
              const roomsSnapshot = await getDocs(roomsCollectionRef);
              
              if (!roomsSnapshot.empty) {
                const roomsData = roomsSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }));
                setRooms(roomsData);
              } else {
                console.log('No rooms found for this dorm');
              }
            }
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      } else {
        // User is signed out, redirect to login
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router, dormId]);

  // Handler for filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for selecting a room
  const handleRoomSelect = (room) => {
    if (hasExistingRoom) {
      setErrorMessage('You or one of your roommates already has a room selected. Please cancel your current room before selecting a new one.');
      return;
    }
    
    setSelectedRoom(room);
    setConfirmationOpen(true);
  };

  // Handler for confirming room selection
  const handleConfirmSelection = async () => {
    if (!selectedRoom || !user) return;
    
    try {
      // Double check that no one in the group already has a room
      if (hasExistingRoom) {
        setErrorMessage('You or one of your roommates already has a room selected. Please cancel your current room before selecting a new one.');
        setConfirmationOpen(false);
        return;
      }
      
      // Get all group members including the current user
      const allGroupMembers = [user, ...activeRoommates];
      const groupMemberIds = allGroupMembers.map(member => member.uid);
      
      // Create room selection data object
      const roomSelectionData = {
        id: selectedRoom.id,
        roomNumber: selectedRoom.roomNumber,
        dormId: dormId,
        dormName: dorm.name,
        type: selectedRoom.type,
        price: selectedRoom.price,
        selectedAt: new Date().toISOString(),
        selectedBy: user.uid
      };
      
      // Use a batch to update multiple documents
      const batch = writeBatch(db);
      
      // Update all user documents
      allGroupMembers.forEach(member => {
        const userRef = doc(db, 'users', member.uid);
        batch.update(userRef, {
          selectedRoom: roomSelectionData
        });
      });
      
      // Update the room document
      const roomRef = doc(db, 'dorms', dormId, 'rooms', selectedRoom.id);
      batch.update(roomRef, {
        occupancyStatus: 'unavailable',
        occupants: groupMemberIds,
        lastUpdated: new Date().toISOString()
      });
      
      // Commit all updates in a single batch
      await batch.commit();
      
      // Update local state to reflect changes
      setRooms(prev => 
        prev.map(room => 
          room.id === selectedRoom.id 
            ? { 
                ...room, 
                occupancyStatus: 'unavailable', 
                occupants: groupMemberIds 
              }
            : room
        )
      );
      
      setConfirmationOpen(false);
      setReservationSuccess(true);
      
    } catch (error) {
      console.error('Error selecting room:', error);
      setErrorMessage('An error occurred while selecting the room. Please try again.');
      setConfirmationOpen(false);
    }
  };
  
  // Cancel existing room selection
  const handleCancelSelection = async () => {
    if (!user?.selectedRoom) return;
    
    try {
      setLoading(true);
      
      // Get the existing room details
      const existingRoom = user.selectedRoom;
      
      // Get all group members including the current user
      const allGroupMembers = [user, ...activeRoommates];
      
      // Use a batch to update multiple documents
      const batch = writeBatch(db);
      
      // Update all user documents to remove room selection
      allGroupMembers.forEach(member => {
        const userRef = doc(db, 'users', member.uid);
        batch.update(userRef, {
          selectedRoom: null
        });
      });
      
      // Update the room document to make it available again
      const roomRef = doc(db, 'dorms', existingRoom.dormId, 'rooms', existingRoom.id);
      batch.update(roomRef, {
        occupancyStatus: 'available',
        occupants: [],
        lastUpdated: new Date().toISOString()
      });
      
      // Commit all updates in a single batch
      await batch.commit();
      
      // If the canceled room is in the current dorm, update local state
      if (existingRoom.dormId === dormId) {
        setRooms(prev => 
          prev.map(room => 
            room.id === existingRoom.id 
              ? { 
                  ...room, 
                  occupancyStatus: 'available', 
                  occupants: [] 
                }
              : room
          )
        );
      }
      
      // Update local state
      setHasExistingRoom(false);
      setErrorMessage('');
      
      // Update user state
      setUser(prev => ({
        ...prev,
        selectedRoom: null
      }));
      
      // Update roommates state
      setActiveRoommates(prev => 
        prev.map(roommate => ({
          ...roommate,
          selectedRoom: null
        }))
      );
      
    } catch (error) {
      console.error('Error canceling room selection:', error);
      setErrorMessage('An error occurred while canceling your room selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms based on selected criteria
  const filteredRooms = rooms.filter(room => {
    // Filter by floor
    if (selectedFloor && room.floor !== selectedFloor) {
      return false;
    }
    
    // Filter by room type
    if (filters.roomType && room.type !== filters.roomType) {
      return false;
    }
    
    // Filter by availability
    if (filters.availability === 'available' && room.occupancyStatus !== 'available') {
      return false;
    }
    
    // If in group selection mode, filter by capacity to ensure enough space for the group
    if (groupSelection) {
      const groupSize = activeRoommates.length + 1; // +1 for the current user
      return room.capacity >= groupSize;
    }
    
    return true;
  });

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

  if (reservationSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">WakeRooms</h1>
        <div className="p-6 bg-white rounded-md shadow-sm border border-gray-200 text-center">
          <div className="inline-block p-2 rounded-full bg-green-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Room Reserved!</h2>
          <p className="mb-4">You've successfully reserved room {selectedRoom?.roomNumber} in {dorm?.name}.</p>
          
          {activeRoommates.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold mb-2">This room has been assigned to you and your roommates:</p>
              <ul className="list-disc list-inside">
                {activeRoommates.map(roommate => (
                  <li key={roommate.uid}>{roommate.firstName} {roommate.lastName}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm">Each of your roommates will see this room selection in their dashboard.</p>
            </div>
          )}
          
          <p className="mb-6">A confirmation email will be sent to your Wake Forest email address.</p>
          <Link href="/dashboard" className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold">
            Return to Dashboard
          </Link>
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
      
      {/* Error message display */}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {/* Existing Room Warning/Cancellation */}
      {hasExistingRoom && (
        <div className="bg-yellow-100 border border-yellow-400 rounded-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">You Already Have a Room</h2>
          <p className="mb-4">
            {user?.selectedRoom ? (
              <>You have already selected Room {user.selectedRoom.roomNumber} in {user.selectedRoom.dormName}.</>
            ) : (
              <>One of your roommates has already selected a room.</>
            )}
          </p>
          <p className="mb-4">You must cancel your current selection before choosing a new room.</p>
          <button
            onClick={handleCancelSelection}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold"
            disabled={loading}
          >
            Cancel Current Room Selection
          </button>
        </div>
      )}
      
      {/* Roommate Group Information */}
      {activeRoommates.length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-green-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Group Selection Mode</h2>
          <p className="mb-4">You are selecting a room for yourself and {activeRoommates.length} roommate{activeRoommates.length > 1 ? 's' : ''}.</p>
          
          <div className="bg-green-50 p-4 rounded-md">
            <p className="font-semibold mb-2">Your Roommates:</p>
            <ul className="list-disc list-inside">
              {activeRoommates.map(roommate => (
                <li key={roommate.uid}>{roommate.firstName} {roommate.lastName}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm">The room you select will be assigned to all members of your group.</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">{dorm?.name}</h2>
        <p className="mb-4">Select a room from the available options below.</p>
        
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="floor" className="block mb-1">Floor</label>
              <select
                id="floor"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="border border-gray-300 p-2 w-full"
              >
                <option value="1">First Floor</option>
                <option value="2">Second Floor</option>
                <option value="3">Third Floor</option>
                <option value="4">Fourth Floor</option>
              </select>
            </div>
            <div>
              <label htmlFor="roomType" className="block mb-1">Room Type</label>
              <select
                id="roomType"
                name="roomType"
                value={filters.roomType}
                onChange={handleFilterChange}
                className="border border-gray-300 p-2 w-full"
              >
                <option value="">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-bold mb-2">Available Rooms on Floor {selectedFloor}</h3>
          
          {filteredRooms.length === 0 ? (
            <p>No rooms match your criteria.</p>
          ) : (
            <div className="space-y-4">
              {filteredRooms.map(room => (
                <div 
                  key={room.id} 
                  className={`border p-4 rounded-md ${room.occupancyStatus === 'available' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">Room {room.roomNumber}</h4>
                      <p className="capitalize">{room.type} Room</p>
                      <p>Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</p>
                      <p>${room.price} per semester</p>
                      
                      {groupSelection && (
                        <p className="mt-2 text-sm font-semibold">
                          {room.capacity >= activeRoommates.length + 1 
                            ? `Suitable for your group of ${activeRoommates.length + 1}` 
                            : `Not enough space for your group of ${activeRoommates.length + 1}`}
                        </p>
                      )}
                    </div>
                    <div>
                      {room.occupancyStatus === 'available' && (!groupSelection || room.capacity >= activeRoommates.length + 1) ? (
                        <button
                          onClick={() => handleRoomSelect(room)}
                          className={`py-1 px-3 rounded font-semibold ${
                            hasExistingRoom 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-yellow-600 hover:bg-yellow-700 text-black'
                          }`}
                          disabled={hasExistingRoom}
                        >
                          Select Room
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded">Unavailable</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {confirmationOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Room Selection</h3>
            <p className="mb-2">Are you sure you want to select Room {selectedRoom.roomNumber} in {dorm?.name}?</p>
            <p className="mb-4">${selectedRoom.price} per semester</p>
            
            {activeRoommates.length > 0 && (
              <div className="mb-4 bg-yellow-50 p-3 rounded-md">
                <p className="font-semibold text-sm">This room will be assigned to you and your {activeRoommates.length} roommate{activeRoommates.length > 1 ? 's' : ''}.</p>
              </div>
            )}
            
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <p className="text-sm"><strong>Note:</strong> Once selected, this room will become unavailable to other students.</p>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmationOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSelection;