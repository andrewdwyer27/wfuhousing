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
            alert("Error updating time slot: " + error.message);
        }
    };

    // Apply bulk time slot to selected users
    const applyBulkTimeSlot = async () => {
        if (selectedUsers.length === 0 || !bulkTimeSlot.startTime || !bulkTimeSlot.endTime) {
            alert("Please select users and specify a time slot");
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
            alert("Error updating time slots: " + error.message);
        }
    };


    // Clear time slots for selected users
    const clearTimeSlots = async () => {
        if (selectedUsers.length === 0) {
            alert("Please select users to clear time slots");
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
            alert("Error clearing time slots: " + error.message);
        }
    };

    // Show a success message that disappears after 3 seconds
    const showSuccessMessage = (message) => {
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
            <div className="max-w-7xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Time Slot Administration</h1>
                <div className="p-6 bg-white rounded-md shadow-sm border border-gray-200">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <div className="p-6 bg-white rounded-md shadow-sm border border-gray-200">
                    <p>You do not have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Time Slot Administration</h1>

            {/* Success message */}
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                    <p>{successMessage}</p>
                </div>
            )}

            {/* Bulk Actions Panel */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Bulk Time Slot Assignment</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1">Start Time</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={bulkTimeSlot.startTime}
                            onChange={handleBulkTimeSlotChange}
                            className="border border-gray-300 p-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">End Time</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            value={bulkTimeSlot.endTime}
                            onChange={handleBulkTimeSlotChange}
                            className="border border-gray-300 p-2 w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={applyBulkTimeSlot}
                        disabled={selectedUsers.length === 0 || !bulkTimeSlot.startTime || !bulkTimeSlot.endTime}
                        className={`py-2 px-4 rounded font-semibold ${selectedUsers.length === 0 || !bulkTimeSlot.startTime || !bulkTimeSlot.endTime
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-yellow-600 hover:bg-yellow-700 text-black'
                            }`}
                    >
                        Assign Time Slot to {selectedUsers.length} Selected Users
                    </button>

                    <button
                        onClick={clearTimeSlots}
                        disabled={selectedUsers.length === 0}
                        className={`py-2 px-4 rounded font-semibold ${selectedUsers.length === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                    >
                        Clear Time Slots
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label htmlFor="searchTerm" className="block mb-1">Search</label>
                        <input
                            id="searchTerm"
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Name, Email, ID..."
                            className="border border-gray-300 p-2 w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="classYear" className="block mb-1">Class Year</label>
                        <select
                            id="classYear"
                            name="classYear"
                            value={filterOptions.classYear}
                            onChange={handleFilterChange}
                            className="border border-gray-300 p-2 w-full"
                        >
                            <option value="">All Years</option>
                            <option value="2025">2025 (Senior)</option>
                            <option value="2026">2026 (Junior)</option>
                            <option value="2027">2027 (Sophomore)</option>
                            <option value="2028">2028 (Freshman)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="hasTimeSlot" className="block mb-1">Has Time Slot</label>
                        <select
                            id="hasTimeSlot"
                            name="hasTimeSlot"
                            value={filterOptions.hasTimeSlot}
                            onChange={handleFilterChange}
                            className="border border-gray-300 p-2 w-full"
                        >
                            <option value="all">All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="hasRoom" className="block mb-1">Has Room</label>
                        <select
                            id="hasRoom"
                            name="hasRoom"
                            value={filterOptions.hasRoom}
                            onChange={handleFilterChange}
                            className="border border-gray-300 p-2 w-full"
                        >
                            <option value="all">All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <p>Showing {filteredUsers.length} of {users.length} users</p>

                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterOptions({
                                classYear: '',
                                hasTimeSlot: 'all',
                                hasRoom: 'all'
                            });
                        }}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="mr-2"
                                    />
                                    Name
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
                                <tr key={user.uid} className={selectedUsers.includes(user.uid) ? 'bg-yellow-50' : ''}>
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.uid)}
                                            onChange={() => toggleUserSelection(user.uid)}
                                            className="mr-2"
                                        />
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {user.classYear || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {user.timeSlot ? (
                                            <div>
                                                <div>{formatDateTime(user.timeSlot.startTime)}</div>
                                                <div>to</div>
                                                <div>{formatDateTime(user.timeSlot.endTime)}</div>
                                            </div>
                                        ) : (
                                            <span className="text-red-500">Not set</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {user.selectedRoom ? (
                                            <span className="text-green-600">
                                                {user.selectedRoom.roomNumber} in {user.selectedRoom.dormName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">None</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {user.timeSlot && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to clear this time slot?')) {
                                                        setUserTimeSlot(user.uid, null);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Clear
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