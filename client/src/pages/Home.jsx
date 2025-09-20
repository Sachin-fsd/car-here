import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Home = () => {
  const navigate = useNavigate();

  const handlePricingClick = async (e) => {
    e.preventDefault();
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      navigate('/pricing');
    } else {
      alert('Please login first to view pricing.');
      navigate('/user-auth');
    }
  };

  return (
  <>
  <div className="min-h-screen w-full flex flex-col bg-slate-950 relative overflow-hidden text-base">
      {/* Header */}
  <header className="w-full flex items-center justify-between px-12 py-6 bg-slate-900/95 backdrop-blur-sm shadow-xl z-20 relative border-b border-slate-800">
        <nav className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="font-bold text-3xl text-white tracking-tight">CarHere</span>
          </div>
          <div className="hidden md:flex items-center gap-6 ml-8">
            <a href="#features" className="text-slate-300 font-medium hover:text-cyan-400 transition-colors">Features</a>
            <a href="#support" className="text-slate-300 font-medium hover:text-cyan-400 transition-colors">Support</a>
            <a href="/pricing" className="text-slate-300 font-medium hover:text-cyan-400 transition-colors" onClick={handlePricingClick}>Pricing</a>
            <a href="#contact" className="text-slate-300 font-medium hover:text-cyan-400 transition-colors">Contact</a>
            <a href="#blog" className="text-slate-300 font-medium hover:text-cyan-400 transition-colors">Blog</a>
          </div>
        </nav>
        <div className="flex gap-4 items-center">
          <a href="/user-auth" className="px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">User Login</a>
          <a href="/driver-auth" className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg">Driver Login</a>
        </div>
      </header>

    {/* Hero Section */}
  <section className="w-full flex flex-col items-center justify-center px-4 py-20 relative min-h-[80vh] bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(34,211,238,0.15)_0%,_transparent_50%)] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(59,130,246,0.15)_0%,_transparent_50%)] pointer-events-none"></div>
        </div>
        <div className="max-w-6xl mx-auto text-center z-10 relative">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-slate-800/50 backdrop-blur-sm text-cyan-400 text-sm font-medium rounded-full border border-slate-700/50">🚀 Next-Gen Ride Hailing Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Smart Rides,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> Seamless</span>
            <br />Journey
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-normal mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience the future of urban mobility with CarHere. Connect with trusted drivers, track rides in real-time, and enjoy secure, efficient transportation across your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href='/user-auth' className="group">
              <button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 group-hover:from-cyan-500 group-hover:to-blue-600">
                🚗 Book Your Ride
              </button>
            </a>
            <a href='/driver-auth' className="group">
              <button className="bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg border-2 border-slate-700 hover:border-cyan-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600">
                👨‍💼 Join as Driver
              </button>
            </a>
          </div>
        </div>
        
        {/* Floating cards for visual appeal */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl rotate-12 animate-pulse"></div>
        </div>
        <div className="absolute bottom-32 right-10 opacity-20">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl -rotate-12 animate-pulse delay-300"></div>
        </div>
      </section>
      
    {/* Features Section */}
  <section id="features" className="w-full py-24 bg-slate-900 flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose CarHere?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Experience the difference with our cutting-edge features designed for modern transportation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-slate-400 leading-relaxed">Book your ride in under 30 seconds with our streamlined booking process and instant driver matching.</p>
            </div>
            <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ultra Secure</h3>
              <p className="text-slate-400 leading-relaxed">Military-grade encryption for payments, verified drivers, and 24/7 safety monitoring for your peace of mind.</p>
            </div>
            <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Tracking</h3>
              <p className="text-slate-400 leading-relaxed">GPS-powered live tracking, ETA updates, and route optimization for the most efficient journey possible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
  <section id="support" className="w-full py-24 bg-slate-950 flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-slate-800/50 backdrop-blur-sm text-cyan-400 text-sm font-medium rounded-full border border-slate-700/50">🎧 24/7 Support</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Always Here
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> For You</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Our intelligent support system ensures you're never alone on your journey. From real-time assistance to proactive care, we've got you covered.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">💬</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Instant Live Chat</h4>
                    <p className="text-slate-400 text-sm">Get immediate help through our AI-powered chat system available 24/7</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🚨</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Emergency Response</h4>
                    <p className="text-slate-400 text-sm">One-tap emergency alerts with automatic location sharing to authorities</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Smart Notifications</h4>
                    <p className="text-slate-400 text-sm">Proactive updates on ride status, delays, and important information</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Support Statistics</h3>
                <p className="text-slate-400">Real-time support performance metrics</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">< 30s</div>
                  <div className="text-sm text-slate-400">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">99.9%</div>
                  <div className="text-sm text-slate-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">4.9★</div>
                  <div className="text-sm text-slate-400">Support Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
                  <div className="text-sm text-slate-400">Availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
  <section id="contact" className="w-full py-24 bg-slate-900 flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Have questions? Need support? We're here to help you 24/7</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
              <p className="text-slate-400 mb-4">Send us a message anytime</p>
              <a href="mailto:usesuber3@gmail.com" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">usesuber3@gmail.com</a>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Phone Support</h3>
              <p className="text-slate-400 mb-4">Call us for immediate help</p>
              <a href="tel:+917795001796" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">+91 77950 01796</a>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 text-center group md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
              <p className="text-slate-400 mb-4">Chat with our AI assistant</p>
              <button className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Start Chat</button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
  <section id="blog" className="w-full py-24 bg-slate-950 flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Latest Updates</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Stay informed with the latest news, updates, and insights from the CarHere team</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-cyan-400 to-blue-500 p-6 flex items-center justify-center">
                <span className="text-4xl">🚀</span>
              </div>
              <div className="p-6">
                <div className="text-sm text-cyan-400 font-medium mb-2">Technology</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">AI-Powered Route Optimization</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Discover how our new AI algorithms reduce travel time by 25% and improve driver efficiency...</p>
              </div>
            </article>
            <article className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 p-6 flex items-center justify-center">
                <span className="text-4xl">🌱</span>
              </div>
              <div className="p-6">
                <div className="text-sm text-green-400 font-medium mb-2">Sustainability</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Going Green with Electric Vehicles</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Our commitment to sustainability: 50% of our fleet will be electric by 2025...</p>
              </div>
            </article>
            <article className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 p-6 flex items-center justify-center">
                <span className="text-4xl">🛡️</span>
              </div>
              <div className="p-6">
                <div className="text-sm text-purple-400 font-medium mb-2">Safety</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Enhanced Safety Features</h3>
                <p className="text-slate-400 text-sm leading-relaxed">New safety protocols and real-time monitoring ensure your journey is always secure...</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <span className="font-bold text-2xl text-white tracking-tight">CarHere</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                Revolutionizing urban mobility with intelligent ride-hailing solutions. Your journey, reimagined.
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all">
                  <span>📘</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-500 transition-all">
                  <span>🐦</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 transition-all">
                  <span>📷</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-700 transition-all">
                  <span>💼</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <div className="space-y-3">
                <a href="#" className="block text-slate-400 hover:text-cyan-400 transition-colors">About Us</a>
                <a href="#" className="block text-slate-400 hover:text-cyan-400 transition-colors">Careers</a>
                <a href="#" className="block text-slate-400 hover:text-cyan-400 transition-colors">Press</a>
                <a href="#blog" className="block text-slate-400 hover:text-cyan-400 transition-colors">Blog</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <div className="space-y-3">
                <a href="/user-auth" className="block text-slate-400 hover:text-cyan-400 transition-colors">Get Started</a>
                <a href="#support" className="block text-slate-400 hover:text-cyan-400 transition-colors">Help Center</a>
                <a href="#contact" className="block text-slate-400 hover:text-cyan-400 transition-colors">Contact</a>
                <a href="#features" className="block text-slate-400 hover:text-cyan-400 transition-colors">Features</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-400 text-sm">
                © 2025 CarHere. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms of Service</a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Home;
