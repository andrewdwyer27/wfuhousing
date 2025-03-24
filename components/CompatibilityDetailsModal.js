import React from 'react';

const CompatibilityDetailsModal = ({ roommate, user, onClose }) => {
    const { preferences, classYear } = user;
    const roommatePrefs = roommate.roommatePreferences;

    // Calculate shared interests
    const sharedInterests = preferences.interests?.filter(
        interest => roommatePrefs.interests?.includes(interest)
    ) || [];

    const uniqueUserInterests = preferences.interests?.filter(
        interest => !roommatePrefs.interests?.includes(interest)
    ) || [];

    const uniqueRoommateInterests = roommatePrefs.interests?.filter(
        interest => !preferences.interests?.includes(interest)
    ) || [];

    // Compatibility factors with descriptions
    const factors = [
        {
            name: 'Study Habits',
            userValue: preferences.studyHabits,
            roommateValue: roommatePrefs.studyHabits,
            match: preferences.studyHabits === roommatePrefs.studyHabits,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            name: 'Sleep Schedule',
            userValue: preferences.sleepSchedule,
            roommateValue: roommatePrefs.sleepSchedule,
            match: preferences.sleepSchedule === roommatePrefs.sleepSchedule,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )
        },
        {
            name: 'Cleanliness',
            userValue: preferences.cleanliness,
            roommateValue: roommatePrefs.cleanliness,
            match: preferences.cleanliness === roommatePrefs.cleanliness,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            name: 'Visitors',
            userValue: preferences.visitors,
            roommateValue: roommatePrefs.visitors,
            match: preferences.visitors === roommatePrefs.visitors,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            name: 'Class Year',
            userValue: classYear,
            roommateValue: roommate.classYear,
            match: classYear === roommate.classYear,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
            )
        }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="mr-2">Compatibility with {roommate.firstName} {roommate.lastName}</span>
                        <div className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${roommate.similarityScore >= 80
                                ? 'bg-green-100 text-green-800'
                                : roommate.similarityScore >= 60
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                            {roommate.similarityScore}% Match
                        </div>
                    </h3>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress bar showing overall compatibility */}
                <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className={`h-4 rounded-full ${roommate.similarityScore >= 80
                                    ? 'bg-green-600'
                                    : roommate.similarityScore >= 60
                                        ? 'bg-yellow-500'
                                        : 'bg-gray-400'
                                }`}
                            style={{ width: `${roommate.similarityScore}%` }}
                        ></div>
                    </div>
                </div>

                {/* Compatibility factors */}
                <div className="space-y-4 mb-6">
                    {factors.map((factor, index) => (
                        <div key={index} className="rounded-lg border p-4">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <div className="text-gray-500 mr-2">
                                        {factor.icon}
                                    </div>
                                    <h4 className="font-medium text-gray-900">{factor.name}</h4>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${factor.match
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {factor.match ? 'Match' : 'Different'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Your preference:</p>
                                    <p className="font-medium">{factor.userValue || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Their preference:</p>
                                    <p className="font-medium">{factor.roommateValue || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Interests section */}
                <div className="rounded-lg border p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Interests Compatibility
                    </h4>

                    {sharedInterests.length > 0 ? (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Shared interests:</p>
                            <div className="flex flex-wrap gap-2">
                                {sharedInterests.map(interest => (
                                    <span key={interest} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mb-2">No shared interests found.</p>
                    )}

                    {/* Your unique interests */}
                    {uniqueUserInterests.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Your other interests:</p>
                            <div className="flex flex-wrap gap-2">
                                {uniqueUserInterests.map(interest => (
                                    <span key={interest} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Their unique interests */}
                    {uniqueRoommateInterests.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Their other interests:</p>
                            <div className="flex flex-wrap gap-2">
                                {uniqueRoommateInterests.map(interest => (
                                    <span key={interest} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional info */}
                {roommate.roommatePreferences?.additionalInfo && (
                    <div className="rounded-lg border p-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Additional Information
                        </h4>
                        <p className="text-sm text-gray-700">{roommate.roommatePreferences.additionalInfo}</p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-medium transition duration-200"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            // Call the sendRequest function if you want to add this functionality
                            // sendRequest(roommate);
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded font-medium transition duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompatibilityDetailsModal;