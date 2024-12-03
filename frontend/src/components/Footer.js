import React from 'react';
import {
    FaFacebookF,
    FaTwitter,
    FaTelegramPlane,
    FaInstagram,
    FaGithub,
    FaYoutube,
    FaMapMarkerAlt, 
    FaEnvelope, 
    FaPhoneAlt 
} from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="py-10 px-5 text-white text-center bg-gradient-to-b from-purple-500 to-blue-500">
            <div className="flex flex-col md:flex-row justify-between items-start max-w-screen-x2 mx-auto px-4">

                {/* Left Section */}
                <div className="flex flex-col md:flex-row w-full md:w-3/3 space-y-6 md:space-y-0 md:space-x-6">
                    
                    {/* Social Media Icons */}
                    <div className="flex flex-col items-center md:items-start space-y-7">
                        <br></br>
                        <br></br>
                        <FaFacebookF className="text-2xl cursor-pointer hover:text-blue-400" />
                        <FaGithub className="text-2xl cursor-pointer hover:text-gray-400" />
                        <FaTelegramPlane className="text-2xl cursor-pointer hover:text-blue-400" />
                        <FaInstagram className="text-2xl cursor-pointer hover:text-pink-400" />
                        <FaYoutube className="text-2xl cursor-pointer hover:text-red-400" />
                        <FaTwitter className="text-2xl cursor-pointer hover:text-blue-300" />
                    </div>

                    {/* Background Shape */}
                    <img
                        src={`${process.env.PUBLIC_URL}/Splines.png`}
                        alt="Decorative Shape"
                        className="w-96 h-96 md:w-[50%] md:h-[50%] max-w-full max-h-full opacity-90"
                    />
                    
                    {/* Info Section */}
                    <div className="text-left max-w-lg md:order-last mt-8 md:mt-0">
                        <h2 className="text-2xl font-bold mb-4">Professional Web Design</h2>
                        <p className="mb-4 text-lg">
                            High level experience in web design and 
                            development knowledge, producing quality work.
                        </p>

                        <div className="text-md space-y-2">
                            <div className="flex items-left">
                                <FaMapMarkerAlt className="mr-2 text-lg" />
                                <p>Wisconsin Ave, Suite 700, Chevy Chase, Maryland 20815</p>
                            </div>

                            <div className="flex items-center">
                                <FaEnvelope className="mr-2 text-lg" />
                                <a href="mailto:support@figma.com" className="text-white underline">support@figma.com</a>
                            </div>

                            <div className="flex items-center">
                                <FaPhoneAlt className="mr-2 text-lg" />
                                <p>+1 800 854-36-80</p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Right Section (Contact Form) */}
                <div className="bg-indigo-200 bg-opacity-03 p-6 rounded-lg shadow-lg w-full md:w-1/3 text-left mt-8 md:mt-0">
                    <h3 className="text-lg font-bold text-violet-600 mb-4">Contact us</h3>
                    <form className="space-y-3">
                        <input
                            type="text"
                            placeholder="First Name"
                            required
                            className="w-full p-3 bg-white text-gray-800 rounded-md focus:outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="w-full p-3 bg-white text-gray-800 rounded-md focus:outline-none"
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            required
                            className="w-full p-3 bg-white text-gray-800 rounded-md focus:outline-none"
                        />
                        <textarea
                            placeholder="Message"
                            required
                            className="w-full p-3 bg-white text-gray-800 rounded-md h-24 resize-none focus:outline-none"
                        ></textarea>
                        <button
                            type="submit"
                            className="w-full py-3 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-100 transition"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 