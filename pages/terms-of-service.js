import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Terms of Service | WakeRooms</title>
                <meta name="description" content="Terms of Service for WakeRooms - Please read these terms carefully before using our platform." />
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
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Terms of Service</h1>
                    <p className="mt-4 text-lg text-gray-500">Last Updated: March 15, 2025</p>
                </div>

                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-8">
                        <div className="prose prose-yellow max-w-none">
                            <p className="text-gray-600">
                                Welcome to WakeRooms. Please read these Terms of Service carefully before using our platform. By accessing or using WakeRooms, you agree to be bound by these terms.
                            </p>

                            <div className="mt-8 space-y-10">
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">1. Acceptance of Terms</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>By creating an account on WakeRooms, you agree to the following terms:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>You are a current Wake Forest University student or affiliated faculty/staff.</li>
                                                    <li>You are at least 18 years of age or have parental consent to use our services.</li>
                                                    <li>You will provide accurate, current, and complete information during registration.</li>
                                                    <li>You will maintain and update your account information as needed.</li>
                                                    <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                                                </ul>
                                                <p className="mt-2">WakeRooms reserves the right to refuse service, terminate accounts, or remove content at our discretion.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">2. Platform Use and Conduct</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>When using WakeRooms, you agree not to:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>Use the platform for any illegal purpose or in violation of Wake Forest University policies.</li>
                                                    <li>Harass, bully, intimidate, or discriminate against other users.</li>
                                                    <li>Post false, misleading, or deceptive information in your profile.</li>
                                                    <li>Attempt to impersonate another user or create multiple accounts.</li>
                                                    <li>Use the platform to spam, solicit, or advertise unrelated services.</li>
                                                    <li>Attempt to access other users' accounts or the platform's underlying code.</li>
                                                    <li>Upload or transmit viruses or other malicious code.</li>
                                                </ul>
                                                <p className="mt-2">Violations may result in account termination and, if appropriate, reporting to university authorities.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">3. Content and Intellectual Property</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>Regarding content on WakeRooms:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>You retain ownership of content you submit, but grant WakeRooms a non-exclusive license to use, display, and distribute it on the platform.</li>
                                                    <li>You may only post content that you own or have the right to share.</li>
                                                    <li>WakeRooms and its licensors own all intellectual property rights in the platform itself.</li>
                                                    <li>You may not copy, modify, distribute, or create derivative works of the WakeRooms platform without explicit permission.</li>
                                                </ul>
                                                <p className="mt-2">WakeRooms may remove any content that violates these terms or our community guidelines.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">4. Room Selection and Roommate Matching</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>Regarding the core services of WakeRooms:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>WakeRooms provides a platform to facilitate roommate matching and room selection but cannot guarantee perfect matches or specific room availability.</li>
                                                    <li>Room selection is subject to Wake Forest University Housing policies, timelines, and availability.</li>
                                                    <li>By using the platform, you authorize WakeRooms to share necessary information with the Housing Department to facilitate room assignments.</li>
                                                    <li>You understand that confirming a roommate on the platform creates a mutual commitment that should not be broken without good cause.</li>
                                                    <li>WakeRooms is not responsible for interpersonal conflicts that may arise between matched roommates.</li>
                                                </ul>
                                                <p className="mt-2">We strive to provide accurate information about housing options but recommend verifying details with the University Housing Department.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">5. Limitation of Liability</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>To the maximum extent permitted by law:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>WakeRooms provides the platform "as is" and "as available" without warranties of any kind.</li>
                                                    <li>We do not guarantee that the platform will be uninterrupted, timely, secure, or error-free.</li>
                                                    <li>WakeRooms is not liable for any indirect, incidental, special, consequential, or punitive damages.</li>
                                                    <li>Our total liability for any claims arising from these terms or your use of WakeRooms will not exceed the amount you paid to use our services (if any) in the past six months.</li>
                                                </ul>
                                                <p className="mt-2">Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability, so some of the above limitations may not apply to you.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">6. Termination and Changes to Terms</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>Regarding the termination of your account and changes to these terms:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>You may terminate your account at any time by following the instructions in your account settings.</li>
                                                    <li>WakeRooms may terminate or suspend your account at any time for violations of these terms or for any other reason.</li>
                                                    <li>We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the updated terms on our website or via email.</li>
                                                    <li>Your continued use of WakeRooms after changes are posted constitutes acceptance of the modified terms.</li>
                                                </ul>
                                                <p className="mt-2">Upon termination, your right to use WakeRooms will immediately cease, but provisions that by their nature should survive termination will remain in effect.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">7. Contact Information</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>If you have questions about these Terms of Service, please contact us at:</p>
                                                <div className="mt-2">
                                                    <p className="font-medium">Email: housing@wfu.edu</p>
                                                    <p className="font-medium">Address: Benson University Center, Room 218, Wake Forest University, Winston-Salem, NC 27109</p>
                                                    <p className="font-medium">Phone: (336) 758-0000</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-yellow-50 rounded-md border border-yellow-100">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-800">
                                            By using WakeRooms, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 mt-12">
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
            </footer>
        </div>
    );
}