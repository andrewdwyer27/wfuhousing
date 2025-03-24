// pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>WakeRooms | Find Your Perfect Match at Wake Forest</title>
                <meta name="description" content="Find compatible roommates and select your ideal dorm room at Wake Forest University with WakeRooms." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Navigation */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-bold text-yellow-600">WakeRooms</span>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <a href="#features" className="border-transparent text-gray-500 hover:border-yellow-600 hover:text-yellow-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Features
                                </a>
                                <a href="#how-it-works" className="border-transparent text-gray-500 hover:border-yellow-600 hover:text-yellow-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    How It Works
                                </a>
                                <a href="#testimonials" className="border-transparent text-gray-500 hover:border-yellow-600 hover:text-yellow-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Testimonials
                                </a>
                                <a href="#faq" className="border-transparent text-gray-500 hover:border-yellow-600 hover:text-yellow-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    FAQ
                                </a>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <Link href="/login" className="px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md text-yellow-600 bg-white hover:bg-gray-50 border-yellow-600">
                                Log in
                            </Link>
                            <Link href="/signup" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700">
                                Sign up
                            </Link>
                        </div>
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu, show/hide based on menu state */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="pt-2 pb-3 space-y-1">
                        <a href="#features" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-600 hover:text-yellow-700">
                            Features
                        </a>
                        <a href="#how-it-works" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-600 hover:text-yellow-700">
                            How It Works
                        </a>
                        <a href="#testimonials" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-600 hover:text-yellow-700">
                            Testimonials
                        </a>
                        <a href="#faq" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-600 hover:text-yellow-700">
                            FAQ
                        </a>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <Link href="/login" className="block text-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-600 bg-white hover:bg-gray-50 border-yellow-600">
                                Log in
                            </Link>
                        </div>
                        <div className="mt-3 px-4">
                            <Link href="/signup" className="block text-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-black to-yellow-900">
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                        <div className="h-full w-full object-cover" style={{
                            backgroundImage: "url('/api/placeholder/1920/1080')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Find Your Perfect Roommate at Wake Forest</h1>
                        <p className="mt-6 text-xl text-gray-100 max-w-3xl">
                            WakeRooms helps you connect with compatible roommates and select your ideal dorm room, making your Wake Forest experience better from day one.
                        </p>
                        <div className="mt-10 max-w-sm sm:flex sm:max-w-none">
                            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                                <Link href="/signup" className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-yellow-500 hover:bg-yellow-600">
                                    Get Started
                                </Link>
                                <Link href="#how-it-works" className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black bg-opacity-60 hover:bg-opacity-70">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-yellow-600">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                The #1 Room Selection Platform at Wake Forest
                            </h2>
                            <p className="mt-3 text-xl text-yellow-100 sm:mt-4">
                                Join thousands of Wake Forest students who have already found their perfect roommate match.
                            </p>
                        </div>
                        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
                            <div className="flex flex-col">
                                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-yellow-100">
                                    Matched Roommates
                                </dt>
                                <dd className="order-1 text-5xl font-extrabold text-white">
                                    3,000+
                                </dd>
                            </div>
                            <div className="flex flex-col mt-10 sm:mt-0">
                                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-yellow-100">
                                    Dorm Rooms
                                </dt>
                                <dd className="order-1 text-5xl font-extrabold text-white">
                                    1,500+
                                </dd>
                            </div>
                            <div className="flex flex-col mt-10 sm:mt-0">
                                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-yellow-100">
                                    Satisfaction Rate
                                </dt>
                                <dd className="order-1 text-5xl font-extrabold text-white">
                                    96%
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>


                {/* How It Works */}
                <div id="how-it-works" className="bg-gray-50 py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">How It Works</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Three Simple Steps to Your Ideal Housing
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                                WakeRooms makes finding a roommate and selecting your dorm room easy and stress-free.
                            </p>
                        </div>

                        <div className="mt-16">
                            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-yellow-500 text-white">
                                        <span className="text-lg font-bold">1</span>
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Create Your Profile</p>
                                    <div className="mt-2 ml-16 text-base text-gray-500">
                                        <p>Sign up with your Wake Forest email and complete your roommate preference questionnaire.</p>
                                        <p className="mt-2">Share your lifestyle, study habits, and what you're looking for in a roommate.</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-yellow-500 text-white">
                                        <span className="text-lg font-bold">2</span>
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Connect with Roommates</p>
                                    <div className="mt-2 ml-16 text-base text-gray-500">
                                        <p>Browse potential matches based on compatibility scores and send roommate requests.</p>
                                        <p className="mt-2">Chat with matches to get to know them better before making your decision.</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-yellow-500 text-white">
                                        <span className="text-lg font-bold">3</span>
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Select Your Room</p>
                                    <div className="mt-2 ml-16 text-base text-gray-500">
                                        <p>During your housing selection window, browse available dorms and rooms together.</p>
                                        <p className="mt-2">Make your selection and confirm your housing arrangement for the upcoming year.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div id="testimonials" className="bg-white py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Testimonials</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Hear from Fellow Demon Deacons
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                                Students just like you who found their perfect housing match through WakeRooms.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 lg:grid-cols-3">
                            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold">Sarah T.</h4>
                                        <p className="text-gray-600">Class of 2024</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    "WakeRooms matched me with someone who has become my best friend. We have similar study habits but different interests, which makes for the perfect balance."
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold">Marcus J.</h4>
                                        <p className="text-gray-600">Class of 2025</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    "The dorm selection process was so easy! Being able to view the floor plans and coordinate with my roommate in real-time made a typically stressful process simple."
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold">Emma L.</h4>
                                        <p className="text-gray-600">Class of 2026</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    "As an international student, I was worried about finding a compatible roommate. WakeRooms made it easy to find someone who respects my culture and shares my academic focus."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div id="faq" className="bg-gray-50 py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">FAQ</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Frequently Asked Questions
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                                Get answers to common questions about using WakeRooms.
                            </p>
                        </div>

                        <div className="mt-12 space-y-6 max-w-3xl mx-auto">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900">Who can use WakeRooms?</h3>
                                <p className="mt-2 text-base text-gray-500">
                                    WakeRooms is exclusively for Wake Forest University students with a valid Wake Forest email address.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900">When should I start looking for a roommate?</h3>
                                <p className="mt-2 text-base text-gray-500">
                                    We recommend starting your search at least 2-3 months before housing selection begins to give yourself plenty of time.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900">How does the matching algorithm work?</h3>
                                <p className="mt-2 text-base text-gray-500">
                                    Our algorithm analyzes 5 different compatibility factors including study habits, sleep schedules, cleanliness preferences, social tendencies, and shared interests to find your most compatible roommate matches.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900">Is roommate matching required for room selection?</h3>
                                <p className="mt-2 text-base text-gray-500">
                                    No, you can use WakeRooms just for dorm selection if you already have a roommate. However, connecting on the platform makes coordinating your room selection easier.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900">How does room selection work?</h3>
                                <p className="mt-2 text-base text-gray-500">
                                    Room selection follows Wake Forest's standard timeline and priority system. WakeRooms provides an easier interface to view and select rooms during your assigned selection window, with real-time updates of availability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-yellow-600">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            <span className="block">Ready to find your perfect match?</span>
                            <span className="block text-black">Sign up for WakeRooms today.</span>
                        </h2>
                        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div className="inline-flex rounded-md shadow">
                                <Link href="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-yellow-600 bg-white hover:bg-gray-50">
                                    Get Started
                                </Link>
                            </div>
                            <div className="ml-3 inline-flex rounded-md shadow">
                                <Link href="/login" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black bg-opacity-60 hover:bg-opacity-70">
                                    Log In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <span className="text-2xl font-bold text-white">WakeRooms</span>
                            <p className="mt-2 text-sm text-gray-300">
                                Making roommate matching and dorm selection easier for Wake Forest students since 2023.
                            </p>
                            <div className="mt-4 flex space-x-6">
                                <a href="#" className="text-gray-400 hover:text-gray-300">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-300">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Quick Links</h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <a href="#features" className="text-base text-gray-300 hover:text-white">Features</a>
                                </li>
                                <li>
                                    <a href="#how-it-works" className="text-base text-gray-300 hover:text-white">How It Works</a>
                                </li>
                                <li>
                                    <a href="#testimonials" className="text-base text-gray-300 hover:text-white">Testimonials</a>
                                </li>
                                <li>
                                    <a href="#faq" className="text-base text-gray-300 hover:text-white">FAQ</a>
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
            </footer>
        </div>
    );
}