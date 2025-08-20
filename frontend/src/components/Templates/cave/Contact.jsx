import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, Globe } from 'lucide-react';
import { useCVData } from '../../../hooks/useCVData';
import { MiniModel } from './Hero';

// Floating 3D crystal component
function FloatingCrystal() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.3;
    }
  });
  
  return (
    <group ref={meshRef} scale={[3, 3, 3]}>
      <MiniModel model="crystal" />
      <pointLight position={[0, 2, 0]} intensity={2} color="#06b6d4" />
      {/* Crystal glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial 
          color="#06b6d4" 
          transparent 
          opacity={0.1} 
        />
      </mesh>
    </group>
  );
}

const Contact = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const { name, email, phone, links } = useCVData();

  // Build contact info from CV data
  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: email || 'contact@example.com', 
      href: `mailto:${email || 'contact@example.com'}`,
      color: 'text-cyan-300'
    },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: phone || '+1 (555) 123-4567', 
      href: `tel:${phone ? phone.replace(/\D/g, '') : '+15551234567'}`,
      color: 'text-blue-300'
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: 'Remote / Available Worldwide', 
      href: '#',
      color: 'text-teal-300'
    }
  ];

  // Build social links from CV data
  const socialLinks = [
    { 
      icon: Github, 
      label: 'GitHub', 
      href: links?.github || '#', 
      color: 'hover:text-gray-300 hover:bg-gray-500/20',
      show: links?.github || true
    },
    { 
      icon: Linkedin, 
      label: 'LinkedIn', 
      href: links?.linkedin || '#', 
      color: 'hover:text-blue-400 hover:bg-blue-500/20',
      show: links?.linkedin || true
    },
    { 
      icon: Globe, 
      label: 'Website', 
      href: links?.website || '#', 
      color: 'hover:text-green-400 hover:bg-green-500/20',
      show: links?.website || true
    },
    { 
      icon: Twitter, 
      label: 'Twitter', 
      href: '#', 
      color: 'hover:text-cyan-400 hover:bg-cyan-500/20',
      show: true
    }
  ].filter(link => link.show);

  const sections = [
    { id: 'contact', label: 'Contact Info', icon: '💎' },
    { id: 'form', label: 'Send Message', icon: '✉️' },
    { id: 'social', label: 'Social Links', icon: '🌐' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const renderContactInfo = () => (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-8">
        Get In Touch
      </h3>
      
      <div className="space-y-6">
        {contactInfo.map((item, index) => (
          <div 
            key={index} 
            className="group bg-gradient-to-r from-white/5 to-white/10 border border-white/15 rounded-xl p-6 
                     hover:from-cyan-500/10 hover:to-blue-500/10 hover:border-cyan-400/30 
                     transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border-2 border-cyan-400/30 rounded-full flex items-center justify-center group-hover:from-cyan-500/25 group-hover:to-blue-500/25 transition-all duration-300">
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/70 uppercase tracking-wide font-medium">{item.label}</p>
                <a 
                  href={item.href}
                  className="text-lg text-white hover:text-cyan-300 transition-colors duration-200 font-medium"
                >
                  {item.value}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Card */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-400/30 rounded-xl p-6 backdrop-blur-md mt-8">
        <blockquote className="text-white/90 italic text-lg leading-relaxed">
          "The cave you fear to enter holds the treasure you seek."
        </blockquote>
        <cite className="text-cyan-300 text-sm mt-3 block font-medium">
          — Joseph Campbell
        </cite>
      </div>
    </div>
  );

  const renderContactForm = () => (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
        Send a Message
      </h3>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-3 uppercase tracking-wide">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-white/8 border-2 border-white/15 rounded-xl text-white placeholder-white/50 
                       focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-300
                       hover:border-white/25 hover:bg-white/10"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/90 mb-3 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-white/8 border-2 border-white/15 rounded-xl text-white placeholder-white/50 
                       focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-300
                       hover:border-white/25 hover:bg-white/10"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white/90 mb-3 uppercase tracking-wide">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-4 bg-white/8 border-2 border-white/15 rounded-xl text-white placeholder-white/50 
                     focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-300 resize-none
                     hover:border-white/25 hover:bg-white/10"
            placeholder={`Tell me about your project or just say hello...${name ? ` Looking forward to hearing from you!` : ''}`}
            required
          ></textarea>
        </div>

        <div
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white py-4 px-6 rounded-xl font-semibold 
                   flex items-center justify-center gap-3 hover:from-cyan-600/80 hover:to-blue-600/80 
                   transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 
                   border-2 border-cyan-400/30 hover:border-cyan-400/50 cursor-pointer"
        >
          <Send className="w-5 h-5" />
          Send Message to the Cave
        </div>
        </div>

      {/* Status indicator */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-400/30 rounded-full">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-300 font-medium">Available for new adventures</span>
        </div>
      </div>
    </div>
  );

  const renderSocialLinks = () => (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-8">
        Follow My Journey
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.href}
            className={`
              group bg-gradient-to-r from-white/5 to-white/10 border border-white/15 rounded-xl p-6
              flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105
              ${social.color} hover:border-white/30
            `}
            title={social.label}
          >
            <div className="w-16 h-16 bg-white/10 border-2 border-white/20 rounded-full 
                          flex items-center justify-center group-hover:bg-white/20 
                          group-hover:border-white/40 transition-all duration-300">
              <social.icon className="w-8 h-8" />
            </div>
            <span className="text-white font-medium">{social.label}</span>
          </a>
        ))}
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-400/30 rounded-xl p-6 text-center mt-8">
        <p className="text-white/90 mb-4">
          Let's connect and create something amazing together!
        </p>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'contact':
        return renderContactInfo();
      case 'form':
        return renderContactForm();
      case 'social':
        return renderSocialLinks();
      default:
        return renderContactInfo();
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      {/* Header with 3D Crystal */}
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-8">
          {/* 3D Crystal */}
          
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Let's Connect
            </h1>
            <p className="text-cyan-300 font-medium">Ready to explore digital frontiers together?</p>
          </div>

          {/* Mirror Crystal */}
          <div className="w-24 h-24">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.6} />
              <pointLight position={[-2, 2, 2]} intensity={1} color="#8b5cf6" />
              <group scale={[3, 3, 3]}>
                <MiniModel model="crystal" />
                <pointLight position={[0, 2, 0]} intensity={2} color="#8b5cf6" />
              </group>
            </Canvas>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="px-8 mb-16 max-w-4xl mx-auto">
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-8 
            shadow-2xl transition-all duration-500
            ${isHovered ? 'bg-black/30 shadow-cyan-500/20 border-cyan-400/30 scale-102' : 'scale-100'}
          `}
        >
          {renderContactInfo()}
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="px-8 mb-16 max-w-4xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-8 shadow-2xl hover:bg-black/30 hover:shadow-purple-500/20 hover:border-purple-400/30 transition-all duration-500 hover:scale-102">
          {renderContactForm()}
        </div>
      </div>

      {/* Social Links Section */}
      <div className="px-8 pb-16 max-w-4xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-8 shadow-2xl hover:bg-black/30 hover:shadow-green-500/20 hover:border-green-400/30 transition-all duration-500 hover:scale-102">
          {renderSocialLinks()}
        </div>
      </div>
    </div>
  );
};

export default Contact;