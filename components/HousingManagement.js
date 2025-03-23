import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  writeBatch,
  where,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const HousingManagement = () => {
  // States for dorm management
  const [dorms, setDorms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for adding/editing dorms
  const [isAddingDorm, setIsAddingDorm] = useState(false);
  const [editingDormId, setEditingDormId] = useState(null); // Track which dorm is being edited by ID
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [currentDorm, setCurrentDorm] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [massActionLoading, setMassActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    dormName: '',
    description: '',
    roomNumber: '',
    capacity: 1,
    floor: 1,
    type: 'standard'
  });

  // Fetch dorms and users on component mount
  useEffect(() => {
    fetchDormsAndUsers();
    // Initialize empty selected rooms object
    setSelectedRooms({});
    
    // Set up a listener for user changes
    const fetchUserDetails = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        const usersList = usersSnapshot.docs.map(userDoc => ({
          id: userDoc.id,
          ...userDoc.data()
        }));
        
        setUsers(usersList);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };
    
    fetchUserDetails();
    
    // You could set up a real-time listener here if needed
    // const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
    //   const usersList = snapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data()
    //   }));
    //   setUsers(usersList);
    // });
    // 
    // return () => unsubscribe();
  }, []);

  // Start editing a dorm
  const startEditingDorm = (dorm) => {
    setCurrentDorm(dorm);
    setEditingDormId(dorm.id); // Set the ID of the dorm being edited
    setFormData({
      ...formData,
      dormName: dorm.name,
      description: dorm.description || ''
    });
  };

  // Start adding room to a specific dorm
  const startAddingRoom = (dorm) => {
    setCurrentDorm(dorm);
    setIsAddingRoom(true);
    setFormData({
      ...formData,
      roomNumber: '',
      capacity: 1,
      floor: 1,
      type: 'standard'
    });
  };

  // Function to fetch all dorms and users
  const fetchDormsAndUsers = async () => {
    try {
      setLoading(true);
      const dormQuery = query(collection(db, 'dorms'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(dormQuery);

      // Process dorms
      const dormsList = [];

      for (const dormDoc of querySnapshot.docs) {
        const dormData = {
          id: dormDoc.id,
          ...dormDoc.data(),
          rooms: []
        };

        // Fetch rooms for this dorm
        const roomsQuery = query(
          collection(db, 'dorms', dormDoc.id, 'rooms'),
          orderBy('roomNumber')
        );
        const roomsSnapshot = await getDocs(roomsQuery);

        // Add rooms to dorm
        dormData.rooms = roomsSnapshot.docs.map(roomDoc => ({
          id: roomDoc.id,
          ...roomDoc.data(),
          occupants: roomDoc.data().occupants || []
        }));

        dormsList.push(dormData);
      }

      setDorms(dormsList);

      // Fetch users
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      
      const usersList = usersSnapshot.docs.map(userDoc => ({
        id: userDoc.id,
        ...userDoc.data()
      }));
      
      setUsers(usersList);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dorms, rooms, and users');
    } finally {
      setLoading(false);
    }
  };

  // Handle dorm form input changes
  const handleDormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle room form input changes
  const handleRoomInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value
    }));
  };

  // Add a new dorm
  const handleAddDorm = async (e) => {
    e.preventDefault();

    try {
      if (!formData.dormName.trim()) {
        throw new Error('Dorm name is required');
      }

      // Add dorm to Firestore
      await addDoc(collection(db, 'dorms'), {
        name: formData.dormName.trim(),
        description: formData.description.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Reset form and refresh dorms
      setFormData({
        ...formData,
        dormName: '',
        description: ''
      });
      setIsAddingDorm(false);
      await fetchDormsAndUsers();
    } catch (err) {
      console.error('Error adding dorm:', err);
      setError(`Error adding dorm: ${err.message}`);
    }
  };

  // Update an existing dorm
  const handleUpdateDorm = async (e, dormId) => {
    e.preventDefault();

    try {
      if (!dormId) {
        throw new Error('No dorm selected for editing');
      }

      if (!formData.dormName.trim()) {
        throw new Error('Dorm name is required');
      }

      // Update dorm in Firestore
      await updateDoc(doc(db, 'dorms', dormId), {
        name: formData.dormName.trim(),
        description: formData.description.trim(),
        updatedAt: serverTimestamp()
      });

      // Reset form and refresh dorms
      setFormData({
        ...formData,
        dormName: '',
        description: ''
      });
      setEditingDormId(null); // Clear editing state
      setCurrentDorm(null);
      await fetchDormsAndUsers();
    } catch (err) {
      console.error('Error updating dorm:', err);
      setError(`Error updating dorm: ${err.message}`);
    }
  };

  // Add a new room to a dorm
  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      if (!currentDorm) {
        throw new Error('No dorm selected');
      }

      if (!formData.roomNumber.trim()) {
        throw new Error('Room number is required');
      }

      // Add room to Firestore
      await addDoc(collection(db, 'dorms', currentDorm.id, 'rooms'), {
        roomNumber: formData.roomNumber.trim(),
        capacity: formData.capacity,
        floor: formData.floor,
        type: formData.type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        occupants: []
      });

      // Reset form and refresh dorms
      setFormData({
        ...formData,
        roomNumber: ''
      });
      setIsAddingRoom(false);
      setCurrentDorm(null);
      await fetchDormsAndUsers();
    } catch (err) {
      console.error('Error adding room:', err);
      setError(`Error adding room: ${err.message}`);
    }
  };

  // Delete a dorm
  const handleDeleteDorm = async (dormId) => {
    if (window.confirm('Are you sure you want to delete this dorm? This will also delete all rooms in this dorm.')) {
      try {
        // First check if any users are assigned to rooms in this dorm
        const dorm = dorms.find(d => d.id === dormId);
        if (dorm) {
          const hasOccupants = dorm.rooms.some(room => room.occupants && room.occupants.length > 0);
          if (hasOccupants) {
            if (!window.confirm('This dorm has occupants. Deleting it will remove room assignments for these users. Continue?')) {
              return;
            }
            
            // If confirmed, remove room assignments for all users in this dorm
            const batch = writeBatch(db);
            const roomIds = dorm.rooms.map(room => room.id);
            
            for (const user of users) {
              if (user.selectedRoom && 
                  user.selectedRoom.dormId === dormId) {
                batch.update(doc(db, 'users', user.id), {
                  selectedRoom: null
                });
              }
            }
            
            await batch.commit();
          }
        }
        
        // Now delete the dorm
        await deleteDoc(doc(db, 'dorms', dormId));
        await fetchDormsAndUsers();
      } catch (err) {
        console.error('Error deleting dorm:', err);
        setError(`Error deleting dorm: ${err.message}`);
      }
    }
  };

  // Delete a room
  const handleDeleteRoom = async (dormId, roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        // First check if any users are assigned to this room
        const dorm = dorms.find(d => d.id === dormId);
        const room = dorm?.rooms.find(r => r.id === roomId);
        
        if (room && room.occupants && room.occupants.length > 0) {
          if (!window.confirm('This room has occupants. Deleting it will remove room assignments for these users. Continue?')) {
            return;
          }
          
          // Remove room assignments for all users in this room
          const batch = writeBatch(db);
          
          for (const user of users) {
            if (user.selectedRoom && 
                user.selectedRoom.dormId === dormId && 
                user.selectedRoom.id === roomId) {
              batch.update(doc(db, 'users', user.id), {
                selectedRoom: null
              });
            }
          }
          
          await batch.commit();
        }
        
        // Now delete the room
        await deleteDoc(doc(db, 'dorms', dormId, 'rooms', roomId));
        await fetchDormsAndUsers();
      } catch (err) {
        console.error('Error deleting room:', err);
        setError(`Error deleting room: ${err.message}`);
      }
    }
  };

  // Remove a user from a room
  const handleRemoveUserFromRoom = async (userId, dormId, roomId) => {
    if (window.confirm('Are you sure you want to remove this user from the room?')) {
      try {
        // Get the room and user references
        const roomRef = doc(db, 'dorms', dormId, 'rooms', roomId);
        const userRef = doc(db, 'users', userId);
        
        // Get current room data
        const roomDoc = await getDoc(roomRef);
        if (!roomDoc.exists()) {
          throw new Error('Room not found');
        }
        
        const roomData = roomDoc.data();
        const occupants = roomData.occupants || [];
        
        // Update room to remove user from occupants
        await updateDoc(roomRef, {
          occupants: occupants.filter(id => id !== userId),
          updatedAt: serverTimestamp()
        });
        
        // Update user to remove selectedRoom
        await updateDoc(userRef, {
          selectedRoom: null
        });
        
        await fetchDormsAndUsers();
      } catch (err) {
        console.error('Error removing user from room:', err);
        setError(`Error removing user: ${err.message}`);
      }
    }
  };

  // Delete multiple rooms
  const handleMassDeleteRooms = async (dormId) => {
    if (!selectedRooms[dormId] || Object.keys(selectedRooms[dormId]).length === 0) {
      setError("No rooms selected for deletion");
      return;
    }

    const roomsToDelete = Object.keys(selectedRooms[dormId]).filter(
      roomId => selectedRooms[dormId][roomId]
    );

    if (roomsToDelete.length === 0) {
      setError("No rooms selected for deletion");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${roomsToDelete.length} selected room(s)?`)) {
      try {
        setMassActionLoading(true);
        
        // Check if any users are assigned to these rooms
        const dorm = dorms.find(d => d.id === dormId);
        const roomsWithOccupants = dorm.rooms
          .filter(room => roomsToDelete.includes(room.id) && room.occupants && room.occupants.length > 0);
        
        if (roomsWithOccupants.length > 0) {
          if (!window.confirm(`${roomsWithOccupants.length} of these rooms have occupants. Deleting them will remove room assignments for these users. Continue?`)) {
            setMassActionLoading(false);
            return;
          }
        }
        
        const batch = writeBatch(db);

        // First remove user assignments
        for (const user of users) {
          if (user.selectedRoom && 
              user.selectedRoom.dormId === dormId && 
              roomsToDelete.includes(user.selectedRoom.id)) {
            batch.update(doc(db, 'users', user.id), {
              selectedRoom: null
            });
          }
        }
        
        // Then delete rooms
        roomsToDelete.forEach(roomId => {
          const roomRef = doc(db, 'dorms', dormId, 'rooms', roomId);
          batch.delete(roomRef);
        });

        await batch.commit();

        // Clear selections for this dorm
        const updatedSelectedRooms = { ...selectedRooms };
        delete updatedSelectedRooms[dormId];
        setSelectedRooms(updatedSelectedRooms);

        await fetchDormsAndUsers();
      } catch (err) {
        console.error('Error deleting rooms:', err);
        setError(`Error deleting rooms: ${err.message}`);
      } finally {
        setMassActionLoading(false);
      }
    }
  };

  // Handle room selection checkbox change
  const handleRoomSelection = (dormId, roomId, isChecked) => {
    setSelectedRooms(prev => {
      const newSelectedRooms = { ...prev };

      // Initialize dorm's selected rooms if not yet exist
      if (!newSelectedRooms[dormId]) {
        newSelectedRooms[dormId] = {};
      }

      // Set the room's selected state
      newSelectedRooms[dormId][roomId] = isChecked;

      return newSelectedRooms;
    });
  };

  // Handle select all rooms in a dorm
  const handleSelectAllRooms = (dormId, rooms, isChecked) => {
    setSelectedRooms(prev => {
      const newSelectedRooms = { ...prev };

      // Initialize dorm's selected rooms
      newSelectedRooms[dormId] = {};

      // Set all rooms' selected state
      rooms.forEach(room => {
        newSelectedRooms[dormId][room.id] = isChecked;
      });

      return newSelectedRooms;
    });
  };

  // Check if all rooms in a dorm are selected
  const areAllRoomsSelected = (dormId, rooms) => {
    if (!selectedRooms[dormId] || rooms.length === 0) return false;

    return rooms.every(room => selectedRooms[dormId][room.id]);
  };

  // Get count of selected rooms in a dorm
  const getSelectedRoomCount = (dormId) => {
    if (!selectedRooms[dormId]) return 0;

    return Object.values(selectedRooms[dormId]).filter(Boolean).length;
  };
  
  // Get user details by ID
  const getUserById = (userId) => {
    const user = users.find(user => user.id === userId);
    
    if (user) {
      return {
        id: user.id,
        name: user.name || user.email || (user.firstName && user.lastName ? 
              `${user.firstName} ${user.lastName}` : 
              (user.firstName || user.lastName || user.displayName || 'User')),
        email: user.email
      };
    }
    
    // Try to fetch the user if not in our local cache
    // This is a placeholder for the actual implementation
    return { 
      id: userId, 
      name: `User ${userId.substring(0, 5)}...`, // Truncate ID for display
      unknown: true 
    };
  };

  // Get occupant details for a room
  const getOccupantDetails = (occupantIds) => {
    if (!occupantIds || occupantIds.length === 0) return [];
    
    return occupantIds.map(id => {
      const user = getUserById(id);
      return {
        id: user.id,
        name: user.name || user.email || id
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-700">Loading housing data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Dorms and Rooms Management</h3>
        <button
          onClick={() => setIsAddingDorm(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded transition duration-200"
        >
          Add New Dorm
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          {error}
          <button
            className="ml-2 text-red-600 font-medium hover:text-red-800"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add Dorm Form */}
      {isAddingDorm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h4 className="text-lg font-bold mb-4 text-gray-900">Add New Dorm</h4>
          <form onSubmit={handleAddDorm}>
            <div className="mb-4">
              <label htmlFor="dormName" className="block text-gray-700 font-medium mb-2">
                Dorm Name*
              </label>
              <input
                id="dormName"
                name="dormName"
                type="text"
                value={formData.dormName}
                onChange={handleDormInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter dorm name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleDormInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 h-24"
                placeholder="Enter dorm description (optional)"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingDorm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                Add Dorm
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Room Form */}
      {isAddingRoom && currentDorm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h4 className="text-lg font-bold mb-4 text-gray-900">
            Add Room to {currentDorm.name}
          </h4>
          <form onSubmit={handleAddRoom}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="roomNumber" className="block text-gray-700 font-medium mb-2">
                  Room Number*
                </label>
                <input
                  id="roomNumber"
                  name="roomNumber"
                  type="text"
                  value={formData.roomNumber}
                  onChange={handleRoomInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g. 101A"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="floor" className="block text-gray-700 font-medium mb-2">
                  Floor
                </label>
                <input
                  id="floor"
                  name="floor"
                  type="number"
                  min="1"
                  value={formData.floor}
                  onChange={handleRoomInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="capacity" className="block text-gray-700 font-medium mb-2">
                  Capacity
                </label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.capacity}
                  onChange={handleRoomInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
                  Room Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleRoomInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="standard">Standard</option>
                  <option value="suite">Suite</option>
                  <option value="double">Double</option>
                  <option value="single">Single</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingRoom(false);
                  setCurrentDorm(null);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dorms and Rooms List */}
      {dorms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
          <p className="text-gray-500">No dorms have been added yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dorms.map(dorm => (
            <div
              key={dorm.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{dorm.name}</h4>
                  {dorm.description && (
                    <p className="text-sm text-gray-600 mt-1">{dorm.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditingDorm(dorm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded transition duration-200"
                  >
                    Edit Dorm
                  </button>
                  <button
                    onClick={() => startAddingRoom(dorm)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-1 px-3 rounded transition duration-200"
                  >
                    Add Room
                  </button>
                  <button
                    onClick={() => handleDeleteDorm(dorm.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1 px-3 rounded transition duration-200"
                  >
                    Delete Dorm
                  </button>
                </div>
              </div>

              {/* Inline Edit Dorm Form - Only shows for the currently edited dorm */}
              {editingDormId === dorm.id && (
                <div className="p-4 bg-yellow-50 border-b border-gray-200">
                  <h4 className="text-lg font-bold mb-4 text-gray-900">
                    Edit Dorm: {dorm.name}
                  </h4>
                  <form onSubmit={(e) => handleUpdateDorm(e, dorm.id)}>
                    <div className="mb-4">
                      <label htmlFor={`dormName-${dorm.id}`} className="block text-gray-700 font-medium mb-2">
                        Dorm Name*
                      </label>
                      <input
                        id={`dormName-${dorm.id}`}
                        name="dormName"
                        type="text"
                        value={formData.dormName}
                        onChange={handleDormInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Enter dorm name"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor={`description-${dorm.id}`} className="block text-gray-700 font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        id={`description-${dorm.id}`}
                        name="description"
                        value={formData.description}
                        onChange={handleDormInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 h-24"
                        placeholder="Enter dorm description (optional)"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDormId(null);
                          setCurrentDorm(null);
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                      >
                        Update Dorm
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Rooms */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-700">Rooms ({dorm.rooms.length})</h5>

                  {dorm.rooms.length > 0 && (
                    <div className="flex items-center space-x-2">
                      {getSelectedRoomCount(dorm.id) > 0 && (
                        <span className="text-sm text-gray-500">
                          {getSelectedRoomCount(dorm.id)} selected
                        </span>
                      )}
                      <button
                        onClick={() => handleMassDeleteRooms(dorm.id)}
                        disabled={getSelectedRoomCount(dorm.id) === 0 || massActionLoading}
                        className={`text-xs py-1 px-2 rounded ${getSelectedRoomCount(dorm.id) === 0 || massActionLoading
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                      >
                        Delete Selected
                      </button>
                    </div>
                  )}
                </div>

                {dorm.rooms.length === 0 ? (
                  <p className="text-gray-500 text-sm">No rooms have been added to this dorm yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                                checked={areAllRoomsSelected(dorm.id, dorm.rooms)}
                                onChange={(e) => handleSelectAllRooms(dorm.id, dorm.rooms, e.target.checked)}
                              />
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupants</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dorm.rooms.map(room => (
                          <tr key={room.id}>
                            <td className="px-2 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                                checked={selectedRooms[dorm.id]?.[room.id] || false}
                                onChange={(e) => handleRoomSelection(dorm.id, room.id, e.target.checked)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{room.roomNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{room.floor}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{room.capacity}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500">
                                {room.type?.charAt(0).toUpperCase() + room.type?.slice(1) || 'Standard'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {room.occupants && room.occupants.length > 0 ? (
                                <div className="space-y-1">
                                  {getOccupantDetails(room.occupants).map(occupant => (
                                    <div key={occupant.id} className="flex items-center">
                                      <span className={`text-sm ${occupant.unknown ? 'text-orange-500' : 'text-gray-700'} mr-2`}>
                                        {occupant.name}
                                        {occupant.email && ` (${occupant.email})`}
                                      </span>
                                      <button
                                        onClick={() => handleRemoveUserFromRoom(occupant.id, dorm.id, room.id)}
                                        className="text-xs py-1 px-2 bg-red-100 text-red-700 hover:bg-red-200 rounded"
                                        title="Remove user from room"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">No occupants</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteRoom(dorm.id, room.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete Room
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HousingManagement;