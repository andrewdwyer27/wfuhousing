import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function HelpCenter() {
    const [activeCategory, setActiveCategory] = useState('getting-started');

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Help Center | WakeRooms</title>
                <meta name="description" content="Find answers to your questions about using WakeRooms for roommate matching and dorm selection at Wake Forest University." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/" className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-bold text-yellow-600">WakeRooms</span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <Link href="/login" className="px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md text-yellow-600 bg-white hover:bg-gray-50 border-yellow-600">
                                Log in
                            </Link>
                            <Link href="/signup" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Help Center</h1>
                    <p className="mt-4 text-lg text-gray-500">Find answers to common questions and learn how to make the most of WakeRooms.</p>
                </div>

                <div className="mt-8 max-w-6xl mx-auto">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-4">
                            {/* Sidebar Navigation - Left Side */}
                            <div className="bg-yellow-600 p-6 text-white">
                                <h2 className="text-xl font-bold mb-6">Topics</h2>
                                <nav className="space-y-3">
                                    <button
                                        onClick={() => setActiveCategory('getting-started')}
                                        className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeCategory === 'getting-started'
                                            ? 'bg-white text-yellow-700'
                                            : 'bg-yellow-500 bg-opacity-30 text-white hover:bg-opacity-40'
                                            }`}
                                    >
                                        Getting Started
                                    </button>
                                    <button
                                        onClick={() => setActiveCategory('account')}
                                        className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeCategory === 'account'
                                            ? 'bg-white text-yellow-700'
                                            : 'bg-yellow-500 bg-opacity-30 text-white hover:bg-opacity-40'
                                            }`}
                                    >
                                        Account Management
                                    </button>
                                    <button
                                        onClick={() => setActiveCategory('roommate')}
                                        className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeCategory === 'roommate'
                                            ? 'bg-white text-yellow-700'
                                            : 'bg-yellow-500 bg-opacity-30 text-white hover:bg-opacity-40'
                                            }`}
                                    >
                                        Roommate Matching
                                    </button>
                                    <button
                                        onClick={() => setActiveCategory('room')}
                                        className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeCategory === 'room'
                                            ? 'bg-white text-yellow-700'
                                            : 'bg-yellow-500 bg-opacity-30 text-white hover:bg-opacity-40'
                                            }`}
                                    >
                                        Room Selection
                                    </button>
                                    <button
                                        onClick={() => setActiveCategory('technical')}
                                        className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeCategory === 'technical'
                                            ? 'bg-white text-yellow-700'
                                            : 'bg-yellow-500 bg-opacity-30 text-white hover:bg-opacity-40'
                                            }`}
                                    >
                                        Technical Support
                                    </button>
                                </nav>

                                <div className="mt-12">
                                    <h3 className="text-xl font-semibold mb-4">Need More Help?</h3>
                                    <p className="text-white text-opacity-90 mb-4">
                                        Can't find what you're looking for? Our support team is here to help you with any questions.
                                    </p>
                                    <div className="space-y-4 mt-6">
                                        <div className="flex items-start">
                                            <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-lg">housing@wfu.edu</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-lg">(336) 758-0000</span>
                                        </div>
                                    </div>

                                    <Link href="/contact" className="mt-6 inline-flex items-center justify-center w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-3 px-5 rounded-md text-base font-medium transition-colors">
                                        Contact Support
                                    </Link>
                                </div>
                            </div>

                            {/* Main Content - Right Side */}
                            <div className="col-span-3 p-8 overflow-auto">
                                {activeCategory === 'getting-started' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Getting Started with WakeRooms</h2>

                                        <div className="space-y-10">
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">How do I create a WakeRooms account?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>Creating an account is easy:</p>
                                                            <ol className="list-decimal pl-5 mt-2 space-y-2">
                                                                <li>Click the "Sign Up" button on the WakeRooms homepage.</li>
                                                                <li>Enter your Wake Forest email address (@wfu.edu).</li>
                                                                <li>Create a secure password.</li>
                                                                <li>Check your email for a verification link and click to confirm your account.</li>
                                                                <li>Complete your profile questionnaire to help with roommate matching.</li>
                                                            </ol>
                                                            <p className="mt-2">Remember, only current Wake Forest students can create an account.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">What information do I need for my profile?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>Your profile helps potential roommates get to know you. We recommend including:</p>
                                                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                                                <li>Your year/class</li>
                                                                <li>Sleep schedule preferences</li>
                                                                <li>Study habits</li>
                                                                <li>Social preferences</li>
                                                                <li>Cleanliness expectations</li>
                                                                <li>Interests and hobbies</li>
                                                                <li>Brief bio to introduce yourself</li>
                                                            </ul>
                                                            <p className="mt-2">The more details you provide, the better your roommate matches will be!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">What's the timeline for using WakeRooms?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>WakeRooms follows the Wake Forest housing selection timeline:</p>
                                                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                                                <li><strong>Early Spring Semester:</strong> Create your account and start browsing potential roommates</li>
                                                                <li><strong>2-3 Months Before Housing Selection:</strong> Begin active roommate search and send/receive requests</li>
                                                                <li><strong>1 Month Before Selection:</strong> Finalize roommate arrangements</li>
                                                                <li><strong>Housing Selection Period:</strong> Use WakeRooms to view and select available rooms during your assigned window</li>
                                                            </ul>
                                                            <p className="mt-2">Specific dates vary each year, but we'll send email reminders about important deadlines.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeCategory === 'account' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Account Management</h2>

                                        <div className="space-y-10">
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">How do I reset my password?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>To reset your password:</p>
                                                            <ol className="list-decimal pl-5 mt-2 space-y-2">
                                                                <li>Click "Log In" on the homepage</li>
                                                                <li>Select "Forgot password?" below the login form</li>
                                                                <li>Enter your Wake Forest email address</li>
                                                                <li>Check your email for a password reset link</li>
                                                                <li>Create a new password following our security requirements</li>
                                                            </ol>
                                                            <p className="mt-2">If you don't receive a reset email within 10 minutes, check your spam folder or contact support.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">How do I update my profile information?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>You can update your profile at any time:</p>
                                                            <ol className="list-decimal pl-5 mt-2 space-y-2">
                                                                <li>Log in to your WakeRooms account</li>
                                                                <li>Click on Roommate Finder</li>
                                                                <li>Select "Edit Preferneces"</li>
                                                                <li>Make your desired changes to any section</li>
                                                                <li>Click "Save Changes" when finished</li>
                                                            </ol>
                                                            <p className="mt-2">Note that updating certain preferences may affect your compatibility scores with potential roommates.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeCategory === 'roommate' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Roommate Matching</h2>

                                        <div className="space-y-10">
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">How does the roommate matching process work?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>Our matching algorithm analyzes multiple compatibility factors:</p>
                                                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                                                <li><strong>Sleep schedule:</strong> Early bird vs. night owl preferences</li>
                                                                <li><strong>Study habits:</strong> Where, when, and how you prefer to study</li>
                                                                <li><strong>Social tendencies:</strong> Introvert vs. extrovert, hosting guests</li>
                                                                <li><strong>Cleanliness:</strong> Organization and tidiness expectations</li>
                                                                <li><strong>Interests:</strong> Shared hobbies and activities</li>
                                                            </ul>
                                                            <p className="mt-2">Each factor is weighted to calculate an overall compatibility score. You'll see potential matches ranked from highest to lowest compatibility percentage.</p>
                                                            <p className="mt-2">You can then browse profiles, send connection requests, and chat with potential roommates to find your best match.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">How do I send a roommate request?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>To send a roommate request:</p>
                                                            <ol className="list-decimal pl-5 mt-2 space-y-2">
                                                                <li>Browse your matches or search for specific students</li>
                                                                <li>Click on a profile to view full details</li>
                                                                <li>If you think they'd make a good roommate, click the "Send Request" button</li>
                                                                <li>Click "Send" to submit your request</li>
                                                            </ol>
                                                            <p className="mt-2">The student will receive a notification of your request and can either accept or decline. If accepted, you'll be able to start chatting directly.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">How do I confirm a roommate?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>Once you've found someone you want to room with:</p>
                                                            <ol className="list-decimal pl-5 mt-2 space-y-2">
                                                                <li>Go to your connections page</li>
                                                                <li>Find the student you want to room with</li>
                                                                <li>Click the "Confirm as Roommate" button</li>
                                                                <li>They'll receive a confirmation request</li>
                                                                <li>Once they accept, you'll be officially matched as roommates</li>
                                                            </ol>
                                                            <p className="mt-2">After confirmation, you'll be linked for room selection, allowing you to coordinate and select a room together during your assigned selection window.</p>
                                                            <p className="mt-2">You can have multiple confirmed roommates if you're planning to live in a suite or apartment-style dorm.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeCategory === 'room' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Room Selection</h2>

                                        <div className="space-y-10">
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">How do selection windows work?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>Selection windows follow Wake Forest University's official housing process:</p>
                                                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                                                <li>Selection windows are assigned based on class year and accumulated housing points</li>
                                                                <li>Seniors select first, followed by juniors, sophomores, and then incoming freshmen</li>
                                                                <li>Each student is assigned a specific date and time when they can make their selection</li>
                                                                <li>The student with the earliest selection window in your roommate group will be able to select for the entire group</li>
                                                            </ul>
                                                            <p className="mt-2">You'll receive an email notification with your specific selection window time. During your window, you'll log in to WakeRooms to view and select from available rooms.</p>
                                                            <p className="mt-2">Selection windows typically last 30 minutes, so be sure to log in on time!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">How can I view available dorms and rooms?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>WakeRooms provides comprehensive information about available housing options:</p>
                                                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                                                <li><strong>Before your selection window:</strong> You can browse all dorms and room types to research options</li>
           
                                                                <li>Filter options by building type, location, and room configuration</li>
                                                                <li>Write down your preferred rooms prior to selection</li>
                                                            </ul>
                                                            <p className="mt-2"><strong>During your selection window:</strong> You'll see real-time availability of rooms. Available rooms will be highlighted in green, while already selected rooms will be shown in red.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">How do I select a room?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>During your selection window:</p>
                                                            <ol className="list-decimal pl-5 mt-2 space-y-2">
                                                                <li>Log in to WakeRooms</li>
                                                                <li>Navigate to the "Room Selection" tab</li>
                                                                <li>Browse available dorms and rooms (only available rooms will be selectable)</li>
                                                                <li>Click on your desired room to view details</li>
                                                                <li>Click "Select Room" to reserve it</li>
                                                                <li>Confirm your selection</li>
                                                            </ol>
                                                            <p className="mt-2">If you have confirmed roommates, you'll select a room for your entire group. Make sure to coordinate with your roommates beforehand about preferences.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeCategory === 'technical' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Technical Support</h2>

                                        <div className="space-y-10">
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">What browsers are supported?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>WakeRooms works best with modern browsers. We officially support:</p>
                                                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                                                <li>Google Chrome (recommended, latest version)</li>
                                                                <li>Mozilla Firefox (latest version)</li>
                                                                <li>Safari (latest version)</li>
                                                                <li>Microsoft Edge (Chromium-based, latest version)</li>
                                                            </ul>
                                                            <p className="mt-2">For the best experience, we recommend using Google Chrome and keeping your browser updated to the latest version.</p>
                                                            <p className="mt-2">Internet Explorer is not supported. If you're experiencing issues, try updating your browser or switching to Chrome.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">Can I use WakeRooms on my phone?</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>Yes! WakeRooms is fully mobile-responsive and works on smartphones and tablets.</p>
                                                            <p className="mt-2">You can access all features through your mobile browser, including:</p>
                                                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                                                <li>Browsing potential roommates</li>
                                                                <li>Messaging connections</li>
                                                                <li>Viewing dorm information</li>
                                                                <li>Selecting your room</li>
                                                            </ul>
                                                            <p className="mt-2">For the room selection process, we recommend using a laptop or desktop computer for the best experience, especially when viewing floor plans.</p>
                                                            <p className="mt-2">We don't currently have a dedicated mobile app, but our mobile web experience is optimized for all screen sizes.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">Common troubleshooting tips</h3>
                                                        <div className="mt-3 text-gray-600">
                                                            <p>If you encounter issues with WakeRooms, try these solutions:</p>
                                                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                                                <li><strong>Page not loading or errors:</strong> Refresh the page, clear browser cache, or try a different browser</li>
                                                                <li><strong>Login problems:</strong> Use the password reset function or ensure you're using your @wfu.edu email</li>
                                                                <li><strong>Messages not sending:</strong> Check your internet connection and refresh the page</li>
                                                                <li><strong>Profile changes not saving:</strong> Make sure you click the "Save" button and stay on the page until confirmation appears</li>
                                                                <li><strong>Room selection issues:</strong> Ensure you're in your assigned selection window and try using a different device or browser</li>
                                                                <li><strong>Images not loading:</strong> Check your internet connection or disable any ad-blockers temporarily</li>
                                                            </ul>
                                                            <p className="mt-2">If you continue to experience technical issues, please:</p>
                                                            <ol className="list-decimal pl-5 mt-2 space-y-2">
                                                                <li>Take a screenshot of any error messages</li>
                                                                <li>Note what you were trying to do when the issue occurred</li>
                                                                <li>Contact our support team through the Contact page with these details</li>
                                                            </ol>
                                                            <p className="mt-2">Our technical team typically responds within 24 hours on weekdays.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div >

            </main >

            {/* Footer */}
            < footer className="bg-gray-800 mt-12" >
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <span className="text-2xl font-bold text-white">WakeRooms</span>
                            <p className="mt-2 text-sm text-gray-300">
                                Making roommate matching and dorm selection easier for Wake Forest students since 2023.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Quick Links</h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <Link href="/#features" className="text-base text-gray-300 hover:text-white">Features</Link>
                                </li>
                                <li>
                                    <Link href="/#how-it-works" className="text-base text-gray-300 hover:text-white">How It Works</Link>
                                </li>
                                <li>
                                    <Link href="/#testimonials" className="text-base text-gray-300 hover:text-white">Testimonials</Link>
                                </li>
                                <li>
                                    <Link href="/#faq" className="text-base text-gray-300 hover:text-white">FAQ</Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <Link href="/help-center" className="text-base text-gray-300 hover:text-white">Help Center</Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-base text-gray-300 hover:text-white">Contact Us</Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="text-base text-gray-300 hover:text-white">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link href="/terms-of-service" className="text-base text-gray-300 hover:text-white">Terms of Service</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
                        <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
                            &copy; {new Date().getFullYear()} WakeRooms. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer >
        </div >
    );
}