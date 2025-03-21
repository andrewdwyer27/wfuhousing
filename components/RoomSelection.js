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
    const [timeSlotActive, setTimeSlotActive] = useState(false);
    const [timeSlotInfo, setTimeSlotInfo] = useState(null);

    const router = useRouter();
    const { dormId } = router.query;

    // Check if the current time is within the user's time slot
    const checkTimeSlot = (timeSlot) => {
        if (!timeSlot) return false;

        const now = new Date();
        const startTime = new Date(timeSlot.startTime);
        const endTime = new Date(timeSlot.endTime);

        return now >= startTime && now <= endTime;
    };

    // Format date for display
    const formatDateTime = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Calculate time remaining in time slot
    const getTimeRemaining = (endTime) => {
        const now = new Date();
        const end = new Date(endTime);
        const diffMs = end - now;

        if (diffMs <= 0) return "Time slot expired";

        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${diffHrs} hr${diffHrs !== 1 ? 's' : ''} ${diffMins} min${diffMins !== 1 ? 's' : ''} remaining`;
    };

    // Log filtered rooms info before render
    console.log("Before rendering - dorm:", dorm);
    console.log("Before rendering - rooms array length:", rooms.length);
    console.log("Before rendering - rooms array:", rooms);
    console.log("Before rendering - selected floor:", selectedFloor);
    console.log("Before rendering - filters:", filters);
    console.log("Before rendering - group selection mode:", groupSelection);
    console.log("Before rendering - active roommates:", activeRoommates);

    // Add these logs to the useEffect hook that loads the rooms data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            console.log("Auth state changed, user:", authUser ? authUser.uid : "No user");

            if (authUser) {
                try {
                    // Get user data
                    console.log("Fetching user document for:", authUser.uid);
                    const userDoc = await getDoc(doc(db, 'users', authUser.uid));
                    console.log("User document exists:", userDoc.exists());

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("User data:", userData);
                        setUser({
                            uid: authUser.uid,
                            ...userData
                        });

                        // Check if user already has a room selected
                        console.log("User selected room:", userData.selectedRoom);
                        if (userData.selectedRoom) {
                            setHasExistingRoom(true);
                        }

                        // Store the current user's time slot active status
                        let currentUserHasActiveTimeSlot = false;

                        // Check if user has an active time slot
                        console.log("User time slot:", userData.timeSlot);
                        if (userData.timeSlot) {
                            currentUserHasActiveTimeSlot = checkTimeSlot(userData.timeSlot);
                            console.log("Time slot active:", currentUserHasActiveTimeSlot);
                            setTimeSlotActive(currentUserHasActiveTimeSlot);
                            setTimeSlotInfo(userData.timeSlot);
                        }

                        // Get active roommate connections
                        console.log("User roommate connections:", userData.roommateConnections);
                        if (userData.roommateConnections && userData.roommateConnections.length > 0) {
                            console.log("Fetching roommate details for:", userData.roommateConnections);
                            // Fetch user details for each connection
                            const roommateDetails = await Promise.all(
                                userData.roommateConnections.map(async (uid) => {
                                    const roommateDoc = await getDoc(doc(db, 'users', uid));
                                    console.log("Roommate document exists:", uid, roommateDoc.exists());
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
                            console.log("Valid roommates:", validRoommates);
                            setActiveRoommates(validRoommates);

                            // Check if we should be in "group selection" mode
                            setGroupSelection(validRoommates.length > 0);
                            console.log("Group selection mode:", validRoommates.length > 0);

                            // Check if any roommate already has a room
                            const roommateWithRoom = validRoommates.find(roommate => roommate.selectedRoom);
                            console.log("Roommate with room:", roommateWithRoom);
                            if (roommateWithRoom) {
                                setHasExistingRoom(true);
                            }

                            // For group selection, at least one person in the group must have an active time slot
                            if (!currentUserHasActiveTimeSlot) {
                                const activeRoommateTimeSlot = validRoommates.find(roommate =>
                                    roommate.timeSlot && checkTimeSlot(roommate.timeSlot)
                                );
                                console.log("Active roommate time slot:", activeRoommateTimeSlot);

                                if (activeRoommateTimeSlot) {
                                    setTimeSlotActive(true);
                                    setTimeSlotInfo(activeRoommateTimeSlot.timeSlot);
                                }
                            }
                        }

                        // Get dorm data from Firestore
                        console.log("dormId from router:", dormId);
                        if (dormId) {
                            console.log("Fetching dorm document for:", dormId);
                            const dormDoc = await getDoc(doc(db, 'dorms', dormId));
                            console.log("Dorm document exists:", dormDoc.exists());

                            if (dormDoc.exists()) {
                                const dormData = dormDoc.data();
                                console.log("Dorm data:", dormData);
                                setDorm({
                                    id: dormId,
                                    ...dormData
                                });
                            } else {
                                console.error('Dorm not found in Firestore');
                                setLoading(false);
                                return;
                            }

                            // Fetch rooms data from Firestore
                            console.log("Attempting to fetch rooms from collection:", `dorms/${dormId}/rooms`);
                            const roomsCollectionRef = collection(db, 'dorms', dormId, 'rooms');
                            const roomsSnapshot = await getDocs(roomsCollectionRef);
                            console.log("Rooms snapshot empty:", roomsSnapshot.empty);
                            console.log("Rooms snapshot size:", roomsSnapshot.size);

                            if (!roomsSnapshot.empty) {
                                const roomsData = roomsSnapshot.docs.map(doc => {
                                    console.log("Room document ID:", doc.id);
                                    console.log("Room data:", doc.data());
                                    return {
                                        id: doc.id,
                                        ...doc.data()
                                    };
                                });
                                console.log("Processed rooms data:", roomsData);
                                setRooms(roomsData);
                            } else {
                                console.log('No rooms found for this dorm');

                                // Try fetching from top-level rooms collection as a fallback
                                console.log("Attempting to fetch from top-level rooms collection with filter");
                                try {
                                    const topLevelRoomsRef = collection(db, 'rooms');
                                    const q = query(topLevelRoomsRef, where("dormId", "==", dormId));
                                    const topLevelSnapshot = await getDocs(q);
                                    console.log("Top-level rooms snapshot empty:", topLevelSnapshot.empty);
                                    console.log("Top-level rooms snapshot size:", topLevelSnapshot.size);

                                    if (!topLevelSnapshot.empty) {
                                        const topLevelRoomsData = topLevelSnapshot.docs.map(doc => ({
                                            id: doc.id,
                                            ...doc.data()
                                        }));
                                        console.log("Top-level rooms data:", topLevelRoomsData);
                                        setRooms(topLevelRoomsData);
                                    } else {
                                        console.log("No rooms found in top-level collection for this dorm either");
                                    }
                                } catch (error) {
                                    console.error("Error fetching from top-level rooms:", error);
                                }
                            }
                        } else {
                            console.error("No dormId in router query parameters");
                        }
                    } else {
                        console.error("User document doesn't exist");
                    }

                    console.log("Finished loading data, setting loading to false");
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    console.log("Error stack:", error.stack);
                    setLoading(false);
                }
            } else {
                // User is signed out, redirect to login
                console.log("No authenticated user, redirecting to login");
                router.push('/login');
            }
        });

        return () => {
            console.log("Cleaning up auth state listener");
            unsubscribe();
        };
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
        // Check if user has an active time slot
        if (!timeSlotActive) {
            setErrorMessage("You cannot select a room because it's not your assigned time slot yet.");
            return;
        }

        if (hasExistingRoom) {
            setErrorMessage('You or one of your roommates already has a room selected. Please cancel your current room before selecting a new one.');
            return;
        }

        // Check for insufficient capacity
        if (groupSelection) {
            const groupSize = activeRoommates.length + 1;
            if (room.capacity < groupSize) {
                setErrorMessage(`This room cannot accommodate your group of ${groupSize} people. Maximum capacity is ${room.capacity}.`);
                return;
            }
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

            // Double check time slot
            if (!timeSlotActive) {
                setErrorMessage("Your time slot is not active. You cannot select a room at this time.");
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

    // Add this right before the filteredRooms definition
    console.log("Computing filtered rooms");

    // Filter rooms based on selected criteria
    const filteredRooms = rooms.filter(room => {
        console.log(`Room ${room.roomNumber} - Floor: ${room.floor}, Selected Floor: ${selectedFloor}, Match: ${room.floor === selectedFloor}`);
        console.log(`Room ${room.roomNumber} - Type: ${room.type}, Filter Type: ${filters.roomType}, Match: ${!filters.roomType || room.type === filters.roomType}`);
        console.log(`Room ${room.roomNumber} - Occupancy: ${room.occupancyStatus}, Match: ${filters.availability !== 'available' || room.occupancyStatus === 'available'}`);

        if (groupSelection) {
            const groupSize = activeRoommates.length + 1;
            console.log(`Room ${room.roomNumber} - Capacity: ${room.capacity}, Group Size: ${groupSize}, Match: ${room.capacity >= groupSize}`);
        }

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

        // Always show rooms regardless of capacity
        return true;
    });

    // After filtering, mark rooms with insufficient capacity for the group
    if (groupSelection) {
        const groupSize = activeRoommates.length + 1; // +1 for the current user
        filteredRooms.forEach(room => {
            room.insufficientCapacity = room.capacity < groupSize;
        });
    }

    // Add these after the filteredRooms definition
    console.log("Filtered rooms length:", filteredRooms.length);
    console.log("Filtered rooms:", filteredRooms);
    console.log("Has existing room:", hasExistingRoom);
    console.log("Time slot active:", timeSlotActive);
    console.log("Error message:", errorMessage);
    console.log("Loading state:", loading);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-black text-white py-4 shadow-md">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl font-bold text-yellow-500">WakeRooms</h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 pt-6">
                    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 flex justify-center items-center">
                        <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="ml-3 text-gray-700">Loading room options...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (reservationSuccess) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-black text-white py-4 shadow-md">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl font-bold text-yellow-500">WakeRooms</h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 pt-6">
                    <div className="p-8 bg-white rounded-lg shadow-md border border-gray-200 text-center">
                        <div className="inline-block p-4 rounded-full bg-green-100 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">Room Reserved!</h2>
                        <p className="mb-6 text-lg text-gray-700">You've successfully reserved room {selectedRoom?.roomNumber} in {dorm?.name}.</p>

                        {activeRoommates.length > 0 && (
                            <div className="mb-8 bg-green-50 p-6 rounded-lg max-w-md mx-auto">
                                <p className="font-semibold mb-3 text-green-800">This room has been assigned to you and your roommates:</p>
                                <ul className="space-y-2">
                                    {activeRoommates.map(roommate => (
                                        <li key={roommate.uid} className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {roommate.firstName} {roommate.lastName}
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-3 text-sm text-green-700">Each of your roommates will see this room selection in their dashboard.</p>
                            </div>
                        )}

                        <p className="mb-8 text-gray-600">A confirmation email will be sent to your Wake Forest email address.</p>
                        <Link href="/dashboard" className="bg-yellow-600 hover:bg-yellow-700 text-black py-3 px-6 rounded-md font-semibold transition duration-200 inline-flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Return to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-black text-white mt-8 py-6">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <p className="text-yellow-500 font-semibold mb-2">WakeRooms</p>
                        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Wake Forest University Housing. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-black text-white py-4 shadow-md">
                <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-yellow-500">WakeRooms</h1>
                    <Link
                        href="/dashboard"
                        className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium py-1 px-4 rounded transition duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 pt-6">
                {/* Error message display */}
                {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p>{errorMessage}</p>
                    </div>
                )}

                {/* Time Slot Information */}
                <div className={`mb-6 p-5 rounded-lg shadow-sm border ${timeSlotActive ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'}`}>
                    <h2 className="text-lg font-bold mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Room Selection Time Slot
                    </h2>
                    {timeSlotInfo ? (
                        <div>
                            <p className="mb-2 text-gray-700">Your assigned time slot: <span className="font-semibold">{formatDateTime(timeSlotInfo.startTime)} - {formatDateTime(timeSlotInfo.endTime)}</span></p>
                            {timeSlotActive ? (
                                <div className="bg-green-100 p-3 rounded-md border border-green-200 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-green-800 font-semibold">Your time slot is active! ({getTimeRemaining(timeSlotInfo.endTime)})</p>
                                </div>
                            ) : (
                                new Date(timeSlotInfo.startTime) > new Date() ? (
                                    <div className="bg-yellow-100 p-3 rounded-md border border-yellow-200 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-yellow-800">Your time slot has not started yet. Please return during your assigned time.</p>
                                    </div>
                                ) : (
                                    <div className="bg-red-100 p-3 rounded-md border border-red-200 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-800">Your time slot has expired. You may still select a room if available.</p>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-100 p-3 rounded-md border border-yellow-200 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-yellow-800">You have not been assigned a room selection time slot yet. Please check back later or contact housing services.</p>
                        </div>
                    )}
                </div>

                {/* Group Selection Capacity Notice */}
                {groupSelection && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                        <h3 className="font-semibold text-blue-800 mb-2">Group Selection Information</h3>
                        <p className="text-blue-700">
                            Your group has {activeRoommates.length + 1} people. Rooms with insufficient
                            capacity will be shown but cannot be selected.
                        </p>
                    </div>
                )}

                {/* Existing Room Warning/Cancellation */}
                {hasExistingRoom && (
                    <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-6 mb-6 shadow-md">
                        <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            You Already Have a Room
                        </h2>
                        <div className="bg-white p-4 rounded-md border border-yellow-200 mb-4">
                            <p className="text-gray-700">
                                {user?.selectedRoom ? (
                                    <>You have already selected <span className="font-semibold">Room {user.selectedRoom.roomNumber}</span> in <span className="font-semibold">{user.selectedRoom.dormName}</span>.</>
                                ) : (
                                    <>One of your roommates has already selected a room.</>
                                )}
                            </p>
                        </div>
                        <p className="mb-4 text-yellow-800">You must cancel your current selection before choosing a new room.</p>
                        <button
                            onClick={handleCancelSelection}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition duration-200 flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Canceling...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Cancel Current Room Selection
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Roommate Group Information */}
                {activeRoommates.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md border border-green-200 p-6 mb-6">
                        <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Group Selection Mode
                        </h2>
                        <p className="mb-4 text-gray-700">You are selecting a room for yourself and {activeRoommates.length} roommate{activeRoommates.length > 1 ? 's' : ''}.</p>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="font-semibold mb-3 text-green-800">Your Roommates:</p>
                            <div className="space-y-2">
                                {activeRoommates.map(roommate => (
                                    <div key={roommate.uid} className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-gray-700">{roommate.firstName} {roommate.lastName}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-sm text-green-700">The room you select will be assigned to all members of your group.</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {dorm?.name}
                    </h2>
                    <p className="mb-4 text-gray-700">Select a room from the available options below.</p>

                    {!timeSlotActive && (
                        <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="font-semibold text-yellow-800">Note: You are currently browsing rooms outside your assigned time slot. You can view the rooms, but you cannot select one until your time slot begins.</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
                        <h3 className="font-semibold mb-4 text-gray-900">Filter Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="floor" className="block mb-1 text-gray-700 text-sm font-medium">Floor</label>
                                <select
                                    id="floor"
                                    value={selectedFloor}
                                    onChange={(e) => setSelectedFloor(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="1">First Floor</option>
                                    <option value="2">Second Floor</option>
                                    <option value="3">Third Floor</option>
                                    <option value="4">Fourth Floor</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="roomType" className="block mb-1 text-gray-700 text-sm font-medium">Room Type</label>
                                <select
                                    id="roomType"
                                    name="roomType"
                                    value={filters.roomType}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="single">Single</option>
                                    <option value="double">Double</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            Available Rooms on Floor {selectedFloor}
                        </h3>

                        {filteredRooms.length === 0 ? (
                            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-700">No rooms match your criteria.</p>
                                <p className="text-gray-500 text-sm mt-2">Try changing your filter options or select a different floor.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredRooms.map(room => (
                                    <div
                                        key={room.id}
                                        className={`border rounded-lg p-5 ${room.occupancyStatus === 'available'
                                            ? 'border-green-200 bg-green-50 hover:shadow-md transition duration-200'
                                            : 'border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">Room {room.roomNumber}</h4>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-gray-700 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        <span className="capitalize">{room.type} Room</span>
                                                    </p>
                                                    <p className="text-gray-700 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}
                                                    </p>
                                                    <p className="text-gray-700 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        ${room.price} per semester
                                                    </p>
                                                </div>

                                                {groupSelection && (
                                                    <div className={`mt-3 text-sm font-medium ${room.insufficientCapacity
                                                        ? 'text-red-700'
                                                        : 'text-green-700'
                                                        }`}>
                                                        {room.insufficientCapacity
                                                            ? `✗ Not enough space for your group of ${activeRoommates.length + 1}`
                                                            : `✓ Suitable for your group of ${activeRoommates.length + 1}`}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                {room.occupancyStatus === 'available' ? (
                                                    <button
                                                        onClick={() => handleRoomSelect(room)}
                                                        className={`py-2 px-4 rounded-md font-semibold ${hasExistingRoom || !timeSlotActive || (groupSelection && room.insufficientCapacity)
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-yellow-600 hover:bg-yellow-700 text-black transition duration-200'
                                                            }`}
                                                        disabled={hasExistingRoom || !timeSlotActive || (groupSelection && room.insufficientCapacity)}
                                                    >
                                                        {groupSelection && room.insufficientCapacity
                                                            ? 'Insufficient Capacity'
                                                            : 'Select Room'}
                                                    </button>
                                                ) : (
                                                    <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md inline-block">Unavailable</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Floor Plan Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Floor Plan - Floor {selectedFloor}
                    </h2>
                    <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <p className="text-gray-500">Interactive floor plan would be displayed here</p>
                            <p className="text-gray-400 text-sm mt-2">Click on a room in the floor plan to view details</p>
                        </div>
                    </div>
                </div>

                {/* Helpful Information */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Room Selection Information
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 text-sm">Once you select a room, your selection is final and cannot be changed unless you cancel it.</span>
                        </li>
                        <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 text-sm">Room prices are per semester and will be added to your student account.</span>
                        </li>
                        <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 text-sm">If you have any questions or issues, please contact Housing Services at housing@wfu.edu or (555) 123-4567.</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black text-white mt-8 py-6">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-yellow-500 font-semibold mb-2">WakeRooms</p>
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} Wake Forest University Housing. All rights reserved.</p>
                </div>
            </footer>

            {/* Confirmation Modal */}
            {confirmationOpen && selectedRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Confirm Room Selection</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                            <p className="text-gray-700 mb-1">You are about to select:</p>
                            <p className="font-semibold text-gray-900 text-lg">Room {selectedRoom.roomNumber} in {dorm?.name}</p>
                            <p className="text-gray-700 mt-2">${selectedRoom.price} per semester</p>
                        </div>

                        {activeRoommates.length > 0 && (
                            <div className="mb-4 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                                <p className="font-semibold text-yellow-800 text-sm">This room will be assigned to you and your {activeRoommates.length} roommate{activeRoommates.length > 1 ? 's' : ''}.</p>
                            </div>
                        )}

                        <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-6">
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-blue-800">Once selected, this room will become unavailable to other students. Your selection is final unless you cancel it.</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setConfirmationOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSelection}
                                className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-6 rounded-md font-semibold transition duration-200"
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