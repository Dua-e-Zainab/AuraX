import React, { useState } from 'react';
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
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reset form
        setFormData({
            firstName: '',
            email: '',
            phone: '',
            message: ''
        });
        setIsSubmitting(false);
    };

    const socialIcons = [
        { Icon: FaFacebookF, hoverColor: 'hover:text-blue-400' },
        { Icon: FaGithub, hoverColor: 'hover:text-gray-400' },
        { Icon: FaTelegramPlane, hoverColor: 'hover:text-blue-400' },
        { Icon: FaInstagram, hoverColor: 'hover:text-pink-400' },
        { Icon: FaYoutube, hoverColor: 'hover:text-red-400' },
        { Icon: FaTwitter, hoverColor: 'hover:text-blue-300' }
    ];

    return (
        <>
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
                    50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.2); }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-pulse-glow {
                    animation: pulse-glow 3s ease-in-out infinite;
                }
            `}</style>
            
            <footer className="py-10 px-5 text-white text-center bg-gradient-to-b from-purple-500 to-blue-500">
                <div className="flex flex-col md:flex-row justify-between items-start max-w-screen-xl mx-auto px-4">

                    {/* Left Section */}
                    <div className="flex flex-col md:flex-row w-full md:w-2/3 space-y-6 md:space-y-0 md:space-x-6">
                        
                        {/* Social Media Icons */}
                        <div className="flex flex-col items-center md:items-start space-y-4 animate-fadeInUp">
                            <div className="h-8"></div>
                            <div className="h-8"></div>
                            {socialIcons.map(({ Icon, hoverColor }, index) => (
                                <div
                                    key={index}
                                    className="animate-fadeInUp"
                                    style={{animationDelay: `${index * 100 + 200}ms`}}
                                >
                                    <Icon className={`text-2xl cursor-pointer transition-all duration-300 hover:scale-110 ${hoverColor} hover:drop-shadow-lg transform hover:-translate-y-1`} />
                                </div>
                            ))}
                        </div>

                        {/* Background Shape */}
                        <div className="animate-fadeInUp animate-float" style={{animationDelay: '400ms'}}>
                            <img
                                src={`${process.env.PUBLIC_URL}/Splines.png`}
                                alt="Decorative Shape"
                                className="w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 max-w-full max-h-full opacity-90 transition-all duration-500 hover:opacity-100 hover:scale-105"
                            />
                        </div>
                        
                        {/* Info Section */}
                        <div className="text-center md:text-left max-w-lg md:order-last mt-8 md:mt-0 animate-fadeInUp" style={{animationDelay: '600ms'}}>
                            <h2 className="text-2xl font-bold mb-4 transition-all duration-300 hover:text-blue-200">
                                Professional Web Design
                            </h2>
                            <p className="mb-4 text-lg leading-relaxed">
                                High level experience in web design and 
                                development knowledge, producing quality work.
                            </p>

                            <div className="text-md space-y-3">
                                <div className="flex items-center justify-center md:justify-start group transition-all duration-300">
                                    <FaMapMarkerAlt className="mr-3 text-lg group-hover:text-blue-300 transition-colors duration-300" />
                                    <p className="group-hover:text-blue-100 transition-colors duration-300">
                                        Wisconsin Ave, Suite 700, Chevy Chase, Maryland 20815
                                    </p>
                                </div>

                                <div className="flex items-center justify-center md:justify-start group transition-all duration-300">
                                    <FaEnvelope className="mr-3 text-lg group-hover:text-blue-300 transition-colors duration-300" />
                                    <a 
                                        href="mailto:support@figma.com" 
                                        className="text-white underline hover:text-blue-200 transition-all duration-300 hover:underline-offset-4"
                                    >
                                        support@figma.com
                                    </a>
                                </div>

                                <div className="flex items-center justify-center md:justify-start group transition-all duration-300">
                                    <FaPhoneAlt className="mr-3 text-lg group-hover:text-blue-300 transition-colors duration-300" />
                                    <p className="group-hover:text-blue-100 transition-colors duration-300">
                                        +1 800 854-36-80
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section (Contact Form) */}
                    <div className="bg-indigo-200 bg-opacity-10 p-6 rounded-lg shadow-lg w-full md:w-1/3 text-left mt-8 md:mt-0 animate-fadeInUp animate-pulse-glow transition-all duration-500 hover:bg-opacity-15" style={{animationDelay: '800ms'}}>
                        <h3 className="text-lg font-bold text-violet-300 mb-4 transition-colors duration-300 hover:text-violet-200">
                            Contact us
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="First Name"
                                className="w-full p-3 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 transform focus:scale-105"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className="w-full p-3 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 transform focus:scale-105"
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone"
                                className="w-full p-3 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 transform focus:scale-105"
                            />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Message"
                                className="w-full p-3 bg-white text-gray-800 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 transform focus:scale-105"
                            ></textarea>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-3 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    'Send'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;