import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
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
            // In a real app, this would include more sophisticated matching
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
    
    try {
      // Update my connections and remove from incoming requests
      await updateDoc(doc(db, 'users', user.uid), {
        roommateConnections: arrayUnion(requestor.uid),
        incomingRoommateRequests: arrayRemove(requestor.uid)
      });
      
      // Update their connections and remove from outgoing requests
      await updateDoc(doc(db, 'users', requestor.uid), {
        roommateConnections: arrayUnion(user.uid),
        outgoingRoommateRequests: arrayRemove(user.uid)
      });
      
      // Update local state
      setRequests(requests.filter(r => r.uid !== requestor.uid));
      setActiveRoommates([...activeRoommates, requestor]);
    } catch (error) {
      console.error('Error accepting request:', error);
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

  // Remove a roommate connection
  const removeRoommate = async () => {
    if (!user || !roommateToRemove) return;
    
    try {
      // Update my connections
      await updateDoc(doc(db, 'users', user.uid), {
        roommateConnections: arrayRemove(roommateToRemove.uid)
      });
      
      // Update their connections
      await updateDoc(doc(db, 'users', roommateToRemove.uid), {
        roommateConnections: arrayRemove(user.uid)
      });
      
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
    }
  };

  // Cancel roommate removal
  const cancelRemove = () => {
    setConfirmModal(false);
    setRoommateToRemove(null);
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
      
      {/* Active Roommates Section */}
      {activeRoommates.length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Active Roommates ({activeRoommates.length})</h2>
          <div className="space-y-4">
            {activeRoommates.map(roommate => {
              // Check if either user has a room selected
              const hasRoom = user?.selectedRoom || roommate.selectedRoom;
              
              return (
                <div key={roommate.uid} className="border border-green-200 bg-green-50 p-4 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{roommate.firstName} {roommate.lastName}</h3>
                      <p className="text-sm text-gray-600">{roommate.email}</p>
                      
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm"><span className="font-semibold">Study Habits:</span> {roommate.roommatePreferences?.studyHabits || 'Not specified'}</p>
                          <p className="text-sm"><span className="font-semibold">Sleep Schedule:</span> {roommate.roommatePreferences?.sleepSchedule || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm"><span className="font-semibold">Cleanliness:</span> {roommate.roommatePreferences?.cleanliness || 'Not specified'}</p>
                          <p className="text-sm"><span className="font-semibold">Visitors:</span> {roommate.roommatePreferences?.visitors || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      {/* Display class year if available */}
                      {roommate.classYear && (
                        <p className="text-sm mt-2"><span className="font-semibold">Class Year:</span> {roommate.classYear}</p>
                      )}
                      
                      {/* Display room information if selected */}
                      {roommate.selectedRoom && (
                        <div className="mt-2 bg-blue-50 p-2 rounded">
                          <p className="text-sm">
                            <span className="font-semibold">Room:</span> {roommate.selectedRoom.roomNumber} in {roommate.selectedRoom.dormName}
                          </p>
                        </div>
                      )}
                      
                      {roommate.roommatePreferences?.interests && roommate.roommatePreferences.interests.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-semibold">Interests:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {roommate.roommatePreferences.interests.map(interest => (
                              <span key={interest} className="bg-green-100 px-2 py-0.5 rounded text-xs">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      {hasRoom ? (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-500 py-1 px-3 rounded text-sm cursor-not-allowed"
                          title="Cannot remove roommate while a room is selected"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => openRemoveConfirmation(roommate)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Add a notice explaining the roommate/room policy */}
          {activeRoommates.some(r => user?.selectedRoom || r.selectedRoom) && (
            <div className="mt-4 bg-yellow-50 p-3 rounded-md text-sm border border-yellow-200">
              <p><strong>Note:</strong> You cannot remove a roommate while either of you has a room selected. 
              To remove a roommate, you must first cancel your room selection in the dashboard.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Roommate Preferences Form */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Roommate Preferences</h2>
          {profileComplete && (
            <button 
              onClick={() => setShowPreferences(!showPreferences)}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              {showPreferences ? 'Hide' : 'Edit'} Preferences
            </button>
          )}
        </div>
        
        {showPreferences ? (
          <form onSubmit={handlePreferenceSubmit}>
            <div className="mb-4">
              <label htmlFor="classYear" className="block mb-1">Class Year</label>
              <select
                id="classYear"
                name="classYear"
                value={classYear}
                onChange={(e) => setClassYear(e.target.value)}
                className="border border-gray-300 p-2 w-full"
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
              <label htmlFor="studyHabits" className="block mb-1">Study Habits</label>
              <select
                id="studyHabits"
                name="studyHabits"
                value={preferences.studyHabits}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
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
              <label htmlFor="sleepSchedule" className="block mb-1">Sleep Schedule</label>
              <select
                id="sleepSchedule"
                name="sleepSchedule"
                value={preferences.sleepSchedule}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
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
              <label htmlFor="cleanliness" className="block mb-1">Cleanliness</label>
              <select
                id="cleanliness"
                name="cleanliness"
                value={preferences.cleanliness}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
                required
              >
                <option value="">Select...</option>
                <option value="Very neat and organized">Very neat and organized</option>
                <option value="Generally neat">Generally neat</option>
                <option value="Not very concerned with tidiness">Generally neat</option>
                <option value="Not very concerned with tidiness">Not very concerned with tidiness</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="visitors" className="block mb-1">Visitors</label>
              <select
                id="visitors"
                name="visitors"
                value={preferences.visitors}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
                required
              >
                <option value="">Select...</option>
                <option value="Often have visitors/friends over">Often have visitors/friends over</option>
                <option value="Occasionally have visitors">Occasionally have visitors</option>
                <option value="Rarely have visitors">Rarely have visitors</option>
                <option value="Only on weekends">Only on weekends</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Interests (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedInterests.includes(interest)
                        ? 'bg-yellow-600 text-black'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="additionalInfo" className="block mb-1">Additional Information</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={preferences.additionalInfo}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full h-24"
                placeholder="Share any additional information that might help find a compatible roommate..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold"
            >
              Save Preferences
            </button>
          </form>
        ) : profileComplete ? (
          <div>
            <p className="mb-4">Your roommate preferences have been saved. You can now browse potential roommates below.</p>
          </div>
        ) : null}
      </div>
      
      {/* Roommate Requests */}
      {requests.length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Roommate Requests ({requests.length})</h2>
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request.uid} className="border border-gray-200 p-4 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{request.firstName} {request.lastName}</h3>
                    <p className="text-sm text-gray-600">Study: {request.roommatePreferences?.studyHabits || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">Sleep: {request.roommatePreferences?.sleepSchedule || 'Not specified'}</p>
                    {request.classYear && (
                      <p className="text-sm text-gray-600">Class: {request.classYear}</p>
                    )}
                  </div>
                  <div className="flex items-start space-x-2">
                    <button
                      onClick={() => acceptRequest(request)}
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => declineRequest(request)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* My Sent Requests */}
      {myRequests.length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">My Sent Requests ({myRequests.length})</h2>
          <div className="space-y-4">
            {myRequests.map(request => (
              <div key={request.uid} className="border border-gray-200 p-4 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{request.firstName} {request.lastName}</h3>
                    <p className="text-sm text-gray-600">{request.email}</p>
                    {request.classYear && (
                      <p className="text-sm text-gray-600">Class: {request.classYear}</p>
                    )}
                  </div>
                  <button
                    onClick={() => cancelRequest(request)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm"
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Potential Roommates with Class Year Filter */}
      {profileComplete && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Potential Roommates</h2>
          
          {/* Filter Panel */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Filter Options</h3>
              
              {(filterOptions.classYear || filterOptions.studyHabits || filterOptions.sleepSchedule || 
                filterOptions.cleanliness || filterOptions.visitors || filterOptions.interests.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="classYearFilter" className="block mb-1 text-sm font-medium">Class Year</label>
                <select
                  id="classYearFilter"
                  name="classYear"
                  value={filterOptions.classYear}
                  onChange={handleFilterChange}
                  className="border border-gray-300 p-2 w-full text-sm rounded"
                >
                  <option value="">All Years</option>
                  <option value="2025 (Senior)">2025 (Senior)</option>
                  <option value="2026 (Junior)">2026 (Junior)</option>
                  <option value="2027 (Sophomore)">2027 (Sophomore)</option>
                  <option value="2028 (Freshman)">2028 (Freshman)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="studyHabitsFilter" className="block mb-1 text-sm font-medium">Study Habits</label>
                <select
                  id="studyHabitsFilter"
                  name="studyHabits"
                  value={filterOptions.studyHabits}
                  onChange={handleFilterChange}
                  className="border border-gray-300 p-2 w-full text-sm rounded"
                >
                  <option value="">Any</option>
                  <option value="I need complete quiet to study">I need complete quiet to study</option>
                  <option value="I can study with music/background noise">I can study with music/background noise</option>
                  <option value="I can study anywhere">I can study anywhere</option>
                  <option value="I prefer to study at the library">I prefer to study at the library</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sleepScheduleFilter" className="block mb-1 text-sm font-medium">Sleep Schedule</label>
                <select
                  id="sleepScheduleFilter"
                  name="sleepSchedule"
                  value={filterOptions.sleepSchedule}
                  onChange={handleFilterChange}
                  className="border border-gray-300 p-2 w-full text-sm rounded"
                >
                  <option value="">Any</option>
                  <option value="Early riser (before 8am)">Early riser (before 8am)</option>
                  <option value="Regular hours (sleep 11pm-8am)">Regular hours (sleep 11pm-8am)</option>
                  <option value="Night owl (up past midnight)">Night owl (up past midnight)</option>
                  <option value="Varies day to day">Varies day to day</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="cleanlinessFilter" className="block mb-1 text-sm font-medium">Cleanliness</label>
                <select
                  id="cleanlinessFilter"
                  name="cleanliness"
                  value={filterOptions.cleanliness}
                  onChange={handleFilterChange}
                  className="border border-gray-300 p-2 w-full text-sm rounded"
                >
                  <option value="">Any</option>
                  <option value="Very neat and organized">Very neat and organized</option>
                  <option value="Generally neat">Generally neat</option>
                  <option value="Casual, clean when needed">Casual, clean when needed</option>
                  <option value="Not very concerned with tidiness">Not very concerned with tidiness</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="visitorsFilter" className="block mb-1 text-sm font-medium">Visitors</label>
                <select
                  id="visitorsFilter"
                  name="visitors"
                  value={filterOptions.visitors}
                  onChange={handleFilterChange}
                  className="border border-gray-300 p-2 w-full text-sm rounded"
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
              <label className="block mb-1 text-sm font-medium">Interest Filters (select to match)</label>
              <div className="flex flex-wrap gap-1 mb-3">
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleFilterInterest(interest)}
                    className={`px-2 py-1 rounded text-xs ${
                      filterOptions.interests.includes(interest)
                        ? 'bg-yellow-600 text-black'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4 text-sm">
              <p>Showing <strong>{filteredRoommates.length}</strong> of <strong>{potentialRoommates.length}</strong> potential roommates</p>
              
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Active filters:</span>
                <div className="flex flex-wrap gap-1">
                  {filterOptions.classYear && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      Year: {filterOptions.classYear}
                    </span>
                  )}
                  {filterOptions.studyHabits && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      Study: {filterOptions.studyHabits}
                    </span>
                  )}
                  {filterOptions.sleepSchedule && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      Sleep: {filterOptions.sleepSchedule}
                    </span>
                  )}
                  {filterOptions.cleanliness && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      Clean: {filterOptions.cleanliness}
                    </span>
                  )}
                  {filterOptions.visitors && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      Visitors: {filterOptions.visitors}
                    </span>
                  )}
                  {filterOptions.interests.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      Interests: {filterOptions.interests.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {filteredRoommates.length === 0 ? (
            <p>No potential roommates found matching your filters.</p>
          ) : (
            <div className="space-y-6">
              {filteredRoommates.map(roommate => (
                <div key={roommate.uid} className="border border-gray-200 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{roommate.firstName} {roommate.lastName}</h3>
                    <button
                      onClick={() => sendRequest(roommate)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black py-1 px-3 rounded font-semibold text-sm"
                    >
                      Send Request
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm"><span className="font-semibold">Study Habits:</span> {roommate.roommatePreferences?.studyHabits || 'Not specified'}</p>
                      <p className="text-sm"><span className="font-semibold">Sleep Schedule:</span> {roommate.roommatePreferences?.sleepSchedule || 'Not specified'}</p>
                      <p className="text-sm"><span className="font-semibold">Cleanliness:</span> {roommate.roommatePreferences?.cleanliness || 'Not specified'}</p>
                      <p className="text-sm"><span className="font-semibold">Visitors:</span> {roommate.roommatePreferences?.visitors || 'Not specified'}</p>
                      {roommate.classYear && (
                        <p className="text-sm"><span className="font-semibold">Class Year:</span> {roommate.classYear}</p>
                      )}
                    </div>
                    
                    <div>
                      {roommate.roommatePreferences?.interests && roommate.roommatePreferences.interests.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold">Interests:</p>
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
                        <div className="mt-2">
                          <p className="text-sm font-semibold">Additional Info:</p>
                          <div className="relative">
                            <p className={`text-sm break-words ${
                              !expandedInfoIds.includes(roommate.uid) ? "line-clamp-2 max-h-12" : ""
                            }`}>
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
      
      {/* Confirmation Modal */}
      {confirmModal && roommateToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Roommate Removal</h3>
            <p className="mb-4">Are you sure you want to remove <span className="font-semibold">{roommateToRemove.firstName} {roommateToRemove.lastName}</span> as your roommate?</p>
            <p className="mb-6 text-gray-600 text-sm">This will remove the roommate connection for both of you. You can always send a new request later.</p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelRemove}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={removeRoommate}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold"
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