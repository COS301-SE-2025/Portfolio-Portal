import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, Globe } from 'lucide-react';
import { useCVData } from '../../../../hooks/useCVData';

const Contact = () => {
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
      href: `mailto:${email || 'contact@example.com'}`
    },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: phone || '+1 (555) 123-4567', 
      href: `tel:${phone ? phone.replace(/\D/g, '') : '+15551234567'}`
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: 'Remote / Available Worldwide', 
      href: '#'
    }
  ];

  // Build social links from CV data
  const socialLinks = [
    { 
      icon: Github, 
      label: 'GitHub', 
      href: links?.github || '#',
      show: links?.github || true
    },
    { 
      icon: Linkedin, 
      label: 'LinkedIn', 
      href: links?.linkedin || '#',
      show: links?.linkedin || true
    },
    { 
      icon: Globe, 
      label: 'Website', 
      href: links?.website || '#',
      show: links?.website || true
    },
    { 
      icon: Twitter, 
      label: 'Twitter', 
      href: '#',
      show: true
    }
  ].filter(link => link.show);

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

  return (
    <div className="text-white space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-cyan-400">Let's Connect</h1>
        <p className="text-xl text-cyan-300">Ready to explore digital frontiers together?</p>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-cyan-400">Get In Touch</h2>
        <div className="space-y-4">
          {contactInfo.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <item.icon className="w-6 h-6 text-cyan-300" />
              <div>
                <p className="text-sm text-white/70 font-medium">{item.label}</p>
                <a 
                  href={item.href}
                  className="text-lg text-white hover:text-cyan-300 transition-colors"
                >
                  {item.value}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
          <blockquote className="text-white/90 italic text-lg leading-relaxed">
            "The cave you fear to enter holds the treasure you seek."
          </blockquote>
          <cite className="text-cyan-300 text-sm mt-3 block font-medium">
            — Joseph Campbell
          </cite>
        </div>
      </div>

      {/* Contact Form */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-purple-400">Send a Message</h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-3">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/90 mb-3">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 resize-none"
              placeholder={`Tell me about your project or just say hello...${name ? ` Looking forward to hearing from you!` : ''}`}
              required
            ></textarea>
          </div>

          <div
            onClick={handleSubmit}
            className="w-full bg-cyan-500/80 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-cyan-600/80 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
            Send Message
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-400/30 rounded-full">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-medium">Available for new adventures</span>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-green-400">Follow My Journey</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              className="flex flex-col items-center gap-3 p-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all"
              title={social.label}
            >
              <social.icon className="w-8 h-8" />
              <span className="text-white font-medium">{social.label}</span>
            </a>
          ))}
        </div>

        <div className="p-6 bg-green-500/10 border border-green-400/30 rounded-lg text-center">
          <p className="text-white/90">
            Let's connect and create something amazing together!
          </p>
        </div>
      </div>

    </div>
  );
};

export default Contact;
