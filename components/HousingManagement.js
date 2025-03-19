// Start adding room to a specific dorm
const startAddingRoom = (dorm) => {
    setCurrentDorm(dorm);
    setIsAddingRoom(true);
    setFormData({
      ...formData,
      roomNumber: '',
      capacity: 1,
      floor: 1,
      isSuite: false,
      isAvailable: true
    });
  };import { useState, useEffect } from 'react';
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
  writeBatch 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const HousingManagement = () => {
  // States for dorm management
  const [dorms, setDorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for adding/editing dorms
  const [isAddingDorm, setIsAddingDorm] = useState(false);
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
    isSuite: false,
    isAvailable: true
  });
  
  // Fetch dorms on component mount
  useEffect(() => {
    fetchDorms();
    // Initialize empty selected rooms object
    setSelectedRooms({});
  }, []);
  
  // Function to fetch all dorms
  const fetchDorms = async () => {
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
          ...roomDoc.data()
        }));
        
        dormsList.push(dormData);
      }
      
      setDorms(dormsList);
    } catch (err) {
      console.error('Error fetching dorms:', err);
      setError('Failed to load dorms and rooms');
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
      await fetchDorms();
    } catch (err) {
      console.error('Error adding dorm:', err);
      setError(`Error adding dorm: ${err.message}`);
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
        isSuite: formData.isSuite,
        isAvailable: formData.isAvailable,
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
      await fetchDorms();
    } catch (err) {
      console.error('Error adding room:', err);
      setError(`Error adding room: ${err.message}`);
    }
  };
  
  // Delete a dorm
  const handleDeleteDorm = async (dormId) => {
    if (window.confirm('Are you sure you want to delete this dorm? This will also delete all rooms in this dorm.')) {
      try {
        await deleteDoc(doc(db, 'dorms', dormId));
        await fetchDorms();
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
        await deleteDoc(doc(db, 'dorms', dormId, 'rooms', roomId));
        await fetchDorms();
      } catch (err) {
        console.error('Error deleting room:', err);
        setError(`Error deleting room: ${err.message}`);
      }
    }
  };
  
  // Toggle room availability
  const toggleRoomAvailability = async (dormId, roomId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'dorms', dormId, 'rooms', roomId), {
        isAvailable: !currentStatus,
        updatedAt: serverTimestamp()
      });
      await fetchDorms();
    } catch (err) {
      console.error('Error updating room availability:', err);
      setError(`Error updating room: ${err.message}`);
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
        const batch = writeBatch(db);
        
        roomsToDelete.forEach(roomId => {
          const roomRef = doc(db, 'dorms', dormId, 'rooms', roomId);
          batch.delete(roomRef);
        });
        
        await batch.commit();
        
        // Clear selections for this dorm
        const updatedSelectedRooms = { ...selectedRooms };
        delete updatedSelectedRooms[dormId];
        setSelectedRooms(updatedSelectedRooms);
        
        await fetchDorms();
      } catch (err) {
        console.error('Error deleting rooms:', err);
        setError(`Error deleting rooms: ${err.message}`);
      } finally {
        setMassActionLoading(false);
      }
    }
  };

  // Set availability for multiple rooms
  const handleMassAvailability = async (dormId, makeAvailable) => {
    if (!selectedRooms[dormId] || Object.keys(selectedRooms[dormId]).length === 0) {
      setError(`No rooms selected to mark ${makeAvailable ? 'available' : 'unavailable'}`);
      return;
    }

    const roomsToUpdate = Object.keys(selectedRooms[dormId]).filter(
      roomId => selectedRooms[dormId][roomId]
    );

    if (roomsToUpdate.length === 0) {
      setError(`No rooms selected to mark ${makeAvailable ? 'available' : 'unavailable'}`);
      return;
    }

    try {
      setMassActionLoading(true);
      const batch = writeBatch(db);
      
      roomsToUpdate.forEach(roomId => {
        const roomRef = doc(db, 'dorms', dormId, 'rooms', roomId);
        batch.update(roomRef, { 
          isAvailable: makeAvailable,
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      await fetchDorms();
    } catch (err) {
      console.error('Error updating rooms:', err);
      setError(`Error updating rooms: ${err.message}`);
    } finally {
      setMassActionLoading(false);
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
              
              <div className="mb-4 flex items-center">
                <label className="flex items-center text-gray-700">
                  <input
                    id="isSuite"
                    name="isSuite"
                    type="checkbox"
                    checked={formData.isSuite}
                    onChange={handleRoomInputChange}
                    className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  Is Suite
                </label>
                
                <label className="flex items-center text-gray-700 ml-6">
                  <input
                    id="isAvailable"
                    name="isAvailable"
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={handleRoomInputChange}
                    className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  Available
                </label>
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMassAvailability(dorm.id, true)}
                          disabled={getSelectedRoomCount(dorm.id) === 0 || massActionLoading}
                          className={`text-xs py-1 px-2 rounded ${
                            getSelectedRoomCount(dorm.id) === 0 || massActionLoading
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          Mark Available
                        </button>
                        <button
                          onClick={() => handleMassAvailability(dorm.id, false)}
                          disabled={getSelectedRoomCount(dorm.id) === 0 || massActionLoading}
                          className={`text-xs py-1 px-2 rounded ${
                            getSelectedRoomCount(dorm.id) === 0 || massActionLoading
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                        >
                          Mark Unavailable
                        </button>
                        <button
                          onClick={() => handleMassDeleteRooms(dorm.id)}
                          disabled={getSelectedRoomCount(dorm.id) === 0 || massActionLoading}
                          className={`text-xs py-1 px-2 rounded ${
                            getSelectedRoomCount(dorm.id) === 0 || massActionLoading
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          Delete Selected
                        </button>
                      </div>
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                                {room.isSuite ? 'Suite' : 'Standard'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                room.isAvailable 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {room.isAvailable ? 'Available' : 'Not Available'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => toggleRoomAvailability(dorm.id, room.id, room.isAvailable)}
                                className="text-yellow-600 hover:text-yellow-900 mr-3"
                              >
                                {room.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(dorm.id, room.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
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