import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
    doc, getDoc, setDoc, updateDoc, collection,
    getDocs, query, where, writeBatch, orderBy
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/router';

const TimeSlotAdmin = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [bulkTimeSlot, setBulkTimeSlot] = useState({
        startTime: '',
        endTime: ''
    });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        classYear: '',
        hasTimeSlot: 'all',
        hasRoom: 'all'
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    // Check if current user is admin and load users
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                try {
                    // Check if user is admin
                    const userDoc = await getDoc(doc(db, 'users', authUser.uid));

                    if (userDoc.exists() && userDoc.data().role === "admin") {
                        setIsAdmin(true);
                        // Fetch all users
                        await fetchUsers();
                    } else {
                        // Not an admin, redirect to dashboard
                        router.push('/dashboard');
                    }
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    setErrorMessage('Error checking admin status: ' + error.message);
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

    // Fetch all users from Firestore
    const fetchUsers = async () => {
        try {
            const usersQuery = query(
                collection(db, 'users'),
                where('role', '!=', 'admin'), // Exclude admins
                orderBy('role'),
                orderBy('lastName')
            );

            const userSnapshot = await getDocs(usersQuery);
            const userData = userSnapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));

            setUsers(userData);
            setFilteredUsers(userData);
        } catch (error) {
            console.error('Error fetching users:', error);
            setErrorMessage('Error fetching users: ' + error.message);
        }
    };

    // Filter users based on search term and filters
    useEffect(() => {
        let result = [...users];

        // Filter by search term
        if (searchTerm) {
            const lowercaseSearch = searchTerm.toLowerCase();
            result = result.filter(user =>
                (user.firstName && user.firstName.toLowerCase().includes(lowercaseSearch)) ||
                (user.lastName && user.lastName.toLowerCase().includes(lowercaseSearch)) ||
                (user.email && user.email.toLowerCase().includes(lowercaseSearch)) ||
                (user.studentId && user.studentId.includes(searchTerm))
            );
        }

        // Filter by class year
        if (filterOptions.classYear) {
            result = result.filter(user => user.classYear === filterOptions.classYear);
        }

        // Filter by time slot status
        if (filterOptions.hasTimeSlot !== 'all') {
            const hasTimeSlot = filterOptions.hasTimeSlot === 'yes';
            result = result.filter(user => !!user.timeSlot === hasTimeSlot);
        }

        // Filter by room selection status
        if (filterOptions.hasRoom !== 'all') {
            const hasRoom = filterOptions.hasRoom === 'yes';
            result = result.filter(user => !!user.selectedRoom === hasRoom);
        }

        setFilteredUsers(result);
    }, [users, searchTerm, filterOptions]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle bulk time slot input changes
    const handleBulkTimeSlotChange = (e) => {
        const { name, value } = e.target;
        setBulkTimeSlot(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Toggle user selection for bulk actions
    const toggleUserSelection = (uid) => {
        if (selectedUsers.includes(uid)) {
            setSelectedUsers(selectedUsers.filter(id => id !== uid));
        } else {
            setSelectedUsers([...selectedUsers, uid]);
        }
    };

    // Select/deselect all users
    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(user => user.uid));
        }
    };

    // Set time slot for a single user
    const setUserTimeSlot = async (uid, timeSlot) => {
        try {
            await updateDoc(doc(db, 'users', uid), {
                timeSlot: timeSlot
            });

            // Update local state
            setUsers(users.map(user =>
                user.uid === uid
                    ? { ...user, timeSlot: timeSlot }
                    : user
            ));

            showSuccessMessage("Time slot updated successfully");
        } catch (error) {
            console.error('Error updating time slot:', error);
            setErrorMessage("Error updating time slot: " + error.message);
        }
    };

    // Apply bulk time slot to selected users
    const applyBulkTimeSlot = async () => {
        if (selectedUsers.length === 0 || !bulkTimeSlot.startTime || !bulkTimeSlot.endTime) {
            setErrorMessage("Please select users and specify a time slot");
            return;
        }

        try {
            const batch = writeBatch(db);

            // Add updates to batch
            selectedUsers.forEach(uid => {
                const userRef = doc(db, 'users', uid);
                batch.update(userRef, {
                    timeSlot: bulkTimeSlot
                });
            });

            // Commit the batch
            await batch.commit();

            // Update local state
            setUsers(users.map(user =>
                selectedUsers.includes(user.uid)
                    ? { ...user, timeSlot: bulkTimeSlot }
                    : user
            ));

            // Clear selection
            setSelectedUsers([]);

            showSuccessMessage(`Time slot updated for ${selectedUsers.length} users`);
        } catch (error) {
            console.error('Error applying bulk time slot:', error);
            setErrorMessage("Error updating time slots: " + error.message);
        }
    };

    // Clear time slots for selected users
    const clearTimeSlots = async () => {
        if (selectedUsers.length === 0) {
            setErrorMessage("Please select users to clear time slots");
            return;
        }

        if (!confirm(`Are you sure you want to clear time slots for ${selectedUsers.length} users?`)) {
            return;
        }

        try {
            const batch = writeBatch(db);

            // Add updates to batch
            selectedUsers.forEach(uid => {
                const userRef = doc(db, 'users', uid);
                batch.update(userRef, {
                    timeSlot: null
                });
            });

            // Commit the batch
            await batch.commit();

            // Update local state
            setUsers(users.map(user =>
                selectedUsers.includes(user.uid)
                    ? { ...user, timeSlot: null }
                    : user
            ));

            // Clear selection
            setSelectedUsers([]);

            showSuccessMessage(`Time slots cleared for ${selectedUsers.length} users`);
        } catch (error) {
            console.error('Error clearing time slots:', error);
            setErrorMessage("Error clearing time slots: " + error.message);
        }
    };

    // Show a success message that disappears after 3 seconds
    const showSuccessMessage = (message) => {
        setErrorMessage(''); // Clear any error messages
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    // Format date for display
    const formatDateTime = (dateString) => {
        if (!dateString) return "Not set";

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-700">Loading user data...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return null; // Will be redirected by useEffect
    }

    return (
        <div className="space-y-6">
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Time Slot Administration</h3>
            </div>

            {/* Notification Messages */}
            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm leading-5 font-medium">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm leading-5 font-medium">{errorMessage}</p>
                            <button 
                                onClick={() => setErrorMessage('')}
                                className="text-red-700 hover:text-red-600 font-medium text-xs underline ml-2"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Actions Panel */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bulk Time Slot Assignment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={bulkTimeSlot.startTime}
                            onChange={handleBulkTimeSlotChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">End Time</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            value={bulkTimeSlot.endTime}
                            onChange={handleBulkTimeSlotChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={applyBulkTimeSlot}
                        disabled={selectedUsers.length === 0 || !bulkTimeSlot.startTime || !bulkTimeSlot.endTime}
                        className={`py-2 px-4 rounded font-medium ${
                            selectedUsers.length === 0 || !bulkTimeSlot.startTime || !bulkTimeSlot.endTime
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            }`}
                    >
                        {selectedUsers.length > 0 
                            ? `Assign Time Slot to ${selectedUsers.length} Selected Users` 
                            : 'Select Users to Assign Time Slot'}
                    </button>

                    <button
                        onClick={clearTimeSlots}
                        disabled={selectedUsers.length === 0}
                        className={`py-2 px-4 rounded font-medium ${
                            selectedUsers.length === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                    >
                        Clear Time Slots
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter Users
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label htmlFor="searchTerm" className="block text-gray-700 font-medium mb-2">
                            Search
                        </label>
                        <input
                            id="searchTerm"
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Name, Email, ID..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="classYear" className="block text-gray-700 font-medium mb-2">
                            Class Year
                        </label>
                        <select
                            id="classYear"
                            name="classYear"
                            value={filterOptions.classYear}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="">All Years</option>
                            <option value="2025 (Senior)">2025 (Senior)</option>
                            <option value="2026 (Junior)">2026 (Junior)</option>
                            <option value="2027 (Sophomore)">2027 (Sophomore)</option>
                            <option value="2028 (Freshman)">2028 (Freshman)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="hasTimeSlot" className="block text-gray-700 font-medium mb-2">
                            Has Time Slot
                        </label>
                        <select
                            id="hasTimeSlot"
                            name="hasTimeSlot"
                            value={filterOptions.hasTimeSlot}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="all">All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="hasRoom" className="block text-gray-700 font-medium mb-2">
                            Has Room
                        </label>
                        <select
                            id="hasRoom"
                            name="hasRoom"
                            value={filterOptions.hasRoom}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="all">All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Showing {filteredUsers.length} of {users.length} users</p>

                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterOptions({
                                classYear: '',
                                hasTimeSlot: 'all',
                                hasRoom: 'all'
                            });
                        }}
                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-900">Student List</h4>
                    {selectedUsers.length > 0 && (
                        <span className="text-sm text-gray-600 bg-yellow-100 px-2 py-1 rounded">
                            {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                        </span>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded mr-2"
                                        />
                                        <span>Name</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Class
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time Slot
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Room
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.uid} 
                                    className={selectedUsers.includes(user.uid) 
                                        ? 'bg-yellow-50' 
                                        : 'hover:bg-gray-50'
                                    }
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.uid)}
                                                onChange={() => toggleUserSelection(user.uid)}
                                                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded mr-2"
                                            />
                                            <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {user.classYear || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {user.timeSlot ? (
                                            <div className="text-gray-700">
                                                <div>{formatDateTime(user.timeSlot.startTime)}</div>
                                                <div className="text-gray-500 text-xs">to</div>
                                                <div>{formatDateTime(user.timeSlot.endTime)}</div>
                                            </div>
                                        ) : (
                                            <span className="text-red-600 font-medium">Not set</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {user.selectedRoom ? (
                                            <span className="text-green-600 font-medium">
                                                {user.selectedRoom.roomNumber} in {user.selectedRoom.dormName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">None</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {user.timeSlot ? (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to clear this time slot?')) {
                                                        setUserTimeSlot(user.uid, null);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Clear Slot
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    toggleUserSelection(user.uid);
                                                    if (!bulkTimeSlot.startTime || !bulkTimeSlot.endTime) {
                                                        // Set focus to start time input
                                                        document.querySelector('input[name="startTime"]').focus();
                                                    }
                                                }}
                                                className="text-yellow-600 hover:text-yellow-800 font-medium"
                                            >
                                                Assign Slot
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                                        No users found matching the filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TimeSlotAdmin;