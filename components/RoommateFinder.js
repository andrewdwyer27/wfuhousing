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
  const [potentialRoommates, setPotentialRoommates] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [activeRoommates, setActiveRoommates] = useState([]); // Add state for active roommates
  const [profileComplete, setProfileComplete] = useState(false);
  const [showPreferences, setShowPreferences] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const router = useRouter();

  const interestOptions = [
    'Sports', 'Music', 'Art', 'Gaming', 'Fitness', 
    'Reading', 'Cooking', 'Travel', 'Movies', 'Outdoor Activities',
    'Technology', 'Academic', 'Greek Life', 'Religious'
  ];

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
            
            // Check if user has roommate preferences
            if (userData.roommatePreferences) {
              setPreferences(userData.roommatePreferences);
              setSelectedInterests(userData.roommatePreferences.interests || []);
              setProfileComplete(true);
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

  // Handle preference form submission
  const handlePreferenceSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      // Update preferences in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
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
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  };

  // Remove a roommate connection
  const removeRoommate = async (roommate) => {
    if (!user) return;
    
    try {
      // Update my connections
      await updateDoc(doc(db, 'users', user.uid), {
        roommateConnections: arrayRemove(roommate.uid)
      });
      
      // Update their connections
      await updateDoc(doc(db, 'users', roommate.uid), {
        roommateConnections: arrayRemove(user.uid)
      });
      
      // Update local state
      setActiveRoommates(activeRoommates.filter(r => r.uid !== roommate.uid));
      setPotentialRoommates([...potentialRoommates, roommate]);
    } catch (error) {
      console.error('Error removing roommate:', error);
    }
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
      
      {/* Active Roommates Section */}
      {activeRoommates.length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Active Roommates ({activeRoommates.length})</h2>
          <div className="space-y-4">
            {activeRoommates.map(roommate => (
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
                    <button
                      onClick={() => removeRoommate(roommate)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                <option value="quiet">I need complete quiet to study</option>
                <option value="music">I can study with music/background noise</option>
                <option value="anywhere">I can study anywhere</option>
                <option value="library">I prefer to study at the library</option>
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
                <option value="early">Early riser (before 8am)</option>
                <option value="regular">Regular hours (sleep 11pm-8am)</option>
                <option value="late">Night owl (up past midnight)</option>
                <option value="varies">Varies day to day</option>
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
                <option value="veryNeat">Very neat and organized</option>
                <option value="neat">Generally neat</option>
                <option value="casual">Casual, clean when needed</option>
                <option value="messy">Not very concerned with tidiness</option>
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
                <option value="often">Often have visitors/friends over</option>
                <option value="sometimes">Occasionally have visitors</option>
                <option value="rarely">Rarely have visitors</option>
                <option value="weekends">Only on weekends</option>
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
      
      {/* Potential Roommates */}
      {profileComplete && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Potential Roommates</h2>
          
          {potentialRoommates.length === 0 ? (
            <p>No potential roommates found at this time.</p>
          ) : (
            <div className="space-y-6">
              {potentialRoommates.map(roommate => (
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
                          <p className="text-sm">{roommate.roommatePreferences.additionalInfo}</p>
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
  );
};

export default RoommateFinder;