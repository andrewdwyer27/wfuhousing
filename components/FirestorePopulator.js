import { useState } from 'react';
import { collection, doc, setDoc, writeBatch, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
    dogwoodRooms,
    magnoliaRooms,
    studentApartmentsARooms,
    studentApartmentsBRooms,
    davisRooms,
    taylorRooms,
    kitchinRooms,
    poteatRooms,
    huffmanRooms,
    efirdRooms
} from '../lib/helpers';

const FirestorePopulator = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const populateDormsData = async () => {
        setLoading(true);
        setStatus('Starting data population...');

        try {
            // Create dorms
            const dormsData = [
                {
                    id: 'dogwood',
                    name: 'Dogwood Residence Hall',
                    description: 'Suite-style residence hall with modern finishes and shared living spaces.',
                    features: ['Shared suites', 'Study lounges', 'Laundry on each floor'],
                    image: '/images/dogwood.jpg',
                    totalRooms: dogwoodRooms.length,
                    availableRooms: dogwoodRooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 'magnolia',
                    name: 'Magnolia Residence Hall',
                    description: 'Modern suite-style residence hall with a variety of room configurations.',
                    features: ['Air conditioning', 'Elevator', 'Study lounges', 'Laundry facilities'],
                    image: '/images/magnolia.jpg',
                    totalRooms: magnoliaRooms.length,
                    availableRooms: magnoliaRooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 'studentApartmentsA',
                    name: 'Student Apartments A',
                    description: 'Apartment-style single rooms designed for upperclassmen.',
                    features: ['Private bathrooms', 'Independent living', 'On-campus location'],
                    image: '/images/student-apartments-a.jpg',
                    totalRooms: studentApartmentsARooms.length,
                    availableRooms: studentApartmentsARooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 'studentApartmentsB',
                    name: 'Student Apartments B',
                    description: 'Identical to Apartments A with a focus on independent single living.',
                    features: ['Private bathrooms', 'Independent living', 'Quiet study environment'],
                    image: '/images/student-apartments-b.jpg',
                    totalRooms: studentApartmentsBRooms.length,
                    availableRooms: studentApartmentsBRooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 'davis',
                    name: 'Davis Residence Hall',
                    description: 'Traditional dorm layout with easy access to dining and classes.',
                    features: ['Close to academic buildings', 'Study lounges', 'Common bathrooms'],
                    image: '/images/davis.jpg',
                    totalRooms: davisRooms.length,
                    availableRooms: davisRooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 'taylor',
                    name: 'Taylor Residence Hall',
                    description: 'Traditional style residence hall centrally located on campus.',
                    features: ['Community bathrooms', 'Lounge spaces', 'Kitchen on each floor'],
                    image: '/images/taylor.jpg',
                    totalRooms: taylorRooms.length,
                    availableRooms: taylorRooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 'kitchin',
                    name: 'Kitchin Residence Hall',
                    description: 'Comfortable dorm with double and single rooms and shared amenities.',
                    features: ['Community bathrooms', 'Common lounge', 'Laundry access'],
                    image: '/images/kitchin.jpg',
                    totalRooms: kitchinRooms.length,
                    availableRooms: kitchinRooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 'poteat',
                    name: 'Poteat Residence Hall',
                    description: 'Located close to the student center, Poteat offers convenience and community.',
                    features: ['Close to gym and dining', 'Mix of room styles', 'Community living'],
                    image: '/images/poteat.jpg',
                    totalRooms: poteatRooms.length,
                    availableRooms: poteatRooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 'huffman',
                    name: 'Huffman Residence Hall',
                    description: 'Popular dorm for sophomores with easy access to north campus amenities.',
                    features: ['Single and double rooms', 'Quiet atmosphere', 'Community study rooms'],
                    image: '/images/huffman.jpg',
                    totalRooms: huffmanRooms.length,
                    availableRooms: huffmanRooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 'efird',
                    name: 'Efird Residence Hall',
                    description: 'Smaller dorm with private living ideal for independent students.',
                    features: ['All singles and doubles', 'Minimal shared space', 'Quiet setting'],
                    image: '/images/efird.jpg',
                    totalRooms: efirdRooms.length,
                    availableRooms: efirdRooms.length,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                }
            ];

            // Create a batch for dorms
            const dormBatch = writeBatch(db);

            // Add dorms to batch
            dormsData.forEach(dorm => {
                const dormRef = doc(db, 'dorms', dorm.id);
                dormBatch.set(dormRef, dorm);
            });

            // Commit the dorms batch
            await dormBatch.commit();
            setStatus('Dorms data added successfully. Adding rooms data...');

            // Populate rooms for Magnolia
            await populateRooms();
            setStatus('All data populated successfully!');
        } catch (error) {
            console.error('Error populating data:', error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const populateRooms = async () => {
        try {
            // Use a batch for efficient writes
            const batch = writeBatch(db);

            // Add all rooms to batch
            // Dogwood
            dogwoodRooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'dogwood', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Magnolia
            magnoliaRooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'magnolia', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Student Apartments A
            studentApartmentsARooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'studentApartmentsA', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Student Apartments B
            studentApartmentsBRooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'studentApartmentsB', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Davis
            davisRooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'davis', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Taylor
            taylorRooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'taylor', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Kitchin
            kitchinRooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'kitchin', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Poteat
            poteatRooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'poteat', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Huffman
            huffmanRooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'huffman', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Efird
            efirdRooms.forEach(room => {
                const roomRef = doc(db, 'dorms', 'efird', 'rooms', room.id);
                batch.set(roomRef, room);
            });

            // Commit the batch
            await batch.commit();
            setStatus('Magnolia rooms data added successfully.');
        } catch (error) {
            console.error('Error adding Magnolia rooms:', error);
            throw error;
        }
    };

    // Populate sample roommate request data
    const populateRoommateRequests = async () => {
        setLoading(true);
        setStatus('Creating sample roommate requests...');

        try {
            // Add incoming requests to user1
            await updateDoc(doc(db, 'users', 'user1'), {
                incomingRoommateRequests: ['user5']
            });

            // Add outgoing requests from user5 to user1
            await updateDoc(doc(db, 'users', 'user5'), {
                outgoingRoommateRequests: ['user1']
            });

            // Add outgoing requests from user2 to user5
            await updateDoc(doc(db, 'users', 'user2'), {
                outgoingRoommateRequests: ['user5']
            });

            // Add incoming requests to user5 from user2
            await updateDoc(doc(db, 'users', 'user5'), {
                incomingRoommateRequests: ['user2']
            });

            setStatus('Roommate request data added successfully!');
        } catch (error) {
            console.error('Error adding roommate request data:', error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const populateUserData = async () => {
        setLoading(true);
        setStatus('Creating sample user data...');

        try {
            // Create mock users
            const users = [
                {
                    uid: 'user1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@wfu.edu',
                    studentId: '12345678',
                    role: 'student',
                    createdAt: new Date().toISOString(),
                    roommatePreferences: {
                        studyHabits: 'quiet',
                        sleepSchedule: 'early',
                        cleanliness: 'veryNeat',
                        visitors: 'rarely',
                        interests: ['Sports', 'Fitness', 'Reading'],
                        additionalInfo: 'I prefer a quiet environment for studying.'
                    }
                },
                {
                    uid: 'user2',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.smith@wfu.edu',
                    studentId: '87654321',
                    role: 'student',
                    createdAt: new Date().toISOString(),
                    roommatePreferences: {
                        studyHabits: 'music',
                        sleepSchedule: 'late',
                        cleanliness: 'neat',
                        visitors: 'sometimes',
                        interests: ['Music', 'Art', 'Movies'],
                        additionalInfo: 'I enjoy having friends over occasionally.'
                    }
                },
                {
                    uid: 'user3',
                    firstName: 'Alex',
                    lastName: 'Johnson',
                    email: 'alex.johnson@wfu.edu',
                    studentId: '23456789',
                    role: 'student',
                    createdAt: new Date().toISOString(),
                    roommatePreferences: {
                        studyHabits: 'anywhere',
                        sleepSchedule: 'regular',
                        cleanliness: 'casual',
                        visitors: 'weekends',
                        interests: ['Gaming', 'Technology', 'Movies'],
                        additionalInfo: 'I like to keep things clean but not obsessively so.'
                    },
                    roommateConnections: ['user4']
                },
                {
                    uid: 'user4',
                    firstName: 'Morgan',
                    lastName: 'Williams',
                    email: 'morgan.williams@wfu.edu',
                    studentId: '34567890',
                    role: 'student',
                    createdAt: new Date().toISOString(),
                    roommatePreferences: {
                        studyHabits: 'library',
                        sleepSchedule: 'regular',
                        cleanliness: 'neat',
                        visitors: 'sometimes',
                        interests: ['Reading', 'Cooking', 'Outdoor Activities'],
                        additionalInfo: 'I enjoy cooking and sharing meals with roommates.'
                    },
                    roommateConnections: ['user3']
                },
                {
                    uid: 'user5',
                    firstName: 'Taylor',
                    lastName: 'Brown',
                    email: 'taylor.brown@wfu.edu',
                    studentId: '45678901',
                    role: 'student',
                    createdAt: new Date().toISOString(),
                    roommatePreferences: {
                        studyHabits: 'music',
                        sleepSchedule: 'late',
                        cleanliness: 'casual',
                        visitors: 'often',
                        interests: ['Sports', 'Movies', 'Greek Life'],
                        additionalInfo: 'I like to have an active social life.'
                    }
                }
            ];

            // Use a batch for efficient writes
            const batch = writeBatch(db);

            // Add all users to batch
            users.forEach(user => {
                const userRef = doc(db, 'users', user.uid);
                batch.set(userRef, user);
            });

            // Commit the batch
            await batch.commit();
            setStatus('User data added successfully!');
        } catch (error) {
            console.error('Error adding user data:', error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Firestore Data Populator</h1>
            <p className="mb-6">Use the buttons below to populate your Firestore database with sample data.</p>

            <div className="space-y-4">
                <div className="mb-6">
                    <button
                        onClick={populateDormsData}
                        disabled={loading}
                        className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold mr-4"
                    >
                        Populate Dorms & Rooms
                    </button>
                    <p className="mt-2 text-sm text-gray-600">Creates dorm buildings and adds fully available room data with no occupants.</p>
                </div>

                <div className="mb-6">
                    <button
                        onClick={populateUserData}
                        disabled={loading}
                        className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold"
                    >
                        Populate User Data
                    </button>
                    <p className="mt-2 text-sm text-gray-600">Creates sample user accounts with roommate preferences (not assigned to any rooms).</p>
                </div>

                <div className="mb-6">
                    <button
                        onClick={populateRoommateRequests}
                        disabled={loading}
                        className="bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded font-semibold"
                    >
                        Add Roommate Requests
                    </button>
                    <p className="mt-2 text-sm text-gray-600">Adds sample roommate requests between users.</p>
                </div>

                <div className="mb-6">
                    <button
                        onClick={() => {
                            populateDormsData()
                                .then(() => populateUserData())
                                .then(() => populateRoommateRequests())
                                .catch(err => console.error('Error in population sequence:', err));
                        }}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold"
                    >
                        Populate All Data
                    </button>
                    <p className="mt-2 text-sm text-gray-600">Runs all population functions in sequence. All rooms will be created as fully available with no occupants.</p>
                </div>
            </div>

            {status && (
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                    <p>{status}</p>
                </div>
            )}

            {loading && (
                <div className="mt-4 flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-600 mr-2"></div>
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
};

export default FirestorePopulator;