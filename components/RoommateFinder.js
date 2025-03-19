import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, arrayUnion, arrayRemove, writeBatch } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';

const RoommateFinder = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preferences, setPreferences] = useState({
        studyHabits: '',
        sleepSchedule: '',
        cleanliness: '',
        visitors: '',
        interests: [],
        additionalInfo: ''
    });
    const [classYear, setClassYear] = useState('');
    const [potentialRoommates, setPotentialRoommates] = useState([]);
    const [filteredRoommates, setFilteredRoommates] = useState([]);
    const [requests, setRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [activeRoommates, setActiveRoommates] = useState([]);
    const [profileComplete, setProfileComplete] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [roommateToRemove, setRoommateToRemove] = useState(null);
    const [expandedInfoIds, setExpandedInfoIds] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        classYear: '',
        studyHabits: '',
        sleepSchedule: '',
        cleanliness: '',
        visitors: '',
        interests: []
    });
    const router = useRouter();

    const interestOptions = [
        'Sports', 'Music', 'Art', 'Gaming', 'Fitness',
        'Reading', 'Cooking', 'Travel', 'Movies', 'Outdoor Activities',
        'Technology', 'Academic', 'Greek Life', 'Religious'
    ];

    // Toggle Additional Info function
    const toggleAdditionalInfo = (roommateId) => {
        setExpandedInfoIds(prev =>
            prev.includes(roommateId)
                ? prev.filter(id => id !== roommateId)
                : [...prev, roommateId]
        );
    };

    // Fetch user data and preference data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                try {
                    // Get user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', authUser.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            uid: authUser.uid,
                            ...userData
                        });

                        // Set class year if exists
                        if (userData.classYear) {
                            setClassYear(userData.classYear);
                        }

                        // Check if user has roommate preferences
                        if (userData.roommatePreferences) {
                            setPreferences(userData.roommatePreferences);
                            setSelectedInterests(userData.roommatePreferences.interests || []);
                            setProfileComplete(true);
                            setShowPreferences(false); // Hide preferences form if already filled out
                        } else {
                            // Show preferences form if the user hasn't filled out preferences yet
                            setShowPreferences(true);
                        }

                        // Get roommate requests
                        if (userData.incomingRoommateRequests) {
                            // Fetch user details for each request
                            const requestDetails = await Promise.all(
                                userData.incomingRoommateRequests.map(async (uid) => {
                                    const requestorDoc = await getDoc(doc(db, 'users', uid));
                                    if (requestorDoc.exists()) {
                                        return {
                                            uid: uid,
                                            ...requestorDoc.data()
                                        };
                                    }
                                    return null;
                                })
                            );

                            setRequests(requestDetails.filter(req => req !== null));
                        }

                        // Get my sent requests
                        if (userData.outgoingRoommateRequests) {
                            // Fetch user details for each request
                            const requestDetails = await Promise.all(
                                userData.outgoingRoommateRequests.map(async (uid) => {
                                    const requesteeDoc = await getDoc(doc(db, 'users', uid));
                                    if (requesteeDoc.exists()) {
                                        return {
                                            uid: uid,
                                            ...requesteeDoc.data()
                                        };
                                    }
                                    return null;
                                })
                            );

                            setMyRequests(requestDetails.filter(req => req !== null));
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

                            setActiveRoommates(roommateDetails.filter(roommate => roommate !== null));
                        }

                        // Fetch potential roommates (with preferences)
                        const roommatesQuery = query(
                            collection(db, 'users'),
                            where('roommatePreferences', '!=', null)
                        );

                        const roommateSnapshot = await getDocs(roommatesQuery);
                        const roommateList = roommateSnapshot.docs
                            .map(doc => ({
                                uid: doc.id,
                                ...doc.data()
                            }))
                            .filter(roommate =>
                                roommate.uid !== authUser.uid &&
                                !userData.outgoingRoommateRequests?.includes(roommate.uid) &&
                                !userData.roommateConnections?.includes(roommate.uid)
                            );

                        setPotentialRoommates(roommateList);
                        setFilteredRoommates(roommateList);
                    }

                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setLoading(false);
                }
            } else {
                // User is signed out, redirect to login
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Apply filters to the potential roommates
    useEffect(() => {
        let result = [...potentialRoommates];

        // Filter by class year
        if (filterOptions.classYear) {
            result = result.filter(roommate => roommate.classYear === filterOptions.classYear);
        }

        // Filter by study habits
        if (filterOptions.studyHabits) {
            result = result.filter(roommate =>
                roommate.roommatePreferences?.studyHabits === filterOptions.studyHabits
            );
        }

        // Filter by sleep schedule
        if (filterOptions.sleepSchedule) {
            result = result.filter(roommate =>
                roommate.roommatePreferences?.sleepSchedule === filterOptions.sleepSchedule
            );
        }

        // Filter by cleanliness
        if (filterOptions.cleanliness) {
            result = result.filter(roommate =>
                roommate.roommatePreferences?.cleanliness === filterOptions.cleanliness
            );
        }

        // Filter by visitors preference
        if (filterOptions.visitors) {
            result = result.filter(roommate =>
                roommate.roommatePreferences?.visitors === filterOptions.visitors
            );
        }

        // Filter by interests
        if (filterOptions.interests && filterOptions.interests.length > 0) {
            result = result.filter(roommate =>
                filterOptions.interests.every(interest =>
                    roommate.roommatePreferences?.interests?.includes(interest)
                )
            );
        }

        setFilteredRoommates(result);
    }, [potentialRoommates, filterOptions]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Toggle interest in filter
    const toggleFilterInterest = (interest) => {
        setFilterOptions(prev => {
            if (prev.interests.includes(interest)) {
                return {
                    ...prev,
                    interests: prev.interests.filter(i => i !== interest)
                };
            } else {
                return {
                    ...prev,
                    interests: [...prev.interests, interest]
                };
            }
        });
    };

    // Clear filters
    const clearFilters = () => {
        setFilterOptions({
            classYear: '',
            studyHabits: '',
            sleepSchedule: '',
            cleanliness: '',
            visitors: '',
            interests: []
        });
    };

    // Handle preference form submission
    const handlePreferenceSubmit = async (e) => {
        e.preventDefault();

        if (!user) return;

        try {
            // Update both class year and preferences in Firestore
            await updateDoc(doc(db, 'users', user.uid), {
                classYear: classYear,
                roommatePreferences: {
                    ...preferences,
                    interests: selectedInterests
                }
            });

            setProfileComplete(true);
            setShowPreferences(false);

            // In a real app, you'd also refresh the list of potential roommates here
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    // Handle interest selection
    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    // Handle preference input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPreferences({
            ...preferences,
            [name]: value
        });
    };

    // Send roommate request
    const sendRequest = async (roommate) => {
        if (!user) return;

        try {
            // Update my outgoing requests
            await updateDoc(doc(db, 'users', user.uid), {
                outgoingRoommateRequests: arrayUnion(roommate.uid)
            });

            // Update their incoming requests
            await updateDoc(doc(db, 'users', roommate.uid), {
                incomingRoommateRequests: arrayUnion(user.uid)
            });

            // Update local state
            setMyRequests([...myRequests, roommate]);
            setPotentialRoommates(potentialRoommates.filter(r => r.uid !== roommate.uid));
            setFilteredRoommates(filteredRoommates.filter(r => r.uid !== roommate.uid));
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    // Accept roommate request
    const acceptRequest = async (requestor) => {
        if (!user) return;
        console.log("========== ACCEPT REQUEST STARTED ==========");
        console.log("Current user:", user.uid, user.firstName, user.lastName);
        console.log("Requestor:", requestor.uid, requestor.firstName, requestor.lastName);
    
        try {
            // Get both users' current roommate connections
            const myDoc = await getDoc(doc(db, 'users', user.uid));
            const requestorDoc = await getDoc(doc(db, 'users', requestor.uid));
    
            if (!myDoc.exists() || !requestorDoc.exists()) {
                console.error('User document not found');
                return;
            }
    
            const myData = myDoc.data();
            const requestorData = requestorDoc.data();
    
            // Build the complete set of all roommate connections
            let myConnections = myData.roommateConnections || [];
            let requestorConnections = requestorData.roommateConnections || [];
    
            console.log("My current connections:", myConnections);
            console.log("Requestor's current connections:", requestorConnections);
    
            // The direct solution: add each other to roommate connections
            // Simply add the requestor to my connections
            await updateDoc(doc(db, 'users', user.uid), {
                roommateConnections: arrayUnion(requestor.uid),
                incomingRoommateRequests: arrayRemove(requestor.uid)
            });
            console.log(`Added ${requestor.uid} to ${user.uid}'s connections`);
    
            // Add me to the requestor's connections
            await updateDoc(doc(db, 'users', requestor.uid), {
                roommateConnections: arrayUnion(user.uid),
                outgoingRoommateRequests: arrayRemove(user.uid)
            });
            console.log(`Added ${user.uid} to ${requestor.uid}'s connections`);
    
            // Create the combined connections set for transitivity checks
            // Include both the current direct connections and any existing connections
            const allConnections = new Set([
                ...myConnections,
                ...requestorConnections,
                requestor.uid // Add the requestor to my connections
            ]);
            allConnections.delete(user.uid); // Remove myself
    
            console.log("All connections to check:", Array.from(allConnections));
    
            // Handle transitive connections (if A connects to B and B to C, connect A to C)
            if (allConnections.size > 1) {
                console.log("More than one connection found, handling transitivity");
                
                // Get all the roommates' data to check their existing connections
                const otherRoommateDocs = await Promise.all(
                    Array.from(allConnections).map(uid => getDoc(doc(db, 'users', uid)))
                );
                
                const batch = writeBatch(db);
                let updates = 0;
                
                // For each roommate
                for (let i = 0; i < otherRoommateDocs.length; i++) {
                    const roommateDoc = otherRoommateDocs[i];
                    if (!roommateDoc.exists()) continue;
                    
                    const roommateId = roommateDoc.id;
                    const roommateData = roommateDoc.data();
                    const roommateConnections = roommateData.roommateConnections || [];
                    
                    console.log(`Checking roommate ${roommateId} connections:`, roommateConnections);
                    
                    // Check which connections this roommate is missing
                    const missingConnections = Array.from(allConnections).filter(
                        uid => uid !== roommateId && !roommateConnections.includes(uid)
                    );
                    
                    if (missingConnections.length > 0) {
                        console.log(`Roommate ${roommateId} is missing connections:`, missingConnections);
                        
                        // Add the missing connections to this roommate
                        batch.update(doc(db, 'users', roommateId), {
                            roommateConnections: arrayUnion(...missingConnections)
                        });
                        updates++;
                        
                        // Also add this roommate to all the missing connections
                        for (const missingId of missingConnections) {
                            batch.update(doc(db, 'users', missingId), {
                                roommateConnections: arrayUnion(roommateId)
                            });
                            updates++;
                        }
                    }
                }
                
                // Only commit if there are updates to make
                if (updates > 0) {
                    console.log(`Committing batch with ${updates} updates`);
                    await batch.commit();
                    console.log("Transitive connections updated successfully");
                } else {
                    console.log("No transitive connections to update");
                }
            }
    
            // Update local state
            setRequests(requests.filter(r => r.uid !== requestor.uid));
            
            // Update active roommates (include at least the new requestor)
            // We need to re-fetch all roommate data to get the latest connections
            const allRoommateIds = [...myConnections, requestor.uid];
            console.log("Fetching data for roommates:", allRoommateIds);
            
            const roommateData = await Promise.all(
                allRoommateIds.map(async (uid) => {
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
    
            const filteredRoommateData = roommateData.filter(roommate => roommate !== null);
            console.log("Updating active roommates to:", filteredRoommateData.map(r => r.uid));
            
            setActiveRoommates(filteredRoommateData);
            console.log("========== ACCEPT REQUEST COMPLETED ==========");
    
            // Force a refresh to ensure we're showing the latest data
            setTimeout(() => {
                window.location.reload();
            }, 1000);
    
        } catch (error) {
            console.error('Error accepting request:', error);
            setErrorMessage('Error accepting roommate request. Please try again.');
        }
    };

    // Remove a roommate connection
    const removeRoommate = async () => {
        if (!user || !roommateToRemove) return;

        try {
            // Get both users' current roommate connections
            const myDoc = await getDoc(doc(db, 'users', user.uid));
            const roommateDoc = await getDoc(doc(db, 'users', roommateToRemove.uid));

            if (!myDoc.exists() || !roommateDoc.exists()) {
                console.error('User document not found');
                return;
            }

            const myData = myDoc.data();
            const roommateData = roommateDoc.data();

            // Get my current connections and remove the roommate
            let myConnections = myData.roommateConnections || [];
            myConnections = myConnections.filter(id => id !== roommateToRemove.uid);

            // Get roommate's connections and remove me
            let roommateConnections = roommateData.roommateConnections || [];
            roommateConnections = roommateConnections.filter(id => id !== user.uid);

            // Batch update
            const batch = writeBatch(db);

            // Update my connections
            batch.update(doc(db, 'users', user.uid), {
                roommateConnections: myConnections
            });

            // Update roommate's connections
            batch.update(doc(db, 'users', roommateToRemove.uid), {
                roommateConnections: roommateConnections
            });

            // Commit the batch
            await batch.commit();

            // Update local state
            setActiveRoommates(activeRoommates.filter(r => r.uid !== roommateToRemove.uid));
            setPotentialRoommates([...potentialRoommates, roommateToRemove]);
            setFilteredRoommates([...filteredRoommates, roommateToRemove]);
            setErrorMessage('');

            // Close the modal and reset the roommate to remove
            setConfirmModal(false);
            setRoommateToRemove(null);
        } catch (error) {
            console.error('Error removing roommate:', error);
            setErrorMessage('Error removing roommate. Please try again.');
        }
    };

    // Decline roommate request
    const declineRequest = async (requestor) => {
        if (!user) return;

        try {
            // Remove from my incoming requests
            await updateDoc(doc(db, 'users', user.uid), {
                incomingRoommateRequests: arrayRemove(requestor.uid)
            });

            // Remove from their outgoing requests
            await updateDoc(doc(db, 'users', requestor.uid), {
                outgoingRoommateRequests: arrayRemove(user.uid)
            });

            // Update local state
            setRequests(requests.filter(r => r.uid !== requestor.uid));
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };

    // Cancel my request
    const cancelRequest = async (requestee) => {
        if (!user) return;

        try {
            // Remove from my outgoing requests
            await updateDoc(doc(db, 'users', user.uid), {
                outgoingRoommateRequests: arrayRemove(requestee.uid)
            });

            // Remove from their incoming requests
            await updateDoc(doc(db, 'users', requestee.uid), {
                incomingRoommateRequests: arrayRemove(user.uid)
            });

            // Update local state
            setMyRequests(myRequests.filter(r => r.uid !== requestee.uid));
            setPotentialRoommates([...potentialRoommates, requestee]);
            setFilteredRoommates([...filteredRoommates, requestee]);
        } catch (error) {
            console.error('Error canceling request:', error);
        }
    };

    // Open confirmation modal for roommate removal
    const openRemoveConfirmation = (roommate) => {
        // Check if either user has a room selected
        const hasRoom = user.selectedRoom || roommate.selectedRoom;

        if (hasRoom) {
            setErrorMessage("You cannot remove a roommate while either of you has a room selected. Please cancel your room selection first.");
            return;
        }

        // Set the roommate to remove and open the modal
        setRoommateToRemove(roommate);
        setConfirmModal(true);
    };

    // Cancel roommate removal
    const cancelRemove = () => {
        setConfirmModal(false);
        setRoommateToRemove(null);
    };

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
                        <p className="ml-3 text-gray-700">Loading roommate data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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

                {/* Roommate Preferences Form */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Roommate Preferences
                        </h2>
                        {profileComplete && (
                            <button
                                onClick={() => setShowPreferences(!showPreferences)}
                                className="text-sm bg-yellow-600 hover:bg-yellow-700 text-black px-3 py-1 rounded font-medium transition duration-200 flex items-center"
                            >
                                {showPreferences ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Hide Preferences
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit Preferences
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {showPreferences ? (
                        <form onSubmit={handlePreferenceSubmit} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                            <div className="mb-4">
                                <label htmlFor="classYear" className="block mb-1 text-sm font-medium text-gray-700">Class Year</label>
                                <select
                                    id="classYear"
                                    name="classYear"
                                    value={classYear}
                                    onChange={(e) => setClassYear(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    required
                                >
                                    <option value="">Select your class year...</option>
                                    <option value="2025 (Senior)">2025 (Senior)</option>
                                    <option value="2026 (Junior)">2026 (Junior)</option>
                                    <option value="2027 (Sophomore)">2027 (Sophomore)</option>
                                    <option value="2028 (Freshman)">2028 (Freshman)</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="studyHabits" className="block mb-1 text-sm font-medium text-gray-700">Study Habits</label>
                                <select
                                    id="studyHabits"
                                    name="studyHabits"
                                    value={preferences.studyHabits}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="I need complete quiet to study">I need complete quiet to study</option>
                                    <option value="I can study with music/background noise">I can study with music/background noise</option>
                                    <option value="I can study anywhere">I can study anywhere</option>
                                    <option value="I prefer to study at the library">I prefer to study at the library</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="sleepSchedule" className="block mb-1 text-sm font-medium text-gray-700">Sleep Schedule</label>
                                <select
                                    id="sleepSchedule"
                                    name="sleepSchedule"
                                    value={preferences.sleepSchedule}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Early riser (before 8am)">Early riser (before 8am)</option>
                                    <option value="Regular hours (sleep 11pm-8am)">Regular hours (sleep 11pm-8am)</option>
                                    <option value="Night owl (up past midnight)">Night owl (up past midnight)</option>
                                    <option value="Varies day to day">Varies day to day</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="cleanliness" className="block mb-1 text-sm font-medium text-gray-700">Cleanliness</label>
                                <select
                                    id="cleanliness"
                                    name="cleanliness"
                                    value={preferences.cleanliness}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Very neat and organized">Very neat and organized</option>
                                    <option value="Generally neat">Generally neat</option>
                                    <option value="Casual, clean when needed">Casual, clean when needed</option>
                                    <option value="Not very concerned with tidiness">Not very concerned with tidiness</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="visitors" className="block mb-1 text-sm font-medium text-gray-700">Visitors</label>
                                <select
                                    id="visitors"
                                    name="visitors"
                                    value={preferences.visitors}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Often have visitors/friends over">Often have visitors/friends over</option>
                                    <option value="Occasionally have visitors">Occasionally have visitors</option>
                                    <option value="Rarely have visitors">Rarely have visitors</option>
                                    <option value="Only on weekends">Only on weekends</option>
                                </select>
                            </div>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Interests (select all that apply)</label>
                                <div className="flex flex-wrap gap-2">
                                    {interestOptions.map(interest => (
                                        <button
                                            key={interest}
                                            type="button"
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-3 py-1 rounded-md text-sm transition duration-200 ${selectedInterests.includes(interest)
                                                ? 'bg-yellow-600 text-black font-medium'
                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="additionalInfo" className="block mb-1 text-sm font-medium text-gray-700">Additional Information</label>
                                <textarea
                                    id="additionalInfo"
                                    name="additionalInfo"
                                    value={preferences.additionalInfo}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full h-24 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Share any additional information that might help find a compatible roommate..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-6 rounded-md font-semibold transition duration-200 inline-flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Save Preferences
                            </button>
                        </form>
                    ) : profileComplete ? (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="flex items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="font-medium text-gray-800">Your roommate preferences have been saved.</p>
                            </div>
                            <p className="text-gray-700">You can now browse potential roommates below or edit your preferences using the button above.</p>
                        </div>
                    ) : null}
                </div>

                {/* Active Roommates Section */}
                {activeRoommates.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Active Roommates ({activeRoommates.length})
                        </h2>
                        <div className="space-y-4">
                            {activeRoommates.map(roommate => {
                                // Check if either user has a room selected
                                const hasRoom = user?.selectedRoom || roommate.selectedRoom;

                                return (
                                    <div key={roommate.uid} className="border border-green-200 bg-green-50 p-5 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{roommate.firstName} {roommate.lastName}</h3>
                                                <p className="text-sm text-gray-600">{roommate.email}</p>
                                            </div>
                                            <div>
                                                {hasRoom ? (
                                                    <button
                                                        disabled
                                                        className="bg-gray-300 text-gray-500 py-1 px-4 rounded text-sm cursor-not-allowed flex items-center"
                                                        title="Cannot remove roommate while a room is selected"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Remove
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => openRemoveConfirmation(roommate)}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded text-sm transition duration-200 flex items-center"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 mt-4">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <span className="text-gray-700"><span className="font-medium">Study Habits:</span> {roommate.roommatePreferences?.studyHabits || 'Not specified'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                </svg>
                                                <span className="text-gray-700"><span className="font-medium">Sleep Schedule:</span> {roommate.roommatePreferences?.sleepSchedule || 'Not specified'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-gray-700"><span className="font-medium">Cleanliness:</span> {roommate.roommatePreferences?.cleanliness || 'Not specified'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="text-gray-700"><span className="font-medium">Visitors:</span> {roommate.roommatePreferences?.visitors || 'Not specified'}</span>
                                            </div>
                                            {roommate.classYear && (
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                                    </svg>
                                                    <span className="text-gray-700"><span className="font-medium">Class Year:</span> {roommate.classYear}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Display room information if selected */}
                                        {roommate.selectedRoom && (
                                            <div className="mt-3 bg-blue-50 p-3 rounded-md border border-blue-100 max-w-md">
                                                <p className="text-sm flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    <span className="font-semibold">Room:</span> {roommate.selectedRoom.roomNumber} in {roommate.selectedRoom.dormName}
                                                </p>
                                            </div>
                                        )}

                                        {roommate.roommatePreferences?.interests && roommate.roommatePreferences.interests.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-gray-700 font-medium">Interests:</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {roommate.roommatePreferences.interests.map(interest => (
                                                        <span key={interest} className="bg-green-100 px-3 py-1 rounded text-sm text-green-800">
                                                            {interest}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add a notice explaining the roommate/room policy */}
                        {activeRoommates.some(r => user?.selectedRoom || r.selectedRoom) && (
                            <div className="mt-4 bg-yellow-50 p-4 rounded-lg text-sm border border-yellow-200">
                                <p className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                        <strong>Note:</strong> You cannot remove a roommate while either of you has a room selected.
                                        To remove a roommate, you must first cancel your room selection in the dashboard.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Roommate Requests (Incoming) */}
                {requests.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Incoming Roommate Requests ({requests.length})
                        </h2>
                        <div className="space-y-4">
                            {requests.map(request => (
                                <div key={request.uid} className="border border-yellow-200 bg-yellow-50 p-5 rounded-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg text-gray-900">{request.firstName} {request.lastName}</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => acceptRequest(request)}
                                                className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded text-sm font-medium transition duration-200 flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => declineRequest(request)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded text-sm font-medium transition duration-200 flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Decline
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <span className="text-gray-700"><span className="font-medium">Study Habits:</span> {request.roommatePreferences?.studyHabits || 'Not specified'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                            <span className="text-gray-700"><span className="font-medium">Sleep Schedule:</span> {request.roommatePreferences?.sleepSchedule || 'Not specified'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-700"><span className="font-medium">Cleanliness:</span> {request.roommatePreferences?.cleanliness || 'Not specified'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="text-gray-700"><span className="font-medium">Visitors:</span> {request.roommatePreferences?.visitors || 'Not specified'}</span>
                                        </div>

                                        {request.classYear && (
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                                </svg>
                                                <span className="text-gray-700"><span className="font-medium">Class Year:</span> {request.classYear}</span>
                                            </div>
                                        )}
                                    </div>

                                    {request.roommatePreferences?.interests && request.roommatePreferences.interests.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-gray-700 font-medium">Interests:</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {request.roommatePreferences.interests.map(interest => (
                                                    <span key={interest} className="bg-yellow-100 px-3 py-1 rounded text-sm text-yellow-800">
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Sent Requests (Outgoing) - Updated to match incoming design */}
                {myRequests.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                            Outgoing Roommate Requests ({myRequests.length})
                        </h2>
                        <div className="space-y-4">
                            {myRequests.map(request => (
                                <div key={request.uid} className="border border-yellow-200 bg-yellow-50 p-5 rounded-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg text-gray-900">{request.firstName} {request.lastName}</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => cancelRequest(request)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded text-sm font-medium transition duration-200 flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel Request
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <span className="text-gray-700"><span className="font-medium">Study Habits:</span> {request.roommatePreferences?.studyHabits || 'Not specified'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                            <span className="text-gray-700"><span className="font-medium">Sleep Schedule:</span> {request.roommatePreferences?.sleepSchedule || 'Not specified'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-700"><span className="font-medium">Cleanliness:</span> {request.roommatePreferences?.cleanliness || 'Not specified'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="text-gray-700"><span className="font-medium">Visitors:</span> {request.roommatePreferences?.visitors || 'Not specified'}</span>
                                        </div>

                                        {request.classYear && (
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                                </svg>
                                                <span className="text-gray-700"><span className="font-medium">Class Year:</span> {request.classYear}</span>
                                            </div>
                                        )}
                                    </div>

                                    {request.roommatePreferences?.interests && request.roommatePreferences.interests.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-gray-700 font-medium">Interests:</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {request.roommatePreferences.interests.map(interest => (
                                                    <span key={interest} className="bg-yellow-100 px-3 py-1 rounded text-sm text-yellow-800">
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MOVED: Potential Roommates with Filters - Now INSIDE the max-width container */}
                {profileComplete && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Potential Roommates
                        </h2>

                        {/* Filter Panel */}
                        <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filter Options
                                </h3>

                                {(filterOptions.classYear || filterOptions.studyHabits || filterOptions.sleepSchedule ||
                                    filterOptions.cleanliness || filterOptions.visitors || filterOptions.interests.length > 0) && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-yellow-600 hover:text-yellow-800 transition duration-200 underline text-sm font-medium flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Clear All Filters
                                        </button>
                                    )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label htmlFor="classYearFilter" className="block mb-1 text-sm font-medium text-gray-700">Class Year</label>
                                    <select
                                        id="classYearFilter"
                                        name="classYear"
                                        value={filterOptions.classYear}
                                        onChange={handleFilterChange}
                                        className="border border-gray-300 p-2 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="">All Years</option>
                                        <option value="2025 (Senior)">2025 (Senior)</option>
                                        <option value="2026 (Junior)">2026 (Junior)</option>
                                        <option value="2027 (Sophomore)">2027 (Sophomore)</option>
                                        <option value="2028 (Freshman)">2028 (Freshman)</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="studyHabitsFilter" className="block mb-1 text-sm font-medium text-gray-700">Study Habits</label>
                                    <select
                                        id="studyHabitsFilter"
                                        name="studyHabits"
                                        value={filterOptions.studyHabits}
                                        onChange={handleFilterChange}
                                        className="border border-gray-300 p-2 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="">Any</option>
                                        <option value="I need complete quiet to study">I need complete quiet to study</option>
                                        <option value="I can study with music/background noise">I can study with music/background noise</option>
                                        <option value="I can study anywhere">I can study anywhere</option>
                                        <option value="I prefer to study at the library">I prefer to study at the library</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="sleepScheduleFilter" className="block mb-1 text-sm font-medium text-gray-700">Sleep Schedule</label>
                                    <select
                                        id="sleepScheduleFilter"
                                        name="sleepSchedule"
                                        value={filterOptions.sleepSchedule}
                                        onChange={handleFilterChange}
                                        className="border border-gray-300 p-2 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="">Any</option>
                                        <option value="Early riser (before 8am)">Early riser (before 8am)</option>
                                        <option value="Regular hours (sleep 11pm-8am)">Regular hours (sleep 11pm-8am)</option>
                                        <option value="Night owl (up past midnight)">Night owl (up past midnight)</option>
                                        <option value="Varies day to day">Varies day to day</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="cleanlinessFilter" className="block mb-1 text-sm font-medium text-gray-700">Cleanliness</label>
                                    <select
                                        id="cleanlinessFilter"
                                        name="cleanliness"
                                        value={filterOptions.cleanliness}
                                        onChange={handleFilterChange}
                                        className="border border-gray-300 p-2 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="">Any</option>
                                        <option value="Very neat and organized">Very neat and organized</option>
                                        <option value="Generally neat">Generally neat</option>
                                        <option value="Casual, clean when needed">Casual, clean when needed</option>
                                        <option value="Not very concerned with tidiness">Not very concerned with tidiness</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="visitorsFilter" className="block mb-1 text-sm font-medium text-gray-700">Visitors</label>
                                    <select
                                        id="visitorsFilter"
                                        name="visitors"
                                        value={filterOptions.visitors}
                                        onChange={handleFilterChange}
                                        className="border border-gray-300 p-2 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="">Any</option>
                                        <option value="Often have visitors/friends over">Often have visitors/friends over</option>
                                        <option value="Occasionally have visitors">Occasionally have visitors</option>
                                        <option value="Rarely have visitors">Rarely have visitors</option>
                                        <option value="Only on weekends">Only on weekends</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Interest Filters (select to match)</label>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {interestOptions.map(interest => (
                                        <button
                                            key={interest}
                                            type="button"
                                            onClick={() => toggleFilterInterest(interest)}
                                            className={`px-2 py-1 rounded-md text-xs transition duration-200 ${filterOptions.interests.includes(interest)
                                                ? 'bg-yellow-600 text-black font-medium'
                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm pt-4 border-t border-gray-200">
                                <p className="mb-3 md:mb-0 text-gray-700">
                                    Showing <span className="font-semibold">{filteredRoommates.length}</span> of <span className="font-semibold">{potentialRoommates.length}</span> potential roommates
                                </p>

                                {(filterOptions.classYear || filterOptions.studyHabits || filterOptions.sleepSchedule ||
                                    filterOptions.cleanliness || filterOptions.visitors || filterOptions.interests.length > 0) && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-600">Active filters:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {filterOptions.classYear && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-md">
                                                        Year: {filterOptions.classYear}
                                                    </span>
                                                )}
                                                {filterOptions.studyHabits && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-md">
                                                        Study: {filterOptions.studyHabits.split(' ').slice(0, 3).join(' ')}...
                                                    </span>
                                                )}
                                                {filterOptions.sleepSchedule && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-md">
                                                        Sleep: {filterOptions.sleepSchedule.split(' ').slice(0, 2).join(' ')}...
                                                    </span>
                                                )}
                                                {filterOptions.cleanliness && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-md">
                                                        Clean: {filterOptions.cleanliness.split(' ').slice(0, 2).join(' ')}...
                                                    </span>
                                                )}
                                                {filterOptions.visitors && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-md">
                                                        Visitors: {filterOptions.visitors.split(' ').slice(0, 2).join(' ')}...
                                                    </span>
                                                )}
                                                {filterOptions.interests.length > 0 && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-md">
                                                        Interests: {filterOptions.interests.length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>

                        {filteredRoommates.length === 0 ? (
                            <div className="bg-gray-50 p-8 rounded-lg text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-700 mb-2">No potential roommates found matching your filters.</p>
                                <p className="text-gray-500 text-sm">Try changing your filter criteria or <button onClick={clearFilters} className="text-yellow-600 hover:text-yellow-800 underline">clear all filters</button>.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5">
                                {filteredRoommates.map(roommate => (
                                    <div key={roommate.uid} className="border border-gray-200 p-5 rounded-lg hover:shadow-md transition duration-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg text-gray-900">{roommate.firstName} {roommate.lastName}</h3>
                                            <button
                                                onClick={() => sendRequest(roommate)}
                                                className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded-md font-semibold text-sm transition duration-200 flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                                Send Request
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <p className="text-sm flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <span className="font-semibold text-gray-700">Study Habits:</span> <span className="ml-1">{roommate.roommatePreferences?.studyHabits || 'Not specified'}</span>
                                                </p>
                                                <p className="text-sm flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                    </svg>
                                                    <span className="font-semibold text-gray-700">Sleep Schedule:</span> <span className="ml-1">{roommate.roommatePreferences?.sleepSchedule || 'Not specified'}</span>
                                                </p>
                                                <p className="text-sm flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="font-semibold text-gray-700">Cleanliness:</span> <span className="ml-1">{roommate.roommatePreferences?.cleanliness || 'Not specified'}</span>
                                                </p>
                                                <p className="text-sm flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span className="font-semibold text-gray-700">Visitors:</span> <span className="ml-1">{roommate.roommatePreferences?.visitors || 'Not specified'}</span>
                                                </p>
                                                {roommate.classYear && (
                                                    <p className="text-sm flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                                        </svg>
                                                        <span className="font-semibold text-gray-700">Class Year:</span> <span className="ml-1">{roommate.classYear}</span>
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                {roommate.roommatePreferences?.interests && roommate.roommatePreferences.interests.length > 0 && (
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-700">Interests:</p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {roommate.roommatePreferences.interests.map(interest => (
                                                                <span key={interest} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                                    {interest}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {roommate.roommatePreferences?.additionalInfo && (
                                                    <div className="mt-3">
                                                        <p className="text-sm font-semibold text-gray-700">Additional Info:</p>
                                                        <div className="relative">
                                                            <p className={`text-sm text-gray-600 break-words ${!expandedInfoIds.includes(roommate.uid) ? "line-clamp-2 max-h-12" : ""}`}>
                                                                {roommate.roommatePreferences.additionalInfo}
                                                            </p>
                                                            {roommate.roommatePreferences.additionalInfo.length > 100 && (
                                                                <button
                                                                    onClick={() => toggleAdditionalInfo(roommate.uid)}
                                                                    className="text-xs text-yellow-600 hover:text-yellow-700 font-medium mt-1"
                                                                >
                                                                    {expandedInfoIds.includes(roommate.uid) ? "See less" : "See more"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmModal && roommateToRemove && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Confirm Roommate Removal</h3>
                        <p className="mb-4 text-gray-700">Are you sure you want to remove <span className="font-semibold">{roommateToRemove.firstName} {roommateToRemove.lastName}</span> as your roommate?</p>
                        <p className="mb-6 text-gray-600 text-sm">This will remove the roommate connection for both of you. You can always send a new request later.</p>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelRemove}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200 text-gray-700 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={removeRoommate}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition duration-200"
                            >
                                Remove Roommate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoommateFinder;