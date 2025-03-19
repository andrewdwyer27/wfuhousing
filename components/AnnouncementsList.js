import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AnnouncementsList = ({ isAdmin = false, maxItems = 5 }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                
                // Create query - if not admin, only show active announcements
                let announcementsQuery = query(
                    collection(db, 'announcements'),
                    orderBy('createdAt', 'desc')
                );
                
                if (!isAdmin) {
                    // For user dashboard, only get active announcements with a limit
                    announcementsQuery = query(
                        collection(db, 'announcements'),
                        where('active', '==', true),
                        orderBy('createdAt', 'desc')
                    );
                    
                    // Apply limit if specified
                    if (maxItems) {
                        announcementsQuery = query(announcementsQuery, limit(maxItems));
                    }
                }
                
                const querySnapshot = await getDocs(announcementsQuery);
                
                const announcementsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Convert Firebase Timestamp to JavaScript Date
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
                }));
                
                setAnnouncements(announcementsList);
            } catch (err) {
                console.error('Error fetching announcements:', err);
                setError('Failed to load announcements');
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [isAdmin, maxItems]);

    const toggleAnnouncementStatus = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, 'announcements', id), {
                active: !currentStatus
            });
            
            // Update the local state
            setAnnouncements(announcements.map(announcement => 
                announcement.id === id 
                    ? { ...announcement, active: !currentStatus } 
                    : announcement
            ));
        } catch (error) {
            console.error('Error updating announcement status:', error);
            alert('Failed to update announcement status');
        }
    };

    const deleteAnnouncement = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
            try {
                await deleteDoc(doc(db, 'announcements', id));
                
                // Update the local state
                setAnnouncements(announcements.filter(announcement => announcement.id !== id));
            } catch (error) {
                console.error('Error deleting announcement:', error);
                alert('Failed to delete announcement');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-700">Loading announcements...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                {error}
            </div>
        );
    }

    if (announcements.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-md">
                {isAdmin ? 'No announcements have been created yet.' : 'No active announcements at this time.'}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {announcements.map((announcement) => (
                <div 
                    key={announcement.id} 
                    className={`border-l-4 ${
                        announcement.isImportant ? 'border-red-500' : 'border-yellow-500'
                    } pl-4 py-2 ${
                        !announcement.active && isAdmin ? 'opacity-60' : ''
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500">
                                {announcement.createdAt.toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                })}
                                {announcement.isImportant && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Important
                                    </span>
                                )}
                                {!announcement.active && isAdmin && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Inactive
                                    </span>
                                )}
                            </p>
                            <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                            <p className="text-gray-700 text-sm mt-1">{announcement.content}</p>
                        </div>
                        
                        {isAdmin && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => toggleAnnouncementStatus(announcement.id, announcement.active)}
                                    className={`p-1 rounded-md ${
                                        announcement.active 
                                            ? 'text-yellow-600 hover:bg-yellow-50' 
                                            : 'text-green-600 hover:bg-green-50'
                                    }`}
                                    title={announcement.active ? 'Deactivate' : 'Activate'}
                                >
                                    {announcement.active ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={() => deleteAnnouncement(announcement.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                                    title="Delete Announcement"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnnouncementsList;