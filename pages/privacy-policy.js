import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Privacy Policy | WakeRooms</title>
                <meta name="description" content="Privacy Policy for WakeRooms - Learn how we collect, use, and protect your personal information." />
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
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Privacy Policy</h1>
                    <p className="mt-4 text-lg text-gray-500">Last Updated: March 15, 2025</p>
                </div>

                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-8">
                        <div className="prose prose-yellow max-w-none">
                            <p className="text-gray-600">
                                At WakeRooms, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                            </p>

                            <div className="mt-8 space-y-10">
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Information We Collect</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>We collect several types of information from and about users of our platform:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li><strong>Personal Information:</strong> Name, email address, Wake Forest University ID, and profile information you provide.</li>
                                                    <li><strong>Profile Data:</strong> Lifestyle preferences, housing preferences, and other information you share to facilitate roommate matching.</li>
                                                    <li><strong>Communications:</strong> Messages exchanged with other users and our support team.</li>
                                                    <li><strong>Usage Data:</strong> Information about how you interact with our platform, including login times, features used, and pages visited.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">How We Use Your Information</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>We use the information we collect to:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>Provide and maintain our roommate matching and housing selection services</li>
                                                    <li>Facilitate connections between potential roommates based on compatibility</li>
                                                    <li>Process room selections during designated windows</li>
                                                    <li>Communicate with you about your account, updates, and support</li>
                                                    <li>Improve and optimize our platform</li>
                                                    <li>Ensure the security of our services and prevent fraud</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Information Sharing</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>We share your information in the following ways:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li><strong>With Other Users:</strong> Profile information is shared with potential roommates based on matching criteria.</li>
                                                    <li><strong>Wake Forest Housing Department:</strong> Room selection information is shared with the University to facilitate housing assignments.</li>
                                                    <li><strong>Service Providers:</strong> We may share data with third-party vendors who help us operate our platform.</li>
                                                    <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect rights and safety.</li>
                                                </ul>
                                                <p className="mt-2">We do not sell your personal information to third parties.</p>
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
                                            <h3 className="text-lg font-medium text-gray-900">Your Privacy Rights</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>You have several rights regarding your personal information:</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li><strong>Access and Update:</strong> You can access and update your profile information through your account settings.</li>
                                                    <li><strong>Delete:</strong> You can request deletion of your account and associated data.</li>
                                                    <li><strong>Restrict Sharing:</strong> You can adjust your privacy settings to limit what information is visible to other users.</li>
                                                    <li><strong>Data Portability:</strong> You can request a copy of your data in a structured format.</li>
                                                </ul>
                                                <p className="mt-2">To exercise these rights, please contact us at housing@wfu.edu.</p>
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
                                            <h3 className="text-lg font-medium text-gray-900">Contact Us</h3>
                                            <div className="mt-2 text-gray-600">
                                                <p>If you have questions about this Privacy Policy or our privacy practices, please contact us at:</p>
                                                <div className="mt-2">
                                                    <p className="font-medium">Email: housing@wfu.edu</p>
                                                    <p className="font-medium">Address: Benson University Center, Room 218, Wake Forest University, Winston-Salem, NC 27109</p>
                                                    <p className="font-medium">Phone: (336) 758-0000</p>
                                                </div>
                                                <p className="mt-2">We will respond to your inquiry as soon as possible, typically within 5 business days.</p>
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
                                            This Privacy Policy may be updated periodically. We will notify you of any material changes through the platform or via email.
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